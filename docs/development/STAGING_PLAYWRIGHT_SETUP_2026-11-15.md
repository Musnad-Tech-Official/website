# MUSNAD TECH — Staging + Playwright setup (2026-11-15)

## Status: prepared in GitHub, not provisioned

This branch adds the Playwright test runner, safety preflight, bilingual read-only
browser tests, an idempotent one-row staging seed, and staging GitHub Actions.
It does NOT deploy the application to a new environment, create an admin account,
copy data from production, or modify production settings.

The branch is based on the combined-but-unmerged integration PR #59, which in
turn includes security PR #58 and dashboard PR #55. Do not merge this staging
preparation branch directly into main before the underlying changes are approved.

## Evidence and blocking conditions

- Existing Vercel Preview and Production share several Supabase and Clerk
  environment-variable entries. A Preview URL by itself is NOT data isolation.
- The existing production Supabase project ref is zlqfoymxladqwkfliuko.
- No separate Supabase branches existed in the connected organization at inspection.
- The existing Clerk Musnad Tech application includes a development instance
  and a production instance; use the DEVELOPMENT instance for staging.
- Vercel Preview is protected by Vercel SSO.
- Supabase's branch creation requires separate agreement to the quoted
  USD 0.01344/hour usage cost. No branch was created without consent.

## Step 1. Create isolated database, after explicit cost approval

Create a persistent Supabase staging branch called staging-musnad-20261115.
Do NOT enable copying production data. Verify the branch has its own project
reference, schema, and RLS settings. Then execute tests/staging/seed.sql
against that STAGING project ref only. The seed creates a single home-page
visibility record required by the strict database-backed page visibility logic.
It does not create fake people, projects, partners, reviews, or job postings.

The schema files under supabase/sql include sample INSERT statements and
should NOT be blindly replayed into staging; those examples can create fake
marketing claims and nonempty job openings. The branch's migrations or
reviewed schema-only setup should be used instead.

## Step 2. Configure branch-scoped Vercel Preview variables

On the existing Vercel project, add overrides restricted to the selected Git
staging branch. Do NOT overwrite globally shared Preview variables or any
Production variables:

1. NEXT_PUBLIC_SUPABASE_URL — isolated Supabase staging URL
2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — staging public/publishable key
3. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — existing Clerk DEVELOPMENT key
4. CLERK_SECRET_KEY — matching development secret (encrypted in Vercel UI)
5. SITE_INDEXABLE — false
6. NEXT_PUBLIC_SITE_URL — staging-specific HTTPS origin when required

The Clerk development instance's redirect/origin configuration must allow the
preview host. Never put Clerk secret keys in GitHub PR text, source files,
diagnostic screenshots, or chat. After changing Preview variables, redeploy
the staging branch; existing deployments do not inherit new values.

## Step 3. Configure E2E runner (no secrets committed)

Set the following independent runner declarations only after checking the
ACTUAL Vercel branch-scoped variables:

- E2E_BASE_URL: dedicated staging Preview URL (never production)
- E2E_STAGING_SUPABASE_URL: isolated Supabase URL
- E2E_STAGING_CLERK_PUBLISHABLE_KEY: development pk_test_ key
- E2E_ISOLATED_DATABASE_CONFIRMED: true only when verified
- Optional E2E_VERCEL_OIDC_TOKEN: short-lived Trusted Sources access token,
  used for requests to the staging host only. Never reuse an expired token.

The safety script refuses the production website and production Supabase
project, a Clerk production key, or an unconfirmed isolation flag.
Note: no local guard can prove what Vercel's remote environment contains.
Verify remote configuration with the Vercel project tooling.

## Step 4. Run Playwright

- npm ci
- npx playwright install chromium
- npm run test:e2e:list (safe, no browser navigation)
- npm run test:e2e (only after environment is isolated)

The read-only suite covers Desktop Chrome and a Chromium mobile viewport,
Arabic/English home, services, contact, careers and sign-in shells,
404 behavior, page language/title, and anonymous redirects away from admin.

The browser fixture explicitly rejects Vercel login as a successful page.
No test submits an inquiry or creates/deletes data. Tests disable videos,
traces and screenshots to avoid leaking customer data or auth cookies.

For live role tests, sign in through the approved staging browser using two
SEPARATE development users. Save admin/member storage states to paths outside
the repository, pass E2E_ADMIN_STORAGE_STATE and E2E_MEMBER_STORAGE_STATE, and
never share their JSON files or commit them. Without these files the optional
role tests are reported as SKIPPED, not passed.

## Step 5. CI restrictions

The workflow staging-e2e.yml runs static checks on this feature branch.
Its real browser job is manual-only and uses a protected GitHub environment
named staging. Before allowing its manual dispatch, configure required
reviewers and the staging environment variables. Preview SSO must remain
enabled; supply an approved fresh auth token or another authorized access path.
Do not store a permanent protection bypass credential in GitHub secrets.

When a PR file is not yet on main, GitHub workflow_dispatch may not be visible
until a reviewed version of the workflow is available on the default branch.

## Release gate

- [ ] User accepts the Supabase hourly branch cost
- [ ] Branch created with zero production data imported
- [ ] Schema/RLS verified and minimum seed applied to staging only
- [ ] Vercel staging branch has dedicated Supabase and Clerk development values
- [ ] Browser can reach protected Preview with authorized Vercel authentication
- [ ] Read-only Playwright checks pass on both viewports and locales
- [ ] Real admin and non-admin Clerk sessions checked
- [ ] A separate synthetic CRUD suite and cleanup are reviewed and executed
- [ ] Existing Next.js security, SEO, integrity, lint and TypeScript checks pass
- [ ] Only then consider separate approval of PR #58 and PR #55

No changes to production infrastructure are authorized by this file.
