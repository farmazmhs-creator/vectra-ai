-- 0007_2a1_lockdown.sql
-- Phase 2A.1 DATABASE LOCKDOWN — close the anon-key RLS exposure.
--
-- Applied ONLY after the secured application deploy succeeded and service-role
-- confinement was proven (no service_role material in any client-accessible
-- output). All application data access now flows through the server-only
-- service-role client (lib/supabase/service.ts), which bypasses RLS.
--
-- Effect: RLS stays ENABLED on every app table and the permissive demo policies
-- are removed, so anon + authenticated are denied by default; their table grants
-- are revoked; object-creation in `public` is removed; and future postgres-owned
-- objects will not auto-grant to the API roles.
--
-- DO NOT restore the demo_all policies as a rollback. Rollback = re-grant only
-- the specific access a future, properly-scoped policy requires.

-- 1. Drop the permissive demo policies (RLS remains enabled -> deny by default).
drop policy if exists demo_all on public.assessments;
drop policy if exists demo_all on public.email_log;
drop policy if exists demo_all on public.enquiries;
drop policy if exists demo_all on public.lead_notes;
drop policy if exists demo_all on public.leads;
drop policy if exists demo_all on public.programmes;
drop policy if exists demo_all on public.results;

-- 2. Belt-and-braces: ensure RLS is enabled on every app table.
alter table public.assessments enable row level security;
alter table public.email_log   enable row level security;
alter table public.enquiries   enable row level security;
alter table public.lead_notes  enable row level security;
alter table public.leads       enable row level security;
alter table public.programmes  enable row level security;
alter table public.results     enable row level security;
alter table public.rate_limit  enable row level security;

-- 3. Revoke ALL table/sequence privileges from the API roles and PUBLIC.
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all tables    in schema public from public;
revoke all on all sequences in schema public from public;

-- 4. Ensure the service role retains full access (it also bypasses RLS).
grant usage on schema public to service_role;
grant all on all tables    in schema public to service_role;
grant all on all sequences in schema public to service_role;

-- 5. Remove object-creation rights in `public` from the API roles + PUBLIC.
revoke create on schema public from public, anon, authenticated;

-- 6. Future postgres-owned objects must not auto-grant to the API roles / PUBLIC.
alter default privileges for role postgres in schema public revoke all on tables    from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated, public;

-- 7. Assert the lockdown: raises if any anon/authenticated table grant or any
--    anon/authenticated/PUBLIC execute grant on the security functions remains.
select public.assert_no_public_grants();
