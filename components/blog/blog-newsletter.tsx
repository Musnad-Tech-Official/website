"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuMail, LuArrowUpRight, LuInfo } from "react-icons/lu";
import type { BlogNewsletterProps } from "./blog-types";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * ARCHITECTURAL & INTEGRATION NOTE:
 * There is currently no backend newsletter service connected.
 * In accordance with frontend persistence guidelines, submitting an email
 * does NOT claim persistence or display a fabricated success state.
 * The subscribe action remains disabled until real email integration is wired.
 * ============================================================================
 */
export function BlogNewsletter({ className = "" }: BlogNewsletterProps) {
  const t = useTranslations("Blog.newsletter");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No-op for frontend-only phase: no fake persistence, no fake success state
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

        {/* Informational Integration Notice */}
        <div
          role="note"
          className="mt-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground"
        >
          <LuInfo className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span className="leading-relaxed">{t("integrationNotice")}</span>
        </div>

        {/* Form Structure */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                leftIcon={<LuMail className="h-4 w-4" aria-hidden="true" />}
                disabled
                aria-disabled="true"
                aria-label={t("emailPlaceholder")}
                className="h-11 bg-background text-sm rounded-xl opacity-75 cursor-not-allowed"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled
              aria-disabled="true"
              className="h-11 rounded-xl px-6 font-semibold gap-2 shrink-0 opacity-60 cursor-not-allowed"
            >
              <span>{t("subscribeButton")}</span>
              <LuArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {t("privacyNotice")}
          </p>
        </form>
      </div>
    </section>
  );
}
