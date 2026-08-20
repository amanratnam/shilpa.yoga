-- Brings an existing shilpa.yoga admin database up to the schema the current
-- code expects, WITHOUT dropping anything.
--
-- Safe to run on:
--   * an empty project (creates everything)
--   * the two-table schema that predates the `phone` column
--   * the original single-table `clients` that carried subscription fields
--
-- Safe to run more than once. Prefer this over re-running 001_schema.sql,
-- which drops both tables.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Clients
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name  text not null,
  age        integer not null,
  gender     text not null
);

alter table public.clients add column if not exists updated_at      timestamptz not null default now();
alter table public.clients add column if not exists email           text;
alter table public.clients add column if not exists phone           text;
alter table public.clients add column if not exists referral_source text;
alter table public.clients add column if not exists status          text;
alter table public.clients add column if not exists notes           text;

-- Existing rows predate these columns, so give them a value before the NOT
-- NULL constraints go on.
update public.clients set referral_source = 'other'  where referral_source is null;
update public.clients set status          = 'active' where status is null;

alter table public.clients alter column referral_source set not null;
alter table public.clients alter column status          set not null;

-- ---------------------------------------------------------------------------
-- Subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  client_id      uuid not null references public.clients (id) on delete cascade,
  yoga_mode      text not null,
  yoga_package   text not null,
  start_date     date not null,
  end_date       date not null,
  payment_done   boolean not null default false,
  payment_method text not null default 'other',
  notes          text
);

alter table public.subscriptions add column if not exists updated_at     timestamptz not null default now();
alter table public.subscriptions add column if not exists payment_method text not null default 'other';
alter table public.subscriptions add column if not exists notes          text;

-- ---------------------------------------------------------------------------
-- Carry over data from the original single-table layout, then retire those
-- columns. While they remain, they are NOT NULL and would block every new
-- client insert.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'clients' and column_name = 'yoga_package'
  ) then
    insert into public.subscriptions
      (client_id, yoga_mode, yoga_package, start_date, end_date, payment_done, payment_method, notes)
    select c.id,
           case when c.yoga_mode in ('online', 'offline') then c.yoga_mode else 'online' end,
           c.yoga_package, c.start_date, c.end_date,
           coalesce(c.payment_done, false), 'other', null
      from public.clients c
     where c.yoga_package is not null
       and not exists (select 1 from public.subscriptions s where s.client_id = c.id);

    alter table public.clients drop column if exists yoga_mode;
    alter table public.clients drop column if exists yoga_package;
    alter table public.clients drop column if exists start_date;
    alter table public.clients drop column if exists end_date;
    alter table public.clients drop column if exists payment_done;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Constraints, indexes and triggers (all idempotent)
-- ---------------------------------------------------------------------------
alter table public.clients       drop constraint if exists clients_gender_check;
alter table public.clients       drop constraint if exists clients_status_check;
alter table public.clients       drop constraint if exists clients_age_check;
alter table public.subscriptions drop constraint if exists subscriptions_yoga_mode_check;
alter table public.subscriptions drop constraint if exists subscriptions_dates_ordered;

alter table public.clients
  add constraint clients_gender_check check (gender in ('female', 'male', 'other', 'prefer_not_to_say')),
  add constraint clients_status_check check (status in ('active', 'potential', 'churned')),
  add constraint clients_age_check    check (age between 1 and 120);

alter table public.subscriptions
  add constraint subscriptions_yoga_mode_check check (yoga_mode in ('online', 'offline')),
  add constraint subscriptions_dates_ordered   check (end_date >= start_date);

-- Unique only among clients that have an email, so any number may leave it blank.
create unique index if not exists clients_email_key         on public.clients (email) where email is not null;
create index        if not exists clients_created_at_idx    on public.clients (created_at desc);
create index        if not exists clients_status_idx        on public.clients (status);
create index        if not exists subscriptions_client_id_idx  on public.subscriptions (client_id, start_date desc);
create index        if not exists subscriptions_created_at_idx on public.subscriptions (created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clients_touch_updated_at on public.clients;
create trigger clients_touch_updated_at
  before update on public.clients
  for each row execute function public.touch_updated_at();

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- The panel connects with the service-role key, which bypasses RLS. RLS is on
-- with no policies so the anon/public key can never read these tables.
alter table public.clients       enable row level security;
alter table public.subscriptions enable row level security;

-- PostgREST caches the schema; without this a brand-new column keeps coming
-- back as "not found in the schema cache".
notify pgrst, 'reload schema';
