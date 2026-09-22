# Master Page Inventory — v0.1

## Interpretation Rule

The 44 supplied screenshots define:

- page composition,
- section order,
- relative placement,
- information hierarchy,
- approximate layout/proportions.

They do **not** define final:

- button appearance,
- form-control appearance,
- message/alert appearance,
- card styling,
- modal styling,
- colors,
- borders,
- radii,
- shadows,
- component states.

Those come from the repository Design System.

## Complexity Scale

- **S** — small page / very limited composition.
- **M** — normal page with a few sections/components.
- **L** — multi-section page or complex form/listing.
- **XL** — complex detail page with many states/interactive areas.

## Backend Dependency

- **Low** — can remain mostly static/content-driven.
- **Medium** — dynamic content/feature flags expected but UI can be completed with mocks.
- **High** — auth, forms, community, member data, uploads, or user-specific behavior.

## Inventory

| # | Page | Recommended route | Family | Complexity | Backend dependency | Suggested owner | Structural notes |
|---:|---|---|---|:---:|:---:|---|---|
| 01 | Home | `/[locale]` | Marketing | XL | Medium | FE-A | Hero; capabilities; projects; team; technologies; testimonials; insights; CTA |
| 02 | About | `/[locale]/about` | Marketing | M | Low | FE-A | Hero; mission/vision; values; process; story; milestones; CTA |
| 03 | Team | `/[locale]/team` | Marketing | M | Medium | FE-B | Team grid; team stats/story; CTA |
| 04 | Services | `/[locale]/services` | Services | M | Medium | FE-A | Service grid; process; CTA |
| 05 | Product Engineering | `/[locale]/services/product-engineering` | Service Detail | L | Medium | FE-A | Hero; overview; capabilities; related projects; related tools; CTA |
| 06 | Platform & Infrastructure | `/[locale]/services/platform-infrastructure` | Service Detail | L | Medium | FE-A | Same service-detail family |
| 07 | Data Engineering | `/[locale]/services/data-engineering` | Service Detail | L | Medium | FE-A | Same service-detail family |
| 08 | Developer Tools | `/[locale]/services/developer-tools` | Service Detail | L | Medium | FE-A | Same service-detail family |
| 09 | AI Integration | `/[locale]/services/ai-integration` | Service Detail | L | Medium | FE-A | Same service-detail family |
| 10 | Design Engineering | `/[locale]/services/design-engineering` | Service Detail | L | Medium | FE-A | Same service-detail family |
| 11 | Projects | `/[locale]/projects` | Projects | L | Medium | FE-B | Filters/search; project cards/grid; CTA |
| 12 | Sahim Analytics | `/[locale]/projects/sahim-analytics` | Project Detail | XL | High | FE-B | Metrics; context; solution; gallery; contributors; related; rating; comments; tools; CTA |
| 13 | Naft Deploy | `/[locale]/projects/naft-deploy` | Project Detail | XL | High | FE-B | Same project-detail family |
| 14 | Rakeen Portal | `/[locale]/projects/rakeen-portal` | Project Detail | XL | High | FE-B | Same project-detail family |
| 15 | Musnad CLI | `/[locale]/projects/musnad-cli` | Project Detail | XL | High | FE-B | Same project-detail family |
| 16 | Wathq Observability | `/[locale]/projects/wathq-observability` | Project Detail | XL | High | FE-B | Same project-detail family |
| 17 | Hudhud Chat | `/[locale]/projects/hudhud-chat` | Project Detail | XL | High | FE-B | Same project-detail family |
| 18 | Blog | `/[locale]/blog` | Blog | L | Medium | FE-B | Search/filter; featured article; article cards; newsletter |
| 19 | Eval-first RAG | `/[locale]/blog/eval-first-rag` | Article Detail | XL | High | FE-B | Article body; TOC; code; author; share; related; recommendations; comments |
| 20 | Bilingual RTL Done Right | `/[locale]/blog/bilingual-rtl-done-right` | Article Detail | XL | High | FE-B | Same article-detail family |
| 21 | Small Teams No Kubernetes | `/[locale]/blog/small-teams-no-kubernetes` | Article Detail | XL | High | FE-B | Same article-detail family |
| 22 | Postgres as Queue | `/[locale]/blog/postgres-as-queue` | Article Detail | XL | High | FE-B | Same article-detail family |
| 23 | Design Tokens That Scale | `/[locale]/blog/design-tokens-that-scale` | Article Detail | XL | High | FE-B | Same article-detail family |
| 24 | Careers | `/[locale]/careers` | Careers | L | Medium | FE-A | Culture/value cards; open positions; open application CTA |
| 25 | Senior Backend Engineer | `/[locale]/careers/senior-backend-engineer` | Job Detail | L | High | FE-A | Responsibilities; requirements; application form; CV upload; related jobs |
| 26 | Machine Learning Engineer | `/[locale]/careers/ml-engineer` | Job Detail | L | High | FE-A | Same job-detail family |
| 27 | Design Engineer | `/[locale]/careers/design-engineer` | Job Detail | L | High | FE-A | Same job-detail family |
| 28 | Contact | `/[locale]/contact` | Lead Form | L | High | FE-B | Inquiry form; project fields; attachment; contact info; next steps |
| 29 | FAQ | `/[locale]/faq` | Support | M | Medium | FE-A | FAQ groups/accordion; sidebar/help CTA |
| 30 | Privacy Policy | `/[locale]/legal/privacy` | Legal | M | Low | FE-A | Legal content; TOC; contact CTA |
| 31 | Terms of Service | `/[locale]/legal/terms` | Legal | M | Low | FE-A | Legal content; TOC; contact CTA |
| 32 | Cookie Policy | `/[locale]/legal/cookies` | Legal | M | Low | FE-A | Legal content; TOC; contact CTA |
| 33 | Sign In | `/[locale]/sign-in` | Auth | M | High | FE-A | Auth card; credentials; social providers; links |
| 34 | Sign Up | `/[locale]/sign-up` | Auth | M | High | FE-A | Registration card; terms; social providers |
| 35 | Forgot Password | `/[locale]/forgot-password` | Auth | S | High | FE-A | Reset request form |
| 36 | Account Overview | `/[locale]/account` | Account | M | High | FE-B | Account shell/sidebar; summary cards; continue exploring |
| 37 | Account Profile | `/[locale]/account/profile` | Account | M | High | FE-B | Editable profile form |
| 38 | Saved Projects | `/[locale]/account/saved` | Account | M | High | FE-B | Saved project cards |
| 39 | My Comments | `/[locale]/account/comments` | Account | M | High | FE-B | Comment history/list |
| 40 | My Ratings | `/[locale]/account/ratings` | Account | M | High | FE-B | Project rating history/list |
| 41 | My Inquiries | `/[locale]/account/inquiries` | Account | M | High | FE-B | Inquiry history/status |
| 42 | Notifications | `/[locale]/account/notifications` | Account | M | High | FE-B | Notification list/actions |
| 43 | Account & Security | `/[locale]/account/security` | Account | L | High | FE-B | Password; email; sessions/devices; login history; delete account |
| 44 | 404 | `automatic not-found` | System | S | Low | FE-A | 404 message; actions; suggested pages |

## Page Families That Must Stay Together

To reduce merge conflicts and duplicated components, keep these families under one frontend owner:

- Services listing + all service-detail pages.
- Projects listing + all project-detail pages.
- Blog listing + all article-detail pages.
- Careers listing + all job-detail pages.
- Auth pages.
- Account pages.
- Legal pages.

The individual pages are still complete page-sized responsibilities; family ownership only prevents two developers from editing the same reusable template/components.
