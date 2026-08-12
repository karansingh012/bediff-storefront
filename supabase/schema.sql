-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text not null,
  full_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create addresses table
create table public.addresses (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  full_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create orders table
create table public.orders (
  id uuid not null default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  order_number text not null unique,
  status text not null default 'PENDING',
  payment_status text not null default 'PENDING',
  payment_provider text not null default 'CASHFREE',
  payment_id text,
  subtotal numeric not null,
  shipping_amount numeric not null,
  total_amount numeric not null,
  currency text not null default 'INR',
  shipping_name text not null,
  shipping_phone text not null,
  shipping_address_line_1 text not null,
  shipping_address_line_2 text,
  shipping_city text not null,
  shipping_state text not null,
  shipping_postal_code text not null,
  shipping_country text not null default 'India',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create order_items table
create table public.order_items (
  id uuid not null default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  product_id text not null,
  product_name text not null,
  product_slug text not null,
  size text,
  color text,
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Addresses policies
create policy "Users can view own addresses" on public.addresses
  for select using (auth.uid() = user_id);

create policy "Users can insert own addresses" on public.addresses
  for insert with check (auth.uid() = user_id);

create policy "Users can update own addresses" on public.addresses
  for update using (auth.uid() = user_id);

create policy "Users can delete own addresses" on public.addresses
  for delete using (auth.uid() = user_id);

-- Orders policies
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

-- Wait, users should not insert orders directly from client if they are created securely on server.
-- We'll allow inserts from service role, which bypasses RLS, but if using anon key on server, 
-- we need to allow insert where auth.uid() = user_id. 
create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);

-- Or just rely on server-side client to do it.

-- Order_items policies
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert own order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

-- Function to handle new user creation and create a profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
