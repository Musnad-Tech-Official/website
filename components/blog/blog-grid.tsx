import React from "react";
import { ArticleCard } from "./article-card";
import type { BlogGridProps } from "./blog-types";

export function BlogGrid({
  articles,
  heading,
  className = "",
}: BlogGridProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section aria-label={heading || "Articles"} className={className}>
      {heading && (
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground select-none">
            {heading}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
