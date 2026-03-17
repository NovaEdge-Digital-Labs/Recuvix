-- ============================================
-- GUARANTEED CLEAN CREDIT RULES ENGINE MIGRATION
-- This script drops and recreates the credit system tables to ensure a clean state.
-- ============================================

-- 1. Drop existing triggers first
drop trigger if exists on_profile_created_give_credits on public.profiles;
drop trigger if exists on_profile_created_evaluate_rules on public.profiles;

-- 2. Drop existing functions to avoid signature conflicts
drop function if exists public.evaluate_credit_rules(uuid, text, jsonb);
drop function if exists public.apply_credit_grant(uuid, integer, text, integer, uuid, text, uuid, text);
drop function if exists public.on_signup_process_rules();

-- 3. Drop existing tables to clear legacy columns/constraints (DANGER: only for setup phase)
-- We drop credit_grants first because it references credit_rules
drop table if exists public.credit_grants;
drop table if exists public.credit_rules;

-- 4. Ensure profiles table has the required administrative columns
do $$
begin
  alter table public.profiles add column if not exists admin_notes text;
  alter table public.profiles add column if not exists admin_labels text[] default '{}';
  alter table public.profiles add column if not exists is_suspended boolean default false;
  alter table public.profiles add column if not exists suspension_reason text;
  alter table public.profiles add column if not exists total_blogs_generated integer default 0;
  alter table public.profiles add column if not exists total_words_generated integer default 0;
  alter table public.profiles add column if not exists country text;
end $$;

-- 5. Recreate tables with clean, correct schema
create table public.credit_rules (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  trigger_event text not null check (trigger_event in ('signup', 'purchase', 'manual')),
  credits_amount integer not null,
  credits_expire_days integer,
  is_active boolean not null default true,
  condition_country text,
  condition_min_blogs integer,
  max_grants_per_user integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.credit_grants (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_id uuid references public.credit_rules(id) on delete set null,
  credits_amount integer not null,
  reason text not null,
  granted_by text not null, -- 'system', 'admin'
  granted_by_user_id uuid references auth.users(id),
  status text not null default 'applied' check (status in ('applied', 'expired', 'revoked')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  note text
);

-- 6. Create indices
create index idx_credit_grants_user on public.credit_grants(user_id);
create index idx_credit_rules_trigger on public.credit_rules(trigger_event) where is_active = true;

-- 7. RPC: Apply Credit Grant
create or replace function public.apply_credit_grant(
  p_user_id uuid,
  p_credits integer,
  p_reason text,
  p_expires_days integer default null,
  p_rule_id uuid default null,
  p_granted_by text default 'system',
  p_granted_by_user_id uuid default null,
  p_note text default null
)
returns uuid as $$
declare
  v_grant_id uuid;
  v_expires_at timestamptz := null;
  v_new_balance integer;
begin
  if p_expires_days is not null then
    v_expires_at := now() + (p_expires_days || ' days')::interval;
  end if;

  -- Create the grant record
  insert into public.credit_grants (
    user_id, rule_id, credits_amount, reason,
    granted_by, granted_by_user_id, expires_at, note
  ) values (
    p_user_id, p_rule_id, p_credits, p_reason,
    p_granted_by, p_granted_by_user_id, v_expires_at, p_note
  ) returning id into v_grant_id;

  -- Update user balance
  update public.profiles
  set credits_balance = coalesce(credits_balance, 0) + p_credits
  where id = p_user_id
  returning credits_balance into v_new_balance;

  -- Log as a transaction
  insert into public.credit_transactions (
    user_id, type, amount, balance_after, description
  ) values (
    p_user_id, 'bonus', p_credits, v_new_balance, p_reason
  );

  return v_grant_id;
end;
$$ language plpgsql security definer;

-- 8. RPC: Evaluate and Trigger Rules
create or replace function public.evaluate_credit_rules(
  p_user_id uuid,
  p_trigger_event text,
  p_metadata jsonb default '{}'
)
returns void as $$
declare
  v_rule record;
begin
  for v_rule in (
    select * from public.credit_rules
    where trigger_event = p_trigger_event
      and is_active = true
      and (condition_country is null or condition_country = (p_metadata->>'country'))
      and (condition_min_blogs is null or condition_min_blogs <= (select coalesce(total_blogs_generated, 0) from public.profiles where id = p_user_id))
  ) loop
    -- Check if user already reached max grants for this rule
    if (select count(*) from public.credit_grants where user_id = p_user_id and rule_id = v_rule.id) < coalesce(v_rule.max_grants_per_user, 1) then
      perform public.apply_credit_grant(
        p_user_id, v_rule.credits_amount, v_rule.name,
        v_rule.credits_expire_days, v_rule.id
      );
    end if;
  end loop;
end;
$$ language plpgsql security definer;

-- 9. Trigger: Process Signup Credits
create or replace function public.on_signup_process_rules()
returns trigger as $$
begin
  perform public.evaluate_credit_rules(new.id, 'signup', jsonb_build_object('country', new.country));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created_evaluate_rules
  after insert on public.profiles
  for each row execute procedure
  public.on_signup_process_rules();

-- 10. Seed Default Rule (Welcome Bonus)
insert into public.credit_rules (name, trigger_event, credits_amount, credits_expire_days)
values ('Welcome Bonus', 'signup', 5, 30);

-- 11. Statistics Unification
update public.profiles 
set total_blogs_generated = blogs_generated_count
where (total_blogs_generated = 0 or total_blogs_generated is null) and blogs_generated_count > 0;
