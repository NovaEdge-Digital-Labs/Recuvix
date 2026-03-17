CREATE TABLE public.contact_messages (
  id uuid primary key
    default uuid_generate_v4(),
  ticket_id text not null unique,
  -- Format: RCV-2026-XXXX (auto-generated)
  user_id uuid references auth.users(id)
    on delete set null,
  -- If logged in, link to user

  name text not null,
  email text not null,
  topic text not null
    check (topic in ('support', 'billing',
      'feature', 'bug', 'enterprise', 'other')),
  subject text not null,
  message text not null,
  priority text default 'medium'
    check (priority in (
      'low', 'medium', 'high', 'critical')),

  status text not null default 'open'
    check (status in (
      'open', 'in_progress', 'resolved', 'closed')),
  resolved_at timestamptz,
  resolution_note text,

  ip_address text,
  user_agent text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ticket ID generation function
CREATE OR REPLACE FUNCTION
  generate_ticket_id()
RETURNS text AS $$
DECLARE
  year_part text;
  seq_part text;
  ticket text;
BEGIN
  year_part := to_char(now(), 'YYYY');
  SELECT lpad(
    (count(*) + 1)::text, 4, '0')
  INTO seq_part
  FROM public.contact_messages
  WHERE extract(year from created_at)
    = extract(year from now());
  ticket := 'RCV-' || year_part ||
    '-' || seq_part;
  RETURN ticket;
END;
$$ LANGUAGE plpgsql;

-- Auto-set ticket_id on insert
CREATE OR REPLACE FUNCTION
  set_ticket_id()
RETURNS trigger AS $$
BEGIN
  NEW.ticket_id := generate_ticket_id();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_contact_insert
  BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE PROCEDURE
  set_ticket_id();
