import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates, localizedUrl } from "./config";

// Only implemented public routes; inventory placeholders are intentionally absent.
export const PUBLIC_STATIC_PATHS = [
  "/", "/about", "/team", "/services", "/projects", "/blog", "/careers",
  "/careers/senior-backend-engineer", "/careers/machine-learning-engineer",
  "/careers/design-engineer", "/contact", "/faq", "/legal/privacy-policy",
  "/legal/terms-of-service", "/legal/cookie-policy",
] as const;

export interface SitemapContentRow { slug: string; updated_at?: string | null }
export interface SitemapPageSetting { path: string; status: string }
export interface SitemapContent {
  articles: SitemapContentRow[];
  projects: SitemapContentRow[];
  services: SitemapContentRow[];
  team: SitemapContentRow[];
  pages: SitemapPageSetting[];
}

export function buildSitemap(content: SitemapContent): MetadataRoute.Sitemap {
  const paths = new Map<string, string | undefined>(PUBLIC_STATIC_PATHS.map((path) => [path, undefined]));
  for (const [prefix, rows] of [
    ["blog", content.articles], ["projects", content.projects],
    ["services", content.services], ["team", content.team],
  ] as const) {
    for (const row of rows) {
      if (!row.slug) continue;
      paths.set(`/${prefix}/${encodeURIComponent(row.slug)}`, row.updated_at || undefined);
    }
  }

  function getPriorityAndFreq(path: string): {
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  } {
    if (path === "/") return { priority: 1.0, changeFrequency: "daily" };
    if (path === "/services" || path === "/projects" || path === "/blog") return { priority: 0.9, changeFrequency: "daily" };
    if (path.startsWith("/blog/") || path.startsWith("/projects/") || path.startsWith("/services/")) return { priority: 0.8, changeFrequency: "weekly" };
    if (path === "/about" || path === "/team" || path === "/contact") return { priority: 0.7, changeFrequency: "monthly" };
    if (path.startsWith("/team/") || path.startsWith("/careers")) return { priority: 0.6, changeFrequency: "weekly" };
    return { priority: 0.5, changeFrequency: "monthly" };
  }

  return [...paths].flatMap(([path, updatedAt]) => {
    const page = content.pages.find((item) => item.path === path);
    if (page && page.status !== "live") return [];
    // Use actual content timestamps, never a fabricated current date.
    const lastModified = updatedAt && !Number.isNaN(Date.parse(updatedAt)) ? updatedAt : undefined;
    const { priority, changeFrequency } = getPriorityAndFreq(path);
    return routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    }));
  });
}
