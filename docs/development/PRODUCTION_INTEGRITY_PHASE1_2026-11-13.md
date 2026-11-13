# Production Integrity — Phase 1 (2026-11-13)

## Purpose

Eliminate deceptive success states and synthetic public content before declaring
MUSNAD Tech's website production-ready. Audit is based on the production-linked
GitHub `main` branch and a read-only examination of the connected Supabase
project (except the explicitly documented article status change).

## Changes in this branch

- Services: creation, update, and deletion return success **only** after a confirmed
  Supabase mutation. Remove ephemeral service cache and disallow public access to
  inactive service details.
- Company profile and careers: remove the hard-coded `FALLBACK_*` records.
  An empty database result stays empty; a failed query produces an explicit error.
- Careers: remove the fake submission success state. The public job form now
  explains that secure on-site applications are not yet supported and directs
  candidates to the published contact email.
- Job details: use active database records for job title, description,
  responsibilities, requirements, and related open positions. Remove invented
  application deadline labels and outdated invented `JobPosting` dates.
  Structured job data must be reintroduced only after dates and locations are
  verified.
- Add a lightweight integrity regression test runner.

## Reversible production data action (outside Git)

On 2026-11-13, the obviously non-production article with slug
`production-us-east` was changed in the connected Supabase project from
`published` to `draft`. The record was **not deleted**. The database returned
the updated record with `status = draft`.

## Public content awaiting factual approval

| Content | Observed | Required decision |
| --- | --- | --- |
| Projects | 6 records with some ratings/review totals and example links such as `google.com` or `github.com` | Verify each project exists, is publishable, and has real URLs and substantiated metrics |
| Testimonials | 6 active quotes without company attribution | Confirm quote, author identity, publication permission, and affiliation; otherwise unpublish |
| Trusted companies | 7 active records (including the company itself) | Verify actual client/partner relationship and approval to show logos |
| Jobs | 3 active listings | Confirm recruiting status, work arrangements, and closing dates; past fixture deadlines were removed from the detail template |
| Company history | 5 timeline records for 2021–2025 | Verify founding claims, milestones, and dates from company records |
| Team | 3 active members | Check names, roles, profile images, consent, and current employment |
| Public article | `production-us-east` test content | Unpublished as draft; review remaining published articles for factual accuracy |
| About page | `/about` is marked `hidden` in `page_settings` | Confirm intentional visibility before launch |

**No claim of fabrication is made about unverified records.** They must be
reviewed against company source material before removal or public endorsement.
Do not make broad changes to customer/partner records without approval.

## Remaining release blockers / separate work

1. Implement a real, persistent careers application pipeline with private CV
   storage, upload validation and scanning, access controls, spam handling,
   retention policy, and end-to-end tests. The email fallback is explicitly
   temporary and is not a completed ATS.
2. Test authenticated admin services CRUD with real RLS and confirm that a
   database error cannot return success.
3. Test the public contact form, newsletter, job access, and authorization
   across Arabic and English sessions.
4. Validate public and admin failures, including service read errors,
   empty states, and cached states.
5. Resolve the Supabase security advisor warning on
   `public.handle_updated_at` (`function_search_path_mutable`) through a
   reviewed database migration.
6. Run a full CI/lint/TypeScript/build/E2E pass. Source-level regression tests
   alone are not sufficient to claim production readiness.

## Review checklist

- [ ] `npm run test:integrity`
- [ ] `npm run test:seo`
- [ ] `npm run lint`
- [ ] `npx tsc --noEmit`
- [ ] `npm run build`
- [ ] Confirm admin services create/update/delete and failure states in preview
- [ ] Confirm inactive services and jobs cannot be accessed publicly
- [ ] Confirm job contact fallback in `ar`/`en` and on mobile
- [ ] Recheck sitemap and indexed article URLs after article unpublishing
- [ ] Obtain factual approval for all active customer and project claims

The branch is intentionally not merged or deployed to production pending review.

## Admin persistence follow-up — 2026-11-14

The subsequent admin audit found the same false-success pattern in additional
dashboard modules. The phase-1 branch now addresses:

- `lib/page-control/actions.ts`: no anonymous fallback to in-memory page
  visibility after failed DB reads; every single, batch, and reset change
  must be confirmed by Supabase. Protected pages cannot be hidden through
  these server actions.
- `lib/technologies/actions.ts`: database-only catalog and CRUD confirmation.
- `lib/companies/actions.ts`: database-only CRUD; reorder uses one verified
  bulk upsert rather than silently accepting partial failures.
- `lib/testimonials/actions.ts`: removes embedded six-person endorsement
  fixtures and unconfirmed in-memory CRUD success. Existing database records
  have **not** been deleted or accepted as verified.
- `lib/announcements/actions.ts`: remove stale cache and check all mutation
  responses. Activation still requires two statements; best-effort rollback
  was added for the error path but **atomicity/concurrent activation are not
  yet guaranteed**. A reviewed database RPC/transaction is a follow-up.
- `lib/inquiries/actions.ts`: no local filesystem or memory caching of
  private inquiry records; admin update and delete verify the affected row.
- `app/[locale]/admin/page.tsx`: stop labeling presence of environment
  variables and embedded analytics SDKs as a live database, RLS, or
  telemetry health check.

### Verification

- Vercel preview builds: status `READY` was observed on the updated admin
  action source prior to the additional test-only commits.
- GitHub Actions: a new `.github/workflows/quality.yml` runs SEO tests,
  source-integrity tests, mocked admin-persistence tests, ESLint, and TypeScript.
  Verify the latest run's **actual outcome** before requesting merge.
- The mock-based tests exercise failure responses and non-admin rejection;
  they do not replace live Clerk session, RLS, browser, network, or upload tests.

### Other review findings

Supabase security advisor still warns about a mutable `search_path` on
`public.handle_updated_at`. The performance advisor reported 27 RLS
`auth_rls_initplan` warnings; these are optimization opportunities to
assess with real query plans, not proof of an authorization bypass.

An inconsistent About page configuration was observed: a persisted
`/about` status of `hidden` coexists with a protected inventory entry
that forces `live`. This was not silently changed in production. Review the
expected policy and align the stored setting and UI.

**Do not approve merge based solely on preview build success.**
Require workflow success plus manual admin/anonymous flows and a factual review
of public customer, project, and career claims.
