-- 0003_profile_pages.sql
-- Creates profile_pages table for public developer portfolio pages (/u/[username])

create table if not exists profile_pages (
  user_id uuid primary key references users(id) on delete cascade,
  enabled boolean not null default false,
  bio_override text check (bio_override is null or length(bio_override) <= 280),
  pinned_links jsonb not null default '[]'::jsonb,
  preset_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Foreign key / lookup index
create index if not exists idx_profile_pages_user_id on profile_pages(user_id);
