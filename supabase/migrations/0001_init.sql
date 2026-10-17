-- 0001_init.sql
-- Enables pgcrypto and creates users table with strict constraints

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  github_id text unique not null,
  github_login text not null,
  name text,
  email text,
  avatar_url text,
  access_token text,
  refresh_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for username lookups on public profile routing
create index if not exists idx_users_github_login on users(github_login);
