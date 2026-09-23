import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuArrowUpRight, LuSparkles } from "react-icons/lu";
import type { FeaturedArticleCardProps } from "./blog-types";
import { cn } from "@/lib/utils";

export function FeaturedArticleCard({
  article,
  className = "",
}: FeaturedArticleCardProps) {
  const t = useTranslations("Blog.card");

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl transition-transform"
      aria-label={`${t("readArticle")}: ${article.title}`}
    >
      <Card
        variant="interactive"
        className={cn(
          "overflow-hidden border border-border/80 bg-card hover:border-primary/50 transition-all duration-200 flex flex-col lg:flex-row",
          className
        )}
      >
        {/* Media / Visual Canvas */}
        <div
          className={cn(
            "relative w-full lg:w-1/2 min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] bg-linear-to-br border-b lg:border-b-0 lg:border-e border-border/60 overflow-hidden flex items-center justify-center",
            article.previewGradient || "from-zinc-800/90 via-zinc-900/70 to-zinc-950"
          )}
        >
          {/* Subtle architectural background texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.14] dark:opacity-[0.20] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Ambient gradient aura */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl dark:bg-primary/25 pointer-events-none"
          />

          {/* Featured Presentation Overlaid Badge */}
          {article.layoutVariant === "featured" && (
            <div className="absolute top-4 start-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-xs">
                <LuSparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t("featuredBadge")}</span>
              </span>
            </div>
          )}

          {/* Center decorative emblem */}
          <div
            aria-hidden="true"
            className="h-14 w-14 rounded-2xl border border-border/40 bg-background/30 backdrop-blur-xs flex items-center justify-center text-muted-foreground/60 shadow-xs group-hover:scale-105 transition-transform"
          >
            <LuArrowUpRight className="h-6 w-6 rtl:-scale-x-100" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between flex-1">
          <div>
            {/* Category badge (optional) */}
            {article.category && (
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" size="md">
                  {article.category}
                </Badge>
              </div>
            )}

            {/* Headline */}
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Meta & CTA Footer */}
          <div className="mt-6 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              {article.author && (
                <span className="font-semibold text-foreground">
                  {article.author.name}
                </span>
              )}
              {article.author && article.readTime && (
                <span aria-hidden="true">·</span>
              )}
              {article.readTime && <span>{article.readTime}</span>}
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary group-hover:underline">
              <span>{t("readArticle")}</span>
              <LuArrowUpRight className="h-4 w-4 rtl:-scale-x-100 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
