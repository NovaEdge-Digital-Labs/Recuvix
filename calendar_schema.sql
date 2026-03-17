-- ============================================
-- CONTENT CALENDAR ENTRIES TABLE
-- ============================================
create table if not exists public.calendar_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id)
    on delete cascade not null,
  workspace_id uuid references public.workspaces(id)
    on delete cascade,

  -- Content details
  title text not null,
  topic text not null,
  focus_keyword text not null default '',
  secondary_keywords text[] not null default '{}',
  country text not null default 'india',
  target_tone text default 'professional',
  target_word_count integer default 1500,

  -- Scheduling
  scheduled_date date not null,
  -- The date this blog is planned to be published
  scheduled_time time,
  -- Optional time of day for publishing

  -- Status tracking
  status text not null default 'planned'
    check (status in (
      'planned', 'scheduled', 'in_progress',
      'published', 'missed', 'cancelled'
    )),

  -- Priority
  priority text not null default 'medium'
    check (priority in (
      'low', 'medium', 'high', 'urgent'
    )),

  -- Categorisation
  content_type text default 'blog'
    check (content_type in (
      'blog', 'listicle', 'how_to', 'comparison',
      'case_study', 'ultimate_guide', 'news_trend'
    )),
  category text,
  -- User-defined category: "SEO", "Marketing" etc
  tags text[] not null default '{}',

  -- Seasonal / trend context
  seasonality_note text,
  -- e.g. "Diwali season", "Budget season",
  -- "New Year", "IPL season"
  trend_context text,
  -- Why this topic is timely

  -- AI suggestion metadata
  is_ai_suggested boolean not null default false,
  ai_suggestion_reason text,
  -- Why the AI suggested this topic
  estimated_search_volume text,
  -- e.g. "1K-10K/month"
  estimated_difficulty text,
  -- Easy / Medium / Hard

  -- Linked blog (once generated)
  blog_id uuid references public.blogs(id)
    on delete set null,
  published_url text,
  -- The actual URL where it was published

  -- Team assignment (for workspaces)
  assigned_to uuid references auth.users(id)
    on delete set null,
  assigned_to_name text,

  -- Notes
  notes text,
  -- Internal notes, research links, etc.

  -- From research feature
  research_history_id uuid references
    public.research_history(id)
    on delete set null,
  -- If this came from keyword research

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cal_user_date_idx
  on public.calendar_entries(
    user_id, scheduled_date);
create index if not exists cal_workspace_date_idx
  on public.calendar_entries(
    workspace_id, scheduled_date)
  where workspace_id is not null;
create index if not exists cal_status_idx
  on public.calendar_entries(
    user_id, status, scheduled_date);
create index if not exists cal_blog_idx
  on public.calendar_entries(blog_id)
  where blog_id is not null;

alter table public.calendar_entries
  enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'calendar_entries' 
    and policyname = 'Users manage own calendar entries'
  ) then
    create policy "Users manage own calendar entries"
      on public.calendar_entries for all
      using (
        auth.uid() = user_id
        or (
          workspace_id is not null
          and exists (
            select 1 from public.workspace_members wm
            where wm.workspace_id =
              calendar_entries.workspace_id
              and wm.user_id = auth.uid()
              and wm.status = 'active'
          )
        )
      );
  end if;
end $$;

-- ============================================
-- CALENDAR SETTINGS TABLE
-- Per-user calendar configuration
-- ============================================
create table if not exists public.calendar_settings (
  user_id uuid references auth.users(id)
    on delete cascade primary key,
  workspace_id uuid references public.workspaces(id)
    on delete cascade,

  -- Planning preferences
  default_country text default 'india',
  default_publishing_frequency text
    default 'weekly'
    check (default_publishing_frequency in (
      'daily', '3x_week', 'weekly',
      'biweekly', 'monthly'
    )),
  target_blogs_per_month integer default 4,
  primary_niche text,
  -- e.g. "digital marketing", "personal finance"

  -- Calendar view
  default_view text default 'month'
    check (default_view in (
      'month', 'week', 'list'
    )),
  start_day_of_week integer default 1,
  -- 0=Sunday, 1=Monday

  -- AI suggestions
  ai_suggestions_enabled boolean default true,
  include_seasonal_topics boolean default true,
  include_trending_topics boolean default true,
  auto_fill_gaps boolean default false,
  -- Auto-suggest topics for empty dates

  -- Notifications
  reminder_days_before integer default 2,
  -- Days before scheduled date to remind

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.calendar_settings
  enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'calendar_settings' 
    and policyname = 'Users manage own calendar settings'
  ) then
    create policy "Users manage own calendar settings"
      on public.calendar_settings for all
      using (auth.uid() = user_id);
  end if;
end $$;

-- Auto-create settings on profile creation
create or replace function
  public.create_calendar_settings()
returns trigger as $$
begin
  insert into public.calendar_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

do $$
begin
  if not exists (
    select 1 from pg_trigger 
    where tgname = 'on_profile_create_calendar_settings'
  ) then
    create trigger on_profile_create_calendar_settings
      after insert on public.profiles
      for each row execute procedure
      public.create_calendar_settings();
  end if;
end $$;

-- ============================================
-- FUNCTION: Get calendar stats for a month
-- ============================================
create or replace function
  public.get_calendar_month_stats(
    p_user_id uuid,
    p_year integer,
    p_month integer,
    p_workspace_id uuid default null
  )
returns jsonb as $$
declare
  v_start date;
  v_end date;
  v_stats jsonb;
begin
  v_start := make_date(p_year, p_month, 1);
  v_end := (v_start + interval '1 month'
    - interval '1 day')::date;

  select jsonb_build_object(
    'total', count(*),
    'planned', count(*)
      filter (where status = 'planned'),
    'scheduled', count(*)
      filter (where status = 'scheduled'),
    'published', count(*)
      filter (where status = 'published'),
    'missed', count(*)
      filter (where status = 'missed'),
    'completion_rate',
      round(
        100.0 * count(*)
          filter (where status = 'published') /
        nullif(count(*), 0)
      , 0)
  ) into v_stats
  from public.calendar_entries
  where (user_id = p_user_id
    or (p_workspace_id is not null
      and workspace_id = p_workspace_id))
    and scheduled_date between v_start and v_end
    and status != 'cancelled';

  return v_stats;
end;
$$ language plpgsql security definer;

-- ============================================
-- FUNCTION: Get upcoming missed entries
-- Entries past their date that are not published
-- ============================================
create or replace function
  public.mark_missed_entries(p_user_id uuid)
returns integer as $$
declare
  v_count integer;
begin
  update public.calendar_entries
  set status = 'missed'
  where user_id = p_user_id
    and status in ('planned', 'scheduled')
    and scheduled_date < current_date;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$ language plpgsql security definer;

-- updated_at trigger
drop trigger if exists set_calendar_entries_updated_at on public.calendar_entries;
create trigger set_calendar_entries_updated_at
  before update on public.calendar_entries
  for each row execute procedure
  public.set_updated_at();

drop trigger if exists set_calendar_settings_updated_at on public.calendar_settings;
create trigger set_calendar_settings_updated_at
  before update on public.calendar_settings
  for each row execute procedure
  public.set_updated_at();
