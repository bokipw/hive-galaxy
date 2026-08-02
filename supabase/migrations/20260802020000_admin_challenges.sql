-- Admin login: one-time nonce table used by admin-auth edge function.
-- Only service_role (edge function) can access; RLS enabled with no policies.
create table if not exists public.admin_challenges (
  nonce text primary key,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.admin_challenges enable row level security;
