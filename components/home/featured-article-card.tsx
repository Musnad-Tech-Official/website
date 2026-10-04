/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight, LuClock, LuSparkles } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatArticleDate } from "@/lib/utils/date";
import type { Article } from "@/lib/articles/types";
import type { InsightArticleData } from "./home-types";
import { cn } from "@/lib/utils";

export type FeaturedArticleItem = Article | InsightArticleData;

export interface FeaturedArticleCardProps {
  article: FeaturedArticleItem;
  className?: string;
}

function isDbArticle(item: FeaturedArticleItem): item is Article {
  return "titleEn" in item || "titleAr" in item;
}

function getInitials(name?: string): string {
  if (!name) return "SA";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function FeaturedArticleCard({
  article,
  className = "",
}: FeaturedArticleCardProps) {
  const t = useTranslations("Home.latestInsights");
  const locale = useLocale();
  const isRtl = locale === "ar";

  let title = "";
  let excerpt = "";
  let category = "";
  let author = "";
  let authorAvatar: string | undefined = undefined;
  let authorInitials = "SA";
  let articleDate = "";
  let dateTimeAttr: string | undefined = undefined;
  let readTime = "";
  let coverImage: string | undefined = undefined;
  let previewGradient = "from-neutral-800/80 via-zinc-900/60 to-stone-950";
  let isFeatured = false;
  let tags: string[] = [];
  let href = "/blog";

  if (isDbArticle(article)) {
    title = isRtl
      ? (article.titleAr || article.titleEn)
      : (article.titleEn || article.titleAr);
    excerpt = isRtl
      ? (article.excerptAr || article.excerptEn)
      : (article.excerptEn || article.excerptAr);
    category = article.category;
    author = article.authorName || (isRtl ? "المسؤول" : "Administrator");
    authorAvatar = article.authorAvatar;
    authorInitials = getInitials(article.authorName);

    const dateVal = article.publishedAt || article.createdAt;
    articleDate = formatArticleDate(dateVal, locale);
    dateTimeAttr = dateVal ? new Date(dateVal).toISOString() : undefined;

    readTime = isRtl
      ? (article.readTimeAr || "5 دقائق للقراءة")
      : (article.readTimeEn || "5 min read");
    coverImage = article.coverImage;
    isFeatured = article.layoutVariant === "featured";
    tags = article.tags || [];
    href = `/blog/${article.slug}`;
  } else {
    title = t(`articles.${article.articleKey}.title`);
    excerpt = t(`articles.${article.articleKey}.excerpt`);
    category = t(`articles.${article.articleKey}.category`);
    author = t(`articles.${article.articleKey}.author`);
    authorAvatar = undefined;
    authorInitials = article.authorInitials || "SA";
    articleDate = t.has(`articles.${article.articleKey}.date`)
      ? t(`articles.${article.articleKey}.date`)
      : article.date || "2024";
    readTime = t("minRead", { count: article.readTime });
    coverImage = undefined;
    previewGradient = article.previewGradient;
    isFeatured = article.isTrending;
    tags = article.tags || [];
    href = article.href || "/blog";
  }

  return (
    <Card
      variant="default"
      className={cn(
        "group relative flex flex-col overflow-hidden p-0 rounded-2xl",
        "border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-xs",
        "shadow-xs hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/5 hover:-translate-y-1.5",
        "transition-all duration-300",
        className
      )}
    >
      <Link
        href={href}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
        aria-label={title}
      >
        {/* Prominent Visual Editorial Thumbnail Area */}
        <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden bg-muted/30 border-b border-border/50 p-6 flex flex-col justify-between">
          {coverImage ? (
            <>
              {/* Real cover image */}
              <img
                src={coverImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Rich gradient overlay for contrast */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              {/* Editorial gradient fallback */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-105",
                  previewGradient
                )}
              />

              {/* Geometric Tech Grid Texture Overlay */}
              <div
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50 mix-blend-overlay pointer-events-none"
                aria-hidden="true"
              />
            </>
          )}

          {/* Top Badges Row */}
          <div className="relative z-10 flex items-center justify-between w-full gap-2">
            {category ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-background/90 dark:bg-black/60 text-foreground backdrop-blur-md border border-border/50 shadow-xs">
                {category}
              </span>
            ) : <span />}

            {isFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground backdrop-blur-md border border-primary/20 shadow-xs">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse"
                  aria-hidden="true"
                />
                <LuSparkles className="h-3 w-3" aria-hidden="true" />
                <span>
                  {t.has("featuredBadge")
                    ? t("featuredBadge")
                    : isRtl
                    ? "مقال مميز"
                    : "Featured"}
                </span>
              </span>
            )}
          </div>

          {/* Stylized Tech Architecture Preview Graphics (shown when no cover image) */}
          {!coverImage && (
            <div
              className="relative z-10 mt-auto flex flex-col gap-2 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-300"
              aria-hidden="true"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary/70" />
                <div className="h-1.5 w-36 rounded-full bg-white/40" />
              </div>
              <div className="h-1.5 w-56 rounded-full bg-white/25" />
              <div className="h-1.5 w-24 rounded-full bg-white/20" />
            </div>
          )}
        </div>

        {/* Card Body with Rich Editorial Typography */}
        <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between text-start">
          <div>
            {/* Author Metadata with fully rounded Avatar */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                src={authorAvatar}
                fallback={authorInitials}
                size="sm"
                shape="circle"
                className="rounded-full border border-border/80 bg-muted/80 text-foreground font-bold shrink-0"
              />
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                <span className="font-semibold text-foreground">{author}</span>
                {articleDate && (
                  <>
                    <span aria-hidden="true">·</span>
                    {dateTimeAttr ? (
                      <time dateTime={dateTimeAttr}>{articleDate}</time>
                    ) : (
                      <span>{articleDate}</span>
                    )}
                  </>
                )}
                {readTime && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <LuClock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{readTime}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Article Title */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug line-clamp-2">
              {title}
            </h3>

            {/* Excerpt */}
            {excerpt && (
              <p className="mt-3.5 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                {excerpt}
              </p>
            )}
          </div>

          {/* Bottom Tags & Read Article CTA with animated arrow */}
          <div className="mt-8 pt-5 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" aria-label="Tags">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono bg-muted/60 text-muted-foreground border border-border/40"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-primary/80 transition-colors shrink-0">
              <span>{t("readArticle")}</span>
              <LuArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
