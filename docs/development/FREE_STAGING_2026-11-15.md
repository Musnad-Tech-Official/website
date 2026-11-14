# Musnad Tech — zero-cost testing plan (2026-11-15)

## Approved constraint
Use no new paid plans, paid database branches or hourly-billed staging services.
The previously suggested $0.01344/hour Supabase database branch is rejected.

## Verified resources
- Two active Supabase projects already exist in the connected organization
  (Musnad Tech Website and wow-platform). Supabase Free has two active
  projects in total per eligible owner/admin; a third free slot is unavailable.
- This GitHub repository is public. GitHub's standard hosted Actions runners
  are free for public repositories under GitHub's terms and limits.
- Supabase CLI local development using Docker is free and does not consume
  Supabase cloud project quota.
- Existing Vercel Preview secrets overlap Production; a Preview deploy is
  NOT an isolated test environment. Do not mutate production data.
- Vercel Hobby is restricted to personal, non-commercial use. A company
  website cannot rely on Hobby for a compliant free production deployment.

## Implemented no-cost tests
- free-local-db.yml uses a temporary PostgreSQL 17 Docker service in
  public GitHub Actions, not an additional hosted Supabase project.
- The test imports DDL and RLS policies verbatim from existing
  supabase/sql/inquiries.sql, services.sql and page_visibility.sql.
- The bundled example INSERT statements are excluded. Only synthetic
  fixtures are inserted into the temporary database.
- A test-only auth.jwt() shim simulates JWT claims and verifies anonymous,
  member and admin permissions. This is a *policy behavior smoke test*, not
  full verification of Clerk-signed JWTs and Supabase PostgREST integration.
- The temporary database is automatically removed at the end of the job.
- Existing Playwright browser tests remain prepared, but must NOT run on a
  production-backed Preview. Real browser E2E is a separate acceptance gate.

## Full local Supabase option (still $0 hosting cost)
Follow https://supabase.com/docs/guides/local-development to initialize
and run the official CLI stack on a developer machine or suitably sized CI
runner with Docker, using schema-only migrations and synthetic seed records.
Do not copy production clients, users, testimonials, projects, or job
applications. Use Clerk's existing development instance for future
authenticated tests. Keep keys and browser-state cookies out of git/logs.

## Release restrictions
- This PR is based on integration-only PR #59. Do not merge it directly to
  main before PR #58 and PR #55 are reviewed.
- No Supabase cloud branch, new hosted database or production modification
  should be made under this plan.
- Passing local RLS policy tests does not mean live Clerk + Supabase
  integrations or the actual browser flow have passed.
