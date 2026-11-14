# Combined security and dashboard validation — 2026-11-15

This is an **integration test branch only**. Do not merge this branch into main.

Sources:
- Production integrity and dashboard improvements: PR #55, commit `5aa1db956ae2f061f30a42665d47817bc14741e7`.
- Next.js dependency security update: PR #58, pinned `next@16.4.6`, `eslint-config-next@16.4.6`, and its exact `package-lock.json`.

Combined branch:
- Admin source changes and existing test suites are unchanged from PR #55.
- Security dependencies from PR #58 are overlaid with the original admin test scripts preserved in `package.json`.
- Both `quality.yml` and the blocking `security-quality.yml` workflows are present.
- External preview browsing is protected by Vercel SSO; do not claim authenticated E2E coverage from a successful build.

Integration acceptance:
- [ ] `npm ci` from the combined manifest/lockfile
- [ ] `npm audit --omit=dev --audit-level=high`
- [ ] `npm run test:seo`
- [ ] `npm run test:integrity`
- [ ] `npm run test:admin`
- [ ] `npm run lint`
- [ ] `npx tsc --noEmit`
- [ ] Vercel Preview READY at the exact combined commit
- [ ] Authorized browser test for Arabic and English pages
- [ ] Real Clerk, Supabase RLS and form submission E2E (not covered by mocked tests)

When the integration gates pass, review and merge PR #58 first, then update/retest PR #55 on the new main branch. PR #59 remains a review-only artifact.
