# Metadata and search indexing

The shared SEO implementation uses the installed Next.js Metadata API and supports
English and Arabic. Existing page translations supply titles and descriptions;
home and auth metadata use the `SEO` message namespace.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTP(S) origin, such as
`https://musnad.tech`, without a path, query, or fragment. It defaults to the
production domain already used in this repository. All canonical URLs, language
alternates, structured data, and sitemap URLs use this origin, never request headers.

Set `SITE_INDEXABLE=false` on staging and self-hosted previews. Vercel deployments
whose `VERCEL_ENV` is not `production`, and local development, are automatically
excluded. These environments return `noindex` page metadata, a disallow-all robots
file, and an empty sitemap. Rebuild after changing deployment configuration.

Search console verification tokens can optionally be supplied via
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_YANDEX_VERIFICATION`.

## Adding public pages

Call `getPageMetadata` from a server page's `generateMetadata` with its locale,
unprefixed path, translated title, and translated description. Existing titles
already include the brand, so the helper uses `title.absolute` to avoid duplication.
Each public URL has its own canonical and reciprocal `en`, `ar`, and `x-default`
alternates. The default alternate points to the English version.

The helper produces complete Open Graph and Twitter metadata because Next.js
replaces nested metadata objects instead of deeply merging them. Content images
override the 1200 × 630 brand preview at `/og`. The Open Graph endpoint at `/og`
supports custom `title` and `description` parameters with fallback to brand presets.

Structured data schemas in `lib/seo/structured-data.ts` provide rich Schema.org JSON-LD:
- `Organization` & `WebSite` on the Home page (`/`)
- `BlogPosting` & `BreadcrumbList` on Article detail pages (`/blog/[slug]`)
- `SoftwareApplication` & `BreadcrumbList` on Project detail pages (`/projects/[slug]`)
- `Service` & `BreadcrumbList` on Service detail pages (`/services/[slug]`)
- `ProfilePage` (`Person`) & `BreadcrumbList` on Team detail pages (`/team/[slug]`)
- `FAQPage` & `BreadcrumbList` on the FAQ page (`/faq`)
- `JobPosting` & `BreadcrumbList` on Career position pages (`/careers/*`)
- `ContactPage` & `BreadcrumbList` on Contact (`/contact`)
- `AboutPage` & `BreadcrumbList` on About (`/about`)

Add new static public routes to `PUBLIC_STATIC_PATHS`. Do not add catch-all routes,
inventory placeholders, sign-in/sign-up, admin, or internal development pages.
Auth and internal pages use `noindex`; robots allows HTML crawling so search engines
can read those tags. API and Clerk transport routes are excluded from crawling.

## Sitemap data and visibility

`/sitemap.xml` runs at request time and reads narrow projections from Supabase with
the existing public publishable key, without Clerk tokens or a service-role key.
Published articles/projects and active services/team members are included under
both locale URLs. Queries paginate past the default 1,000-row response limit.
Hidden and maintenance routes are excluded using the current page settings; their
page metadata also uses `noindex`. Dynamic entries use real `updated_at` values;
static entries omit modification dates rather than claiming a new update on every request.

Sitemap entries specify standardized `changeFrequency` and `priority` tiers:
- Homepage: `priority: 1.0`, `changeFrequency: "daily"`
- Top-level hubs (`/services`, `/projects`, `/blog`): `priority: 0.9`, `changeFrequency: "daily"`
- Detail routes (`/blog/*`, `/projects/*`, `/services/*`): `priority: 0.8`, `changeFrequency: "weekly"`
- Institutional pages (`/about`, `/team`, `/contact`): `priority: 0.7`, `changeFrequency: "monthly"`
- Team & Career detail pages (`/team/*`, `/careers/*`): `priority: 0.6`, `changeFrequency: "weekly"`
- Informational & Legal (`/legal/*`, `/faq`): `priority: 0.5`, `changeFrequency: "monthly"`

The sitemap requires the existing public Supabase configuration and tables. A
database failure produces a server error instead of silently replacing a complete
sitemap with partial data. No database schema or security policies are changed.

## Web Manifest and Icons

`/manifest.webmanifest` is generated via `app/manifest.ts` and declares standalone
application display, branding colors (`#09090b` background, `#c22c22` theme),
categorization, and icons (`/favicon.ico` and `/brand/logo-light.png`).

## Validation and release

Run `npm run test:seo`, `npm run lint`, and `npx tsc --noEmit`.
After deployment, inspect `/robots.txt`, `/sitemap.xml`, English/Arabic canonical
links and language alternates, and social cards. Submit the production sitemap in
Google Search Console and validate a published article with the Rich Results Test.
Search rankings and rich results are not guaranteed by metadata alone.

References:

- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js sitemap convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld)
- [Google localized pages](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Google robots limitations](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
