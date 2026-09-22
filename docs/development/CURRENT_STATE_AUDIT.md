# Current Project Audit — v0.1

## Scope

This audit is based on:

- the uploaded current repository dump,
- the uploaded repository structure,
- the 44 supplied page-reference screenshots.

The screenshots are **layout/structure references only**. They are not the final authority for component styling.

## Current repository state

### Already present

- Next.js App Router foundation.
- TypeScript.
- Tailwind CSS v4.
- `next-intl` with `en` and `ar`.
- `next-themes`.
- global light/dark tokens.
- RTL/LTR handling in the locale layout.
- Navbar and mobile navigation.
- language switcher.
- theme switcher.
- announcement banner.
- current Hero implementation.
- reusable UI components:
  - Alert
  - Avatar
  - Badge
  - Button
  - Card
  - Checkbox
  - Dialog
  - Input
  - Select
  - Skeleton
  - Switch
  - Tabs
  - Textarea
  - Tooltip
- a large UI Showcase used as a component/design-system playground.

### Not yet implemented in the current repository

- the real production Home page composition,
- About route,
- Team route,
- Services routes,
- Projects routes,
- Blog routes,
- Careers routes,
- Contact,
- FAQ,
- Legal routes,
- Auth routes,
- Account routes,
- Supabase integration,
- database/schema/migrations,
- Clerk integration,
- RLS,
- backend business logic,
- Inngest,
- Resend,
- Cloudinary integration,
- application search,
- application moderation,
- malware scanning,
- backend tests.

## Important observations

### 1. The project is recoverable without a restart

The repository is still at a foundation stage. There is no substantial backend implementation to unwind.

### 2. Home is currently a development playground

The current locale Home route renders:

- `HeroSection`
- `UIShowcase`

`UIShowcase` should not remain in the final production Home route. It is useful and should be preserved as an internal design-system/dev reference.

Recommended future location:

`/[locale]/dev/design-system`

or another internal development-only route chosen by the team.

### 3. Existing Hero does not currently follow the supplied Home reference layout

The current Hero is a two-column layout with an interactive Tech Cloud.

The supplied Home screenshot uses a different structural composition.

Because screenshots are the structural reference, the Home implementer should refactor the Hero/page structure while still using the approved Design System.

### 4. Current Design System vs approved tech-stack wording

The current `components/ui` implementation is custom and the current `package.json` does not contain the usual shadcn/Radix dependency set.

Project rule for now:

> The existing repository Design System is the UI source of truth. Do not replace it wholesale simply to make the repository look like a standard shadcn installation.

This can be reconciled in the formal architecture documentation later.

### 5. README is still create-next-app boilerplate

It should be replaced with a project-specific README after the working model and setup are finalized.

### 6. AGENTS.md currently contains only Next.js generated agent rules

The generated block must be retained. Project-specific instructions should be appended after it.
