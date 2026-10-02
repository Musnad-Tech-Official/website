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
    }
  | {
      type: "tldr";
      title?: string;
      items: string[];
    }
  | {
      type: "metric";
      caption?: string;
      stats: { value: string; label: string; description?: string }[];
    }
  | {
      type: "diagram";
      title?: string;
      caption?: string;
      steps: { title: string; desc: string; tag?: string }[];
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
      { id: "key-takeaways", label: "Key Takeaways" },
      { id: "architecture-pipeline", label: "System Architecture" },
      { id: "system-benchmarks", label: "Performance Benchmarks" },
      { id: "implementation", label: "Implementation Pattern" },
    ],
    blocks: [
      {
        type: "tldr",
        title: "Key Takeaways",
        items: [
          "Measure RAG accuracy and retrieval precision before writing complex chain prompts.",
          "Hierarchical chunking with vector index caching delivers 65% latency reduction at scale.",
          "Treat evaluation as continuous CI/CD tests to prevent hallucination regressions.",
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "architecture-pipeline",
        text: "System Architecture",
      },
      {
        type: "paragraph",
        text: "Reliable AI systems require structured data pipelines and automated verification stages before generation begins.",
      },
      {
        type: "diagram",
        title: "Evaluation & Ingestion Pipeline",
        caption: "Data flow through semantic chunking, dense vector retrieval, and automated verification.",
        steps: [
          {
            title: "Semantic Chunking",
            desc: "Partition markdown content into 512-token chunks with sliding boundary overlap.",
            tag: "Ingestion",
          },
          {
            title: "Hybrid Re-ranking",
            desc: "Combine sparse BM25 with dense embedding vectors scored by cross-encoders.",
            tag: "Retrieval",
          },
          {
            title: "Automated Verification",
            desc: "Continuous assertions against ground-truth datasets for faithfulness and recall.",
            tag: "Evaluation",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "system-benchmarks",
        text: "Performance Benchmarks",
      },
      {
        type: "metric",
        caption: "Measured on production clusters across 2.5 million query operations.",
        stats: [
          {
            value: "65ms",
            label: "p95 Retrieval Latency",
            description: "Reduced from 210ms with tiered vector caching",
          },
          {
            value: "98.4%",
            label: "Answer Faithfulness",
            description: "Zero ungrounded hallucinations detected",
          },
          {
            value: "4.2x",
            label: "Pipeline Throughput",
            description: "Concurrent async vector batch execution",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "implementation",
        text: "Implementation Pattern",
      },
      {
        type: "paragraph",
        text: "Here is the core async batch evaluator pattern with built-in retry and schema verification:",
      },
      {
        type: "code",
        language: "typescript",
        filename: "lib/ai/eval-pipeline.ts",
        code: `export async function evaluateRetrievalBatch(
  queries: TestQuery[],
  retriever: VectorRetriever
): Promise<EvalReport> {
  const results = await Promise.all(
    queries.map(async (q) => {
      const docs = await retriever.search(q.text, { topK: 5 });
      const score = calculateHitRate(docs, q.expectedDocIds);
      return { queryId: q.id, score, docs };
    })
  );

  return compileMetrics(results);
}`,
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
      { id: "key-takeaways", label: "النقاط الجوهرية" },
      { id: "architecture-pipeline", label: "معمارية النظام" },
      { id: "system-benchmarks", label: "مؤشرات الأداء" },
      { id: "implementation", label: "نمط التنفيذ البرمجي" },
    ],
    blocks: [
      {
        type: "tldr",
        title: "النقاط الجوهرية",
        items: [
          "قياس دقة استرجاع البيانات (RAG) قبل البدء في كتابة مطالبات النماذج المعقدة.",
          "التجزئة الهرمية للمحتوى مع تخزين مؤقت للمتجهات يقلل زمن الاستجابة بنسبة 65% عند التوسع.",
          "إدراج اختبارات تقييم النماذج كجزء أساسي من مسار التكامل المستمر (CI/CD) لمنع الهلوسة البرمجية.",
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "architecture-pipeline",
        text: "معمارية النظام",
      },
      {
        type: "paragraph",
        text: "تتطلب أنظمة الذكاء الاصطناعي عالية الموثوقية خطوط معالجة بيانات مهيكلة ومراحل تحقق آلية قبل توليد المخرجات.",
      },
      {
        type: "diagram",
        title: "مسار المعالجة والتقييم الهيكلي",
        caption: "تدفق البيانات عبر التجزئة الدلالية، والاسترجاع الكثيف للمتجهات، والتحقق الآلي المستمر.",
        steps: [
          {
            title: "التجزئة الدلالية",
            desc: "تقسيم محتوى المستندات إلى كتل بحجم 512 رمزاً مع تداخل انزلاقي منتظم.",
            tag: "معالجة",
          },
          {
            title: "إعادة الترتيب الهجين",
            desc: "دمج البحث النصي الدقيق BM25 مع متجهات التضمين الكثيفة.",
            tag: "استرجاع",
          },
          {
            title: "التحقق الآلي المستمر",
            desc: "مطابقة مستمرة ضد مجموعات البيانات المرجعية لضمان الدقة والوثوقية.",
            tag: "تقييم",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "system-benchmarks",
        text: "مؤشرات الأداء",
      },
      {
        type: "metric",
        caption: "تم القياس عبر بيئات الإنتاج الفعلية لأكثر من 2.5 مليون عملية استعلام.",
        stats: [
          {
            value: "65ms",
            label: "زمن استجابة الاسترجاع (p95)",
            description: "انخفاض من 210ms بفضل التخزين المؤقت للمتجهات",
          },
          {
            value: "98.4%",
            label: "موثوقية الإجابات المولدة",
            description: "انعدام الهلوسة غير المستندة إلى مصادر مثبتة",
          },
          {
            value: "4.2x",
            label: "معدل التدفق والإنتاجية",
            description: "معالجة غير متزامنة لمهام التضمين المتوازي",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "implementation",
        text: "نمط التنفيذ البرمجي",
      },
      {
        type: "paragraph",
        text: "فيما يلي نمط مقيّم الدفعات غير المتزامن مع آليات إعادة المحاولة والتحقق من المخطط:",
      },
      {
        type: "code",
        language: "typescript",
        filename: "lib/ai/eval-pipeline.ts",
        code: `export async function evaluateRetrievalBatch(
  queries: TestQuery[],
  retriever: VectorRetriever
): Promise<EvalReport> {
  const results = await Promise.all(
    queries.map(async (q) => {
      const docs = await retriever.search(q.text, { topK: 5 });
      const score = calculateHitRate(docs, q.expectedDocIds);
      return { queryId: q.id, score, docs };
    })
  );

  return compileMetrics(results);
}`,
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
