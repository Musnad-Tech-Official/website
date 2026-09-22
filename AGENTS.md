<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Musnad Tech Website — Agent Instructions

## 1. Read Before Editing

Before changing code, identify the work lane:

- Frontend page work
- Backend/platform work
- Shared foundation work

Read the relevant documents under `docs/`.

## 2. Source-of-Truth Priority

Use this order when instructions appear to conflict:

1. approved Product Analysis,
2. approved project behavior/requirements,
3. reference screenshots for **layout/structure only**,
4. repository Design System for component visual styling,
5. approved Technology Stack,
6. current implementation details.

Do not treat screenshots as final button/card/form visual specifications.

## 3. Screenshot Policy

Reference screenshots define:

- section order,
- element location,
- information hierarchy,
- approximate layout.

The repository Design System defines:

- buttons,
- inputs,
- cards,
- badges,
- alerts,
- dialogs,
- tabs,
- colors,
- borders,
- radii,
- shadows,
- component states.

Reuse existing Design System components whenever possible.

## 4. Frontend Lane

When the assigned work is a frontend page:

DO:

- implement the complete page,
- use mock/fixture data,
- support responsive layouts,
- support `ar` and `en`,
- support RTL and LTR,
- support light and dark modes,
- implement relevant visual states,
- reuse shared UI components.

DO NOT:

- add Supabase queries,
- create migrations,
- write RLS,
- implement backend auth rules,
- introduce backend business logic,
- add Inngest/Resend workflows,
- create storage policies.

Frontend page work must remain backend-independent.

## 5. Backend Lane

When assigned backend/platform work:

- follow the approved System/Data/Backend Design,
- use Supabase APIs/SDK; no ORM,
- own Clerk/Supabase integration,
- own RLS/security/storage,
- own background/email/search/moderation/integration work,
- integrate completed frontend through stable page-facing contracts.

Do not redesign page UI while connecting real data.

## 6. Shared Foundation

Treat these as shared/high-conflict areas:

- `app/globals.css`
- `components/ui/*`
- `components/navbar/*`
- i18n routing/configuration

Avoid broad refactors while implementing an individual page.

If a reusable component exists, reuse it.

If a new variant can solve the need cleanly, extend carefully.

Do not create parallel button/input/card systems.

## 7. Existing Design System

The current repository Design System is authoritative for this implementation phase.

Do not wholesale replace it with a different component library or default styling system.

## 8. Localization

Current supported locales:

- `en`
- `ar`

Every public page must be designed for both directions.

Static UI text belongs in the localization system.

Dynamic CMS content will be supplied by the backend localization model later.

## 9. Mock Data

Frontend mock data must be:

- typed,
- realistic,
- replaceable,
- separated from presentation where practical.

Do not design database tables from frontend mock objects.

A frontend contract is not automatically the database schema.

## 10. Page Ownership

A developer assigned a page owns the complete frontend implementation of that page.

Do not partially redesign another developer's page without coordination.

Page families should reuse their family components rather than copy them.

## 11. Production vs Development Showcase

`UIShowcase` is a development/design-system reference.

It must not remain as production Home content once the real Home page is implemented.

Preserve it in a development-only location rather than deleting it without reason.

## 12. Secrets

Never expose or commit:

- service-role credentials,
- Clerk secret keys,
- API secrets,
- Resend keys,
- Inngest keys,
- malware-scanning keys,
- OpenAI keys,
- cloud credentials.

Never place server secrets in public browser environment variables.

## 13. Scope Discipline

Do not:

- add new technologies without an approved decision,
- change the architecture while implementing a page,
- perform unrelated repository-wide refactors,
- silently change shared tokens to fix one local design,
- turn frontend tasks into backend tasks.

## 14. Quality Baseline

Before declaring frontend work complete, check:

- correct reference layout,
- Design System reuse,
- responsive behavior,
- Arabic/English,
- RTL/LTR,
- dark/light,
- accessibility basics,
- no obvious runtime/type errors.

Backend completion criteria are defined in the backend architecture/testing docs.

## 15. Page Branching

Every frontend page must be implemented in its own Git branch.

Pattern:

```text
page/<screen-number>-<reference-name>
```

Examples:

```text
page/01-home
page/11-projects
page/12-project-sahim-analytics
page/43-account-security
```

Do not keep multiple page implementations in a long-lived developer branch.

Workflow:

```text
main
→ page branch
→ complete page
→ lint/build/review
→ PR
→ merge
→ next page from updated main
```

A dedicated `shared/*` or `refactor/*` branch is allowed only for genuinely shared foundation work. This does not replace the rule that every page has its own page branch.

Read:

- `docs/development/PAGE_BRANCHING_STRATEGY.md`
- `docs/development/FRONTEND_ASSIGNMENTS.md`
- `docs/development/FRONTEND_IMPLEMENTATION_MAP.md`
