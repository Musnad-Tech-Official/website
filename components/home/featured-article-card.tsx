/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight, LuClock, LuSparkles } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatArticleDate } from "@/lib/utils/date";
import type { Article } from "@/lib/articles/types";
import { cn } from "@/lib/utils";

export type FeaturedArticleItem = Article;

export interface FeaturedArticleCardProps {
  article: FeaturedArticleItem;
  className?: string;
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

  const title = isRtl
    ? (article.titleAr || article.titleEn)
    : (article.titleEn || article.titleAr);
  const excerpt = isRtl
    ? (article.excerptAr || article.excerptEn)
    : (article.excerptEn || article.excerptAr);

  const category = article.category;
  const author = article.authorName || (isRtl ? "المسؤول" : "Administrator");
  const authorAvatar = article.authorAvatar;
  const authorInitials = getInitials(article.authorName);

  const dateVal = article.publishedAt || article.createdAt;
  const articleDate = formatArticleDate(dateVal, locale);
  const dateTimeAttr = dateVal ? new Date(dateVal).toISOString() : undefined;

  const readTime = isRtl
    ? (article.readTimeAr || "5 دقائق للقراءة")
    : (article.readTimeEn || "5 min read");
  const coverImage = article.coverImage;
  const previewGradient = "from-neutral-800/80 via-zinc-900/60 to-stone-950";
  const isFeatured = article.layoutVariant === "featured";
  const tags = article.tags || [];
  const href = `/blog/${article.slug}`;

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
      {/* 1. Article Visual Header Banner (Cover Image or Curated Tech Gradient) */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-muted/40">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "h-full w-full bg-linear-to-br transition-transform duration-500 group-hover:scale-105",
              previewGradient
            )}
          />
        )}

        {/* Ambient Subtle Texture Pattern Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_70%)]"
        />

        {/* Top Badges: Category & Featured Tag */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-background/85 dark:bg-background/90 text-foreground backdrop-blur-md border border-border/50 shadow-2xs">
            {category}
          </span>

          {isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-xs animate-pulse">
              <LuSparkles className="h-3 w-3" aria-hidden="true" />
              <span>{t("featuredBadge")}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Article Editorial Content */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div className="space-y-3">
          {/* Metadata Row: Date & Read Time */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground/90 font-medium">
            <time dateTime={dateTimeAttr}>{articleDate}</time>
            <span aria-hidden="true" className="text-border">
              •
            </span>
            <span className="inline-flex items-center gap-1">
              <LuClock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{readTime}</span>
            </span>
          </div>

          {/* Article Title */}
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            <Link
              href={href}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
            >
              {title}
            </Link>
          </h3>

          {/* Excerpt Summary */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {excerpt}
          </p>

          {/* Technical Tags */}
          {tags.length > 0 && (
            <div
              className="pt-2 flex flex-wrap gap-1.5"
              aria-label="Article Topics"
            >
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/60 text-muted-foreground border border-border/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Card Footer: Author & Read More Link */}
        <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              src={authorAvatar}
              fallback={authorInitials}
              size="sm"
              className="border border-border/40 bg-primary/10 text-primary font-bold shrink-0"
            />
            <span className="text-xs font-semibold text-foreground/90 truncate">
              {author}
            </span>
          </div>

          <Link
            href={href}
            className="group/link inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs shrink-0"
            aria-label={`${t("readArticle")}: ${title}`}
          >
            <span>{t("readArticle")}</span>
            <LuArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1 rtl:rotate-180 rtl:group-hover/link:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </Card>
  );
}
