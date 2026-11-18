# MUSNAD TECH — Free staging and Playwright setup (2026-11-15)

The project owner requires **zero additional paid services**. The earlier
hourly-billed Supabase branching plan is cancelled. See
`docs/development/FREE_STAGING_2026-11-15.md` for the authoritative plan.

## Verified free resources

- The linked Supabase organization already uses both of its free project slots.
  Do not create a paid branch or a third cloud project.
- The existing GitHub repository is public. Standard GitHub Actions runners
  provide free ephemeral testing under GitHub's terms.
- GitHub Actions workflow `free-local-db.yml` tests genuine SQL source RLS
  policies for inquiries, services and page settings against isolated
  PostgreSQL, synthetic test data, and simulated JWT role claims.
- The full Supabase local stack is available free through the official
  Supabase CLI with Docker; it has not yet been provisioned in this branch.
- Vercel Preview currently shares Supabase and Clerk credentials with
  Production, so no mutating browser test may target those previews.

## How to run Playwright without a paid cloud staging database

Start local Supabase using the official CLI and Docker with reviewed schema-only
migrations, and start Next.js on localhost with the DEVELOPMENT Clerk instance.
Do not connect any local app instance to production Supabase.

Use these declarations when the local services and auth configuration are
verified (actual publishable keys are never committed):

```text
E2E_BASE_URL=http://127.0.0.1:3000
E2E_STAGING_SUPABASE_URL=http://127.0.0.1:54321
E2E_STAGING_CLERK_PUBLISHABLE_KEY=pk_test_...
E2E_ISOLATED_DATABASE_CONFIRMED=true
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
```

Preflight refuses production domains and production Supabase, refuses mixed
online-preview/local-database targets, and requires a Clerk development key.

```bash
npm ci
npx playwright install chromium
npm run test:e2e:list
npm run test:e2e
```

The Playwright tests are read-only: localized public routes, 404, sign-in
shells and anonymous admin protection. Two additional real-role tests are
SKIPPED without explicit staging-only browser states. Full authenticated
browser E2E remains a release gate and is not implied by passing unit tests.

## Status

- GitHub Free local Postgres RLS job: executable on PR #60.
- Browser suite: prepared but actual navigation needs an isolated local
  Supabase/Next.js runtime and Clerk development configuration.
- No hourly Supabase branch or cloud database created.
- No production database or production web deployment changed.
- PR #60 remains draft, based on unmerged integration-only PR #59.
