"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuMail, LuArrowUpRight, LuInfo } from "react-icons/lu";
import type { ArticleSidebarNewsletterProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleSidebarNewsletter({
  className = "",
}: ArticleSidebarNewsletterProps) {
  const t = useTranslations("ArticleDetail.sidebar");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-3.5",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase select-none pb-2 border-b border-border/40">
        <LuMail className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{t("newsletterTitle")}</span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {t("newsletterDescription")}
      </p>

      {/* Integration Notice */}
      <div
        role="note"
        className="flex items-start gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/60 text-[11px] text-muted-foreground"
      >
        <LuInfo className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
        <span className="leading-snug">{t("newsletterNotice")}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletterPlaceholder")}
          leftIcon={<LuMail className="h-3.5 w-3.5" aria-hidden="true" />}
          disabled
          aria-disabled="true"
          aria-label={t("newsletterPlaceholder")}
          className="h-9 text-xs rounded-xl bg-muted/40 cursor-not-allowed opacity-75"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled
          aria-disabled="true"
          className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 cursor-not-allowed opacity-60"
        >
          <span>{t("subscribe")}</span>
          <LuArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
        </Button>

        <p className="text-[11px] text-muted-foreground/80 leading-normal">
          {t("privacyNotice")}
        </p>
      </form>
    </div>
  );
}
