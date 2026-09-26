"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { LuArrowUp } from "react-icons/lu";
import type { ArticleBackToTopProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleBackToTop({
  label,
  className = "",
}: ArticleBackToTopProps) {
  const t = useTranslations("ArticleDetail");

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn("py-8 text-center", className)}>
      <button
        type="button"
        onClick={scrollToTop}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border/60 transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <LuArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{label || t("backToTop")}</span>
      </button>
    </div>
  );
}
