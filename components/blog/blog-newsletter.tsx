"use client";

import React, { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuMail, LuArrowUpRight, LuCircleCheck, LuLoader } from "react-icons/lu";
import type { BlogNewsletterProps } from "./blog-types";
import { subscribeNewsletterAction } from "@/lib/newsletter/actions";
import { cn } from "@/lib/utils";

export function BlogNewsletter({ className = "" }: BlogNewsletterProps) {
  const t = useTranslations("Blog.newsletter");
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
        const result = await subscribeNewsletterAction(trimmed, locale, "blog_footer");
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
    <section
      aria-labelledby="newsletter-heading"
      className={cn(
        "relative rounded-3xl border border-border/80 bg-linear-to-b from-card/80 to-card/40 p-8 sm:p-12 lg:p-16 my-16 sm:my-20 overflow-hidden shadow-xs",
        className
      )}
    >
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"
      />

      <div className="relative max-w-2xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground select-none">
            {t("eyebrow")}
          </span>
        </div>

        {/* Heading */}
        <h2
          id="newsletter-heading"
          className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.15]"
        >
          {t("title")}
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t("description")}
        </p>

        {isSubscribed ? (
          <div className="mt-8 p-6 rounded-2xl bg-card border border-primary/20 shadow-2xs space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary border border-primary/20">
              <LuCircleCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t("subscribedTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
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
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={t("emailPlaceholder")}
                  leftIcon={<LuMail className="h-4 w-4" aria-hidden="true" />}
                  disabled={isPending}
                  aria-label={t("emailPlaceholder")}
                  className={cn(
                    "h-11 bg-background text-sm rounded-xl transition-colors",
                    errorMessage && "border-destructive/80 focus-visible:ring-destructive/20"
                  )}
                />
                {errorMessage && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errorMessage}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isPending}
                className="h-11 rounded-xl px-6 font-semibold gap-2 shrink-0 shadow-xs transition-all cursor-pointer"
              >
                {isPending ? (
                  <>
                    <LuLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>{t("subscribing")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("subscribeButton")}</span>
                    <LuArrowUpRight
                      className="h-4 w-4 rtl:-scale-x-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </Button>
            </div>

            {/* Privacy note */}
            <p className="text-xs text-muted-foreground/80 leading-normal">
              {t("privacyNotice")}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
