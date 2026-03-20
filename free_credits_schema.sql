-- ============================================
-- FREE CREDIT RULES TABLE
-- Defines automated rules for giving credits
-- ============================================
CREATE TABLE IF NOT EXISTS public.credit_rules (
  id uuid primary key default uuid_generate_v4(),

  name text not null unique,
  -- e.g. "New User Welcome Bonus"
  description text,

  rule_type text not null
    check (rule_type in (
      'signup_bonus',
      -- Given to every new user on signup
      'manual_all',
      -- Admin manually triggers for all users
      'manual_segment',
      -- Admin manually triggers for a segment
      'manual_specific',
      -- Admin manually triggers for specific users
      'referral_bonus',
      -- Given when user refers someone
      'milestone_bonus'
      -- Given when user hits a milestone
    )),

  credits_amount integer not null
    check (credits_amount > 0),

  -- Conditions (for segment rules)
  condition_country text,
  -- Only give to users from this country
  condition_min_blogs integer,
  -- Only users who have generated >= N blogs
  condition_max_blogs integer,
  -- Only users who have generated <= N blogs
  condition_has_byok boolean,
  -- Only users with/without API key
  condition_joined_after date,
  -- Only users who joined after this date
  condition_joined_before date,
  condition_no_previous_purchase boolean,
  -- Only users who never bought credits
  condition_tenant_id uuid,
  -- Only users on this white label tenant

  -- Limits
  max_grants_per_user integer default 1,
  -- How many times can one user get this
  total_budget_credits integer,
  -- Max total credits to give across all users
  credits_given_so_far integer default 0,

  -- Expiry of granted credits
  credits_expire_days integer,
  -- null = never expire
  -- 30 = credits expire 30 days after grant

  -- Status
  is_active boolean default true,
  auto_apply boolean default false,
  -- true = apply automatically when conditions met
  -- false = admin must manually trigger

  -- Tracking
  total_users_granted integer default 0,
  last_triggered_at timestamptz,
  triggered_by uuid references auth.users(id),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CREDIT GRANTS TABLE
-- Records every free credit given to every user
-- ============================================
CREATE TABLE IF NOT EXISTS public.credit_grants (
  id uuid primary key default uuid_generate_v4(),

  user_id uuid references auth.users(id)
    on delete cascade not null,
  rule_id uuid references public.credit_rules(id)
    on delete set null,
  -- null if given manually without a rule

  credits_amount integer not null,
  reason text not null,
  -- Human readable: "New User Welcome Bonus"

  -- Who gave it
  granted_by text not null default 'system',
  -- 'system' | 'admin' | admin user ID
  granted_by_user_id uuid references auth.users(id)
    on delete set null,
  -- The admin who manually gave it

  -- Expiry
  expires_at timestamptz,
  -- null = never expires
  is_expired boolean default false,

  -- Status
  status text default 'applied'
    check (status in (
      'applied',    -- credits added to balance
      'pending',    -- not yet applied
      'expired',    -- past expiry date
      'revoked'     -- admin took back
    )),

  -- Metadata
  note text,
  -- Admin's internal note

  applied_at timestamptz default now(),
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS grants_user_idx
  ON public.credit_grants(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS grants_rule_idx
  ON public.credit_grants(rule_id)
  WHERE rule_id IS NOT NULL;

-- ============================================
-- UPDATE profiles TABLE
-- Add admin notes and labels
-- ============================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS
  admin_note text,
  -- Internal note from admin about this user

  ADD COLUMN IF NOT EXISTS
  user_label text,
  -- 'vip' | 'agency' | 'flagged' | 'influencer'

  ADD COLUMN IF NOT EXISTS
  is_suspended boolean default false,

  ADD COLUMN IF NOT EXISTS
  suspended_reason text,

  ADD COLUMN IF NOT EXISTS
  total_blogs_generated integer default 0,
  -- Cached count updated on each generation

  ADD COLUMN IF NOT EXISTS
  total_credits_purchased integer default 0,

  ADD COLUMN IF NOT EXISTS
  total_free_credits_received integer default 0,

  ADD COLUMN IF NOT EXISTS
  last_active_at timestamptz;

-- ============================================
-- FUNCTION: Apply credit grant to user
-- Atomic: adds credits + creates transaction
-- ============================================
CREATE OR REPLACE FUNCTION
  public.apply_credit_grant(
    p_user_id uuid,
    p_rule_id uuid,
    p_credits integer,
    p_reason text,
    p_granted_by text,
    p_granted_by_user_id uuid,
    p_expires_at timestamptz,
    p_note text
  )
RETURNS uuid AS $$
DECLARE
  v_grant_id uuid;
BEGIN
  -- Check if user already got this rule
  -- (if max_grants_per_user = 1)
  IF p_rule_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.credit_grants
      WHERE user_id = p_user_id
        AND rule_id = p_rule_id
        AND status = 'applied'
    ) THEN
      RAISE EXCEPTION
        'User already received this grant';
    END IF;
  END IF;

  -- Add credits to balance
  UPDATE public.profiles
  SET
    credits_balance = credits_balance + p_credits,
    total_free_credits_received =
      total_free_credits_received + p_credits
  WHERE id = p_user_id;

  -- Create credit_transactions record
  INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after,
    description, reference_id
  )
  SELECT
    p_user_id,
    'free_grant',
    p_credits,
    credits_balance,
    p_reason,
    p_rule_id::text
  FROM public.profiles
  WHERE id = p_user_id;

  -- Create credit_grants record
  INSERT INTO public.credit_grants (
    user_id, rule_id, credits_amount,
    reason, granted_by, granted_by_user_id,
    expires_at, note, status
  ) VALUES (
    p_user_id, p_rule_id, p_credits,
    p_reason, p_granted_by, p_granted_by_user_id,
    p_expires_at, p_note, 'applied'
  ) RETURNING id INTO v_grant_id;

  -- Update rule stats
  IF p_rule_id IS NOT NULL THEN
    UPDATE public.credit_rules
    SET
      credits_given_so_far =
        credits_given_so_far + p_credits,
      total_users_granted =
        total_users_granted + 1,
      last_triggered_at = now()
    WHERE id = p_rule_id;
  END IF;

  RETURN v_grant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Get user stats for admin
-- ============================================
CREATE OR REPLACE FUNCTION
  public.get_user_admin_stats(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'totalBlogs',
      (SELECT count(*) FROM public.blogs
        WHERE user_id = p_user_id),
    'totalCreditsPurchased',
      (SELECT coalesce(sum(amount), 0)
        FROM public.credit_transactions
        WHERE user_id = p_user_id
          AND type = 'purchase'),
    'totalFreeCreditsReceived',
      (SELECT coalesce(sum(credits_amount), 0)
        FROM public.credit_grants
        WHERE user_id = p_user_id
          AND status = 'applied'),
    'totalGrantsReceived',
      (SELECT count(*) FROM public.credit_grants
        WHERE user_id = p_user_id),
    'workspaceCount',
      (SELECT count(*)
        FROM public.workspace_members
        WHERE user_id = p_user_id
          AND status = 'active'),
    'lastBlogAt',
      (SELECT max(created_at) FROM public.blogs
        WHERE user_id = p_user_id),
    'joinedDaysAgo',
      extract(day from now() -
        (SELECT created_at FROM public.profiles
          WHERE id = p_user_id))
  ) INTO v_stats;

  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Expire overdue credits
-- Run daily via Supabase cron
-- ============================================
CREATE OR REPLACE FUNCTION
  public.expire_free_credits()
RETURNS integer AS $$
DECLARE
  v_count integer := 0;
  rec record;
BEGIN
  FOR rec IN
    SELECT id, user_id, credits_amount
    FROM public.credit_grants
    WHERE expires_at < now()
      AND status = 'applied'
      AND is_expired = false
  LOOP
    -- Deduct expired credits
    UPDATE public.profiles
    SET credits_balance = GREATEST(
      0, credits_balance - rec.credits_amount)
    WHERE id = rec.user_id;

    -- Mark grant as expired
    UPDATE public.credit_grants
    SET status = 'expired', is_expired = true
    WHERE id = rec.id;

    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger (assuming set_updated_at function exists as per common patterns)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_credit_rules_updated_at') THEN
        CREATE TRIGGER set_credit_rules_updated_at
          BEFORE UPDATE ON public.credit_rules
          FOR EACH ROW EXECUTE PROCEDURE
          public.set_updated_at();
    END IF;
END $$;

-- Failsafe: ensure all required columns exist before insert
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_rules' AND column_name='description') THEN
    ALTER TABLE public.credit_rules ADD COLUMN description text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_rules' AND column_name='rule_type') THEN
    ALTER TABLE public.credit_rules ADD COLUMN rule_type text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_rules' AND column_name='trigger_event') THEN
    ALTER TABLE public.credit_rules ADD COLUMN trigger_event text;
    -- Set default for existing rows if any
    UPDATE public.credit_rules SET trigger_event = 'signup' WHERE rule_type = 'signup_bonus';
    UPDATE public.credit_rules SET trigger_event = 'manual' WHERE trigger_event IS NULL;
  END IF;

  -- Ensure trigger_event doesn't violate not-null from other migrations
  -- But we need to make it nullable temporarily or provide defaults
  ALTER TABLE public.credit_rules ALTER COLUMN trigger_event DROP NOT NULL;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_rules' AND column_name='credits_amount') THEN
    ALTER TABLE public.credit_rules ADD COLUMN credits_amount integer;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_rules' AND column_name='auto_apply') THEN
    ALTER TABLE public.credit_rules ADD COLUMN auto_apply boolean default false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_rules' AND column_name='is_active') THEN
    ALTER TABLE public.credit_rules ADD COLUMN is_active boolean default true;
  END IF;

  -- Ensure name is unique for ON CONFLICT
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'credit_rules_name_key'
  ) THEN
    ALTER TABLE public.credit_rules ADD CONSTRAINT credit_rules_name_key UNIQUE (name);
  END IF;
END $$;

-- ============================================
-- SEED DEFAULT RULES
-- ============================================
INSERT INTO public.credit_rules (
  name, description, rule_type, trigger_event,
  credits_amount, auto_apply, is_active
) VALUES
(
  'New User Welcome Bonus',
  'Given to every new user on signup automatically',
  'signup_bonus', 'signup', 5, true, true
),
(
  'First Purchase Bonus',
  'Extra credits when user makes their first purchase',
  'milestone_bonus', 'purchase', 10, false, false
),
(
  'BYOK User Appreciation',
  'Free credits for users who connected their own API key',
  'manual_segment', 'manual', 5, false, false
)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  rule_type = EXCLUDED.rule_type,
  trigger_event = EXCLUDED.trigger_event,
  credits_amount = EXCLUDED.credits_amount,
  auto_apply = EXCLUDED.auto_apply,
  is_active = EXCLUDED.is_active;
