"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { LuCopy, LuCheck, LuShare2 } from "react-icons/lu";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegram,
  FaFacebookF,
} from "react-icons/fa6";
import type { ArticleSidebarShareProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleSidebarShare({
  title,
  slug,
  className = "",
}: ArticleSidebarShareProps) {
  const t = useTranslations("ArticleDetail.sidebar");
  const locale = useLocale();
  const isRtl = locale === "ar";
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

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${getUrl()}`);
    if (typeof window !== "undefined") {
      window.open(
        `https://api.whatsapp.com/send?text=${text}`,
        "_blank",
        "noopener,noreferrer"
      );
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

  const handleShareTelegram = () => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title);
    if (typeof window !== "undefined") {
      window.open(
        `https://t.me/share/url?url=${url}&text=${text}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(getUrl());
    if (typeof window !== "undefined") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-3",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase select-none pb-2 border-b border-border/40">
        <LuShare2 className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{t("shareTitle")}</span>
      </div>

      <div className="space-y-2">
        {/* Copy Link Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label={copied ? t("citationCopied") : t("copyCitation")}
          className="w-full justify-center rounded-xl text-xs font-medium gap-2"
        >
          {copied ? (
            <>
              <LuCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span className="text-primary font-semibold">{t("citationCopied")}</span>
            </>
          ) : (
            <>
              <LuCopy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span>{isRtl ? "نسخ رابط المقال" : "Copy Link"}</span>
            </>
          )}
        </Button>

        {/* Share on WhatsApp */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareWhatsApp}
          className="w-full justify-center rounded-xl text-xs font-medium gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-colors"
        >
          <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
          <span>{isRtl ? "مشاركة عبر واتساب" : "WhatsApp"}</span>
        </Button>

        {/* Share on X */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareX}
          className="w-full justify-center rounded-xl text-xs font-medium gap-2"
        >
          <FaXTwitter className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t("shareOnX")}</span>
        </Button>

        {/* Share on LinkedIn */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareLinkedIn}
          className="w-full justify-center rounded-xl text-xs font-medium gap-2 hover:bg-[#0077b5]/10 hover:border-[#0077b5]/30 transition-colors"
        >
          <FaLinkedinIn className="h-3.5 w-3.5 text-[#0077b5]" aria-hidden="true" />
          <span>{t("shareOnLinkedIn")}</span>
        </Button>

        {/* Share on Telegram */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareTelegram}
          className="w-full justify-center rounded-xl text-xs font-medium gap-2 hover:bg-[#229ED9]/10 hover:border-[#229ED9]/30 transition-colors"
        >
          <FaTelegram className="h-3.5 w-3.5 text-[#229ED9]" aria-hidden="true" />
          <span>{isRtl ? "تيليجرام" : "Telegram"}</span>
        </Button>

        {/* Share on Facebook */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareFacebook}
          className="w-full justify-center rounded-xl text-xs font-medium gap-2 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-colors"
        >
          <FaFacebookF className="h-3.5 w-3.5 text-[#1877F2]" aria-hidden="true" />
          <span>{isRtl ? "فيسبوك" : "Facebook"}</span>
        </Button>
      </div>
    </div>
  );
}
