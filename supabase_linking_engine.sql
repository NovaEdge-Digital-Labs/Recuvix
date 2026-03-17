-- ============================================
-- UTILITY FUNCTIONS
-- ================= resolve missing function error
-- ============================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================
-- INTERNAL LINK SUGGESTIONS TABLE
-- Stores all computed suggestions per blog
-- ============================================
create table if not exists public.internal_link_suggestions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id)
    on delete cascade not null,
  workspace_id uuid references public.workspaces(id)
    on delete cascade,

  -- Source blog (the one being modified)
  source_blog_id uuid references public.blogs(id)
    on delete cascade not null,

  -- Target blog (the one being linked TO)
  target_blog_id uuid references public.blogs(id)
    on delete cascade not null,
  target_title text not null,
  target_slug text,
  target_url text,
  target_focus_keyword text,

  -- Link placement details
  anchor_text text not null,
  context_sentence text not null,
  section_h2 text,
  placement_type text not null
    check (placement_type in (
      'keyword_match', 'placeholder',
      'heading_match', 'semantic_match'
    )),

  -- Scoring
  relevance_score integer not null
    check (relevance_score between 0 and 100),
  score_breakdown jsonb,
  -- { keyword: 35, topic: 25, country: 15,
  --   freshness: 10, not_linked: 5 }

  -- Status tracking
  status text not null default 'pending'
    check (status in (
      'pending', 'approved', 'rejected', 'applied'
    )),
  applied_at timestamptz,
  rejected_reason text,

  -- Computed by
  computed_at timestamptz not null default now(),
  computed_by text not null default 'engine',
  -- 'engine' | 'ai_enhanced' | 'manual'

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Prevent duplicate suggestions
  unique(source_blog_id, target_blog_id, anchor_text)
);

create index if not exists ils_source_blog_idx
  on public.internal_link_suggestions(
    source_blog_id, status);
create index if not exists ils_user_idx
  on public.internal_link_suggestions(
    user_id, status, created_at desc);
create index if not exists ils_workspace_idx
  on public.internal_link_suggestions(
    workspace_id, status)
  where workspace_id is not null;
create index if not exists ils_score_idx
  on public.internal_link_suggestions(
    source_blog_id, relevance_score desc)
  where status = 'pending';

alter table public.internal_link_suggestions
  enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'internal_link_suggestions' and policyname = 'Users manage own link suggestions'
  ) then
    create policy "Users manage own link suggestions"
      on public.internal_link_suggestions for all
      using (
        auth.uid() = user_id
        or (
          workspace_id is not null
          and exists (
            select 1 from public.workspace_members wm
            where wm.workspace_id =
              internal_link_suggestions.workspace_id
              and wm.user_id = auth.uid()
              and wm.status = 'active'
          )
        )
      );
  end if;
end $$;

-- ============================================
-- APPLIED LINKS TABLE
-- Tracks all links that have been applied
-- to blog HTML (the link graph)
-- ============================================
create table if not exists public.applied_internal_links (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id)
    on delete cascade not null,
  workspace_id uuid references public.workspaces(id)
    on delete cascade,

  source_blog_id uuid references public.blogs(id)
    on delete cascade not null,
  target_blog_id uuid references public.blogs(id)
    on delete cascade not null,

  anchor_text text not null,
  target_url text not null,
  section_h2 text,
  suggestion_id uuid references
    public.internal_link_suggestions(id)
    on delete set null,

  -- Was this link removed later?
  is_active boolean not null default true,
  removed_at timestamptz,
  removed_reason text,

  applied_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists ail_source_idx
  on public.applied_internal_links(
    source_blog_id, is_active);
create index if not exists ail_target_idx
  on public.applied_internal_links(
    target_blog_id, is_active);
create index if not exists ail_user_idx
  on public.applied_internal_links(
    user_id, applied_at desc);

alter table public.applied_internal_links
  enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'applied_internal_links' and policyname = 'Users manage own applied links'
  ) then
    create policy "Users manage own applied links"
      on public.applied_internal_links for all
      using (auth.uid() = user_id or (
        workspace_id is not null and exists (
          select 1 from public.workspace_members wm
          where wm.workspace_id =
            applied_internal_links.workspace_id
            and wm.user_id = auth.uid()
            and wm.status = 'active'
        )
      ));
  end if;
end $$;

-- ============================================
-- BLOG LINK INDEX
-- Lightweight metadata for fast scoring
-- (subset of blogs table for engine use)
-- ============================================
alter table public.blogs
  add column if not exists
  link_index jsonb,
  add column if not exists
  internal_links_count integer not null default 0;

-- ============================================
-- FUNCTION: Update link index for a blog
-- ============================================
create or replace function
  public.update_blog_link_index(
    p_blog_id uuid,
    p_link_index jsonb,
    p_internal_links_count integer
  )
returns void as $$
begin
  update public.blogs
  set
    link_index = p_link_index,
    internal_links_count = p_internal_links_count
  where id = p_blog_id;
end;
$$ language plpgsql security definer;

-- ============================================
-- FUNCTION: Get link graph for user/workspace
-- Returns all active links as source→target pairs
-- ============================================
create or replace function
  public.get_link_graph(
    p_user_id uuid,
    p_workspace_id uuid default null
  )
returns table(
  source_id uuid,
  source_title text,
  source_slug text,
  target_id uuid,
  target_title text,
  target_slug text,
  link_count integer,
  anchor_texts text[]
) as $$
begin
  return query
  select
    ail.source_blog_id as source_id,
    sb.title as source_title,
    sb.slug as source_slug,
    ail.target_blog_id as target_id,
    tb.title as target_title,
    tb.slug as target_slug,
    count(*)::integer as link_count,
    array_agg(ail.anchor_text) as anchor_texts
  from public.applied_internal_links ail
  join public.blogs sb on sb.id = ail.source_blog_id
  join public.blogs tb on tb.id = ail.target_blog_id
  where ail.is_active = true
    and (
      ail.user_id = p_user_id
      or (
        p_workspace_id is not null
        and ail.workspace_id = p_workspace_id
      )
    )
  group by
    ail.source_blog_id, sb.title, sb.slug,
    ail.target_blog_id, tb.title, tb.slug;
end;
$$ language plpgsql security definer;

-- ============================================
-- FUNCTION: Get orphan blogs
-- Blogs with 0 inbound OR 0 outbound links
-- ============================================
create or replace function
  public.get_orphan_blogs(
    p_user_id uuid,
    p_workspace_id uuid default null
  )
returns table(
  blog_id uuid,
  title text,
  focus_keyword text,
  created_at timestamptz,
  inbound_links integer,
  outbound_links integer
) as $$
begin
  return query
  select
    b.id as blog_id,
    b.title,
    b.focus_keyword,
    b.created_at,
    coalesce((
      select count(*)::integer
      from public.applied_internal_links ail
      where ail.target_blog_id = b.id
        and ail.is_active = true
    ), 0) as inbound_links,
    coalesce((
      select count(*)::integer
      from public.applied_internal_links ail
      where ail.source_blog_id = b.id
        and ail.is_active = true
    ), 0) as outbound_links
  from public.blogs b
  where
    (b.user_id = p_user_id
    or (
      p_workspace_id is not null
      and b.workspace_id = p_workspace_id
    ))
    and b.blog_html is not null
    and b.blog_html != ''
  and (
    not exists (
      select 1 from public.applied_internal_links ail2
      where ail2.target_blog_id = b.id and ail2.is_active = true
    )
    or not exists (
      select 1 from public.applied_internal_links ail3
      where ail3.source_blog_id = b.id and ail3.is_active = true
    )
  );
end;
$$ language plpgsql security definer;

-- updated_at trigger for suggestions
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_ils_updated_at'
  ) then
    create trigger set_ils_updated_at
      before update on public.internal_link_suggestions
      for each row execute procedure
      public.set_updated_at();
  end if;
end $$;
