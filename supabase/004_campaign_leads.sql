-- Festival campaign leads: one row per enquiry from an /offer/* landing page.
-- Non-destructive and safe to run more than once.
--
-- Run in the Supabase SQL editor after 003_pricing.sql.

create extension if not exists "pgcrypto";

create table if not exists public.campaign_leads (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  -- Which landing page the lead came from, e.g. "diwali-yoga".
  campaign     text        not null,
  full_name    text        not null,
  phone        text        not null,
  email        text,
  country      text,
  experience   text,
  preferred_time text,
  plan_interest  text,
  message      text,
  -- Attribution, as sent by ads and links (?utm_source=instagram …).
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  referrer     text
);

create index if not exists campaign_leads_created_at_idx
  on public.campaign_leads (created_at desc);
create index if not exists campaign_leads_campaign_idx
  on public.campaign_leads (campaign);

-- The site writes with the service-role key, which bypasses RLS. RLS is on
-- with no policies so the public key can never read or write leads.
alter table public.campaign_leads enable row level security;

notify pgrst, 'reload schema';
