/**
 * Musnad Tech — Blog Frontend Data Fixtures
 *
 * ARCHITECTURAL NOTE:
 * This file contains typed frontend-only fixtures for Page 18 (Blog Listing).
 *
 * CONTENT INTEGRITY POLICY:
 * In accordance with repository content integrity rules, these temporary
 * fixtures use neutral preview copy. No unsupported technical claims,
 * unverified author attributions, fabricated publication dates, or fake
 * engagement metrics are included.
 *
 * FUTURE BACKEND INTEGRATION:
 * The future Backend Owner will replace local fixture resolvers with real
 * CMS/database queries.
 * The core routing identity is:
 *   - slug: Stable URL-safe slug used for /blog/[slug] dynamic routing
 */

export interface BlogAuthor {
  id?: string;
  name: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;

  author?: BlogAuthor;
  category?: string;
  categorySlug?: string;
  tags?: string[];
  publishedAt?: string;
  readTime?: string;

  layoutVariant?: "default" | "featured";
  visualKey?: string;
  previewGradient?: string;
}

export const BLOG_ARTICLES_EN: BlogArticle[] = [
  {
    id: "article-preview-01",
    slug: "article-preview-01",
    title: "Article preview 01",
    excerpt: "Approved article content will appear here when connected.",
    layoutVariant: "featured",
    previewGradient: "from-zinc-800/90 via-zinc-900/70 to-zinc-950",
  },
  {
    id: "article-preview-02",
    slug: "article-preview-02",
    title: "Article preview 02",
    excerpt: "Approved article content will appear here when connected.",
    layoutVariant: "default",
    previewGradient: "from-neutral-800/90 via-zinc-900/70 to-stone-950",
  },
  {
    id: "article-preview-03",
    slug: "article-preview-03",
    title: "Article preview 03",
    excerpt: "Approved article content will appear here when connected.",
    layoutVariant: "default",
    previewGradient: "from-stone-800/90 via-zinc-900/70 to-neutral-950",
  },
  {
    id: "article-preview-04",
    slug: "article-preview-04",
    title: "Article preview 04",
    excerpt: "Approved article content will appear here when connected.",
    layoutVariant: "default",
    previewGradient: "from-zinc-900/90 via-neutral-900/70 to-zinc-950",
  },
  {
    id: "article-preview-05",
    slug: "article-preview-05",
    title: "Article preview 05",
    excerpt: "Approved article content will appear here when connected.",
    layoutVariant: "default",
    previewGradient: "from-neutral-900/90 via-zinc-900/70 to-zinc-950",
  },
];

export const BLOG_ARTICLES_AR: BlogArticle[] = [
  {
    id: "article-preview-01",
    slug: "article-preview-01",
    title: "معاينة المقال 01",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    layoutVariant: "featured",
    previewGradient: "from-zinc-800/90 via-zinc-900/70 to-zinc-950",
  },
  {
    id: "article-preview-02",
    slug: "article-preview-02",
    title: "معاينة المقال 02",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    layoutVariant: "default",
    previewGradient: "from-neutral-800/90 via-zinc-900/70 to-stone-950",
  },
  {
    id: "article-preview-03",
    slug: "article-preview-03",
    title: "معاينة المقال 03",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    layoutVariant: "default",
    previewGradient: "from-stone-800/90 via-zinc-900/70 to-neutral-950",
  },
  {
    id: "article-preview-04",
    slug: "article-preview-04",
    title: "معاينة المقال 04",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    layoutVariant: "default",
    previewGradient: "from-zinc-900/90 via-neutral-900/70 to-zinc-950",
  },
  {
    id: "article-preview-05",
    slug: "article-preview-05",
    title: "معاينة المقال 05",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    layoutVariant: "default",
    previewGradient: "from-neutral-900/90 via-zinc-900/70 to-zinc-950",
  },
];

/**
 * Returns all articles for the specified locale.
 * Clean abstraction point for future backend service integration.
 */
export function getBlogArticles(locale: string = "en"): BlogArticle[] {
  return locale === "ar" ? BLOG_ARTICLES_AR : BLOG_ARTICLES_EN;
}

/**
 * Resolves a single article by its slug.
 */
export function getBlogArticle(
  slug: string,
  locale: string = "en"
): BlogArticle | undefined {
  const articles = getBlogArticles(locale);
  return articles.find((article) => article.slug === slug);
}
