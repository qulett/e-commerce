
alter table products_response enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on products_response
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on products_response
  for select
  using (auth.role() = 'anon');
