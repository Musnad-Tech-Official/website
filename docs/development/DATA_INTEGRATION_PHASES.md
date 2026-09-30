# Admin and database integration phases

The live schema draft defines 24 tables. The public.profiles table is created separately and referenced by the draft. The admin workspace must handle all 25 tables. Public pages should read only data permitted by their row policies; private tables remain available only to authorized users.

## Phase 1 — Admin foundation and inventory

- Protect the admin route with Clerk's server-side metadata.role=admin check.
- Keep Supabase RLS as the database authorization boundary.
- Provide a bilingual, responsive overview, specialized editors for projects, articles, and technologies, an inquiry queue, and a read-only explorer for every table.
- Verify build, typing, and localization. Verify the running app with a real Clerk admin session before deployment.

## Phase 2 — Complete admin workflows

- Add domain forms and actions for services, team members, categories, jobs, pages, media, and their translations and relations.
- Add moderation workflows for comments and reports, and review workflows for job applications, ratings, saved projects, and notifications.
- Manage profiles and roles through trusted Clerk/server flows; never expose role assignment as a generic table edit.
- Validate required fields, relationships, publication prerequisites, and side effects in server actions. Make multi-table writes atomic where the workflow requires it.
- Add pagination, filters, empty/error states, and auditability for each table.

## Phase 3 — Public read integration

- Replace fixtures on Home, Services, Projects, Team, Blog, Careers, and legal/content pages with published Supabase data through page-facing adapters.
- Keep existing page composition and design-system components.
- Render the requested locale from translation rows and define explicit missing-translation behavior.
- Connect detail pages by stable slug and return 404 for unpublished or missing content.

## Phase 4 — User and submission flows

- Connect contact inquiries, job applications, comments, ratings, saved projects, notifications, and account views.
- Enforce Clerk auth, Supabase RLS, validation, and anti-abuse controls at each entry point.
- Keep private data out of public responses and client bundles.

## Phase 5 — Verification and release

- Verify admin and non-admin access, both locales and text directions, light/dark modes, responsive layouts, and empty/error states.
- Test RLS with distinct users and anonymous requests, including attempts to invoke server actions directly.
- Verify data created in admin appears on the intended public page, and that drafts remain hidden.

## Table coverage map

| Area | Tables | Public or user-facing destinations |
| --- | --- | --- |
| Services | services, service_translations | Home, services listing, service details |
| Projects | projects, project_translations, technologies, project_technologies, project_media | Home, projects listing and details |
| Team | team_members, team_member_translations | Home, team |
| Blog | categories, articles, article_translations | Home, blog listing and details |
| Careers | jobs, job_translations, job_applications | Careers listing/details and applications |
| Pages | pages, page_translations | Legal and other content pages |
| Community | comments, comment_reports, project_ratings, saved_projects | Project/article detail and account pages |
| Communication | inquiries, notifications | Contact/project inquiries and account pages |
| Media | media_assets | Published content imagery and attachments |
| Identity | profiles | Account pages and admin identity review |

The todos route and table are development artifacts outside this content model.
