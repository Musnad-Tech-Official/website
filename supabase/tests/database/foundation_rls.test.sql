begin;

create extension if not exists pgtap with schema extensions;

select plan(41);

select has_table('public', 'locales', 'locales table exists');
select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'admin_memberships', 'admin_memberships table exists');
select has_function('private', 'current_profile_id', array[]::text[], 'current_profile_id helper exists');
select has_function('private', 'is_admin_at_least', array['text'], 'admin role helper exists');

select ok(
  has_table_privilege('service_role', 'public.profiles', 'INSERT'),
  'service_role has explicit profile insert privilege for verified server workflows'
);
select ok(
  has_table_privilege('service_role', 'public.profiles', 'UPDATE'),
  'service_role has explicit profile update privilege for verified server workflows'
);
select ok(
  has_table_privilege('service_role', 'public.admin_memberships', 'UPDATE'),
  'service_role has explicit admin-membership mutation privilege for controlled server workflows'
);
select ok(
  has_function_privilege('service_role', 'public.sync_clerk_profile(text,bigint,text,text,text)', 'EXECUTE'),
  'service_role can sync Clerk profiles'
);
select ok(
  has_function_privilege('service_role', 'public.delete_clerk_profile(text,bigint)', 'EXECUTE'),
  'service_role can apply Clerk deletions'
);
select ok(
  not has_function_privilege('authenticated', 'public.sync_clerk_profile(text,bigint,text,text,text)', 'EXECUTE'),
  'authenticated clients cannot call privileged profile sync'
);
select ok(
  not has_function_privilege('anon', 'public.delete_clerk_profile(text,bigint)', 'EXECUTE'),
  'anonymous clients cannot call privileged profile deletion'
);

select public.sync_clerk_profile('user_webhook', 1000, 'first@example.test', 'First', null);
select results_eq(
  $$select primary_email, status, clerk_updated_at from public.profiles where clerk_user_id = 'user_webhook'$$,
  $$values ('first@example.test'::text, 'active'::text, 1000::bigint)$$,
  'create event inserts an active profile'
);
select public.sync_clerk_profile('user_webhook', 1000, 'retry@example.test', 'Retry', null);
select results_eq(
  $$select primary_email from public.profiles where clerk_user_id = 'user_webhook'$$,
  array['first@example.test'::text],
  'retry does not change an already applied event'
);
select public.sync_clerk_profile('user_webhook', 999, 'old@example.test', 'Old', null);
select results_eq(
  $$select primary_email from public.profiles where clerk_user_id = 'user_webhook'$$,
  array['first@example.test'::text],
  'older create/update cannot overwrite newer data'
);
select public.sync_clerk_profile('user_webhook', 1001, 'new@example.test', 'New', null);
select results_eq(
  $$select primary_email, display_name from public.profiles where clerk_user_id = 'user_webhook'$$,
  $$values ('new@example.test'::text, 'First'::text)$$,
  'newer update refreshes Clerk fields but preserves editable display name'
);
select public.delete_clerk_profile('user_webhook', 1000);
select results_eq(
  $$select status from public.profiles where clerk_user_id = 'user_webhook'$$,
  array['active'::text],
  'older deletion cannot overwrite newer profile state'
);
select public.delete_clerk_profile('user_webhook', 1002);
select results_eq(
  $$select status, primary_email, deleted_at is not null from public.profiles where clerk_user_id = 'user_webhook'$$,
  $$values ('deleted'::text, null::text, true)$$,
  'delete marks the profile deleted and clears PII'
);
select public.delete_clerk_profile('user_webhook', 1002);
select results_eq(
  $$select clerk_updated_at from public.profiles where clerk_user_id = 'user_webhook'$$,
  array[1002::bigint],
  'delete retry is idempotent'
);
select public.sync_clerk_profile('user_webhook', 1003, 'resurrect@example.test', 'Resurrect', null);
select results_eq(
  $$select status, primary_email from public.profiles where clerk_user_id = 'user_webhook'$$,
  $$values ('deleted'::text, null::text)$$,
  'a later create/update cannot resurrect a deleted profile'
);
select public.delete_clerk_profile('user_deleted_first', 2000);
select results_eq(
  $$select status, deleted_at is not null from public.profiles where clerk_user_id = 'user_deleted_first'$$,
  $$values ('deleted'::text, true)$$,
  'delete before create leaves a tombstone'
);
select public.sync_clerk_profile('user_deleted_first', 1999, 'stale@example.test', 'Stale', null);
select results_eq(
  $$select status, primary_email from public.profiles where clerk_user_id = 'user_deleted_first'$$,
  $$values ('deleted'::text, null::text)$$,
  'delayed create cannot resurrect a tombstone'
);
select public.sync_clerk_profile('user_suspended', 1000, null, null, null);
update public.profiles set status = 'suspended' where clerk_user_id = 'user_suspended';
select public.sync_clerk_profile('user_suspended', 1001, 'suspended@example.test', null, null);
select results_eq(
  $$select status from public.profiles where clerk_user_id = 'user_suspended'$$,
  array['suspended'::text],
  'Clerk update does not reactivate a suspended profile'
);

insert into public.profiles (
  id,
  clerk_user_id,
  primary_email,
  display_name,
  preferred_locale,
  status,
  clerk_updated_at
)
values
  ('00000000-0000-0000-0000-000000000001', 'user_a', 'a@example.test', 'User A', 'en', 'active', 1),
  ('00000000-0000-0000-0000-000000000002', 'user_b', 'b@example.test', 'User B', 'ar', 'active', 1),
  ('00000000-0000-0000-0000-000000000003', 'user_viewer', 'viewer@example.test', 'Viewer', 'en', 'active', 1),
  ('00000000-0000-0000-0000-000000000004', 'user_editor', 'editor@example.test', 'Editor', 'en', 'active', 1),
  ('00000000-0000-0000-0000-000000000005', 'user_admin', 'admin@example.test', 'Admin', 'en', 'active', 1),
  ('00000000-0000-0000-0000-000000000006', 'user_super', 'super@example.test', 'Super Admin', 'en', 'active', 1);

insert into public.admin_memberships (profile_id, role, is_active)
values
  ('00000000-0000-0000-0000-000000000003', 'viewer', true),
  ('00000000-0000-0000-0000-000000000004', 'editor', true),
  ('00000000-0000-0000-0000-000000000005', 'admin', true),
  ('00000000-0000-0000-0000-000000000006', 'super_admin', true);

set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';

select results_eq(
  'select count(*) from public.locales',
  array[2::bigint],
  'anonymous users can read active locales'
);

select throws_ok(
  'select * from public.profiles',
  '42501',
  null,
  'anonymous users cannot read profiles'
);

set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"user_a"}';

select results_eq(
  'select clerk_user_id from public.profiles order by clerk_user_id',
  array['user_a'::text],
  'authenticated user sees only their own profile'
);

select results_eq(
  'select private.current_profile_id()',
  array['00000000-0000-0000-0000-000000000001'::uuid],
  'current_profile_id resolves Clerk sub to internal UUID'
);

update public.profiles
set display_name = 'User A Updated'
where clerk_user_id = 'user_a';

select results_eq(
  $$select display_name from public.profiles where clerk_user_id = 'user_a'$$,
  array['User A Updated'::text],
  'user can update an allowed column on their own profile'
);

select throws_ok(
  $$update public.profiles set status = 'suspended' where clerk_user_id = 'user_a'$$,
  '42501',
  null,
  'user cannot update protected profile status column'
);

select throws_ok(
  $$update public.profiles set display_name = repeat('x', 81) where clerk_user_id = 'user_a'$$,
  '23514',
  null,
  'database enforces profile display-name length invariant'
);

update public.profiles
set display_name = 'Not Allowed'
where clerk_user_id = 'user_b';

reset role;

select results_eq(
  $$select display_name from public.profiles where clerk_user_id = 'user_b'$$,
  array['User B'::text],
  'user cannot update another profile'
);

set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"user_viewer"}';

select results_eq(
  'select count(*) from public.profiles',
  array[1::bigint],
  'viewer role does not gain broad profile access'
);
select ok(private.is_admin_at_least('viewer'), 'viewer satisfies viewer threshold');
select ok(not private.is_admin_at_least('editor'), 'viewer does not satisfy editor threshold');

set local "request.jwt.claims" = '{"role":"authenticated","sub":"user_editor"}';
select ok(private.is_admin_at_least('viewer'), 'editor satisfies viewer threshold');
select ok(private.is_admin_at_least('editor'), 'editor satisfies editor threshold');
select ok(not private.is_admin_at_least('admin'), 'editor does not satisfy admin threshold');

set local "request.jwt.claims" = '{"role":"authenticated","sub":"user_admin"}';
select results_eq(
  'select count(*) from public.profiles',
  array[9::bigint],
  'admin role can read profiles for approved operational workflows'
);
select ok(private.is_admin_at_least('admin'), 'admin satisfies admin threshold');
select ok(not private.is_admin_at_least('super_admin'), 'admin does not satisfy super-admin threshold');

set local "request.jwt.claims" = '{"role":"authenticated","sub":"user_super"}';
select ok(private.is_admin_at_least('super_admin'), 'super admin satisfies super-admin threshold');

select * from finish();
rollback;
