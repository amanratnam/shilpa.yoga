-- Adds the pricing configurator's storage, and makes subscription pricing
-- historical. Non-destructive and safe to run more than once.
--
-- Run in the Supabase SQL editor after 002_align_schema.sql.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Pricing configuration: append-only, newest row is live.
--
-- Keeping every publish rather than updating one row gives a free audit trail
-- ("what did we charge in March, and who changed it?") and makes a publish a
-- single atomic insert with no read-modify-write race.
-- ---------------------------------------------------------------------------
create table if not exists public.pricing_config (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  published_by text        not null,
  config       jsonb       not null
);

create index if not exists pricing_config_created_at_idx
  on public.pricing_config (created_at desc);

-- ---------------------------------------------------------------------------
-- Price snapshots on subscriptions.
--
-- Package labels and amounts used to be derived from the pricing table at
-- read time. Once prices are editable that would silently rewrite history:
-- raising the 12-session price would change what every past receipt says was
-- paid. These columns record the price as sold.
--
-- Nullable on purpose. Rows that predate this migration have no snapshot, and
-- the app falls back to resolving them against the live config, exactly as it
-- did before.
-- ---------------------------------------------------------------------------
alter table public.subscriptions add column if not exists package_label  text;
alter table public.subscriptions add column if not exists package_amount integer;

alter table public.subscriptions drop constraint if exists subscriptions_package_amount_check;
alter table public.subscriptions
  add constraint subscriptions_package_amount_check
  check (package_amount is null or package_amount >= 0);

-- The panel connects with the service-role key, which bypasses RLS. RLS is on
-- with no policies so the anon/public key can never read this table.
alter table public.pricing_config enable row level security;

-- PostgREST caches the schema; without this a brand-new column keeps coming
-- back as "not found in the schema cache".
notify pgrst, 'reload schema';
