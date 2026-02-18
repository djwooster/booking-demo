-- ============================================================
-- APEX Studio — Supabase Database Schema
-- ============================================================
-- Run this in your Supabase SQL editor to set up all tables.
-- Enable UUID extension first.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── Users (extends Supabase auth.users) ───────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text not null,
  name        text not null,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  phone       text,
  avatar_url  text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins can read all profiles"
  on profiles for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Instructors ────────────────────────────────────────────
create table public.instructors (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  bio         text,
  specialties text[] default '{}',
  image_url   text,
  rating      numeric(3,1) default 5.0,
  class_count int default 0,
  active      boolean default true,
  created_at  timestamptz default now()
);

alter table public.instructors enable row level security;

create policy "Anyone can read instructors"
  on instructors for select using (true);

create policy "Only admins can modify instructors"
  on instructors for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── Class Types ────────────────────────────────────────────
create table public.fitness_classes (
  id            uuid default uuid_generate_v4() primary key,
  name          text not null,
  description   text,
  category      text not null check (category in ('yoga','hiit','spin','pilates','boxing','barre','strength','dance','meditation')),
  duration      int not null default 60,  -- minutes
  capacity      int not null default 20,
  difficulty    text not null default 'all-levels' check (difficulty in ('beginner','intermediate','advanced','all-levels')),
  image_url     text,
  color         text default 'from-emerald-400 to-teal-500',
  instructor_id uuid references public.instructors(id) on delete set null,
  active        boolean default true,
  created_at    timestamptz default now()
);

alter table public.fitness_classes enable row level security;

create policy "Anyone can read classes"
  on fitness_classes for select using (true);

create policy "Only admins can modify classes"
  on fitness_classes for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── Schedules ──────────────────────────────────────────────
create table public.schedules (
  id            uuid default uuid_generate_v4() primary key,
  class_id      uuid not null references public.fitness_classes(id) on delete cascade,
  instructor_id uuid references public.instructors(id) on delete set null,
  start_time    timestamptz not null,
  end_time      timestamptz not null,
  status        text not null default 'active' check (status in ('active','cancelled')),
  booked_count  int default 0,
  waitlist_count int default 0,
  created_at    timestamptz default now()
);

alter table public.schedules enable row level security;

create policy "Anyone can read schedules"
  on schedules for select using (true);

create policy "Only admins can modify schedules"
  on schedules for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index schedules_start_time_idx on public.schedules(start_time);
create index schedules_class_id_idx on public.schedules(class_id);

-- ─── Bookings ───────────────────────────────────────────────
create table public.bookings (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  schedule_id  uuid not null references public.schedules(id) on delete cascade,
  status       text not null default 'confirmed' check (status in ('confirmed','cancelled','waitlist','attended')),
  booked_at    timestamptz default now(),
  cancelled_at timestamptz,
  unique (user_id, schedule_id, status)
);

alter table public.bookings enable row level security;

create policy "Users can read own bookings"
  on bookings for select using (auth.uid() = user_id);

create policy "Users can create bookings"
  on bookings for insert with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on bookings for update using (auth.uid() = user_id);

create policy "Admins can read all bookings"
  on bookings for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index bookings_user_id_idx on public.bookings(user_id);
create index bookings_schedule_id_idx on public.bookings(schedule_id);

-- Keep booked_count in sync
create or replace function update_schedule_counts()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.status = 'confirmed' then
      update schedules set booked_count = booked_count + 1 where id = NEW.schedule_id;
    elsif NEW.status = 'waitlist' then
      update schedules set waitlist_count = waitlist_count + 1 where id = NEW.schedule_id;
    end if;
  elsif TG_OP = 'UPDATE' then
    if OLD.status = 'confirmed' and NEW.status = 'cancelled' then
      update schedules set booked_count = greatest(0, booked_count - 1) where id = NEW.schedule_id;
    elsif OLD.status = 'waitlist' and NEW.status = 'cancelled' then
      update schedules set waitlist_count = greatest(0, waitlist_count - 1) where id = NEW.schedule_id;
    end if;
  end if;
  return NEW;
end;
$$;

create trigger on_booking_change
  after insert or update on public.bookings
  for each row execute procedure update_schedule_counts();

-- ─── Membership Plans ───────────────────────────────────────
create table public.membership_plans (
  id           uuid default uuid_generate_v4() primary key,
  name         text not null,
  description  text,
  price        numeric(10,2) not null,
  type         text not null check (type in ('dropin','pack','unlimited')),
  credits      int,           -- for pack type
  duration_days int,          -- for pack and unlimited
  features     text[] default '{}',
  popular      boolean default false,
  color        text default 'border-stone-200',
  active       boolean default true,
  created_at   timestamptz default now()
);

alter table public.membership_plans enable row level security;

create policy "Anyone can read membership plans"
  on membership_plans for select using (true);

create policy "Only admins can modify plans"
  on membership_plans for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── User Memberships ───────────────────────────────────────
create table public.user_memberships (
  id                 uuid default uuid_generate_v4() primary key,
  user_id            uuid not null references auth.users(id) on delete cascade,
  plan_id            uuid not null references public.membership_plans(id),
  status             text not null default 'active' check (status in ('active','expired','cancelled')),
  start_date         timestamptz default now(),
  end_date           timestamptz,
  credits_remaining  int,
  credits_used       int default 0,
  stripe_subscription_id text,
  created_at         timestamptz default now()
);

alter table public.user_memberships enable row level security;

create policy "Users can read own memberships"
  on user_memberships for select using (auth.uid() = user_id);

create policy "Users can create memberships"
  on user_memberships for insert with check (auth.uid() = user_id);

create policy "Users can update own memberships"
  on user_memberships for update using (auth.uid() = user_id);

create policy "Admins can read all memberships"
  on user_memberships for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index user_memberships_user_id_idx on public.user_memberships(user_id);
