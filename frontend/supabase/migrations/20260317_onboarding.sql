-- Migration: Add onboarding and preference fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS primary_country text,
ADD COLUMN IF NOT EXISTS default_tone text,
ADD COLUMN IF NOT EXISTS typical_word_count integer DEFAULT 1500,
ADD COLUMN IF NOT EXISTS primary_niche text;

-- Add index for onboarding status
CREATE INDEX IF NOT EXISTS profiles_onboarding_completed_idx ON public.profiles(onboarding_completed);
