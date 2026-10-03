"use client";

import React, { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuMail, LuArrowUpRight, LuCircleCheck, LuLoader } from "react-icons/lu";
import type { ArticleSidebarNewsletterProps } from "./article-detail-types";
import { subscribeNewsletterAction } from "@/lib/newsletter/actions";
import { cn } from "@/lib/utils";

export function ArticleSidebarNewsletter({
  className = "",
}: ArticleSidebarNewsletterProps) {
  const t = useTranslations("ArticleDetail.sidebar");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setErrorMessage(t("invalidEmail"));
      return;
    }

    startTransition(async () => {
      try {
        const result = await subscribeNewsletterAction(trimmed, locale, "article_sidebar");
        if (result.success) {
          setIsSubscribed(true);
          setEmail("");
        } else {
          setErrorMessage(
            result.error === "invalid_email" ? t("invalidEmail") : t("errorGeneric")
          );
        }
      } catch {
        setErrorMessage(t("errorGeneric"));
      }
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-3.5 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase select-none pb-2 border-b border-border/40">
        <LuMail className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{t("newsletterTitle")}</span>
      </div>

      {isSubscribed ? (
        <div className="py-2 space-y-3 text-center sm:text-start animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20">
            <LuCircleCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              {t("subscribedTitle")}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {t("subscribedDescription")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSubscribed(false);
              setErrorMessage(null);
            }}
            className="text-xs font-medium text-primary hover:underline underline-offset-2 transition-colors cursor-pointer"
          >
            {t("subscribeAnother")}
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("newsletterDescription")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={t("newsletterPlaceholder")}
                leftIcon={<LuMail className="h-3.5 w-3.5" aria-hidden="true" />}
                aria-label={t("newsletterPlaceholder")}
                disabled={isPending}
                className={cn(
                  "h-9 text-xs rounded-xl bg-muted/40 transition-colors",
                  errorMessage && "border-destructive/80 focus-visible:ring-destructive/20"
                )}
              />
              {errorMessage && (
                <p className="mt-1 text-[11px] font-medium text-destructive">
                  {errorMessage}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isPending}
              className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {isPending ? (
                <>
                  <LuLoader className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>{t("subscribing")}</span>
                </>
              ) : (
                <>
                  <span>{t("subscribe")}</span>
                  <LuArrowUpRight
                    className="h-3.5 w-3.5 rtl:-scale-x-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </Button>

            <p className="text-[11px] text-muted-foreground/80 leading-normal">
              {t("privacyNotice")}
            </p>
          </form>
        </>
      )}
    </div>
  );
}
