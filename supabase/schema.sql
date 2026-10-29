-- Express Wash: pickups table and row level security.
-- Run once in the Supabase SQL editor.

create table if not exists public.pickups (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  name         text not null check (char_length(name) between 2 and 80),
  phone        text not null check (phone ~ '^09[0-9]{9}$'),
  address      text not null check (char_length(address) between 8 and 300),
  pickup_date  date not null,
  time_slot    text not null check (time_slot in ('06-09','09-12','12-15','15-18','18-21','21-24','00-06')),
  load_kg      numeric(4,1) not null check (load_kg >= 1 and load_kg <= 60),
  notes        text check (notes is null or char_length(notes) <= 500),
  status       text not null default 'pending'
               check (status in ('pending','picked_up','washing','ready','delivered'))
);

create index if not exists pickups_status_date_idx on public.pickups (status, pickup_date);

-- Keep updated_at honest on every status change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pickups_set_updated_at on public.pickups;
create trigger pickups_set_updated_at
  before update on public.pickups
  for each row execute function public.set_updated_at();

-- Row level security ---------------------------------------------------------
-- The public site (anon key) may only INSERT a new booking, and only as 'pending'.
-- It can never read, change or delete bookings, so customers' names, phones and
-- addresses are not readable with the public key.
-- The admin screen uses the service role key on the server, which bypasses RLS.

alter table public.pickups enable row level security;

drop policy if exists "Public can book a pending pickup" on public.pickups;
create policy "Public can book a pending pickup"
  on public.pickups
  for insert
  to anon
  with check (
    status = 'pending'
    and pickup_date >= (now() at time zone 'Asia/Manila')::date
    and pickup_date <= (now() at time zone 'Asia/Manila')::date + 14
  );

-- No select / update / delete policies for anon or authenticated: denied by default.

-- Tighten table privileges to match: anon can insert, nothing else.
revoke all on public.pickups from anon, authenticated;
grant insert on public.pickups to anon;
