import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ArticleDetailData } from "@/components/blog/detail/article-detail-types";
import type { BlogArticle } from "@/components/blog/blog-types";
import { getArticleBySlugAction, getArticlesAction } from "@/lib/articles/actions";
import { getArticleCommentsAction } from "@/lib/comments/actions";
import { getTeamMemberBySlugAction } from "@/lib/team/actions";
import { getAuthorSlug } from "@/lib/team/utils";
import {
  ArticleDetailHeader,
  ArticleDetailBody,
  ArticleDetailRelated,
  ArticleDetailComments,
  ArticleBackToTop,
} from "@/components/blog/detail";

interface ArticleDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function processHtmlHeadings(html: string) {
  let counter = 0;
  const items: { id: string; label: string; level?: 2 | 3 }[] = [];

  const processedHtml = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (full, levelStr, attrs, inner) => {
    const level = parseInt(levelStr, 10) as 2 | 3;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return full;

    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const id = idMatch ? idMatch[1] : `section-${++counter}-${text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;

    items.push({ id, label: text, level });

    if (idMatch) {
      return full;
    }
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });

  return { processedHtml, tocItems: items };
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const dbArticle = await getArticleBySlugAction(slug);

  if (!dbArticle) {
    return {};
  }

  const title = locale === "ar"
    ? (dbArticle.titleAr || dbArticle.titleEn)
    : (dbArticle.titleEn || dbArticle.titleAr);
  const excerpt = locale === "ar"
    ? (dbArticle.excerptAr || dbArticle.excerptEn)
    : (dbArticle.excerptEn || dbArticle.excerptAr);

  const t = await getTranslations({ locale, namespace: "ArticleDetail" });

  return {
    title: t("meta.titleTemplate", { title }),
    description: excerpt || t("meta.defaultDescription"),
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  const dbArticle = await getArticleBySlugAction(slug);

  if (!dbArticle) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ArticleDetail" });

  const isAr = locale === "ar";
  const rawHtml = isAr
    ? (dbArticle.contentHtmlAr || dbArticle.contentHtmlEn || "")
    : (dbArticle.contentHtmlEn || dbArticle.contentHtmlAr || "");

  const { processedHtml, tocItems } = processHtmlHeadings(rawHtml);

  const authorSlug = getAuthorSlug(dbArticle.authorName);
  const teamMember = await getTeamMemberBySlugAction(authorSlug);

  const article: ArticleDetailData = {
    id: dbArticle.id,
    slug: dbArticle.slug,
    title: isAr ? (dbArticle.titleAr || dbArticle.titleEn) : (dbArticle.titleEn || dbArticle.titleAr),
    excerpt: isAr ? (dbArticle.excerptAr || dbArticle.excerptEn) : (dbArticle.excerptEn || dbArticle.excerptAr),
    coverImage: dbArticle.coverImage,
    category: dbArticle.category,
    categorySlug: dbArticle.categorySlug,
    tags: dbArticle.tags,
    publishedAt: dbArticle.publishedAt,
    readTime: isAr ? dbArticle.readTimeAr : dbArticle.readTimeEn,
    author: {
      id: authorSlug,
      slug: authorSlug,
      name: dbArticle.authorName,
      role: dbArticle.authorRole || (teamMember ? (isAr ? teamMember.roleAr : teamMember.roleEn) : undefined),
      avatar: dbArticle.authorAvatar || teamMember?.image,
      initials: teamMember?.initials,
      bio: teamMember ? (isAr ? teamMember.bioAr : teamMember.bioEn) : undefined,
      topics: teamMember?.skills,
    },
    contentHtml: processedHtml,
    tableOfContents: tocItems.length > 0 ? tocItems : undefined,
  };

  // Related articles: from other database published articles
  const dbPublished = await getArticlesAction("published");

  const mappedPublished: BlogArticle[] = dbPublished.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: locale === "ar" ? (a.titleAr || a.titleEn) : (a.titleEn || a.titleAr),
    excerpt: locale === "ar" ? (a.excerptAr || a.excerptEn) : (a.excerptEn || a.excerptAr),
    coverImage: a.coverImage,
    category: a.category,
    categorySlug: a.categorySlug,
    tags: a.tags,
    publishedAt: a.publishedAt,
    readTime: locale === "ar" ? a.readTimeAr : a.readTimeEn,
    layoutVariant: a.layoutVariant,
    author: { name: a.authorName },
  }));

  const relatedArticles = mappedPublished
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  // Comments: fetch initial comments for zero-flicker SSR
  const initialComments = await getArticleCommentsAction(article.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Header & Breadcrumbs with optional Metadata & Actions */}
      <ArticleDetailHeader
        title={article.title}
        excerpt={article.excerpt}
        coverImage={article.coverImage}
        category={article.category}
        author={article.author}
        publishedAt={article.publishedAt}
        readTime={article.readTime}
        homeLabel={t("breadcrumb.home")}
        blogLabel={t("breadcrumb.blog")}
        breadcrumbLabel={t("breadcrumb.label")}
      />

      {/* 2. Main Body (Content Blocks or Tiptap HTML) & Sidebar Widgets (TOC, Font Size, Cite, Share, Newsletter) */}
      <ArticleDetailBody article={article} />

      {/* 3. Related Articles */}
      {relatedArticles.length > 0 && (
        <ArticleDetailRelated
          articles={relatedArticles}
          title={t("related.title")}
          viewAllLabel={t("related.viewAll")}
        />
      )}

      {/* 4. Comments Section (Interactive with Clerk auth and TanStack Query) */}
      <ArticleDetailComments
        articleId={article.id}
        articleSlug={article.slug}
        initialComments={initialComments}
        authorName={article.author?.name}
      />

      {/* 5. Back to Top Button */}
      <ArticleBackToTop label={t("backToTop")} />
    </div>
  );
}

