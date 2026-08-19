-- Phase 2A.1 additive migration (applied via MCP). Columns, preflight+unique indexes,
-- rate-limit store/functions, atomic completion RPC, grant-guard. NO RLS/grant changes here.
-- (Full statements as applied — see repo history / 0007 for the lockdown.)
alter table public.assessments
  add column if not exists session_token_hash text,
  add column if not exists session_token_expires_at timestamptz;
alter table public.results
  add column if not exists public_token_hash text,
  add column if not exists public_token_expires_at timestamptz,
  add column if not exists public_token_revoked_at timestamptz;
alter table public.email_log
  add column if not exists result_id uuid references public.results(id) on delete set null,
  add column if not exists attempts int not null default 0,
  add column if not exists last_attempt_at timestamptz;
create unique index if not exists uq_results_assessment on public.results(assessment_id);
create unique index if not exists uq_results_public_token_hash on public.results(public_token_hash) where public_token_hash is not null;
create unique index if not exists uq_assessments_session_token_hash on public.assessments(session_token_hash) where session_token_hash is not null;
create unique index if not exists uq_email_log_result_type on public.email_log(result_id, type) where result_id is not null;
create table if not exists public.rate_limit (
  id bigint generated always as identity primary key, bucket text not null,
  created_at timestamptz not null default now());
create index if not exists idx_rate_limit_created on public.rate_limit(created_at);
create index if not exists idx_rate_limit_bucket_time on public.rate_limit(bucket, created_at desc);
alter table public.rate_limit enable row level security;
-- functions rate_limit_hit / rate_limit_purge / claim_and_create_result / assert_no_public_grants
-- are SECURITY DEFINER, owner postgres, search_path='' , execute granted only to service_role.
-- (See applied migration for full bodies.)
