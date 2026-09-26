import React from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { LuChevronRight } from "react-icons/lu";
import { ArticleHeaderActions } from "./article-header-actions";
import type { ArticleDetailHeaderProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleDetailHeader({
  title,
  excerpt,
  category,
  author,
  publishedAt,
  readTime,
  homeLabel,
  blogLabel,
  breadcrumbLabel = "Breadcrumbs",
  className = "",
}: ArticleDetailHeaderProps) {
  const hasMetadata = Boolean(author || publishedAt || readTime);

  return (
    <header
      className={cn(
        "pt-8 sm:pt-12 pb-8 sm:pb-12 border-b border-border/60",
        className
      )}
    >
      {/* 1. Breadcrumbs Navigation */}
      <nav aria-label={breadcrumbLabel} className="mb-6 sm:mb-8">
        <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
            >
              {homeLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="select-none text-muted-foreground/60">
            <LuChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </li>
          <li>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
            >
              {blogLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="select-none text-muted-foreground/60">
            <LuChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </li>
          <li
            aria-current="page"
            className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-md"
          >
            {title}
          </li>
        </ol>
      </nav>

      {/* 2. Optional Category Eyebrow Badge */}
      {category && (
        <div className="mb-4">
          <Badge variant="secondary" size="sm">
            {category}
          </Badge>
        </div>
      )}

      {/* 3. Page Title */}
      <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.15] max-w-4xl">
        {title}
      </h1>

      {/* 4. Subtitle / Excerpt */}
      {excerpt && (
        <p className="mt-4 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          {excerpt}
        </p>
      )}

      {/* 5. Metadata Bar (Author, Date, Read Time) & Action Buttons */}
      <div className="mt-6 sm:mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Metadata info (only if present) */}
        {hasMetadata ? (
          <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0"
                >
                  {author.initials || author.name.charAt(0)}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5">
                  <span className="font-semibold text-foreground">
                    {author.name}
                  </span>
                  {author.role && (
                    <span className="text-muted-foreground/80 hidden sm:inline">
                      · {author.role}
                    </span>
                  )}
                </div>
              </div>
            )}

            {publishedAt && (
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="select-none text-muted-foreground/50">
                  ·
                </span>
                <time dateTime={publishedAt}>{publishedAt}</time>
              </div>
            )}

            {readTime && (
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="select-none text-muted-foreground/50">
                  ·
                </span>
                <span>{readTime}</span>
              </div>
            )}
          </div>
        ) : (
          <div aria-hidden="true" />
        )}

        {/* Right: Header Actions (Bookmark, Copy Link, Share) */}
        <ArticleHeaderActions title={title} />
      </div>
    </header>
  );
}
