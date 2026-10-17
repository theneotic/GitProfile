-- 0002_card_presets.sql
-- Creates card_presets table with FK to users, slug uniqueness, and closed enum CHECK constraint

create table if not exists card_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  slug text unique not null,
  card_type text not null check (card_type in (
    'profile',
    'stats',
    'languages',
    'streak',
    'repository',
    'rankings',
    'trophies',
    'topContributed',
    'wrapped',
    'activityGraph'
  )),
  name text not null,
  options jsonb not null default '{}'::jsonb,
  sponsor boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Foreign key index (Rule 11.3)
create index if not exists idx_card_presets_user_id on card_presets(user_id);

-- Slug lookup index (serves /cards/by-preset/:slug.svg, Rule 11.8)
create index if not exists idx_card_presets_slug on card_presets(slug);
