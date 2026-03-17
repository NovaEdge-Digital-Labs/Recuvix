-- Create referral system table
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_user_id uuid references auth.users(id)
    on delete cascade not null,
  referred_user_id uuid references auth.users(id)
    on delete cascade,
  referral_code text not null,
  status text default 'pending'
    check (status in (
      'pending',    -- link shared, not signed up
      'signed_up',  -- referred user created account
      'converted',  -- referred user generated first blog
      'rewarded'    -- referrer received credits
    )),
  credits_rewarded integer default 0,
  signed_up_at timestamptz,
  converted_at timestamptz,
  rewarded_at timestamptz,
  created_at timestamptz default now()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS referrals_code_idx
  ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS referrals_referrer_idx
  ON public.referrals(referrer_user_id);

-- Update profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text unique default 
    upper(substring(encode(gen_random_bytes(4), 'hex'), 1, 8));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS total_referrals integer default 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS total_referral_credits_earned integer default 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referred_by_user_id uuid references auth.users(id) on delete set null;

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policies for referrals
CREATE POLICY "Users can view their own referrals as referrer"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can view their own referral record as referred user"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referred_user_id);

-- Helper functions for referrals
CREATE OR REPLACE FUNCTION public.increment_total_referrals(p_user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET total_referrals = total_referrals + 1
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_referral_credits(p_user_id uuid, p_amount integer)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET total_referral_credits_earned = total_referral_credits_earned + p_amount
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
