-- Admin client-management table for shilpa.yoga.
-- Run once in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.clients (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  full_name    text        not null,
  age          integer     not null check (age between 1 and 120),
  gender       text        not null check (gender in ('female', 'male', 'other', 'prefer_not_to_say')),
  yoga_mode    text        not null check (yoga_mode in ('online', 'offline')),
  -- Package id from content/pricing.ts, e.g. 'online-monthly-8'.
  yoga_package text        not null,
  start_date   date        not null,
  end_date     date        not null,
  payment_done boolean     not null default false,
  notes        text,
  constraint clients_dates_ordered check (end_date >= start_date)
);

create index if not exists clients_created_at_idx on public.clients (created_at desc);

-- The admin panel connects with the service-role key, which bypasses RLS.
-- RLS is enabled with no policies so that the anon/public key can never read
-- this table, even if it is exposed to the browser.
alter table public.clients enable row level security;
