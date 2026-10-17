-- 0004_rls_policies.sql
-- Row Level Security (RLS) policies for Instrument Stats
--
-- AUDIT & MECHANISM NOTES (Rule 11.5):
-- Instrument Stats handles GitHub OAuth at the Express API layer (apps/api),
-- issuing its own signed JWT access tokens containing claims { sub: user.id, login: user.github_login }.
-- When interacting with Postgres via Supabase postgREST or direct client session,
-- the current user ID is checked against auth.uid() or current_setting('request.jwt.claim.sub', true).
-- Public read access is granted for:
-- 1. card_presets SELECT: anyone can read presets by slug to render public SVG embeds.
-- 2. profile_pages SELECT: anyone can read profile pages where enabled = true.
-- Write operations (INSERT, UPDATE, DELETE) are strictly locked down to the owning user.

-- 1. Enable RLS on all user data tables
alter table users enable row level security;
alter table card_presets enable row level security;
alter table profile_pages enable row level security;

-- Helper function to extract user_id from either Supabase auth.uid() or custom JWT claim
create or replace function get_current_user_id() returns uuid as $$
begin
  if auth.uid() is not null then
    return auth.uid();
  end if;
  return nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
exception
  when others then return null;
end;
$$ language plpgsql stable;

-- Users Table Policies
create policy "Users can view their own profile"
  on users for select
  using (id = get_current_user_id());

create policy "Users can update their own profile"
  on users for update
  using (id = get_current_user_id());

-- Card Presets Policies
-- Public can read presets (needed to render /cards/by-preset/:slug.svg)
create policy "Public can view card presets by slug"
  on card_presets for select
  using (true);

-- Owners can insert their own presets
create policy "Users can insert their own presets"
  on card_presets for insert
  with check (user_id = get_current_user_id());

-- Owners can update their own presets
create policy "Users can update their own presets"
  on card_presets for update
  using (user_id = get_current_user_id());

-- Owners can delete their own presets
create policy "Users can delete their own presets"
  on card_presets for delete
  using (user_id = get_current_user_id());

-- Profile Pages Policies
-- Public can view enabled profile pages
create policy "Public can view enabled profile pages"
  on profile_pages for select
  using (enabled = true or user_id = get_current_user_id());

-- Owners can insert/update/delete their own profile page
create policy "Users can insert their own profile page"
  on profile_pages for insert
  with check (user_id = get_current_user_id());

create policy "Users can update their own profile page"
  on profile_pages for update
  using (user_id = get_current_user_id());

create policy "Users can delete their own profile page"
  on profile_pages for delete
  using (user_id = get_current_user_id());
