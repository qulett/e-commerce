create table products (
  id uuid not null,
  photo_url text,
  display_name text,
  price numeric,
  qty int,
  description text,
  created_at timestamptz not null default now(),
  primary key (id)
);

alter table products enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on products
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on products
  for select
  using (auth.role() = 'anon');
