create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  to_email text not null,
  to_name text,
  type text not null,
  subject text not null,
  body text not null,
  status text not null default 'queued',
  provider text,
  error text
);
create index if not exists idx_email_log_created on public.email_log(created_at desc);
create index if not exists idx_email_log_lead on public.email_log(lead_id);

alter table public.email_log enable row level security;
drop policy if exists "demo_all" on public.email_log;
create policy "demo_all" on public.email_log for all to anon, authenticated using (true) with check (true);
