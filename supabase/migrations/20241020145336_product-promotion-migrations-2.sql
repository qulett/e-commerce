drop table if exists products_response;
drop table if exists products;
drop table if exists promotion;
drop table if exists categories;

create table categories (
  id serial primary key,
  categories text,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;
-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on categories
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on categories
  for select
  using (auth.role() = 'anon');


create table products (
  id serial primary key,
  photo_url text,
  display_name text,
  price numeric,
  qty int,
  description text,
  category_id int references categories(id) on delete set null,
  brand text,
  created_at timestamptz not null default now()
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

create index on products (category_id);




create table products_response (
  id int references products(id) on delete cascade,
  best_seller boolean,
  rating numeric,
  created_at timestamptz not null default now()
);

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




create or replace function insert_products_response()
returns trigger as $$
begin
  insert into products_response (id, best_seller, rating, created_at)
  values (NEW.id, false, null, now());
  return NEW;
end;
$$ language plpgsql;

create trigger after_user_insert
after insert on products
for each row
execute procedure insert_products_response();


create table promotion (
    id numeric,
    photo_url text,
    active boolean,
    expired_at timestamptz not null,
    created_at timestamptz not null default now()
);

alter table promotion enable row level security;

-- Policy for authenticated users
create policy "Allow all access for authenticated users"
  on promotion
  for all
  using (auth.role() = 'authenticated');

-- Policy for anonymous users
create policy "Allow all access for anonymous users"
  on promotion
  for select
  using (auth.role() = 'anon');
