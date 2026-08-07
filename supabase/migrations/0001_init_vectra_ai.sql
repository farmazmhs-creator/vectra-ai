-- Vectra AI — Farmaz Somu | AI Trainer platform
-- Core schema: leads (progressive KYC), assessments, results, programmes, lead_notes, enquiries

create extension if not exists "pgcrypto";

-- leads: progressive lead capture + KYC profile
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Stage 1 (lightweight entry)
  full_name text not null,
  phone text not null,
  consent boolean not null default false,
  language text not null default 'en',
  source_page text,
  campaign jsonb not null default '{}'::jsonb,
  -- Stage 2 (KYC unlock)
  user_context text,
  email text,
  industry text,
  country text,
  position text,
  training_intent text,
  decision_authority text,
  org_name text,
  department text,
  org_size text,
  client_details text,
  timing text,
  kyc_completed_at timestamptz,
  result_viewed_at timestamptz,
  -- Lead management
  lead_priority text not null default 'standard',
  lead_status text not null default 'new'
);

-- assessments: one per run, tied to a lead
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  lead_id uuid not null references public.leads(id) on delete cascade,
  route text not null default 'individual',
  client_subroute text,
  language text not null default 'en',
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'in_progress'
);

-- results: deterministic diagnostic output
create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  route text not null,
  overall_score int not null,
  stage text not null,
  dimension_scores jsonb not null default '{}'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  investment_state text,
  pains jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  tna_snapshot jsonb not null default '{}'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  opportunity_horizon text,
  next_path jsonb not null default '[]'::jsonb
);

-- programmes: training catalog (admin CRUD, recommendation source)
create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text unique not null,
  title text not null,
  summary text,
  modules jsonb not null default '[]'::jsonb,
  target_dimensions jsonb not null default '[]'::jsonb,
  intended_capability text,
  route_fit jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  sort_order int not null default 0
);

-- lead_notes: admin follow-up notes
create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  body text not null,
  author text not null default 'Farmaz Somu'
);

-- enquiries: commercial progression CTAs
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  result_id uuid references public.results(id) on delete set null,
  type text not null default 'enquiry',
  message text,
  preferred_time text,
  status text not null default 'open'
);

create index if not exists idx_assessments_lead on public.assessments(lead_id);
create index if not exists idx_results_lead on public.results(lead_id);
create index if not exists idx_results_assessment on public.results(assessment_id);
create index if not exists idx_lead_notes_lead on public.lead_notes(lead_id);
create index if not exists idx_enquiries_lead on public.enquiries(lead_id);
create index if not exists idx_leads_created on public.leads(created_at desc);

-- RLS — demo-first (no login wall in v1). Lock-down is a later sprint.
alter table public.leads enable row level security;
alter table public.assessments enable row level security;
alter table public.results enable row level security;
alter table public.programmes enable row level security;
alter table public.lead_notes enable row level security;
alter table public.enquiries enable row level security;

do $$
declare t text;
begin
  foreach t in array array['leads','assessments','results','programmes','lead_notes','enquiries']
  loop
    execute format('drop policy if exists "demo_all" on public.%I;', t);
    execute format('create policy "demo_all" on public.%I for all to anon, authenticated using (true) with check (true);', t);
  end loop;
end $$;
