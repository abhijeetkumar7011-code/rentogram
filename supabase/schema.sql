-- ============================================
-- Rentogram Supabase Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)
-- ============================================

-- 0. PRODUCTS TABLE
-- Stores actual rental inventory. Add products here via Supabase Table Editor
-- or the dashboard. Publicly readable (anon can SELECT) so the website can
-- display them, but NOT publicly insertable/editable (only you, via the
-- Supabase Dashboard or service_role key, can add/edit products).
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category text not null,           -- e.g. 'Laptop' or 'Monitor'
  name text not null,
  specs text,
  price_per_day numeric not null,
  image_url text,                   -- e.g. '/images/laptop-placeholder.svg' or a Supabase Storage URL
  tag text,                         -- e.g. 'Popular', 'Premium', 'Gaming'
  created_at timestamp with time zone default now()
);

alter table products enable row level security;

create policy "Allow public read on products"
  on products for select
  to anon
  using (true);

-- 1. BOOKINGS TABLE
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  product_id text,
  product_name text,
  start_date date,
  end_date date,
  total_days int,
  total_amount numeric,
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  status text default 'pending', -- pending | confirmed | delivered | completed | cancelled
  created_at timestamp with time zone default now()
);

-- 2. SERVICING REQUESTS TABLE
create table if not exists servicing_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  device text not null,
  issue_description text not null,
  status text default 'pending', -- pending | diagnosed | in_repair | completed
  created_at timestamp with time zone default now()
);

-- 3. CONTACT MESSAGES TABLE
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- 4. NEWSLETTER SUBSCRIBERS TABLE
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Since this is a public-facing site with no login system yet,
-- we allow anonymous INSERT only (visitors can submit forms),
-- but NOT allow them to read/update/delete others' data.
-- ============================================

alter table bookings enable row level security;
alter table servicing_requests enable row level security;
alter table contact_messages enable row level security;
alter table newsletter_subscribers enable row level security;

-- Allow anyone (anon key) to INSERT into these tables
create policy "Allow public insert on bookings"
  on bookings for insert
  to anon
  with check (true);

create policy "Allow public insert on servicing_requests"
  on servicing_requests for insert
  to anon
  with check (true);

create policy "Allow public insert on contact_messages"
  on contact_messages for insert
  to anon
  with check (true);

create policy "Allow public insert on newsletter_subscribers"
  on newsletter_subscribers for insert
  to anon
  with check (true);

-- NOTE: SELECT/UPDATE/DELETE policies are intentionally NOT added for `anon`.
-- This means only you (via Supabase Dashboard, using the service_role key,
-- or once you add an admin login) can view/manage submitted bookings,
-- servicing requests, messages, and subscribers. This keeps customer data private.
