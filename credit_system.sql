-- ============================================
-- CREDITS TABLE
-- Current credit balance per user
-- ============================================
alter table public.profiles
  add column if not exists
  credits_balance integer not null default 0,
  add column if not exists
  credits_total_purchased integer not null default 0,
  add column if not exists
  credits_total_used integer not null default 0,
  add column if not exists
  managed_mode_enabled boolean not null default false,
  add column if not exists
  managed_llm_provider text default 'claude'
    check (managed_llm_provider in (
      'claude', 'openai', 'gemini', 'grok'));

-- Give 5 free credits to all existing users
-- (new users get them via trigger)
update public.profiles
  set credits_balance = 5
  where credits_balance = 0;

-- ============================================
-- CREDIT TRANSACTIONS TABLE
-- Full audit log of all credit movements
-- ============================================
create table if not exists public.credit_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id)
    on delete cascade not null,

  type text not null check (type in (
    'purchase',      -- bought credits
    'usage',         -- used for blog generation
    'refund',        -- refund for failed generation
    'bonus',         -- free credits given
    'admin_adjust'   -- manual adjustment
  )),

  amount integer not null,
  -- positive = credits added
  -- negative = credits deducted

  balance_after integer not null
  -- snapshot of balance after this transaction
);

-- Add Razorpay columns if they don't exist
alter table public.credit_transactions
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_payment_id text,
  add column if not exists razorpay_signature text,
  add column if not exists pack_id text,
  add column if not exists pack_name text,
  add column if not exists amount_paid_inr integer,
  add column if not exists blog_id uuid references public.blogs(id) on delete set null,
  add column if not exists blog_topic text,
  add column if not exists llm_provider text,
  add column if not exists description text,
  add column if not exists created_at timestamptz not null default now();

create index if not exists credit_txn_user_idx
  on public.credit_transactions(
    user_id, created_at desc);

create index if not exists credit_txn_razorpay_idx
  on public.credit_transactions(razorpay_payment_id)
  where razorpay_payment_id is not null;

alter table public.credit_transactions
  enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users view own transactions' and tablename = 'credit_transactions') then
    create policy "Users view own transactions"
      on public.credit_transactions for select
      using (auth.uid() = user_id);
  end if;
end $$;

-- ============================================
-- RAZORPAY ORDERS TABLE
-- Track pending orders before payment confirmation
-- ============================================
-- ============================================
-- RAZORPAY ORDERS TABLE
-- Track pending orders before payment confirmation
-- ============================================
create table if not exists public.razorpay_orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id)
    on delete cascade not null,
  razorpay_order_id text not null unique,
  pack_id text not null,
  pack_name text not null,
  credits integer not null,
  amount_inr integer not null,    -- in paise
  status text not null default 'created'
    check (status in (
      'created', 'paid', 'failed', 'expired')),
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  expires_at timestamptz not null
    default (now() + interval '30 minutes')
);

-- Ensure user_id exists even if table was created with profile_id
alter table public.razorpay_orders
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.razorpay_orders
  enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users view own orders' and tablename = 'razorpay_orders') then
    create policy "Users view own orders"
      on public.razorpay_orders for select
      using (auth.uid() = user_id);
  end if;
end $$;

-- ============================================
-- PLATFORM API KEYS TABLE
-- Keys used for managed mode (admin only)
-- ============================================
create table if not exists public.platform_api_keys (
  id uuid primary key default uuid_generate_v4(),
  provider text not null unique
    check (provider in (
      'claude', 'openai', 'gemini', 'grok')),
  encrypted_key text not null,
  is_active boolean not null default true,
  daily_limit integer default 1000,
  daily_used integer not null default 0,
  last_reset_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- TRIGGER: Give 5 free credits to new users
-- ============================================
create or replace function public.give_signup_credits()
returns trigger as $$
begin
  -- Give 5 free credits
  update public.profiles
    set credits_balance = 5,
        credits_total_purchased = 5
    where id = new.id;

  -- Record the bonus transaction
  insert into public.credit_transactions (
    user_id, type, amount, balance_after,
    description
  ) values (
    new.id, 'bonus', 5, 5,
    'Welcome bonus — 5 free credits'
  );

  return new;
end;
$$ language plpgsql security definer;

-- Fire after profile is created (which fires after
-- user signup via the existing on_auth_user_created
-- trigger)
drop trigger if exists on_profile_created_give_credits on public.profiles;
create trigger on_profile_created_give_credits
  after insert on public.profiles
  for each row execute procedure
  public.give_signup_credits();

-- ============================================
-- FUNCTION: Deduct credits atomically
-- Called from server-side only (service role)
-- ============================================
create or replace function public.deduct_credit(
  p_user_id uuid,
  p_blog_id uuid,
  p_blog_topic text,
  p_llm_provider text
)
returns jsonb as $$
declare
  v_current_balance integer;
  v_new_balance integer;
begin
  -- Lock the row to prevent race conditions
  select credits_balance into v_current_balance
  from public.profiles
  where id = p_user_id
  for update;

  -- Check sufficient balance
  if v_current_balance < 1 then
    return jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'balance', v_current_balance
    );
  end if;

  v_new_balance := v_current_balance - 1;

  -- Deduct from profile
  update public.profiles
  set credits_balance = v_new_balance,
      credits_total_used = credits_total_used + 1
  where id = p_user_id;

  -- Record transaction
  insert into public.credit_transactions (
    user_id, type, amount, balance_after,
    blog_id, blog_topic, llm_provider,
    description
  ) values (
    p_user_id, 'usage', -1, v_new_balance,
    p_blog_id, p_blog_topic, p_llm_provider,
    'Blog generation: ' || p_blog_topic
  );

  return jsonb_build_object(
    'success', true,
    'balance_after', v_new_balance
  );
end;
$$ language plpgsql security definer;

-- ============================================
-- FUNCTION: Add credits after payment
-- Called from webhook (service role)
-- ============================================
create or replace function public.add_credits(
  p_user_id uuid,
  p_amount integer,
  p_razorpay_payment_id text,
  p_razorpay_order_id text,
  p_razorpay_signature text,
  p_pack_id text,
  p_pack_name text,
  p_amount_paid_inr integer
)
returns jsonb as $$
declare
  v_current_balance integer;
  v_new_balance integer;
begin
  -- Check for duplicate payment (idempotency)
  if exists (
    select 1 from public.credit_transactions
    where razorpay_payment_id = p_razorpay_payment_id
  ) then
    return jsonb_build_object(
      'success', false,
      'error', 'duplicate_payment'
    );
  end if;

  -- Get current balance with lock
  select credits_balance into v_current_balance
  from public.profiles
  where id = p_user_id
  for update;

  v_new_balance := v_current_balance + p_amount;

  -- Add to profile
  update public.profiles
  set credits_balance = v_new_balance,
      credits_total_purchased =
        credits_total_purchased + p_amount
  where id = p_user_id;

  -- Update order status
  update public.razorpay_orders
  set status = 'paid',
      razorpay_payment_id = p_razorpay_payment_id,
      razorpay_signature = p_razorpay_signature,
      paid_at = now()
  where razorpay_order_id = p_razorpay_order_id;

  -- Record transaction
  insert into public.credit_transactions (
    user_id, type, amount, balance_after,
    razorpay_order_id, razorpay_payment_id,
    razorpay_signature, pack_id, pack_name,
    amount_paid_inr,
    description
  ) values (
    p_user_id, 'purchase', p_amount, v_new_balance,
    p_razorpay_order_id, p_razorpay_payment_id,
    p_razorpay_signature, p_pack_id, p_pack_name,
    p_amount_paid_inr,
    'Purchased ' || p_amount || ' credits — ' ||
    p_pack_name
  );

  return jsonb_build_object(
    'success', true,
    'credits_added', p_amount,
    'balance_after', v_new_balance
  );
end;
$$ language plpgsql security definer;
