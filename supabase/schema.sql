-- Expand Global: Supabase schema, relationships, RLS, storage, and realtime.
-- Run this in the Supabase SQL Editor once.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  surname text,
  first_name text,
  last_name text,
  profile_picture text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.design_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text,
  email text,
  phone text,
  service text,
  description text,
  timeline text,
  budget text,
  status text not null default 'Pending',
  standard_price numeric,
  premium_price numeric,
  admin_comment text,
  reject_reason text,
  rejected_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  message text not null,
  type text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  design_request_id uuid not null references public.design_requests (id) on delete cascade,
  sender_id uuid references public.profiles (id) on delete set null,
  sender_email text,
  sender_name text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Reply + delete support (also safe to re-run on an existing database)
alter table public.messages
  add column if not exists reply_to_id uuid references public.messages (id) on delete set null,
  add column if not exists reply_to_name text,
  add column if not exists reply_to_message text,
  add column if not exists deleted boolean not null default false,
  add column if not exists deleted_by uuid,
  add column if not exists deleted_by_label text,
  add column if not exists deleted_for uuid[] not null default '{}';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists design_requests_user_id_idx on public.design_requests (user_id);
create index if not exists design_requests_created_at_idx on public.design_requests (created_at);
create index if not exists design_requests_email_idx on public.design_requests (email);
create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_created_at_idx on public.notifications (created_at);
create index if not exists messages_design_request_id_idx on public.messages (design_request_id);
create index if not exists messages_created_at_idx on public.messages (created_at);

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------
-- Auto-create a profile whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, surname, first_name, last_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'surname', ''),
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Security-definer helper so authenticated users can look up a user id by
-- email (used to deliver notifications to the admin / request owners)
-- without being able to read arbitrary profiles.
create or replace function public.get_user_id_by_email(target_email text)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.profiles where email = target_email limit 1;
$$;

revoke all on function public.get_user_id_by_email(text) from public;
grant execute on function public.get_user_id_by_email(text) to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'adminemail@gmail.com';
$$;

-- Security-definer helper so a participant can hide a message "for me" even
-- when they are not the sender. Only the sender, the admin, or the owner of
-- the linked design request may mark a message as deleted for their own view.
create or replace function public.delete_message_for_me(p_message_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.messages m
    where m.id = p_message_id
      and (
        m.sender_id = p_user_id
        or public.is_admin()
        or exists (
          select 1 from public.design_requests dr
          where dr.id = m.design_request_id and dr.user_id = p_user_id
        )
      )
  ) then
    raise exception 'Not allowed to delete this message';
  end if;

  update public.messages
  set deleted_for = array_append(coalesce(deleted_for, '{}'), p_user_id)
  where id = p_message_id
    and not (p_user_id = any(coalesce(deleted_for, '{}')));
end;
$$;

revoke all on function public.delete_message_for_me(uuid, uuid) from public;
grant execute on function public.delete_message_for_me(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.design_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.messages enable row level security;

-- profiles
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_delete" on public.profiles;
create policy "profiles_delete" on public.profiles
  for delete using (public.is_admin());

-- design_requests
drop policy if exists "design_requests_select" on public.design_requests;
create policy "design_requests_select" on public.design_requests
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "design_requests_insert" on public.design_requests;
create policy "design_requests_insert" on public.design_requests
  for insert with check (auth.role() = 'authenticated' and user_id = auth.uid());

drop policy if exists "design_requests_update" on public.design_requests;
create policy "design_requests_update" on public.design_requests
  for update using (user_id = auth.uid() or public.is_admin());

drop policy if exists "design_requests_delete" on public.design_requests;
create policy "design_requests_delete" on public.design_requests
  for delete using (public.is_admin());

-- notifications
drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications_insert" on public.notifications;
create policy "notifications_insert" on public.notifications
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "notifications_update" on public.notifications;
create policy "notifications_update" on public.notifications
  for update using (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications_delete" on public.notifications;
create policy "notifications_delete" on public.notifications
  for delete using (user_id = auth.uid() or public.is_admin());

-- messages
drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages
  for select using (
    sender_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1
      from public.design_requests dr
      where dr.id = messages.design_request_id
        and dr.user_id = auth.uid()
    )
  );

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert with check (auth.role() = 'authenticated' and sender_id = auth.uid());

drop policy if exists "messages_update" on public.messages;
create policy "messages_update" on public.messages
  for update using (sender_id = auth.uid() or public.is_admin());

drop policy if exists "messages_delete" on public.messages;
create policy "messages_delete" on public.messages
  for delete using (sender_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: profile pictures
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('profile-pictures', 'profile-pictures', true)
on conflict (id) do update set public = true;

drop policy if exists "profile-pictures-public-read" on storage.objects;
create policy "profile-pictures-public-read" on storage.objects
  for select using (bucket_id = 'profile-pictures');

drop policy if exists "profile-pictures-auth-upload" on storage.objects;
create policy "profile-pictures-auth-upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'profile-pictures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "profile-pictures-auth-update" on storage.objects;
create policy "profile-pictures-auth-update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'profile-pictures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "profile-pictures-auth-delete" on storage.objects;
create policy "profile-pictures-auth-delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'profile-pictures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Realtime (used by the dashboard, notification panel, and message threads)
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.design_requests;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.messages;
