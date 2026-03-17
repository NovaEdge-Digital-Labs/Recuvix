-- ============================================
-- DROP AND RECREATE platform_api_keys
-- ============================================
drop table if exists public.platform_api_keys cascade;

create table public.platform_api_keys (
  id uuid primary key default uuid_generate_v4(),

  -- Provider info
  provider text not null
    check (provider in (
      'claude', 'openai', 'gemini', 'grok')),
  model text not null,

  -- Key storage
  encrypted_key text not null,
  key_hint text not null,

  -- Key metadata
  label text,
  added_by text,

  -- Status
  is_active boolean not null default true,
  is_healthy boolean not null default true,
  disabled_reason text,

  -- Rate limiting
  rate_limit_reset_at timestamptz,
  consecutive_failures integer not null default 0,
  last_error text,
  last_error_at timestamptz,
  last_success_at timestamptz,

  -- Usage tracking (rolling windows)
  requests_today integer not null default 0,
  requests_this_hour integer not null default 0,
  tokens_today integer not null default 0,
  last_used_at timestamptz,
  last_reset_date date not null default current_date,
  last_hour_reset timestamptz not null default now(),

  -- Limits (0 = no limit)
  daily_request_limit integer not null default 0,
  hourly_request_limit integer not null default 0,
  daily_token_limit integer not null default 0,

  -- Cost tracking
  total_requests integer not null default 0,
  total_tokens_used bigint not null default 0,
  estimated_cost_usd numeric(10,4) not null default 0,

  -- Priority for selection (lower = preferred)
  priority integer not null default 100,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast key selection queries
create index platform_keys_provider_active_idx
  on public.platform_api_keys(provider, is_active,
    is_healthy, priority)
  where is_active = true and is_healthy = true;

-- ============================================
-- PLATFORM KEY USAGE LOG
-- ============================================
create table public.platform_key_usage_log (
  id uuid primary key default uuid_generate_v4(),
  key_id uuid references public.platform_api_keys(id)
    on delete set null,
  user_id uuid references auth.users(id)
    on delete set null,
  blog_id uuid references public.blogs(id)
    on delete set null,

  provider text not null,
  model text not null,
  status text not null
    check (status in (
      'success', 'failed', 'rate_limited',
      'timeout', 'invalid_key', 'cancelled')),

  -- Token usage
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,

  -- Timing
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms integer,

  -- Request details
  blog_topic text,
  word_count integer,
  was_streaming boolean not null default true,

  -- Error info
  error_code text,
  error_message text,
  http_status integer,

  -- Was credit refunded after failure?
  credit_refunded boolean not null default false
);

create index key_usage_key_id_idx
  on public.platform_key_usage_log(
    key_id, started_at desc);
create index key_usage_user_id_idx
  on public.platform_key_usage_log(
    user_id, started_at desc);
create index key_usage_date_idx
  on public.platform_key_usage_log(
    date_trunc('day', started_at));

-- RLS: users can see their own usage
alter table public.platform_key_usage_log
  enable row level security;

create policy "Users view own usage"
  on public.platform_key_usage_log for select
  using (auth.uid() = user_id);

-- ============================================
-- PLATFORM SETTINGS TABLE
-- ============================================
create table public.platform_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Insert default settings
insert into public.platform_settings
  (key, value, description) values
('managed_mode_enabled', 'true'::jsonb, 'Whether managed mode is available to users'),
('default_provider', '"claude"'::jsonb, 'Default LLM provider for managed mode'),
('fallback_order', '["claude","openai","gemini","grok"]'::jsonb, 'Provider fallback order when preferred unavailable'),
('auto_disable_after_failures', '5'::jsonb, 'Disable key after N consecutive failures'),
('rate_limit_backoff_minutes', '60'::jsonb, 'Minutes to wait after 429 before retrying key'),
('max_blogs_per_user_per_day', '50'::jsonb, 'Max managed blogs per user per day (0=unlimited)'),
('credit_warning_threshold', '5'::jsonb, 'Show low credit warning when below this'),
('free_credits_on_signup', '5'::jsonb, 'Free credits given to new users')
on conflict (key) do nothing;

-- ============================================
-- FUNCTION: Select best key for provider
-- ============================================
create or replace function
  public.select_platform_key(p_provider text)
returns table(
  key_id uuid,
  encrypted_key text,
  model text
) as $$
begin
  return query
  select
    k.id as key_id,
    k.encrypted_key,
    k.model
  from public.platform_api_keys k
  where k.provider = p_provider
    and k.is_active = true
    and k.is_healthy = true
    and (k.rate_limit_reset_at is null
      or k.rate_limit_reset_at < now())
    and (k.daily_request_limit = 0
      or k.requests_today < k.daily_request_limit)
    and (k.hourly_request_limit = 0
      or k.requests_this_hour < k.hourly_request_limit)
  order by k.priority asc,
    k.requests_this_hour asc,   -- load balance
    k.last_used_at asc nulls first
  limit 1;
end;
$$ language plpgsql security definer;

-- ============================================
-- FUNCTION: Record key usage after API call
-- ============================================
create or replace function public.record_key_usage(
  p_key_id uuid,
  p_status text,
  p_tokens integer default 0,
  p_error_code text default null,
  p_http_status integer default null
)
returns void as $$
declare
  v_today date := current_date;
  v_now timestamptz := now();
begin
  -- Reset daily counters if new day
  update public.platform_api_keys
  set
    requests_today = case
      when last_reset_date < v_today then 0
      else requests_today
    end,
    tokens_today = case
      when last_reset_date < v_today then 0
      else tokens_today
    end,
    last_reset_date = case
      when last_reset_date < v_today then v_today
      else last_reset_date
    end
  where id = p_key_id;

  -- Reset hourly counters if new hour
  update public.platform_api_keys
  set
    requests_this_hour = case
      when last_hour_reset < date_trunc('hour', v_now) then 0
      else requests_this_hour
    end,
    last_hour_reset = case
      when last_hour_reset < date_trunc('hour', v_now)
      then date_trunc('hour', v_now)
      else last_hour_reset
    end
  where id = p_key_id;

  if p_status = 'success' then
    update public.platform_api_keys
    set
      requests_today = requests_today + 1,
      requests_this_hour = requests_this_hour + 1,
      total_requests = total_requests + 1,
      tokens_today = tokens_today + p_tokens,
      total_tokens_used = total_tokens_used + p_tokens,
      consecutive_failures = 0,
      last_success_at = v_now,
      last_used_at = v_now,
      last_error = null
    where id = p_key_id;

  elsif p_status = 'rate_limited' then
    update public.platform_api_keys
    set
      requests_today = requests_today + 1,
      requests_this_hour = requests_this_hour + 1,
      total_requests = total_requests + 1,
      consecutive_failures = consecutive_failures + 1,
      last_error = 'Rate limited (429)',
      last_error_at = v_now,
      last_used_at = v_now,
      rate_limit_reset_at = v_now + interval '60 minutes',
      is_healthy = case
        when consecutive_failures + 1 >= 5
        then false else is_healthy
      end
    where id = p_key_id;

  elsif p_status = 'invalid_key' then
    update public.platform_api_keys
    set
      is_active = false,
      is_healthy = false,
      disabled_reason = 'invalid_key',
      last_error = 'Invalid API key (401)',
      last_error_at = v_now
    where id = p_key_id;

  else -- 'failed', 'timeout'
    update public.platform_api_keys
    set
      requests_today = requests_today + 1,
      total_requests = total_requests + 1,
      consecutive_failures = consecutive_failures + 1,
      last_error = p_error_code,
      last_error_at = v_now,
      is_healthy = case
        when consecutive_failures + 1 >= 5
        then false else is_healthy
      end,
      disabled_reason = case
        when consecutive_failures + 1 >= 5
        then 'auto_disabled_failures'
        else disabled_reason
      end
    where id = p_key_id;
  end if;
end;
$$ language plpgsql security definer;

-- ============================================
-- FUNCTION: Daily reset
-- ============================================
create or replace function public.reset_daily_usage()
returns void as $$
begin
  update public.platform_api_keys
  set
    requests_today = 0,
    tokens_today = 0,
    last_reset_date = current_date
  where last_reset_date < current_date;

  -- Re-enable keys that were rate limited
  -- and their reset time has passed
  update public.platform_api_keys
  set
    is_healthy = true,
    rate_limit_reset_at = null,
    consecutive_failures = 0,
    disabled_reason = null
  where disabled_reason = 'rate_limited'
    and rate_limit_reset_at < now();
end;
$$ language plpgsql security definer;
