

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

  coverImage?: string;
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
