-- Fix the is_admin() function to use the correct admin email address.
-- The previous function checked against 'adminemail@gmail.com' which was a
-- placeholder. The actual admin email is 'winnermichael21dev@gmail.com'.
-- This mismatch caused all RLS policies that use is_admin() to return false
-- for the real admin, blocking access to design requests, user profiles,
-- messages, and payments in the admin dashboard.

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'winnermichael21dev@gmail.com';
$$;
