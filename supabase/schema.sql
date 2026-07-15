-- ============================================================
-- Rentogram Supabase Schema — v2 (Production Backend)
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS /
-- CREATE OR REPLACE / ON CONFLICT DO NOTHING), so running this on
-- top of your existing v1 database will NOT drop or duplicate data.
-- Run in Supabase Dashboard → SQL Editor → New Query.
-- ============================================================

-- ------------------------------------------------------------
-- 0. PRODUCTS TABLE — extended in place (existing rows kept)
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  specs text,
  price_per_day numeric not null,          -- "Rent price" (per day)
  image_url text,
  tag text,
  created_at timestamp with time zone default now()
);

-- New columns (safe on an already-existing table)
alter table products add column if not exists slug text;
alter table products add column if not exists brand text;
alter table products add column if not exists short_description text;
alter table products add column if not exists full_description text;      -- rich text (HTML)
alter table products add column if not exists security_deposit numeric default 0;
alter table products add column if not exists original_price numeric;
alter table products add column if not exists stock_quantity integer not null default 1;
alter table products add column if not exists availability_status text not null default 'available';
-- valid values: 'available' | 'rented_out' | 'maintenance' | 'unavailable'
alter table products add column if not exists is_featured boolean not null default false;
alter table products add column if not exists condition text not null default 'New';
-- valid values: 'New' | 'Used'
alter table products add column if not exists sku text;
alter table products add column if not exists view_count integer not null default 0;
alter table products add column if not exists is_deleted boolean not null default false; -- soft delete (optional)
alter table products add column if not exists updated_at timestamp with time zone default now();

-- Backfill slugs for any existing rows that don't have one yet (safe to re-run —
-- only touches rows where slug is still null)
update products
set slug = lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(id::text, 1, 6)
where slug is null;

create unique index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_brand on products(brand);
create index if not exists idx_products_featured on products(is_featured) where is_featured = true;
create index if not exists idx_products_availability on products(availability_status);
create index if not exists idx_products_sku on products(sku);

alter table products enable row level security;

drop policy if exists "Allow public read on products" on products;
create policy "Allow public read on products"
  on products for select
  to anon
  using (is_deleted = false);
-- NOTE: no anon INSERT/UPDATE/DELETE policy — writes require the service_role
-- key (server-side only, see lib/supabaseAdmin.js) until an admin auth system
-- is added.

-- ------------------------------------------------------------
-- 1. PRODUCT IMAGES — one product, many images
-- ------------------------------------------------------------
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  position integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamp with time zone default now()
);

create index if not exists idx_product_images_product_id on product_images(product_id);
create index if not exists idx_product_images_position on product_images(product_id, position);

alter table product_images enable row level security;

drop policy if exists "Allow public read on product_images" on product_images;
create policy "Allow public read on product_images"
  on product_images for select
  to anon
  using (true);
-- writes: service_role only (admin upload API), see app/api/products/upload-image

-- ------------------------------------------------------------
-- 2. PRODUCT DETAILS — specs / features / policies / SEO (1:1 with products)
-- ------------------------------------------------------------
create table if not exists product_details (
  product_id uuid primary key references products(id) on delete cascade,
  specifications jsonb not null default '[]',      -- [{ "label": "RAM", "value": "16GB" }, ...]
  features jsonb not null default '[]',             -- ["Backlit keyboard", "Fingerprint reader", ...]
  whats_included jsonb not null default '[]',       -- ["Charger", "Carry case", ...]
  rental_terms text,
  delivery_information text,
  return_policy text,
  warranty text,
  faqs jsonb not null default '[]',                 -- [{ "q": "...", "a": "..." }, ...]
  tags text[] not null default '{}',
  meta_title text,
  meta_description text,
  updated_at timestamp with time zone default now()
);

alter table product_details enable row level security;

drop policy if exists "Allow public read on product_details" on product_details;
create policy "Allow public read on product_details"
  on product_details for select
  to anon
  using (true);
-- writes: service_role only

-- ------------------------------------------------------------
-- 3. PRODUCT VIEWS — lightweight analytics
-- ------------------------------------------------------------
create table if not exists product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid,             -- nullable until auth exists
  session_id text,
  ip_address text,
  viewed_at timestamp with time zone default now()
);

create index if not exists idx_product_views_product_id on product_views(product_id);
create index if not exists idx_product_views_viewed_at on product_views(viewed_at);

alter table product_views enable row level security;

drop policy if exists "Allow public insert on product_views" on product_views;
create policy "Allow public insert on product_views"
  on product_views for insert
  to anon
  with check (true);
-- no SELECT policy for anon — view logs are not publicly browsable,
-- only the aggregated `products.view_count` is public.

-- Auto-increment products.view_count whenever a view is logged
create or replace function increment_product_view_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update products set view_count = view_count + 1 where id = new.product_id;
  return new;
end;
$$;

drop trigger if exists trg_increment_view_count on product_views;
create trigger trg_increment_view_count
  after insert on product_views
  for each row execute function increment_product_view_count();

-- ------------------------------------------------------------
-- 4. RENTAL ORDERS + ORDER ITEMS — production Rent Now flow
-- ------------------------------------------------------------
create table if not exists rental_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,          -- e.g. RNT-LX3F9K-8421 (generated client-side)
  customer_name text not null,
  customer_mobile text not null,
  customer_email text,
  customer_address text not null,
  customer_city text not null,
  customer_state text not null,
  customer_pincode text not null,
  start_date date not null,
  end_date date not null,
  rental_duration_days integer not null,
  subtotal_amount numeric not null default 0,
  security_deposit_amount numeric not null default 0,
  gst_amount numeric not null default 0,
  total_amount numeric not null default 0,
  status text not null default 'pending',
  -- valid values: 'pending' | 'confirmed' | 'delivered' | 'active' | 'completed' | 'cancelled'
  payment_status text not null default 'pending',
  -- valid values: 'pending' | 'cod' | 'paid' | 'refunded'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_rental_orders_order_number on rental_orders(order_number);
create index if not exists idx_rental_orders_mobile on rental_orders(customer_mobile);
create index if not exists idx_rental_orders_status on rental_orders(status);

create table if not exists rental_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references rental_orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,        -- snapshot (survives product edits/deletion)
  product_image text,                -- snapshot
  unit_rent_price numeric not null,  -- snapshot
  unit_security_deposit numeric not null default 0,
  quantity integer not null default 1,
  line_rent_total numeric not null,
  line_deposit_total numeric not null default 0,
  created_at timestamp with time zone default now()
);

create index if not exists idx_rental_order_items_order_id on rental_order_items(order_id);
create index if not exists idx_rental_order_items_product_id on rental_order_items(product_id);

alter table rental_orders enable row level security;
alter table rental_order_items enable row level security;

drop policy if exists "Allow public insert on rental_orders" on rental_orders;
create policy "Allow public insert on rental_orders"
  on rental_orders for insert
  to anon
  with check (true);

drop policy if exists "Allow public insert on rental_order_items" on rental_order_items;
create policy "Allow public insert on rental_order_items"
  on rental_order_items for insert
  to anon
  with check (true);
-- No SELECT policy for anon on either table (customer names/phones/addresses
-- must not be publicly browsable). Guest order-confirmation lookups go through
-- the get_order_details() function below instead, which only returns a row
-- when the caller already knows the exact order_number.

create or replace function get_order_details(p_order_number text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'order', row_to_json(o.*),
    'items', coalesce(json_agg(i.*) filter (where i.id is not null), '[]'::json)
  )
  into result
  from rental_orders o
  left join rental_order_items i on i.order_id = o.id
  where o.order_number = p_order_number
  group by o.id;

  return result;
end;
$$;

grant execute on function get_order_details(text) to anon;

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_rental_orders_updated_at on rental_orders;
create trigger trg_rental_orders_updated_at
  before update on rental_orders
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 5. SUPABASE STORAGE — "products" bucket for images
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "Public read access on products bucket" on storage.objects;
create policy "Public read access on products bucket"
  on storage.objects for select
  to public
  using (bucket_id = 'products');
-- Uploads/deletes are NOT opened to anon — they go through the server-side
-- API route (app/api/products/upload-image) using the service_role key,
-- so random visitors can never write to storage directly.

-- ------------------------------------------------------------
-- 6. EXISTING TABLES (unchanged from v1 — kept for compatibility)
-- ------------------------------------------------------------
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
  status text default 'pending',
  created_at timestamp with time zone default now()
);

create table if not exists servicing_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  device text not null,
  issue_description text not null,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone default now()
);

alter table bookings enable row level security;
alter table servicing_requests enable row level security;
alter table contact_messages enable row level security;
alter table newsletter_subscribers enable row level security;

drop policy if exists "Allow public insert on bookings" on bookings;
create policy "Allow public insert on bookings"
  on bookings for insert to anon with check (true);

drop policy if exists "Allow public insert on servicing_requests" on servicing_requests;
create policy "Allow public insert on servicing_requests"
  on servicing_requests for insert to anon with check (true);

drop policy if exists "Allow public insert on contact_messages" on contact_messages;
create policy "Allow public insert on contact_messages"
  on contact_messages for insert to anon with check (true);

drop policy if exists "Allow public insert on newsletter_subscribers" on newsletter_subscribers;
create policy "Allow public insert on newsletter_subscribers"
  on newsletter_subscribers for insert to anon with check (true);

-- ============================================================
-- NOT included here (needs a decision from you first):
--   • Admin authentication (Supabase Auth) — required before any
--     admin CRUD/UI can be safely exposed. Everything above is written
--     so it slots in cleanly once auth exists (RLS already blocks
--     anon writes on products/images/details).
--   • Rate limiting / logging-monitoring hooks — these are
--     infra-level choices (e.g. Upstash, Vercel logs, Sentry) rather
--     than SQL, happy to wire up once you pick a provider.
-- ============================================================