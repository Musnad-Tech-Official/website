"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { LuArrowUpRight, LuSparkles } from "react-icons/lu";
import { cn } from "@/lib/utils";

export interface ArticleCareersCalloutProps {
  category?: string;
  className?: string;
}

/**
 * ArticleCareersCallout renders an authentic developer-focused hiring prompt,
 * a signature practice of premier tech companies (Stripe, Cloudflare, Linear).
 */
export function ArticleCareersCallout({
  category,
  className = "",
}: ArticleCareersCalloutProps) {
  const t = useTranslations("ArticleDetail.careers");

  return (
    <aside
      aria-label="Engineering careers"
      className={cn(
        "my-10 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-7 relative overflow-hidden shadow-xs",
        className
      )}
    >
      {/* Background ambient crimson highlight */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
              <LuSparkles className="h-3 w-3" aria-hidden="true" />
              <span>{t("badge")}</span>
            </span>
            {category && (
              <span className="text-xs text-muted-foreground font-medium">
                · {category}
              </span>
            )}
          </div>
          <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {t("title")}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <Link href="/careers" className="shrink-0">
          <Button
            variant="primary"
            size="md"
            className="rounded-xl px-5 font-semibold gap-2 shadow-xs group"
          >
            <span>{t("button")}</span>
            <LuArrowUpRight className="h-4 w-4 rtl:-scale-x-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </aside>
  );
}
