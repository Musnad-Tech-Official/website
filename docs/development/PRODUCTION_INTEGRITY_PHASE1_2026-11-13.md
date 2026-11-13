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
