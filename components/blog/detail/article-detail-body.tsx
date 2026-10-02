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

          {/* Structured Content Blocks OR Rich Tiptap HTML Content */}
          {article.contentHtml ? (
            <div
              className="tiptap-rendered-content space-y-4 text-foreground/90 leading-relaxed font-normal
                [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:pt-6 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-border/40 [&_h2]:scroll-mt-24
                [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-foreground [&_h3]:pt-4 [&_h3]:pb-2 [&_h3]:scroll-mt-24
                [&_p]:leading-relaxed [&_p]:text-foreground/90
                [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-2 [&_ul]:text-foreground/90
                [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-2 [&_ol]:text-foreground/90
                [&_blockquote]:my-8 [&_blockquote]:ps-5 sm:[&_blockquote]:ps-6 [&_blockquote]:py-2 [&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:bg-muted/20 [&_blockquote]:rounded-e-xl [&_blockquote]:text-lg sm:[&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-foreground
                [&_pre]:bg-zinc-950 dark:[&_pre]:bg-zinc-900 [&_pre]:text-zinc-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border [&_pre]:border-border/60 [&_pre]:[direction:ltr] [&_pre]:text-left [&_pre]:[text-align:left]
                [&_code]:font-mono [&_code]:text-xs [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-muted/80 [&_code]:border [&_code]:border-border/60 [&_code]:[direction:ltr] [&_code]:[unicode-bidi:isolate]
                [&_pre_code]:bg-transparent [&_pre_code]:border-none [&_pre_code]:p-0 [&_pre_code]:[direction:ltr] [&_pre_code]:text-left
                [&_img]:rounded-2xl [&_img]:border [&_img]:border-border/60 [&_img]:my-6 [&_img]:w-full [&_img]:max-w-3xl [&_img]:object-cover [&_img]:shadow-sm
                [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:opacity-80
              "
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          ) : (
            <ArticleContentRenderer blocks={article.blocks} />
          )}

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
