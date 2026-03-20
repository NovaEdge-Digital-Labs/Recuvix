CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text,
  source text default 'website',
  -- 'blog', 'changelog', 'landing', 'footer'
  status text default 'active'
    check (status in (
      'active', 'unsubscribed', 'bounced'
    )),
  unsubscribe_token text unique default
    encode(gen_random_bytes(32), 'hex'),
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.newsletter_sends (
  id uuid primary key default uuid_generate_v4(),
  subject text not null,
  preview_text text,
  html_content text not null,
  status text default 'draft'
    check (status in (
      'draft', 'scheduled', 'sending', 'sent'
    )),
  recipient_count integer default 0,
  open_count integer default 0,
  click_count integer default 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- RLS Policies
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

-- Only service role can manage these for now to keep it simple and secure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscribers' 
        AND policyname = 'Allow service role all access'
    ) THEN
        CREATE POLICY "Allow service role all access" ON public.newsletter_subscribers
            FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_sends' 
        AND policyname = 'Allow service role all access sends'
    ) THEN
        CREATE POLICY "Allow service role all access sends" ON public.newsletter_sends
            FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;
