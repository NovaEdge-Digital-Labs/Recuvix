-- ============================================
-- WHITE LABEL TENANTS TABLE
-- One row per agency/white label client
-- ============================================
create table if not exists public.wl_tenants (
  id uuid primary key default uuid_generate_v4(),

  -- Identity
  slug text not null unique,
  -- URL-safe slug: "nova-agency", "seo-tools-pro"
  -- Used for {slug}.recuvix.in subdomain

  name text not null,
  -- What THEIR users see: "Nova SEO Tool"

  -- Branding
  brand_logo_url text,
  brand_favicon_url text,
  brand_primary_color text default '#e8ff47',
  -- Their accent colour (hex)
  brand_secondary_color text default '#111111',
  brand_background_color text default '#0a0a0a',
  brand_text_color text default '#f5f5f5',
  brand_font_heading text default 'Syne',
  -- Google Font name
  brand_font_body text default 'DM Sans',
  brand_tagline text,
  -- "AI-powered content for your business"

  -- Domain config
  subdomain text generated always as
    (slug || '.recuvix.in') stored,
  custom_domain text unique,
  -- e.g. "blogtool.agencyname.com"
  custom_domain_verified boolean default false,
  custom_domain_verification_token text,
  -- TXT record value for DNS verification
  ssl_provisioned boolean default false,

  -- Owner (the agency admin account)
  owner_user_id uuid references auth.users(id)
    on delete restrict not null,
  owner_email text not null,

  -- Licence
  licence_plan text not null default 'starter'
    check (licence_plan in (
      'starter', 'growth', 'agency', 'enterprise'
    )),
  licence_status text not null default 'trial'
    check (licence_status in (
      'trial', 'active', 'suspended', 'cancelled'
    )),
  trial_ends_at timestamptz default
    (now() + interval '14 days'),
  licence_starts_at timestamptz,
  licence_renews_at timestamptz,
  monthly_licence_fee_inr integer,
  -- In paise: ₹4999 = 499900

  -- Revenue sharing
  revenue_share_percent integer default 20,
  -- % of credit purchase that goes to agency owner
  -- Platform keeps the rest
  credit_markup_percent integer default 30,
  -- Agency can mark up credit prices by this %
  -- e.g. platform sells 10 credits for ₹499
  -- agency marks up 30%: sells for ₹649

  -- Feature flags
  features_enabled jsonb not null default
    '{
      "byok": true,
      "managed_mode": true,
      "multilingual": true,
      "bulk_generation": true,
      "voice_to_blog": true,
      "competitor_analyzer": true,
      "keyword_research": true,
      "repurposing": true,
      "internal_linking": true,
      "content_calendar": true,
      "wordpress_publish": true,
      "gsc_tracker": true,
      "team_workspaces": true,
      "white_label_sub_resell": false
    }'::jsonb,

  -- Limits
  max_users integer default 100,
  max_workspaces integer default 10,
  max_blogs_per_user_per_day integer default 50,

  -- Credit pricing overrides
  -- If null: use platform defaults
  credit_pack_prices jsonb,
  -- {
  --   "starter": 64900,   (₹649 in paise)
  --   "pro": 259900,      (₹2599 in paise)
  --   "agency": 779900,   (₹7799 in paise)
  --   "mega": 1559900     (₹15599 in paise)
  -- }

  -- LLM config
  -- If set: this tenant uses their own keys
  -- (agency provides platform LLM keys for their users)
  tenant_claude_key_encrypted text,
  tenant_openai_key_encrypted text,
  tenant_gemini_key_encrypted text,
  tenant_grok_key_encrypted text,
  tenant_whisper_key_encrypted text,

  -- Auth config
  allow_google_oauth boolean default true,
  allow_email_signup boolean default true,
  require_email_verification boolean default true,
  custom_email_from_name text,
  -- "Nova SEO Team" (sender name for emails)
  custom_email_from_address text,
  -- "hello@novaagency.com" (if Resend configured)

  -- Support
  support_email text,
  help_url text,
  privacy_policy_url text,
  terms_url text,

  -- Analytics
  ga4_measurement_id text,
  -- Google Analytics 4 ID for tenant
  clarity_project_id text,
  -- Microsoft Clarity for tenant

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active_at timestamptz
);

create index if not exists wl_tenants_slug_idx
  on public.wl_tenants(slug);
create index if not exists wl_tenants_domain_idx
  on public.wl_tenants(custom_domain)
  where custom_domain is not null;
create index if not exists wl_tenants_owner_idx
  on public.wl_tenants(owner_user_id);

-- No RLS on this table (admin only via service role)
-- Regular users never query this table directly

-- ============================================
-- ADD tenant_id TO KEY TABLES
-- Every user and workspace belongs to a tenant
-- ============================================
alter table public.profiles
  add column if not exists
  tenant_id uuid references public.wl_tenants(id)
    on delete restrict;
  -- null = main Recuvix platform user

alter table public.workspaces
  add column if not exists
  tenant_id uuid references public.wl_tenants(id)
    on delete restrict;

alter table public.blogs
  add column if not exists
  tenant_id uuid references public.wl_tenants(id)
    on delete restrict;

-- Index for tenant-scoped queries
create index if not exists profiles_tenant_idx
  on public.profiles(tenant_id)
  where tenant_id is not null;
create index if not exists blogs_tenant_idx
  on public.blogs(tenant_id)
  where tenant_id is not null;
create index if not exists workspaces_tenant_idx
  on public.workspaces(tenant_id)
  where tenant_id is not null;

-- ============================================
-- WL TENANT USERS TABLE
-- Junction table: which users belong to tenant
-- ============================================
create table if not exists public.wl_tenant_users (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.wl_tenants(id)
    on delete cascade not null,
  user_id uuid references auth.users(id)
    on delete cascade not null,
  role text not null default 'user'
    check (role in (
      'tenant_owner',   -- the agency itself
      'tenant_admin',   -- agency staff
      'user'            -- end user (agency's client)
    )),
  status text not null default 'active'
    check (status in (
      'active', 'suspended', 'deleted'
    )),
  joined_at timestamptz not null default now(),
  last_active_at timestamptz,
  unique(tenant_id, user_id)
);

create index if not exists wl_tenant_users_tenant_idx
  on public.wl_tenant_users(tenant_id, status);
create index if not exists wl_tenant_users_user_idx
  on public.wl_tenant_users(user_id);

-- ============================================
-- WL REVENUE TRANSACTIONS
-- Track revenue sharing per credit purchase
-- ============================================
create table if not exists public.wl_revenue_transactions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.wl_tenants(id)
    on delete restrict not null,

  -- The credit purchase that triggered this
  credit_transaction_id uuid references
    public.credit_transactions(id)
    on delete restrict,

  -- Amounts (all in paise/INR)
  gross_amount_inr integer not null,
  -- What user paid
  platform_share_inr integer not null,
  -- What Recuvix keeps
  tenant_share_inr integer not null,
  -- What agency earns
  revenue_share_percent integer not null,

  -- Payout status
  payout_status text not null default 'pending'
    check (payout_status in (
      'pending', 'processing', 'paid', 'held'
    )),
  payout_reference text,
  -- Razorpay payout ID when disbursed
  payout_date timestamptz,

  created_at timestamptz not null default now()
);

create index if not exists wl_revenue_tenant_idx
  on public.wl_revenue_transactions(
    tenant_id, created_at desc);

-- ============================================
-- WL DOMAIN VERIFICATION TABLE
-- Tracks DNS verification for custom domains
-- ============================================
create table if not exists public.wl_domain_verifications (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.wl_tenants(id)
    on delete cascade not null,
  domain text not null,
  verification_token text not null unique,
  verified_at timestamptz,
  verification_attempts integer default 0,
  last_check_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- FUNCTION: Get tenant from hostname
-- Called on every request by middleware
-- ============================================
create or replace function
  public.get_tenant_by_hostname(
    p_hostname text
  )
returns table(
  tenant_id uuid,
  slug text,
  name text,
  brand_logo_url text,
  brand_favicon_url text,
  brand_primary_color text,
  brand_secondary_color text,
  brand_background_color text,
  brand_text_color text,
  brand_font_heading text,
  brand_font_body text,
  brand_tagline text,
  features_enabled jsonb,
  licence_status text,
  subdomain text,
  custom_domain text
) as $$
begin
  return query
  select
    t.id,
    t.slug,
    t.name,
    t.brand_logo_url,
    t.brand_favicon_url,
    t.brand_primary_color,
    t.brand_secondary_color,
    t.brand_background_color,
    t.brand_text_color,
    t.brand_font_heading,
    t.brand_font_body,
    t.brand_tagline,
    t.features_enabled,
    t.licence_status,
    t.subdomain,
    t.custom_domain
  from public.wl_tenants t
  where
    t.licence_status in ('trial', 'active')
    and (
      -- Match subdomain: {slug}.recuvix.in
      t.subdomain = p_hostname
      or
      -- Match custom domain
      (t.custom_domain = p_hostname
        and t.custom_domain_verified = true)
    )
  limit 1;
end;
$$ language plpgsql security definer;

-- ============================================
-- FUNCTION: Resolve tenant LLM key
-- Returns the best available key for a tenant
-- ============================================
create or replace function
  public.get_tenant_llm_key(
    p_tenant_id uuid,
    p_provider text
  )
returns text as $$
declare
  v_encrypted_key text;
begin
  -- Try tenant's own key first
  select case p_provider
    when 'claude'  then tenant_claude_key_encrypted
    when 'openai'  then tenant_openai_key_encrypted
    when 'gemini'  then tenant_gemini_key_encrypted
    when 'grok'    then tenant_grok_key_encrypted
  end into v_encrypted_key
  from public.wl_tenants
  where id = p_tenant_id;

  -- Return tenant key if exists
  if v_encrypted_key is not null then
    return v_encrypted_key;
  end if;

  -- Fall back to platform key
  select encrypted_key into v_encrypted_key
  from public.platform_api_keys
  where provider = p_provider
    and is_active = true
    and is_healthy = true
  order by priority asc, requests_today asc
  limit 1;

  return v_encrypted_key;
end;
$$ language plpgsql security definer;

-- updated_at triggers
drop trigger if exists set_wl_tenants_updated_at on public.wl_tenants;
create trigger set_wl_tenants_updated_at
  before update on public.wl_tenants
  for each row execute procedure
  public.set_updated_at();
