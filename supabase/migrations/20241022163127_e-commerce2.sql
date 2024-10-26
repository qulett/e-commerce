alter table product_category enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on product_category
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on product_category
  for all
  using (auth.role() = 'anon');


alter table products enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on products
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on products
  for all
  using (auth.role() = 'anon');


alter table product_images enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on product_images
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on product_images
  for all
  using (auth.role() = 'anon');


alter table orders enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on orders
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on orders
  for all
  using (auth.role() = 'anon');

alter table order_items enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on order_items
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on order_items
  for all
  using (auth.role() = 'anon');

alter table banners enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on banners
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on banners
  for all
  using (auth.role() = 'anon');


alter table best_sellers enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on best_sellers
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on best_sellers
  for all
  using (auth.role() = 'anon');


alter table offers enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on offers
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on offers
  for all
  using (auth.role() = 'anon');


alter table product_ratings enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on product_ratings
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on product_ratings
  for all
  using (auth.role() = 'anon');
