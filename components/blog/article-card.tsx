import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { LuArrowUpRight } from "react-icons/lu";
import type { ArticleCardProps } from "./blog-types";
import { cn } from "@/lib/utils";

export function ArticleCard({ article, className = "" }: ArticleCardProps) {
  const t = useTranslations("Blog.card");

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl transition-transform"
      aria-label={`${t("readArticle")}: ${article.title}`}
    >
      <Card
        variant="interactive"
        className={cn(
          "h-full flex flex-col overflow-hidden border border-border/80 bg-card hover:border-primary/50 transition-all duration-200",
          className
        )}
      >
        {/* Media / Visual Canvas */}
        <div
          className={cn(
            "relative h-44 sm:h-48 w-full overflow-hidden bg-linear-to-br border-b border-border/60 flex items-center justify-center shrink-0",
            article.previewGradient || "from-muted/90 via-muted/40 to-background"
          )}
        >
          {/* Subtle architectural background texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.12] dark:opacity-[0.18] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Ambient gradient aura */}
          <div
            aria-hidden="true"
            className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl dark:bg-primary/20 pointer-events-none"
          />

          {/* Overlaid Category Badge (if present) */}
          {article.category && (
            <div className="absolute top-3.5 start-3.5 z-10">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background/80 text-foreground border border-border/70 backdrop-blur-xs shadow-2xs">
                {article.category}
              </span>
            </div>
          )}

          {/* Center decorative emblem */}
          <div
            aria-hidden="true"
            className="h-11 w-11 rounded-xl border border-border/40 bg-background/40 backdrop-blur-xs flex items-center justify-center text-muted-foreground/60 shadow-xs group-hover:scale-105 transition-transform"
          >
            <LuArrowUpRight className="h-5 w-5 rtl:-scale-x-100" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Author & Read Time Meta Line (rendered if author exists) */}
          {article.author && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="font-semibold text-foreground">
                {article.author.name}
              </span>
              {article.readTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-2">
            {article.excerpt}
          </p>

          {/* Tag Chips at bottom (if tags exist) */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-auto pt-4 flex flex-wrap gap-1.5 border-t border-border/50">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium text-muted-foreground bg-muted/50 border border-border/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
