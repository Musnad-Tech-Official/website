# Security dependency remediation — 2026-11-15

This change addresses the production dependency advisories recorded in
[issue #57](https://github.com/Musnad-Tech-Official/website/issues/57).
The original application and its chosen technology stack are preserved.

## Verified dependency changes

| Package | Original | Updated and locked | Scope |
| --- | --- | --- | --- |
| `next` | `16.3.5` | `16.4.6` | Direct production |
| `eslint-config-next` | `16.3.5` | `16.4.6` | Direct development; kept in sync |
| `sharp` | vulnerable transitive | `0.35.5` | Transitive |
| `seroval` | vulnerable transitive | `1.6.12` | Transitive |
| `source-map-js` | vulnerable transitive | `1.2.2` | Transitive |
| `solid-js` | vulnerable transitive chain | `1.9.19` | Transitive |

The dependency resolution was performed against the live npm registry in
GitHub Actions, using `npm install --package-lock-only --ignore-scripts`
and `npm audit fix --package-lock-only --ignore-scripts`. The bot committed
the generated `package.json` and `package-lock.json` to this security-only
branch. The temporary workflow used for this one-time operation was deleted.

## Evidence

GitHub Actions run
[43644962981](https://github.com/Musnad-Tech-Official/website/actions/runs/43644962981)
completed with **success**:

- `npm audit --omit=dev --audit-level=high` returned **0 vulnerabilities**.
- `npm ci` succeeded with the generated lockfile.
- The full dependency installation still reported **7 moderate advisories**.
  This change does not claim that all developer/transitive advisories are resolved.
- GitHub source inspection confirmed all six versions above in the updated
  `package-lock.json`.

The permanent
`.github/workflows/security-quality.yml` now blocks high/critical
**production** advisories on pull requests and `main`, and runs available
SEO, integrity, admin, lint, and TypeScript tests.

## Important verification before merge

- [ ] Pull-request GitHub Actions pipeline succeeds on the *final* commit.
- [ ] Vercel preview build is `READY` on the *final* commit.
- [ ] Verify Arabic/English localized navigation, dynamic articles and
      projects, responsive content, and internal links in the preview.
- [ ] Verify Clerk sign-in/admin sessions and Supabase data access in a
      safe test session.
- [ ] Verify `next/image`, dynamically generated OpenGraph images, and
      `next-intl` behavior on the new Next.js 16.4 minor version.
- [ ] Review the 7 moderate advisories; classify exploitability and
      decide whether to address them in a separate PR.
- [ ] Once this patch reaches `main`, verify that pending production-integrity
      PR #55 remains mergeable and its combined checks still pass.

**This PR does not merge code, promote a deployment, change secrets or modify
production database rows.** It must not be deployed automatically until reviewed.
