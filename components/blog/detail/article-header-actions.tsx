"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  LuCheck,
  LuCopy,
  LuShare2,
  LuExternalLink,
} from "react-icons/lu";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegram,
  FaFacebookF,
} from "react-icons/fa6";

interface ArticleHeaderActionsProps {
  title: string;
  className?: string;
}

export function ArticleHeaderActions({
  title,
  className = "",
}: ArticleHeaderActionsProps) {
  const t = useTranslations("ArticleDetail.actions");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [copied, setCopied] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const handleCopyLink = async () => {
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

  // Close share menu on click outside or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsShareMenuOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsShareMenuOpen(false);
      }
    }

    if (isShareMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isShareMenuOpen]);

  const shareOptions = [
    {
      id: "whatsapp",
      name: isRtl ? "واتساب" : "WhatsApp",
      icon: <FaWhatsapp className="w-4 h-4 text-[#25D366]" />,
      action: () => {
        const text = encodeURIComponent(`${title}\n${getUrl()}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "x",
      name: "X (Twitter)",
      icon: <FaXTwitter className="w-4 h-4 text-foreground" />,
      action: () => {
        const url = encodeURIComponent(getUrl());
        const text = encodeURIComponent(`${title} — Musnad Tech`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <FaLinkedinIn className="w-4 h-4 text-[#0077b5]" />,
      action: () => {
        const url = encodeURIComponent(getUrl());
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "telegram",
      name: isRtl ? "تيليجرام" : "Telegram",
      icon: <FaTelegram className="w-4 h-4 text-[#229ED9]" />,
      action: () => {
        const url = encodeURIComponent(getUrl());
        const text = encodeURIComponent(title);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <FaFacebookF className="w-4 h-4 text-[#1877F2]" />,
      action: () => {
        const url = encodeURIComponent(getUrl());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
      },
    },
  ];

  const handleNativeShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: getUrl(),
        });
        setIsShareMenuOpen(false);
      } catch {
        // User cancelled
      }
    }
  };

  const hasNativeShare = typeof window !== "undefined" && typeof navigator !== "undefined" && Boolean(navigator.share);

  return (
    <div className={`relative flex items-center gap-2 ${className}`} ref={menuRef}>
      {/* Copy Link Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        aria-label={copied ? t("copied") : t("copyLink")}
        className="rounded-xl gap-1.5 text-xs font-medium cursor-pointer"
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

      {/* Share Button (triggers real share menu) */}
      <div className="relative">
        <Button
          type="button"
          variant={isShareMenuOpen ? "secondary" : "outline"}
          size="sm"
          onClick={() => setIsShareMenuOpen((prev) => !prev)}
          aria-label={t("share")}
          aria-expanded={isShareMenuOpen}
          className="rounded-xl p-2 text-xs cursor-pointer gap-1.5"
        >
          <LuShare2 className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
          <span className="hidden sm:inline font-medium">{t("share")}</span>
        </Button>

        {/* Real Share Dropdown Menu */}
        {isShareMenuOpen && (
          <div
            className={`absolute end-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-1.5 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150 ${
              isRtl ? "text-end" : "text-start"
            }`}
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground border-b border-border/40 select-none">
              {isRtl ? "مشاركة المقال عبر" : "Share this article"}
            </div>

            <div className="py-1 space-y-0.5">
              {shareOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    opt.action();
                    setIsShareMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <span className="shrink-0">{opt.icon}</span>
                  <span className="flex-1">{opt.name}</span>
                </button>
              ))}

              <div className="h-px bg-border/40 my-1" />

              {/* Copy URL option */}
              <button
                type="button"
                onClick={() => {
                  handleCopyLink();
                  setIsShareMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {copied ? (
                  <LuCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <LuCopy className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className="flex-1">
                  {copied ? (isRtl ? "تم نسخ الرابط!" : "Link Copied!") : (isRtl ? "نسخ رابط المقال" : "Copy Article Link")}
                </span>
              </button>

              {/* Native device share if supported */}
              {hasNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <LuExternalLink className="w-4 h-4 shrink-0" />
                  <span className="flex-1">
                    {isRtl ? "خيارات المشاركة الإضافية..." : "More options..."}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
