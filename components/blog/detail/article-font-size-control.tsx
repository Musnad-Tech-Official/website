"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { LuType } from "react-icons/lu";
import type { ArticleFontSizeControlProps, ArticleFontSize } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleFontSizeControl({
  fontSize,
  onFontSizeChange,
  className = "",
}: ArticleFontSizeControlProps) {
  const t = useTranslations("ArticleDetail.sidebar");

  const sizes: { value: ArticleFontSize; label: string; ariaLabel: string }[] = [
    { value: "sm", label: "A-", ariaLabel: t("fontSizeSmall") },
    { value: "base", label: "A", ariaLabel: t("fontSizeDefault") },
    { value: "lg", label: "A+", ariaLabel: t("fontSizeLarge") },
  ];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-4 shadow-2xs space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between text-xs font-bold tracking-wider text-muted-foreground uppercase select-none">
        <div className="flex items-center gap-1.5">
          <LuType className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>{t("fontSize")}</span>
        </div>

        <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border/60">
          {sizes.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onFontSizeChange(s.value)}
              aria-label={s.ariaLabel}
              aria-pressed={fontSize === s.value}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                fontSize === s.value
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
