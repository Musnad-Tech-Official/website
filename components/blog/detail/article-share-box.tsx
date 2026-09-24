"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LuCopy, LuCheck } from "react-icons/lu";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import type { ArticleShareBoxProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleShareBox({
  title,
  slug,
  className = "",
}: ArticleShareBoxProps) {
  const t = useTranslations("ArticleDetail.shareBlock");
  const tActions = useTranslations("ArticleDetail.actions");
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://musnad.tech/blog/${slug}`;
  };

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(getUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleShareX = () => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(`${title} — Musnad Tech`);
    if (typeof window !== "undefined") {
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(getUrl());
    if (typeof window !== "undefined") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <section
      aria-labelledby="share-section-heading"
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-6 sm:p-8 my-10 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6",
        className
      )}
    >
      <div className="space-y-1">
        <h3
          id="share-section-heading"
          className="text-lg font-bold text-foreground"
        >
          {t("title")}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleCopy}
          className="rounded-xl gap-1.5 text-xs font-semibold"
        >
          {copied ? (
            <>
              <LuCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{tActions("copied")}</span>
            </>
          ) : (
            <>
              <LuCopy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{tActions("copyLink")}</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareX}
          aria-label="Share on X"
          className="rounded-xl p-2.5 text-xs"
        >
          <FaXTwitter className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareLinkedIn}
          aria-label="Share on LinkedIn"
          className="rounded-xl p-2.5 text-xs"
        >
          <FaLinkedinIn className="h-3.5 w-3.5 text-[#0077b5]" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
