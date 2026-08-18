-- Migration: Add payments table and fully_paid column for secure Paystack integration.
-- Run this in the Supabase SQL Editor.

-- Add fully_paid boolean to track second payment completion
alter table public.design_requests
  add column if not exists fully_paid boolean not null default false;

-- Payments audit table for idempotent server-side verification
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  design_request_id uuid not null references public.design_requests (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  paystack_reference text not null unique,
  amount_kobo integer not null,
  currency text not null default 'NGN',
  payment_type text not null check (payment_type in ('half', 'remaining')),
  verified boolean not null default false,
  verified_at timestamptz,
  paystack_response jsonb,
  created_at timestamptz not null default now()
);

-- Indexes for payments
create index if not exists payments_design_request_id_idx on public.payments (design_request_id);
create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payments_reference_idx on public.payments (paystack_reference);

-- RLS policies for payments
alter table public.payments enable row level security;

drop policy if exists "payments_select_owner_or_admin" on public.payments;
create policy "payments_select_owner_or_admin" on public.payments
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "payments_insert_auth" on public.payments;
create policy "payments_insert_auth" on public.payments
  for insert with check (auth.role() = 'authenticated' and user_id = auth.uid());

drop policy if exists "payments_update_admin" on public.payments;
create policy "payments_update_admin" on public.payments
  for update using (public.is_admin() or user_id = auth.uid());

-- Grants
grant select, insert, update on public.payments to authenticated;

-- Allow Edge Functions (service_role) full access to payments
grant all on public.payments to service_role;

-- Allow Edge Functions (service_role) to read and update design_requests for payment
grant select, update on public.design_requests to service_role;

-- Enable realtime for payments
alter publication supabase_realtime add table public.payments;
