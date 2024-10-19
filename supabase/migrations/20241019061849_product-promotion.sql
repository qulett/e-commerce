drop table if exists products;
 
create table products (
  id serial primary key,
  photo_url text,
  display_name text,
  price numeric,
  qty int,
  description text,
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




create table products_response (
  id int references products(id) on delete cascade,
  categories text,
  best_seller boolean,
  brand text,
  rating numeric,
  created_at timestamptz not null default now()
);

create or replace function insert_products_response()
returns trigger as $$
begin
  insert into products_response (id, categories, best_seller, brand, rating, created_at)
  values (NEW.id, null, false, null, null, now());
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
)