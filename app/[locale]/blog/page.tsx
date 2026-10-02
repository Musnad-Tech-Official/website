import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { BlogArticle } from "@/data/blog";
import { getArticlesAction } from "@/lib/articles/actions";
import {
  BlogHeader,
  BlogExplorer,
  BlogNewsletter,
} from "@/components/blog";
import { PageGuard } from "@/lib/page-control/guard";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  const dbArticles = await getArticlesAction("published");

  // Map published database articles to BlogArticle format
  const articles: BlogArticle[] = dbArticles.map((art) => ({
    id: art.id,
    slug: art.slug,
    title: locale === "ar" ? (art.titleAr || art.titleEn) : (art.titleEn || art.titleAr),
    excerpt: locale === "ar" ? (art.excerptAr || art.excerptEn) : (art.excerptEn || art.excerptAr),
    coverImage: art.coverImage,
    category: art.category,
    categorySlug: art.categorySlug,
    tags: art.tags,
    publishedAt: art.publishedAt,
    readTime: locale === "ar" ? art.readTimeAr : art.readTimeEn,
    layoutVariant: art.layoutVariant,
    author: {
      name: art.authorName,
    },
  }));

  return (
    <PageGuard slug="blog" locale={locale}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* 1. Header & Breadcrumbs */}
        <BlogHeader
          eyebrow={t("header.eyebrow")}
          title={t("header.title")}
          subtitle={t("header.subtitle")}
          homeLabel={t("breadcrumb.home")}
          blogLabel={t("breadcrumb.blog")}
          breadcrumbLabel={t("breadcrumb.label")}
        />

        {/* 2. Interactive Search, Featured Presentation, and Articles Grid */}
        <BlogExplorer articles={articles} />

        {/* 3. Newsletter Subscription Card */}
        <BlogNewsletter />
      </div>
    </PageGuard>
  );
}
