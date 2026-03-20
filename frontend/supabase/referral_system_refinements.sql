-- Notifications table for persistent user alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info', -- 'info', 'success', 'warning', 'error', 'reward'
  is_read boolean default false,
  link text, -- optional link for the notification
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON public.notifications(user_id) WHERE is_read = false;

-- RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notifications' 
        AND policyname = 'Users can view their own notifications'
    ) THEN
        CREATE POLICY "Users can view their own notifications"
          ON public.notifications FOR SELECT
          USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notifications' 
        AND policyname = 'Users can update their own notifications'
    ) THEN
        CREATE POLICY "Users can update their own notifications"
          ON public.notifications FOR UPDATE
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Ensure profiles has the correct columns (in case original migration skipped some)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text unique,
  ADD COLUMN IF NOT EXISTS total_referrals integer default 0,
  ADD COLUMN IF NOT EXISTS total_referral_credits_earned integer default 0,
  ADD COLUMN IF NOT EXISTS referred_by_user_id uuid references auth.users(id);

-- Add total_blogs_generated if missing (sometimes it's blogs_generated_count)
-- The UI uses total_blogs_generated in some places and blogs_generated_count in others.
-- Let's make sure both are handled or standardized.
-- Standardizing on total_blogs_generated as requested in implementation plan.
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='total_blogs_generated') THEN
    ALTER TABLE public.profiles ADD COLUMN total_blogs_generated integer default 0;
  END IF;
END $$;
