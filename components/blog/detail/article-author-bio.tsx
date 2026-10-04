/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuChevronRight } from "react-icons/lu";
import { getAuthorSlug } from "@/lib/team/utils";
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

  const authorSlug = getAuthorSlug(
    author.name,
    (author as { slug?: string; id?: string }).slug || (author as { slug?: string; id?: string }).id
  );
  const profileHref = `/team/${authorSlug}`;

  return (
    <section
      aria-label={t("aboutAuthor")}
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-6 sm:p-8 my-10 shadow-2xs space-y-5",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Author Avatar & Main Info */}
        <Link
          href={profileHref}
          className="group/author flex items-center gap-4 focus:outline-none"
        >
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="h-14 w-14 rounded-2xl object-cover border border-border/80 group-hover/author:border-primary/50 transition-colors shrink-0"
            />
          ) : (
            <div
              aria-hidden="true"
              className="h-14 w-14 rounded-2xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center border border-primary/20 shrink-0 group-hover/author:border-primary transition-colors"
            >
              {author.initials || author.name.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {t("by")}
            </div>
            <h3 className="text-lg font-bold text-foreground group-hover/author:text-primary transition-colors flex items-center gap-1.5">
              <span>{author.name}</span>
            </h3>
            {author.role && (
              <p className="text-xs text-muted-foreground">{author.role}</p>
            )}
          </div>
        </Link>

        {/* View Profile Action Link */}
        <Link
          href={profileHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group/cta"
        >
          <span>{t("viewProfile")}</span>
          <LuChevronRight className="w-3.5 h-3.5 rtl:rotate-180 transition-transform group-hover/cta:translate-x-0.5 rtl:group-hover/cta:-translate-x-0.5" />
        </Link>
      </div>

      {author.bio && (
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {author.bio}
        </p>
      )}

      {author.topics && author.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/40">
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
