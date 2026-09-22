# Frontend Implementation Map — v0.2

## Core Rule

Every frontend page is implemented in its own Git branch.

```text
one page
→ one Git branch
→ one implementation
→ one review
→ one PR
→ merge
→ next page
```

Branch naming:

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

## Conversation Branch vs Git Branch

- Chat branch = developer's long-running implementation context.
- Git branch = one specific page.

A developer keeps the same ChatGPT conversation branch across their assigned pages, but creates a new Git branch for every page.

## Master Page Execution Map

| # | Page | Owner | Owner order | Git branch | Reference | Route | Main dependency | Mock/fixture need |
|---:|---|---|---:|---|---|---|---|---|
| 01 | Home | Frontend A | 1 | `page/01-home` | `01-home.png` | `/[locale]` | Existing Hero + new production home sections; global Footer may be introduced here | Home page mock content |
| 02 | About | Frontend A | 2 | `page/02-about` | `02-about.png` | `/[locale]/about` | Home shared section primitives | About content fixture |
| 03 | Team | Frontend B | 1 | `page/03-team` | `03-team.png` | `/[locale]/team` | Current shared foundation only | Team member fixture |
| 04 | Services | Frontend A | 3 | `page/04-services` | `04-services.png` | `/[locale]/services` | Home shared CTA/section primitives | Service listing fixture |
| 05 | Product Engineering | Frontend A | 4 | `page/05-service-product-engineering` | `05-service-product-engineering.png` | `/[locale]/services/product-engineering` | Services listing / ServiceCard | Service detail fixture |
| 06 | Platform & Infrastructure | Frontend A | 5 | `page/06-service-platform-infrastructure` | `06-service-platform-infrastructure.png` | `/[locale]/services/platform-infrastructure` | Service detail template from 05 | Service detail fixture |
| 07 | Data Engineering | Frontend A | 6 | `page/07-service-data-engineering` | `07-service-data-engineering.png` | `/[locale]/services/data-engineering` | Service detail template from 05 | Service detail fixture |
| 08 | Developer Tools | Frontend A | 7 | `page/08-service-developer-tools` | `08-service-developer-tools.png` | `/[locale]/services/developer-tools` | Service detail template from 05 | Service detail fixture |
| 09 | AI Integration | Frontend A | 8 | `page/09-service-ai-integration` | `09-service-ai-integration.png` | `/[locale]/services/ai-integration` | Service detail template from 05 | Service detail fixture |
| 10 | Design Engineering | Frontend A | 9 | `page/10-service-design-engineering` | `10-service-design-engineering.png` | `/[locale]/services/design-engineering` | Service detail template from 05 | Service detail fixture |
| 11 | Projects | Frontend B | 2 | `page/11-projects` | `11-projects.png` | `/[locale]/projects` | Team page optional shared PageHeader | Projects fixture; filter/search fixture state |
| 12 | Sahim Analytics | Frontend B | 3 | `page/12-project-sahim-analytics` | `12-project-sahim-analytics.png` | `/[locale]/projects/sahim-analytics` | ProjectCard/listing patterns from 11 | Project detail + rating/comments fixtures |
| 13 | Naft Deploy | Frontend B | 4 | `page/13-project-naft-deploy` | `13-project-naft-deploy.png` | `/[locale]/projects/naft-deploy` | Project detail template from 12 | Project detail fixture |
| 14 | Rakeen Portal | Frontend B | 5 | `page/14-project-rakeen-portal` | `14-project-rakeen-portal.png` | `/[locale]/projects/rakeen-portal` | Project detail template from 12 | Project detail fixture |
| 15 | Musnad CLI | Frontend B | 6 | `page/15-project-musnad-cli` | `15-project-musnad-cli.png` | `/[locale]/projects/musnad-cli` | Project detail template from 12 | Project detail fixture |
| 16 | Wathq Observability | Frontend B | 7 | `page/16-project-wathq-observability` | `16-project-wathq-observability.png` | `/[locale]/projects/wathq-observability` | Project detail template from 12 | Project detail fixture |
| 17 | Hudhud Chat | Frontend B | 8 | `page/17-project-hudhud-chat` | `17-project-hudhud-chat.png` | `/[locale]/projects/hudhud-chat` | Project detail template from 12 | Project detail fixture |
| 18 | Blog | Frontend B | 9 | `page/18-blog` | `18-blog.png` | `/[locale]/blog` | Project/listing patterns may be reused where generic | Article listing fixture; search/filter states |
| 19 | Eval-first RAG | Frontend B | 10 | `page/19-article-eval-first-rag` | `19-article-eval-first-rag.png` | `/[locale]/blog/eval-first-rag` | Blog listing / ArticleCard | Article body + comments fixtures |
| 20 | Bilingual RTL Done Right | Frontend B | 11 | `page/20-article-bilingual-rtl-done-right` | `20-article-bilingual-rtl-done-right.png` | `/[locale]/blog/bilingual-rtl-done-right` | Article detail template from 19 | Article detail fixture |
| 21 | Small Teams No Kubernetes | Frontend B | 12 | `page/21-article-small-teams-no-kubernetes` | `21-article-small-teams-no-kubernetes.png` | `/[locale]/blog/small-teams-no-kubernetes` | Article detail template from 19 | Article detail fixture |
| 22 | Postgres as Queue | Frontend B | 13 | `page/22-article-postgres-as-queue` | `22-article-postgres-as-queue.png` | `/[locale]/blog/postgres-as-queue` | Article detail template from 19 | Article detail fixture |
| 23 | Design Tokens That Scale | Frontend B | 14 | `page/23-article-design-tokens-that-scale` | `23-article-design-tokens-that-scale.png` | `/[locale]/blog/design-tokens-that-scale` | Article detail template from 19 | Article detail fixture |
| 24 | Careers | Frontend A | 10 | `page/24-careers` | `24-careers.png` | `/[locale]/careers` | Home/shared CTA patterns | Jobs listing fixture |
| 25 | Senior Backend Engineer | Frontend A | 11 | `page/25-job-senior-backend-engineer` | `25-job-senior-backend-engineer.png` | `/[locale]/careers/senior-backend-engineer` | Careers / JobCard | Job detail + application form fixture |
| 26 | Machine Learning Engineer | Frontend A | 12 | `page/26-job-ml-engineer` | `26-job-ml-engineer.png` | `/[locale]/careers/ml-engineer` | Job detail template from 25 | Job detail fixture |
| 27 | Design Engineer | Frontend A | 13 | `page/27-job-design-engineer` | `27-job-design-engineer.png` | `/[locale]/careers/design-engineer` | Job detail template from 25 | Job detail fixture |
| 28 | Contact | Frontend B | 15 | `page/28-contact` | `28-contact.png` | `/[locale]/contact` | Shared form controls | Contact form fixture; success/error/upload visual states |
| 29 | FAQ | Frontend A | 14 | `page/29-faq` | `29-faq.png` | `/[locale]/faq` | Shared PageHeader/CTA | FAQ grouped fixture |
| 30 | Privacy Policy | Frontend A | 15 | `page/30-legal-privacy` | `30-legal-privacy.png` | `/[locale]/legal/privacy` | Legal content template established here | Legal content fixture |
| 31 | Terms of Service | Frontend A | 16 | `page/31-legal-terms` | `31-legal-terms.png` | `/[locale]/legal/terms` | Legal template from 30 | Legal content fixture |
| 32 | Cookie Policy | Frontend A | 17 | `page/32-legal-cookies` | `32-legal-cookies.png` | `/[locale]/legal/cookies` | Legal template from 30 | Legal content fixture |
| 33 | Sign In | Frontend A | 18 | `page/33-signin` | `33-signin.png` | `/[locale]/sign-in` | Shared form controls | Auth visual fixtures only |
| 34 | Sign Up | Frontend A | 19 | `page/34-signup` | `34-signup.png` | `/[locale]/sign-up` | Auth shell from 33 | Auth visual fixtures only |
| 35 | Forgot Password | Frontend A | 20 | `page/35-forgot` | `35-forgot.png` | `/[locale]/forgot-password` | Auth shell from 33 | Auth visual fixtures only |
| 36 | Account Overview | Frontend B | 16 | `page/36-account-overview` | `36-account-overview.png` | `/[locale]/account` | Account shell/sidebar established here | Account summary fixture |
| 37 | Account Profile | Frontend B | 17 | `page/37-account-profile` | `37-account-profile.png` | `/[locale]/account/profile` | Account shell from 36 | Profile form fixture |
| 38 | Saved Projects | Frontend B | 18 | `page/38-account-saved` | `38-account-saved.png` | `/[locale]/account/saved` | Account shell + ProjectCard | Saved projects fixture |
| 39 | My Comments | Frontend B | 19 | `page/39-account-comments` | `39-account-comments.png` | `/[locale]/account/comments` | Account shell | Comment history fixture |
| 40 | My Ratings | Frontend B | 20 | `page/40-account-ratings` | `40-account-ratings.png` | `/[locale]/account/ratings` | Account shell | Rating history fixture |
| 41 | My Inquiries | Frontend B | 21 | `page/41-account-inquiries` | `41-account-inquiries.png` | `/[locale]/account/inquiries` | Account shell | Inquiry status/history fixture |
| 42 | Notifications | Frontend B | 22 | `page/42-account-notifications` | `42-account-notifications.png` | `/[locale]/account/notifications` | Account shell | Notification fixture |
| 43 | Account & Security | Frontend B | 23 | `page/43-account-security` | `43-account-security.png` | `/[locale]/account/security` | Account shell | Sessions/devices/security fixture |
| 44 | 404 | Frontend A | 21 | `page/44-404` | `44-404.png` | `automatic not-found` | Existing not-found implementation | No backend; localization only |

## Shared-Foundation Rule

Every page has its own branch, but not every change is page-specific.

High-conflict shared files include:

```text
app/globals.css
app/[locale]/layout.tsx
components/ui/*
components/navbar/*
components/theme-*
components/language-switcher*
i18n/*
messages/*
```

### Small shared change needed by a page

It may stay in the page PR if:

- it is necessary for that page,
- it is small and reusable,
- it does not rewrite the shared foundation,
- the developer documents it in the PR.

### Large shared-foundation change

Do not bury it in a page PR.

Use a dedicated branch such as:

```text
shared/footer
shared/page-header
refactor/design-system-<name>
```

Then merge it before dependent page branches consume it.

Important:

> Every page must have its own branch. This does not forbid a dedicated non-page branch for genuinely shared foundation work.

## Global Shell

The following belong to the application shell, not to individual page bodies:

- Navbar
- announcement banner
- language/theme utilities
- global Footer
- global providers
- locale direction/font handling

The production Footer is currently missing.

Recommended ownership:

- Frontend A establishes the Footer while implementing `page/01-home`.
- The Footer itself should be reusable/global.
- Frontend B should not create a competing Footer while working in parallel.

If Frontend B starts before `page/01-home` is merged, they should implement the page body and consume the shared Footer after syncing `main`.

## Template-Establishing Pages

These pages are intentionally first within their family:

| Family | Template-establishing page | Later pages |
|---|---|---|
| Services | `page/05-service-product-engineering` | 06–10 |
| Project Detail | `page/12-project-sahim-analytics` | 13–17 |
| Article Detail | `page/19-article-eval-first-rag` | 20–23 |
| Job Detail | `page/25-job-senior-backend-engineer` | 26–27 |
| Legal | `page/30-legal-privacy` | 31–32 |
| Auth | `page/33-signin` | 34–35 |
| Account | `page/36-account-overview` | 37–43 |

Do not copy the first implementation into every later page.

Extract the stable family layout/components and reuse them.

## Backend Independence

All page branches remain frontend-only.

Use typed fixtures/mocks for:

- content,
- user data,
- form states,
- comments,
- ratings,
- notifications,
- inquiry status,
- job application state.

The Backend / Platform Owner later replaces/feeds those contracts with real data.
