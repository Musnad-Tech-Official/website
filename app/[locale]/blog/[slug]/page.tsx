import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getArticleDetail, getArticleDetails } from "@/data/article-details";
import { getBlogArticles } from "@/data/blog";
import { routing } from "@/i18n/routing";
import {
  ArticleDetailHeader,
  ArticleDetailBody,
  ArticleDetailRelated,
  ArticleDetailComments,
  ArticleBackToTop,
  ArticleReadingProgress,
} from "@/components/blog/detail";

interface ArticleDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const articles = getArticleDetails(locale);
    return articles.map((article) => ({
      locale,
      slug: article.slug,
    }));
  });
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
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author?.name || "Musnad Tech",
    },
    publisher: {
      "@type": "Organization",
      name: "Musnad Tech",
      url: "https://musnad.tech",
    },
  };

  return (
    <>
      {/* 1. Viewport Pinned Reading Progress Bar */}
      <ArticleReadingProgress />

      {/* 2. Structured Data for Developer Search / SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* 3. Header & Breadcrumbs with Metadata & Actions */}
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

        {/* 4. Main Body (Content Blocks) & Sticky Sidebar Widgets */}
        <ArticleDetailBody article={article} />

        {/* 5. Contextual Related Technical Articles */}
        {relatedArticles.length > 0 && (
          <ArticleDetailRelated
            articles={relatedArticles}
            title={t("related.title")}
            viewAllLabel={t("related.viewAll")}
          />
        )}

        {/* 6. Comments Section with Clerk Modal Authentication */}
        <ArticleDetailComments />

        {/* 7. Back to Top Button */}
        <ArticleBackToTop label={t("backToTop")} />
      </div>
    </>
  );
}
