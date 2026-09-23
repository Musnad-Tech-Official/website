import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getBlogArticles } from "@/data/blog";
import {
  BlogHeader,
  BlogExplorer,
  BlogNewsletter,
} from "@/components/blog";

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

  const articles = getBlogArticles(locale);

  return (
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
  );
}
