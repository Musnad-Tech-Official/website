"use client";

import React, { useState } from "react";
import { ArticleContentRenderer } from "./article-content-renderer";
import { ArticleTableOfContents } from "./article-table-of-contents";
import { ArticleFontSizeControl } from "./article-font-size-control";
import { ArticleCitation } from "./article-citation";
import { ArticleSidebarShare } from "./article-sidebar-share";
import { ArticleSidebarNewsletter } from "./article-sidebar-newsletter";
import { ArticleAuthorBio } from "./article-author-bio";
import { ArticleShareBox } from "./article-share-box";
import type { ArticleDetailBodyProps, ArticleFontSize } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleDetailBody({
  article,
  className = "",
}: ArticleDetailBodyProps) {
  const [fontSize, setFontSize] = useState<ArticleFontSize>("base");

  const fontSizeClasses: Record<ArticleFontSize, string> = {
    sm: "text-sm sm:text-base [&_p]:text-sm sm:[&_p]:text-base",
    base: "text-base sm:text-lg [&_p]:text-base sm:[&_p]:text-lg",
    lg: "text-lg sm:text-xl [&_p]:text-lg sm:[&_p]:text-xl",
  };

  return (
    <div
      className={cn(
        "py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start",
        className
      )}
    >
      {/* ==================================================================== */}
      {/* 1. Main Article Content Column (Left in LTR, Right in RTL)           */}
      {/* ==================================================================== */}
      <div className="lg:col-span-8 min-w-0">
        <article className={cn("transition-all duration-150", fontSizeClasses[fontSize])}>
          {/* Intro Paragraphs */}
          {article.intro && article.intro.length > 0 && (
            <div className="space-y-4 mb-8">
              {article.intro.map((para, idx) => (
                <p
                  key={idx}
                  className="text-lg sm:text-xl text-foreground font-medium leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* Structured Content Blocks */}
          <ArticleContentRenderer blocks={article.blocks} />

          {/* Tag Chips (only if tags exist) */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border/40 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-medium text-muted-foreground bg-muted/60 border border-border/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Bio (only if author exists) */}
          <ArticleAuthorBio author={article.author} />

          {/* Bottom Share Box */}
          <ArticleShareBox title={article.title} slug={article.slug} />
        </article>
      </div>

      {/* ==================================================================== */}
      {/* 2. Sidebar Widgets Column (Right in LTR, Left in RTL)                */}
      {/* ==================================================================== */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
        {/* Table of Contents (only if items exist) */}
        {article.tableOfContents && article.tableOfContents.length > 0 && (
          <ArticleTableOfContents items={article.tableOfContents} />
        )}

        {/* Font Size Reading Control */}
        <ArticleFontSizeControl
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />

        {/* Citation Box (only if citation data exists) */}
        {article.citation && (
          <ArticleCitation
            title={article.title}
            slug={article.slug}
            citation={article.citation}
          />
        )}

        {/* Sidebar Quick Share */}
        <ArticleSidebarShare title={article.title} slug={article.slug} />

        {/* Compact Newsletter Widget */}
        <ArticleSidebarNewsletter />
      </aside>
    </div>
  );
}
