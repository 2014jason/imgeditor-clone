-- Billing / entitlements tables + helper RPCs.
-- Apply this in Supabase SQL Editor (or via migrations if you use supabase-cli).

-- 1) Per-user entitlements (credits + subscription flags)
create table if not exists public.user_entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  credits_balance integer not null default 0,
  subscription_active boolean not null default false,
  plan text null,
  subscription_status text null,
  subscription_product_id text null,
  subscription_current_period_end timestamptz null,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on any update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_entitlements_updated_at on public.user_entitlements;
create trigger trg_user_entitlements_updated_at
before update on public.user_entitlements
for each row execute function public.set_updated_at();

-- 2) Webhook idempotency log (one row per Creem webhook event)
create table if not exists public.billing_events (
  webhook_id text primary key,
  event_type text not null,
  user_id uuid null references auth.users (id) on delete set null,
  payload jsonb null,
  processed_at timestamptz not null default now()
);

-- 3) RLS (optional but recommended)
alter table public.user_entitlements enable row level security;
drop policy if exists "read_own_entitlements" on public.user_entitlements;
create policy "read_own_entitlements"
on public.user_entitlements
for select
to authenticated
using (auth.uid() = user_id);

alter table public.billing_events enable row level security;
-- No policies: only service role should be able to read/write billing_events.

-- 4) RPC: add credits (atomic)
create or replace function public.billing_add_credits(p_user_id uuid, p_amount integer)
returns public.user_entitlements
language plpgsql
as $$
declare
  row public.user_entitlements;
begin
  if p_amount is null or p_amount <= 0 then
    select * into row from public.user_entitlements where user_id = p_user_id;
    return row;
  end if;

  insert into public.user_entitlements (user_id, credits_balance)
  values (p_user_id, p_amount)
  on conflict (user_id) do update
    set credits_balance = public.user_entitlements.credits_balance + excluded.credits_balance;

  select * into row from public.user_entitlements where user_id = p_user_id;
  return row;
end;
$$;

-- 5) RPC: consume credits (atomic, raises 'insufficient_credits' when not enough)
create or replace function public.billing_consume_credits(p_user_id uuid, p_amount integer)
returns public.user_entitlements
language plpgsql
as $$
declare
  row public.user_entitlements;
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'invalid_amount';
  end if;

  insert into public.user_entitlements (user_id, credits_balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  update public.user_entitlements
    set credits_balance = credits_balance - p_amount
  where user_id = p_user_id and credits_balance >= p_amount
  returning * into row;

  if not found then
    raise exception 'insufficient_credits';
  end if;

  return row;
end;
$$;
