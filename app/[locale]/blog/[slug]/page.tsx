import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getArticleDetail } from "@/data/article-details";
import { getBlogArticles } from "@/data/blog";
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

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleDetail(slug, locale);

  if (!article) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "ArticleDetail" });

  return {
    title: t("meta.titleTemplate", { title: article.title }),
    description: article.excerpt || t("meta.defaultDescription"),
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  const article = getArticleDetail(slug, locale);

  if (!article) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ArticleDetail" });

  // Related articles: select up to 3 other articles from approved blog fixtures
  const allArticles = getBlogArticles(locale);
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Header & Breadcrumbs with optional Metadata & Actions */}
      <ArticleDetailHeader
        title={article.title}
        excerpt={article.excerpt}
        category={article.category}
        author={article.author}
        publishedAt={article.publishedAt}
        readTime={article.readTime}
        homeLabel={t("breadcrumb.home")}
        blogLabel={t("breadcrumb.blog")}
        breadcrumbLabel={t("breadcrumb.label")}
      />

      {/* 2. Main Body (Content Blocks) & Sidebar Widgets (TOC, Font Size, Cite, Share, Newsletter) */}
      <ArticleDetailBody article={article} />

      {/* 3. Related Articles */}
      {relatedArticles.length > 0 && (
        <ArticleDetailRelated
          articles={relatedArticles}
          title={t("related.title")}
          viewAllLabel={t("related.viewAll")}
        />
      )}

      {/* 4. Comments Section (Non-persistent structural presentation with empty state) */}
      <ArticleDetailComments />

      {/* 5. Back to Top Button */}
      <ArticleBackToTop label={t("backToTop")} />
    </div>
  );
}
