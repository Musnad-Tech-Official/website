import React from "react";
import { Link } from "@/i18n/routing";
import { ArticleCard } from "@/components/blog/article-card";
import { LuArrowUpRight } from "react-icons/lu";
import type { ArticleDetailRelatedProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleDetailRelated({
  articles,
  title = "Related articles",
  viewAllLabel = "View all",
  className = "",
}: ArticleDetailRelatedProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-articles-heading"
      className={cn("py-12 sm:py-16 border-t border-border/60", className)}
    >
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2
          id="related-articles-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
        >
          {title}
        </h2>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline group"
        >
          <span>{viewAllLabel}</span>
          <LuArrowUpRight className="h-4 w-4 rtl:-scale-x-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
