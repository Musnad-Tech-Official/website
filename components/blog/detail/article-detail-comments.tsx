import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuMessageSquare, LuInfo } from "react-icons/lu";
import type { ArticleDetailCommentsProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleDetailComments({
  className = "",
}: ArticleDetailCommentsProps) {
  const t = useTranslations("ArticleDetail.comments");

  return (
    <section
      aria-labelledby="comments-heading"
      className={cn("py-12 sm:py-16 border-t border-border/60", className)}
    >
      {/* 1. Header & Section Title (No fake count metrics) */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2
          id="comments-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
        >
          {t("title")}
        </h2>
      </div>

      {/* 2. Community Discussion Policy Note */}
      <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mb-6 leading-relaxed">
        {t("guidelines")}
      </p>

      {/* 3. Localized Integration Status Notice */}
      <div
        role="note"
        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground mb-8"
      >
        <LuInfo className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <span className="leading-relaxed">{t("integrationNotice")}</span>
      </div>

      {/* 4. Structural Comment Prompt (Frontend Only — Non-persistent) */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <div
            aria-hidden="true"
            className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border/60 shrink-0"
          >
            <LuMessageSquare className="h-4 w-4" />
          </div>
          <span>{t("placeholder")}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <Link
            href="/sign-in"
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            {t("signIn")}
          </Link>
          <Link
            href="/sign-up"
            className="px-3 py-1.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors border border-border/60"
          >
            {t("signUp")}
          </Link>
        </div>
      </div>

      {/* 5. Structural Empty State (No fake comments or fake commenters) */}
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 py-12 px-6 text-center space-y-2">
        <LuMessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto" />
        <p className="text-sm font-medium text-muted-foreground">
          {t("empty")}
        </p>
      </div>
    </section>
  );
}
