import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import typescript from "typescript";

const { transpileModule, ModuleKind, ScriptTarget } = typescript;
const testDirectory = dirname(fileURLToPath(import.meta.url));
const nodeRequire = createRequire(import.meta.url);

// Use the existing TypeScript compiler and Node test runner; no test dependencies.
function loadTs(filename, mocks = {}, cache = new Map()) {
  const fullPath = resolve(testDirectory, "..", filename);
  if (cache.has(fullPath)) return cache.get(fullPath);
  const exports = {};
  cache.set(fullPath, exports);
  const source = transpileModule(readFileSync(fullPath, "utf8"), {
    compilerOptions: { module: ModuleKind.CommonJS, target: ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (name) => {
    if (name in mocks) return mocks[name];
    if (name === "server-only") return {};
    if (name === "next-intl/routing") return { defineRouting: (value) => value };
    if (name === "next-intl/navigation") return { createNavigation: () => ({}) };
    if (name.startsWith("@/") || name.startsWith(".")) {
      const target = name.startsWith("@/")
        ? resolve(testDirectory, "..", name.slice(2))
        : resolve(dirname(fullPath), name);
      return loadTs(`${target}.ts`, mocks, cache);
    }
    return nodeRequire(name);
  };
  new Function("require", "exports", source)(localRequire, exports);
  return exports;
}

const config = loadTs("lib/seo/config.ts");
const { createPageMetadata } = loadTs("lib/seo/metadata.ts");
const { buildSitemap } = loadTs("lib/seo/sitemap.ts");
const {
  serializeJsonLd,
  articleJsonLd,
  websiteJsonLd,
  breadcrumbsJsonLd,
  projectJsonLd,
  serviceJsonLd,
  personJsonLd,
  faqJsonLd,
  jobPostingJsonLd,
  aboutPageJsonLd,
  contactPageJsonLd,
} = loadTs("lib/seo/structured-data.ts");
const options = { locale: "en", path: "/about", title: "About | Musnad Tech", description: "Our studio" };

function withEnv(values, run) {
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  const restore = () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  };
  try {
    const result = run();
    if (result && typeof result.finally === "function") return result.finally(restore);
    restore();
    return result;
  } catch (error) { restore(); throw error; }
}

test("localized canonicals and alternates agree, including encoded detail slugs", () => {
  withEnv({ NEXT_PUBLIC_SITE_URL: "https://example.com/" }, () => {
    for (const locale of ["en", "ar"]) {
      const metadata = createPageMetadata({ ...options, locale, path: "/blog/%D9%85%D8%B3%D9%86%D8%AF" });
      assert.equal(metadata.alternates.canonical, `https://example.com/${locale}/blog/%D9%85%D8%B3%D9%86%D8%AF`);
      assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
      assert.equal(metadata.alternates.languages[locale], metadata.alternates.canonical);
      assert.equal(metadata.alternates.languages["x-default"], metadata.alternates.languages.en);
      assert.deepEqual(metadata.title, { absolute: options.title });
    }
    assert.equal(config.localizedUrl("en"), "https://example.com/en");
    assert.throws(() => config.localizedUrl("fr", "/about"));
    assert.throws(() => config.localizedUrl("en", "/about?q=1"));
    assert.throws(() => config.localizedUrl("en", "//example.org"));
  });
});

test("canonical configuration rejects credentials, paths, and non-HTTP origins", () => {
  for (const origin of ["https://example.com/path", "https://user:pass@example.com", "file:///", "https://example.com?q=1", "https://example.com/#fragment"]) {
    withEnv({ NEXT_PUBLIC_SITE_URL: origin }, () => assert.throws(config.getSiteUrl));
  }
});

test("preview and development metadata cannot advertise indexable pages", () => {
  for (const env of [{ SITE_INDEXABLE: "false" }, { VERCEL_ENV: "preview" }, { VERCEL_ENV: "development" }, { NODE_ENV: "development" }]) {
    withEnv({ SITE_INDEXABLE: "true", NODE_ENV: "production", VERCEL_ENV: "production", ...env }, () => {
      assert.equal(createPageMetadata(options).robots.index, false);
      assert.equal(createPageMetadata(options).robots.googleBot.index, false);
      assert.equal(loadTs("app/robots.ts").default().rules.disallow, "/");
    });
  }
  withEnv({ SITE_INDEXABLE: "true", NODE_ENV: "production", VERCEL_ENV: "production" }, () => {
    assert.equal(createPageMetadata(options).robots.index, true);
    assert.equal(createPageMetadata({ ...options, index: false }).robots.index, false);
    const robots = loadTs("app/robots.ts").default();
    assert.ok(robots.sitemap.endsWith("/sitemap.xml"));
    assert.ok(!robots.rules.disallow.includes("/en/sign-in"));
  });
});

test("article previews preserve real images, dates, and authors with a safe fallback", () => {
  const metadata = createPageMetadata({ ...options, image: "/cover.jpg", article: { author: "Author", publishedTime: "2026-01-01", modifiedTime: "2026-02-01", tags: ["Engineering"] } });
  assert.equal(metadata.openGraph.type, "article");
  assert.equal(metadata.openGraph.publishedTime, "2026-01-01");
  assert.deepEqual(metadata.openGraph.authors, ["Author"]);
  assert.equal(metadata.twitter.card, "summary_large_image");
  assert.ok(metadata.openGraph.images[0].url.endsWith("/cover.jpg"));
  const fallback = createPageMetadata({ ...options, image: "javascript:alert(1)" });
  assert.ok(fallback.openGraph.images[0].url.endsWith("/og"));
  assert.equal(fallback.openGraph.images[0].width, 1200);
});

test("hidden and maintenance routes receive noindex metadata", async () => {
  for (const status of ["hidden", "maintenance", "live"]) {
    const { getPageMetadata } = loadTs("lib/seo/page-metadata.ts", {
      "@/lib/page-control/actions": { getPageControlsAction: async () => [{ path: "/about", status }] },
    });
    const metadata = await withEnv({ SITE_INDEXABLE: "true", VERCEL_ENV: "production", NODE_ENV: "production" }, () => getPageMetadata(options));
    assert.equal(metadata.robots.index, status === "live");
  }
});

test("sitemap contains reciprocal locale URLs, real dates, and only available routes", () => {
  const entries = buildSitemap({
    articles: [{ slug: "مسند", updated_at: "2026-10-01T00:00:00Z" }],
    projects: [{ slug: "project", updated_at: "invalid" }], services: [], team: [],
    pages: [{ path: "/about", status: "maintenance" }, { path: "/faq", status: "hidden" }],
  });
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);
  for (const entry of entries) {
    assert.equal(entry.alternates.languages.en.replace("/en", "/ar"), entry.alternates.languages.ar);
    assert.ok(!/\/(about|faq|sign-in|sign-up|todos|admin)(\/|$)/.test(entry.url));
    assert.ok(!entry.url.includes("/services/product-engineering"));
    if (entry.url.includes("/blog/")) assert.equal(entry.lastModified, "2026-10-01T00:00:00Z");
    else assert.equal(entry.lastModified, undefined);
  }
});

test("JSON-LD escapes script injection and reflects localized article content", () => {
  const payload = { headline: "</script><script>alert(1)</script>" };
  const serialized = serializeJsonLd(payload);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), payload);
  const article = { slug: "post", titleEn: "English", titleAr: "العربية", excerptEn: "Excerpt", excerptAr: "وصف", authorName: "Author", coverImage: "/article.jpg", updatedAt: "2026-10-01" };
  const data = articleJsonLd(article, "ar");
  assert.equal(data.headline, "العربية");
  assert.equal(data.inLanguage, "ar");
  assert.ok(data.mainEntityOfPage["@id"].endsWith("/ar/blog/post"));
  assert.equal(data.datePublished, undefined);
});

test("sitemap queries are anonymous, filtered, and paginate beyond 1000 rows", async () => {
  const requests = [];
  let clientOptions;
  let fail = false;
  const { getSitemapContent } = loadTs("lib/seo/sitemap-content.ts", {
    "@supabase/supabase-js": { createClient: (_url, _key, options) => {
      clientOptions = options;
      return { from: (table) => {
        const request = { table };
        const query = {
          select: (columns) => { request.columns = columns; return query; },
          order: (column) => { request.order = column; return query; },
          range: (start, end) => { request.start = start; request.end = end; return query; },
          eq: (column, value) => { request.filter = [column, value]; return query; },
          then: (resolve) => {
            requests.push(request);
            const count = table === "articles" ? (request.start === 0 ? 1000 : 1) : 0;
            resolve({ data: Array.from({ length: count }, (_, i) => ({ slug: `post-${request.start + i}` })), error: fail ? { message: "Unavailable" } : null });
          },
        };
        return query;
      } };
    } },
  });
  const content = await withEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-test-key" }, getSitemapContent);
  assert.equal(clientOptions.auth.persistSession, false);
  assert.equal(clientOptions.accessToken, undefined);
  assert.equal(content.articles.length, 1001);
  assert.deepEqual(requests.find((request) => request.table === "articles").filter, ["status", "published"]);
  assert.deepEqual(requests.find((request) => request.table === "projects").filter, ["status", "published"]);
  for (const table of ["services", "team_members"]) {
    assert.deepEqual(requests.find((request) => request.table === table).filter, ["is_active", true]);
  }
  assert.ok(requests.every((request) => request.columns !== "*" && request.order === "id"));
  fail = true;
  await withEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-test-key" }, () => assert.rejects(getSitemapContent, /Could not generate sitemap/));
});

test("SEO endpoints bypass locale redirects while localized pages retain middleware", () => {
  const { config } = loadTs("proxy.ts", {
    "@clerk/nextjs/server": { clerkMiddleware: (handler) => handler },
    "next-intl/middleware": { default: () => () => {} },
    "next/server": { NextResponse: {} },
  });
  const matcher = new RegExp(`^${config.matcher[0]}$`);
  for (const path of ["/robots.txt", "/sitemap.xml", "/og"]) assert.equal(matcher.test(path), false);
  for (const path of ["/en", "/ar/about", "/en/blog/post", "/en/admin", "/en/sign-in"]) assert.equal(matcher.test(path), true);
});

test("structured data covers website, breadcrumbs, projects, services, team, faq, jobs, and contact", () => {
  const website = websiteJsonLd("en");
  assert.equal(website["@type"], "WebSite");
  assert.equal(website.name, "Musnad Tech");
  assert.equal(website.inLanguage, "en");

  const breadcrumbs = breadcrumbsJsonLd([
    { name: "Home", url: "https://musnad.tech/en" },
    { name: "Blog", url: "https://musnad.tech/en/blog" },
  ]);
  assert.equal(breadcrumbs["@type"], "BreadcrumbList");
  assert.equal(breadcrumbs.itemListElement.length, 2);
  assert.equal(breadcrumbs.itemListElement[0].position, 1);
  assert.equal(breadcrumbs.itemListElement[1].position, 2);

  const project = projectJsonLd({ slug: "sahim", titleEn: "Sahim", titleAr: "ساهم", descriptionEn: "Platform", descriptionAr: "منصة", image: "/p.png", liveDemoUrl: "https://demo.com" }, "en");
  assert.equal(project["@type"], "SoftwareApplication");
  assert.equal(project.name, "Sahim");
  assert.equal(project.installUrl, "https://demo.com");

  const service = serviceJsonLd({ slug: "cloud", titleEn: "Cloud", titleAr: "سحاب", descriptionEn: "Cloud desc", descriptionAr: "وصف" }, "ar");
  assert.equal(service["@type"], "Service");
  assert.equal(service.name, "سحاب");
  assert.equal(service.inLanguage, "ar");

  const person = personJsonLd({ slug: "ahmed", nameEn: "Ahmed", nameAr: "أحمد", roleEn: "Lead", roleAr: "قائد", bioEn: "Bio", bioAr: "سيرة", image: "/ahmed.jpg", socialLinks: { github: "https://github.com/ahmed", linkedin: "https://linkedin.com/in/ahmed" } }, "en");
  assert.equal(person["@type"], "ProfilePage");
  assert.equal(person.mainEntity["@type"], "Person");
  assert.equal(person.mainEntity.name, "Ahmed");
  assert.deepEqual(person.mainEntity.sameAs, ["https://linkedin.com/in/ahmed", "https://github.com/ahmed"]);

  const faq = faqJsonLd([{ question: "What is Musnad?", answer: "A technology company" }]);
  assert.equal(faq["@type"], "FAQPage");
  assert.equal(faq.mainEntity[0].name, "What is Musnad?");
  assert.equal(faq.mainEntity[0].acceptedAnswer.text, "A technology company");

  const job = jobPostingJsonLd({ title: "Senior Backend Engineer", description: "Build scalable APIs", location: "Sana'a / Remote" }, "en");
  assert.equal(job["@type"], "JobPosting");
  assert.equal(job.title, "Senior Backend Engineer");
  assert.equal(job.jobLocationType, "TELECOMMUTE");

  const about = aboutPageJsonLd("en");
  assert.equal(about["@type"], "AboutPage");

  const contact = contactPageJsonLd("en");
  assert.equal(contact["@type"], "ContactPage");
});

test("sitemap entries include search-engine priorities and change frequencies", () => {
  const entries = buildSitemap({
    articles: [{ slug: "post", updated_at: "2026-10-01T00:00:00Z" }],
    projects: [{ slug: "project", updated_at: "2026-10-01T00:00:00Z" }],
    services: [{ slug: "service", updated_at: "2026-10-01T00:00:00Z" }],
    team: [{ slug: "member", updated_at: "2026-10-01T00:00:00Z" }],
    pages: [],
  });

  const home = entries.find((e) => e.url.endsWith("/en"));
  assert.ok(home);
  assert.equal(home.priority, 1.0);
  assert.equal(home.changeFrequency, "daily");

  const blog = entries.find((e) => e.url.endsWith("/en/blog"));
  assert.ok(blog);
  assert.equal(blog.priority, 0.9);
  assert.equal(blog.changeFrequency, "daily");

  const article = entries.find((e) => e.url.endsWith("/en/blog/post"));
  assert.ok(article);
  assert.equal(article.priority, 0.8);
  assert.equal(article.changeFrequency, "weekly");
});

test("page metadata includes authors, creator, publisher, and keywords when provided", () => {
  const metadata = createPageMetadata({
    ...options,
    keywords: ["AI", "Cloud"],
  });
  assert.deepEqual(metadata.keywords, ["AI", "Cloud"]);
  assert.equal(metadata.creator, "Musnad Tech");
  assert.equal(metadata.publisher, "Musnad Tech");
  assert.deepEqual(metadata.authors, [{ name: "Musnad Tech", url: "https://musnad.tech" }]);
});

test("web manifest specifies standalone display, branding icons, and metadata", () => {
  const manifest = loadTs("app/manifest.ts").default();
  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.icons.length >= 2);
  assert.ok(manifest.icons.some((i) => i.src.endsWith(".ico")));
  assert.ok(manifest.icons.some((i) => i.src.endsWith(".png")));
});
