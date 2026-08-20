-- Admin schema for shilpa.yoga: a client repository plus their subscriptions.
--
-- !! DESTRUCTIVE !!
-- The two DROP statements below delete the old single-table `clients`
-- structure and everything in it. That is intended for the move to separate
-- clients and subscriptions. If you ever need to keep existing rows, export
-- them first.
--
-- Run once in the Supabase SQL editor.

create extension if not exists "pgcrypto";

drop table if exists public.subscriptions cascade;
drop table if exists public.clients cascade;

-- ---------------------------------------------------------------------------
-- Clients: the people. Doubles as the newsletter list.
-- ---------------------------------------------------------------------------
create table public.clients (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  full_name       text        not null,
  age             integer     not null check (age between 1 and 120),
  gender          text        not null check (gender in ('female', 'male', 'other', 'prefer_not_to_say')),
  -- Optional: walk-ins and phone enquiries may not have given an email yet.
  -- Stored lowercase so uniqueness is not case-sensitive.
  email           text,
  phone           text,
  referral_source text        not null,
  status          text        not null check (status in ('active', 'potential', 'churned')),
  notes           text
);

-- Unique only among clients that actually have an email, so any number of
-- records may leave it blank.
create unique index clients_email_key on public.clients (email) where email is not null;
create index clients_created_at_idx on public.clients (created_at desc);
create index clients_status_idx on public.clients (status);

-- ---------------------------------------------------------------------------
-- Subscriptions: one row per package a client signs up for. Kept as an
-- append-friendly history so a client's detail page can show an audit trail.
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  client_id      uuid        not null references public.clients (id) on delete cascade,
  yoga_mode      text        not null check (yoga_mode in ('online', 'offline')),
  -- Package id from content/pricing.ts, e.g. 'online-monthly-8'.
  yoga_package   text        not null,
  start_date     date        not null,
  end_date       date        not null,
  payment_done   boolean     not null default false,
  payment_method text        not null,
  notes          text,
  constraint subscriptions_dates_ordered check (end_date >= start_date)
);

create index subscriptions_client_id_idx on public.subscriptions (client_id, start_date desc);
create index subscriptions_created_at_idx on public.subscriptions (created_at desc);

-- Keep updated_at honest without the app having to remember.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_touch_updated_at
  before update on public.clients
  for each row execute function public.touch_updated_at();

create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- The admin panel connects with the service-role key, which bypasses RLS.
-- RLS is enabled with no policies so the anon/public key can never read these
-- tables, even though it is exposed to the browser.
alter table public.clients enable row level security;
alter table public.subscriptions enable row level security;
