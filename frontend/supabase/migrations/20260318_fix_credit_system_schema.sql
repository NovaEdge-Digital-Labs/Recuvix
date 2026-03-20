-- Migration: Fix credit_transactions schema and related functions
-- File: 20260318_fix_credit_system_schema.sql
-- Location: frontend/supabase/migrations

-- 1. Add missing columns to credit_transactions if they do not exist
ALTER TABLE public.credit_transactions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS balance_after INTEGER,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS reference_id TEXT;

-- 2. Ensure type constraint includes all needed values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'credit_transactions_type_check'
  ) THEN
    ALTER TABLE public.credit_transactions
      ADD CONSTRAINT credit_transactions_type_check CHECK (type IN ('purchase', 'bonus', 'generation', 'refund', 'admin', 'free_grant'));
  END IF;
END $$;

-- 3. Populate user_id from existing profile_id where possible
UPDATE public.credit_transactions ct
SET user_id = (SELECT id FROM public.profiles p WHERE p.id = ct.profile_id)
WHERE ct.user_id IS NULL AND ct.profile_id IS NOT NULL;

-- 4. (Optional) Drop the old profile_id column if no longer needed
-- ALTER TABLE public.credit_transactions DROP COLUMN IF EXISTS profile_id;

-- 5. Update give_signup_credits function to use unified schema
CREATE OR REPLACE FUNCTION public.give_signup_credits()
RETURNS trigger AS $$
BEGIN
  -- Give 5 free credits
  UPDATE public.profiles
    SET credits_balance = credits_balance + 5
    WHERE id = NEW.id;

  -- Record the bonus transaction using unified columns
  INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, reference_id
  ) VALUES (
    NEW.id,
    'free_grant',
    5,
    (SELECT credits_balance FROM public.profiles WHERE id = NEW.id),
    'Welcome bonus — 5 free credits',
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Ensure trigger exists (replace if already exists)
DROP TRIGGER IF EXISTS on_profile_created_give_credits ON public.profiles;
CREATE TRIGGER on_profile_created_give_credits
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.give_signup_credits();

-- 7. Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
