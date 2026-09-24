/**
 * Musnad Tech — Dynamic Article Detail Data & Resolvers
 *
 * ARCHITECTURAL NOTE:
 * This file provides the typed data contract and local frontend fixtures
 * for the dynamic Article Detail template (Page 19-23).
 *
 * All current and future articles resolve through the single dynamic route:
 *   app/[locale]/blog/[slug]/page.tsx
 *
 * CONTENT INTEGRITY POLICY:
 * In accordance with repository content integrity rules, these temporary
 * fixtures use neutral preview copy. No unsupported technical claims,
 * unverified author attributions, fabricated publication dates, fake
 * engagement metrics, or speculative citation metadata are included.
 *
 * FUTURE BACKEND INTEGRATION:
 * The future Backend Owner will replace local fixture resolvers with real
 * CMS/database queries (e.g., Supabase lookup by slug -> stable internal ID).
 * The Article Detail presentation components remain fully data-driven.
 */

export type ArticleContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id?: string }
  | { type: "quote"; text: string; attribution?: string }
  | {
      type: "callout";
      title?: string;
      text: string;
      variant?: "info" | "warning" | "success";
    }
  | { type: "code"; language?: string; code: string; filename?: string }
  | { type: "list"; style: "ordered" | "unordered"; items: string[] }
  | {
      type: "media";
      visualKey?: string;
      caption?: string;
      previewGradient?: string;
    };

export interface ArticleTocItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

export interface ArticleAuthorData {
  id?: string;
  name: string;
  role?: string;
  bio?: string;
  initials?: string;
  topics?: string[];
}

export interface ArticleCitationData {
  apa: string;
  mla: string;
  chicago: string;
  bibtex: string;
}

export interface ArticleHeroData {
  visualKey?: string;
  caption?: string;
  previewGradient?: string;
}

export interface ArticleCtaData {
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export interface ArticleDetailData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;

  category?: string;
  categorySlug?: string;
  tags?: string[];

  author?: ArticleAuthorData;
  publishedAt?: string;
  updatedAt?: string;
  readTime?: string;

  hero?: ArticleHeroData;
  intro?: string[];
  blocks?: ArticleContentBlock[];
  tableOfContents?: ArticleTocItem[];
  citation?: ArticleCitationData;

  relatedArticleSlugs?: string[];
  cta?: ArticleCtaData;
}

// ============================================================================
// ENGLISH ARTICLE FIXTURES (Audited Neutral Preview Content Only)
// ============================================================================

export const ARTICLE_DETAILS_EN: ArticleDetailData[] = [
  {
    id: "article-preview-01",
    slug: "article-preview-01",
    title: "Article preview 01",
    excerpt: "Approved article content will appear here when connected.",
    intro: [
      "Approved article content will appear here when connected.",
    ],
    tableOfContents: [
      { id: "section-01", label: "Section 01" },
      { id: "section-02", label: "Section 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "Section 01",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "Section 02",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
    ],
    relatedArticleSlugs: ["article-preview-02", "article-preview-03"],
  },
  {
    id: "article-preview-02",
    slug: "article-preview-02",
    title: "Article preview 02",
    excerpt: "Approved article content will appear here when connected.",
    intro: [
      "Approved article content will appear here when connected.",
    ],
    tableOfContents: [
      { id: "section-01", label: "Section 01" },
      { id: "section-02", label: "Section 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "Section 01",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "Section 02",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
    ],
    relatedArticleSlugs: ["article-preview-01", "article-preview-03"],
  },
  {
    id: "article-preview-03",
    slug: "article-preview-03",
    title: "Article preview 03",
    excerpt: "Approved article content will appear here when connected.",
    intro: [
      "Approved article content will appear here when connected.",
    ],
    tableOfContents: [
      { id: "section-01", label: "Section 01" },
      { id: "section-02", label: "Section 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "Section 01",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "Section 02",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
    ],
    relatedArticleSlugs: ["article-preview-01", "article-preview-02"],
  },
  {
    id: "article-preview-04",
    slug: "article-preview-04",
    title: "Article preview 04",
    excerpt: "Approved article content will appear here when connected.",
    intro: [
      "Approved article content will appear here when connected.",
    ],
    tableOfContents: [
      { id: "section-01", label: "Section 01" },
      { id: "section-02", label: "Section 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "Section 01",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "Section 02",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
    ],
    relatedArticleSlugs: ["article-preview-02", "article-preview-05"],
  },
  {
    id: "article-preview-05",
    slug: "article-preview-05",
    title: "Article preview 05",
    excerpt: "Approved article content will appear here when connected.",
    intro: [
      "Approved article content will appear here when connected.",
    ],
    tableOfContents: [
      { id: "section-01", label: "Section 01" },
      { id: "section-02", label: "Section 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "Section 01",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "Section 02",
      },
      {
        type: "paragraph",
        text: "This section is reserved for approved article content.",
      },
    ],
    relatedArticleSlugs: ["article-preview-03", "article-preview-04"],
  },
];

// ============================================================================
// ARABIC ARTICLE FIXTURES (Audited Neutral Preview Content Only)
// ============================================================================

export const ARTICLE_DETAILS_AR: ArticleDetailData[] = [
  {
    id: "article-preview-01",
    slug: "article-preview-01",
    title: "معاينة المقال 01",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    intro: [
      "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    ],
    tableOfContents: [
      { id: "section-01", label: "القسم 01" },
      { id: "section-02", label: "القسم 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "القسم 01",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "القسم 02",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
    ],
    relatedArticleSlugs: ["article-preview-02", "article-preview-03"],
  },
  {
    id: "article-preview-02",
    slug: "article-preview-02",
    title: "معاينة المقال 02",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    intro: [
      "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    ],
    tableOfContents: [
      { id: "section-01", label: "القسم 01" },
      { id: "section-02", label: "القسم 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "القسم 01",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "القسم 02",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
    ],
    relatedArticleSlugs: ["article-preview-01", "article-preview-03"],
  },
  {
    id: "article-preview-03",
    slug: "article-preview-03",
    title: "معاينة المقال 03",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    intro: [
      "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    ],
    tableOfContents: [
      { id: "section-01", label: "القسم 01" },
      { id: "section-02", label: "القسم 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "القسم 01",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "القسم 02",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
    ],
    relatedArticleSlugs: ["article-preview-01", "article-preview-02"],
  },
  {
    id: "article-preview-04",
    slug: "article-preview-04",
    title: "معاينة المقال 04",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    intro: [
      "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    ],
    tableOfContents: [
      { id: "section-01", label: "القسم 01" },
      { id: "section-02", label: "القسم 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "القسم 01",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "القسم 02",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
    ],
    relatedArticleSlugs: ["article-preview-02", "article-preview-05"],
  },
  {
    id: "article-preview-05",
    slug: "article-preview-05",
    title: "معاينة المقال 05",
    excerpt: "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    intro: [
      "سيظهر محتوى المقال المعتمد هنا عند ربطه.",
    ],
    tableOfContents: [
      { id: "section-01", label: "القسم 01" },
      { id: "section-02", label: "القسم 02" },
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        id: "section-01",
        text: "القسم 01",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
      {
        type: "heading",
        level: 2,
        id: "section-02",
        text: "القسم 02",
      },
      {
        type: "paragraph",
        text: "هذا القسم مخصص لمحتوى المقال المعتمد.",
      },
    ],
    relatedArticleSlugs: ["article-preview-03", "article-preview-04"],
  },
];

// ============================================================================
// ARTICLE RESOLVERS
// ============================================================================

/**
 * Returns all articles for the specified locale.
 * Clean abstraction point for future backend service integration.
 */
export function getArticleDetails(locale: string = "en"): ArticleDetailData[] {
  return locale === "ar" ? ARTICLE_DETAILS_AR : ARTICLE_DETAILS_EN;
}

/**
 * Resolves a single article by its slug.
 * Returns undefined for unknown slugs.
 */
export function getArticleDetail(
  slug: string,
  locale: string = "en"
): ArticleDetailData | undefined {
  const articles = getArticleDetails(locale);
  return articles.find((article) => article.slug === slug);
}
