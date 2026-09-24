import React from "react";
import { useTranslations } from "next-intl";
import type { ArticleAuthorBioProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleAuthorBio({
  author,
  className = "",
}: ArticleAuthorBioProps) {
  const t = useTranslations("ArticleDetail.author");

  if (!author || !author.name) {
    return null;
  }

  return (
    <section
      aria-label={t("aboutAuthor")}
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-6 sm:p-8 my-10 shadow-2xs space-y-4",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar */}
        <div
          aria-hidden="true"
          className="h-14 w-14 rounded-2xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center border border-primary/20 shrink-0"
        >
          {author.initials || author.name.charAt(0)}
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
            {t("by")}
          </div>
          <h3 className="text-lg font-bold text-foreground">{author.name}</h3>
          {author.role && (
            <p className="text-xs text-muted-foreground">{author.role}</p>
          )}
        </div>
      </div>

      {author.bio && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {author.bio}
        </p>
      )}

      {author.topics && author.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {author.topics.map((topic, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium text-muted-foreground bg-muted/60 border border-border/40"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
