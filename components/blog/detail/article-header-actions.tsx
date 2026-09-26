"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LuCheck, LuCopy, LuShare2 } from "react-icons/lu";

interface ArticleHeaderActionsProps {
  title: string;
  className?: string;
}

export function ArticleHeaderActions({
  title,
  className = "",
}: ArticleHeaderActionsProps) {
  const t = useTranslations("ArticleDetail.actions");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Copy Link Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        aria-label={copied ? t("copied") : t("copyLink")}
        className="rounded-xl gap-1.5 text-xs font-medium"
      >
        {copied ? (
          <>
            <LuCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="text-primary font-semibold">{t("copied")}</span>
          </>
        ) : (
          <>
            <LuCopy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{t("copyLink")}</span>
          </>
        )}
      </Button>

      {/* Share Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShare}
        aria-label={t("share")}
        className="rounded-xl p-2 text-xs"
      >
        <LuShare2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      </Button>
    </div>
  );
}
