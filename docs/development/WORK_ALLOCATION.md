# Frontend / Backend Work Allocation — Draft v0.1

## Working Model

The project currently uses three implementation lanes:

```text
Frontend A       Frontend B       Backend / Platform Owner
UI pages only    UI pages only    All backend/platform work
```

Frontend developers do not implement backend code.

The backend owner does not redesign the approved frontend composition.

---

# Frontend A

Recommended page ownership:

- 01 Home
- 02 About
- 04 Services
- 05 Product Engineering
- 06 Platform & Infrastructure
- 07 Data Engineering
- 08 Developer Tools
- 09 AI Integration
- 10 Design Engineering
- 24 Careers
- 25 Senior Backend Engineer
- 26 Machine Learning Engineer
- 27 Design Engineer
- 29 FAQ
- 30 Privacy Policy
- 31 Terms of Service
- 32 Cookie Policy
- 33 Sign In
- 34 Sign Up
- 35 Forgot Password
- 44 404

**21 screens**

Primary reusable families owned by Frontend A:

- service presentation components,
- careers/job presentation components,
- legal-content layout,
- auth shell,
- FAQ presentation,
- production Home composition.

---

# Frontend B

Recommended page ownership:

- 03 Team
- 11 Projects
- 12 Sahim Analytics
- 13 Naft Deploy
- 14 Rakeen Portal
- 15 Musnad CLI
- 16 Wathq Observability
- 17 Hudhud Chat
- 18 Blog
- 19 Eval-first RAG
- 20 Bilingual RTL Done Right
- 21 Small Teams No Kubernetes
- 22 Postgres as Queue
- 23 Design Tokens That Scale
- 28 Contact
- 36 Account Overview
- 37 Account Profile
- 38 Saved Projects
- 39 My Comments
- 40 My Ratings
- 41 My Inquiries
- 42 Notifications
- 43 Account & Security

**23 screens**

Primary reusable families owned by Frontend B:

- team cards,
- project cards/detail presentation,
- article cards/detail presentation,
- account shell/sidebar,
- contact-form presentation.

---

# Why this split

The split is not based only on number of screenshots.

Frontend A has fewer but heavier groups:

- Home,
- Services family,
- Careers/forms family,
- Auth.

Frontend B has more pages but several reuse the same family templates:

- Project Detail,
- Article Detail,
- Account shell.

The estimated implementation load is intentionally close rather than numerically identical.

---

# Shared Frontend Foundation

Already existing:

- Navbar
- Mobile Navbar
- Theme
- Language
- Design tokens
- UI component library

Still expected as shared components:

- Footer
- Breadcrumb
- Page header / eyebrow pattern
- common CTA section
- reusable empty state
- reusable loading state
- reusable error state
- page container/section primitives

Likely feature-specific shared components:

- ServiceCard
- ProjectCard
- TeamMemberCard
- ArticleCard
- JobCard
- Rating display/input
- Comment UI
- File Upload UI
- FAQ Accordion
- Account Sidebar

## Rule

A page owner may create reusable components needed by that page family.

Do not create a second version of an existing component simply because another page looks slightly different.

---

# Backend / Platform Owner

The third member owns the complete backend/platform lane.

## BE-01 — System / Data / Backend Design

Deliver:

- system design,
- ERD,
- database schema,
- relationships,
- constraints,
- indexes,
- lifecycle/status models,
- localization data model,
- audit model,
- storage model,
- security boundaries.

## BE-02 — Platform Foundation

Deliver:

- required backend dependencies,
- environment configuration,
- Supabase local/staging/production approach,
- migrations,
- seed/test data approach,
- generated DB types where used.

## BE-03 — Identity & Authorization

Deliver:

- Clerk integration,
- public-user identity mapping,
- admin identity mapping,
- roles and permissions,
- verification requirements,
- RLS,
- privileged server access boundaries.

## BE-04 — Content Backend

Deliver backend for:

- Home-managed content,
- Services,
- Projects,
- Team,
- Technologies,
- Blog/Articles,
- Careers,
- FAQ,
- Testimonials,
- Clients/Partners,
- site settings,
- feature flags.

## BE-05 — Community & Member Backend

Deliver:

- profiles,
- saved projects,
- ratings,
- comments/replies,
- reports,
- moderation state,
- notifications,
- user-safe inquiry history.

## BE-06 — Leads & Careers Workflows

Deliver:

- Contact,
- Project Inquiry,
- lead storage/workflow,
- Job Applications,
- CV upload,
- inquiry attachments,
- confirmation behavior.

## BE-07 — Storage / Media / Async Integrations

Deliver:

- Supabase Storage for private files,
- Cloudinary integration for public media,
- Inngest jobs,
- Resend mail flows,
- malware-scan orchestration,
- translation-draft workflow where enabled.

## BE-08 — Search / Analytics / Observability / Moderation

Deliver:

- PostgreSQL FTS,
- analytics event integration,
- Better Stack logging,
- Sentry error monitoring,
- OpenAI moderation integration,
- operational backend instrumentation.

## BE-09 — Frontend Integration

The backend owner is responsible for replacing mock sources with real system data.

Frontend developers should not need to understand database tables or RLS to connect their pages.

Integration uses stable page-facing contracts/adapters.

## BE-10 — Backend Quality

Deliver:

- database tests,
- RLS tests,
- backend/application tests,
- critical integration checks,
- security validation,
- staging verification.

---

# Integration Contract

Frontend builds against typed mock-facing contracts.

Example:

```ts
type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  image: string | null;
  technologies: string[];
};
```

This is **not** a declaration that the database table has the same shape.

The backend may combine:

- project,
- translation,
- media,
- technology relations

and expose/return a page-facing shape.

---

# Important Separation

Frontend A/B must not add:

- Supabase queries,
- migrations,
- RLS,
- backend authentication rules,
- server-side business logic,
- Inngest jobs,
- Resend flows,
- storage policies.

Backend Owner must not:

- invent new visual styles,
- replace Design System components without an approved reason,
- rearrange page layouts during integration,
- rewrite page composition unless required by an agreed contract change.
