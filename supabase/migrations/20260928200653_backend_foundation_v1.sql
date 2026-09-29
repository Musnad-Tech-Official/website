-- MUSNAD Tech Website — Backend Foundation V1
-- This SQL is copied into a timestamped file created by:
--   npx supabase migration new backend_foundation_v1
-- Do not use this template filename directly as migration history.

begin;

-- -----------------------------------------------------------------------------
-- Shared schemas
-- -----------------------------------------------------------------------------

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

-- -----------------------------------------------------------------------------
-- Locales
-- -----------------------------------------------------------------------------

create table public.locales (
  code text primary key,
  direction text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint locales_code_check check (code in ('en', 'ar')),
  constraint locales_direction_check check (direction in ('ltr', 'rtl'))
);

insert into public.locales (code, direction)
values
  ('en', 'ltr'),
  ('ar', 'rtl')
on conflict (code) do update
set direction = excluded.direction,
    is_active = true;

-- -----------------------------------------------------------------------------
-- Profiles / identity
-- -----------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  primary_email text,
  display_name text,
  avatar_url text,
  preferred_locale text not null default 'en' references public.locales(code),
  status text not null default 'active',
  clerk_updated_at bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint profiles_status_check check (status in ('active', 'suspended', 'deleted')),
  constraint profiles_clerk_user_id_nonempty check (length(btrim(clerk_user_id)) > 0),
  constraint profiles_display_name_length check (
    display_name is null or char_length(btrim(display_name)) between 1 and 80
  ),
  constraint profiles_clerk_updated_at_nonnegative check (clerk_updated_at >= 0),
  constraint profiles_deleted_at_consistency check (
    (status = 'deleted' and deleted_at is not null)
    or (status <> 'deleted' and deleted_at is null)
  )
);

create index profiles_status_idx on public.profiles(status);

-- -----------------------------------------------------------------------------
-- Admin memberships
-- -----------------------------------------------------------------------------

create table public.admin_memberships (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null,
  is_active boolean not null default true,
  granted_by_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_memberships_role_check check (role in ('viewer', 'editor', 'admin', 'super_admin'))
);

create index admin_memberships_active_role_idx
  on public.admin_memberships(is_active, role)
  where is_active = true;

-- -----------------------------------------------------------------------------
-- Shared timestamp trigger
-- -----------------------------------------------------------------------------

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger admin_memberships_set_updated_at
before update on public.admin_memberships
for each row execute function private.set_updated_at();

-- Apply each Clerk event in one statement. The conflict predicate serializes
-- concurrent deliveries on clerk_user_id and makes deletion terminal.
create or replace function public.sync_clerk_profile(
  p_clerk_user_id text,
  p_event_timestamp bigint,
  p_primary_email text default null,
  p_display_name text default null,
  p_avatar_url text default null
)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.profiles (
    clerk_user_id, primary_email, display_name, avatar_url, clerk_updated_at
  )
  values (
    p_clerk_user_id, p_primary_email, p_display_name, p_avatar_url, p_event_timestamp
  )
  on conflict (clerk_user_id) do update
  set primary_email = excluded.primary_email,
      avatar_url = excluded.avatar_url,
      clerk_updated_at = excluded.clerk_updated_at
  where public.profiles.status <> 'deleted'
    and public.profiles.clerk_updated_at < excluded.clerk_updated_at;
$$;

create or replace function public.delete_clerk_profile(
  p_clerk_user_id text,
  p_event_timestamp bigint
)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.profiles (
    clerk_user_id, status, deleted_at, clerk_updated_at
  )
  values (
    p_clerk_user_id, 'deleted', to_timestamp(p_event_timestamp / 1000.0), p_event_timestamp
  )
  on conflict (clerk_user_id) do update
  set status = 'deleted',
      deleted_at = excluded.deleted_at,
      primary_email = null,
      display_name = null,
      avatar_url = null,
      clerk_updated_at = excluded.clerk_updated_at
  where public.profiles.clerk_updated_at < excluded.clerk_updated_at;
$$;

revoke all on function public.sync_clerk_profile(text, bigint, text, text, text) from public, anon, authenticated;
revoke all on function public.delete_clerk_profile(text, bigint) from public, anon, authenticated;
grant execute on function public.sync_clerk_profile(text, bigint, text, text, text) to service_role;
grant execute on function public.delete_clerk_profile(text, bigint) to service_role;

-- -----------------------------------------------------------------------------
-- Clerk/RLS helpers
-- -----------------------------------------------------------------------------

create or replace function private.current_clerk_user_id()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select nullif(((select auth.jwt()) ->> 'sub'), '');
$$;

revoke all on function private.current_clerk_user_id() from public;
grant execute on function private.current_clerk_user_id() to authenticated;

create or replace function private.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.id
  from public.profiles as p
  where p.clerk_user_id = ((select auth.jwt()) ->> 'sub')
    and p.status = 'active'
  limit 1;
$$;

revoke all on function private.current_profile_id() from public;
grant execute on function private.current_profile_id() to authenticated;

create or replace function private.current_admin_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select am.role
  from public.admin_memberships as am
  join public.profiles as p on p.id = am.profile_id
  where p.clerk_user_id = ((select auth.jwt()) ->> 'sub')
    and p.status = 'active'
    and am.is_active = true
  limit 1;
$$;

revoke all on function private.current_admin_role() from public;
grant execute on function private.current_admin_role() to authenticated;

create or replace function private.is_admin_at_least(required_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select
        case am.role
          when 'viewer' then 1
          when 'editor' then 2
          when 'admin' then 3
          when 'super_admin' then 4
          else 0
        end
        >=
        case required_role
          when 'viewer' then 1
          when 'editor' then 2
          when 'admin' then 3
          when 'super_admin' then 4
          else 999
        end
      from public.admin_memberships as am
      join public.profiles as p on p.id = am.profile_id
      where p.clerk_user_id = ((select auth.jwt()) ->> 'sub')
        and p.status = 'active'
        and am.is_active = true
      limit 1
    ),
    false
  );
$$;

revoke all on function private.is_admin_at_least(text) from public;
grant execute on function private.is_admin_at_least(text) to authenticated;

-- -----------------------------------------------------------------------------
-- Grants
-- RLS and SQL grants are separate controls. Keep both explicit.
-- -----------------------------------------------------------------------------

revoke all on table public.locales from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.admin_memberships from anon, authenticated;

grant select on table public.locales to anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, preferred_locale) on table public.profiles to authenticated;

-- Secret API keys execute as service_role and bypass RLS, but SQL grants still
-- apply. Keep privileged capabilities explicit instead of relying on defaults.
grant select on table public.locales to service_role;
grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.admin_memberships to service_role;

-- Direct access to admin_memberships remains unavailable to ordinary authenticated clients.
-- Admin authorization for ordinary requests is resolved through protected helpers.

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.locales enable row level security;
alter table public.profiles enable row level security;
alter table public.admin_memberships enable row level security;

create policy locales_select_active
on public.locales
for select
to anon, authenticated
using (is_active = true);

create policy profiles_select_self_or_admin
on public.profiles
for select
to authenticated
using (
  (
    clerk_user_id = ((select auth.jwt()) ->> 'sub')
    and status = 'active'
  )
  or (select private.is_admin_at_least('admin'))
);

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (
  clerk_user_id = ((select auth.jwt()) ->> 'sub')
  and status = 'active'
)
with check (
  clerk_user_id = ((select auth.jwt()) ->> 'sub')
  and status = 'active'
);

-- No direct authenticated policies are intentionally created for admin_memberships.
-- Role management is a privileged server workflow reviewed separately.

commit;
