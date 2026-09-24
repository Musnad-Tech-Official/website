"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { LuArrowLeft, LuSearch, LuCompass } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { NotFoundHeroProps } from "./not-found-types";

/**
 * Centered Hero section for the 404 Not Found page.
 *
 * Visual hierarchy:
 * 1. Subtle decorative circular marker above the number
 * 2. Grand editorial serif "404"
 * 3. Authoritative H1 "Page not found"
 * 4. Reassuring contextual subtitle
 * 5. High-contrast "Back to home" primary action + "Search for a page" discovery action
 *
 * Interactive Enhancement:
 * Listens for ⌘K / Ctrl+K keyboard shortcut to safely trigger page search discovery.
 */
export function NotFoundHero({ className = "" }: NotFoundHeroProps) {
  const t = useTranslations("NotFoundPage");
  const router = useRouter();

  // Wire keyboard shortcut (⌘K / Ctrl+K) to route safely to the search/discovery destination
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        router.push("/projects");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <section
      aria-labelledby="not-found-heading"
      className={cn("w-full flex flex-col items-center text-center", className)}
    >
      {/* Decorative circular marker above the number */}
      <div
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/80 bg-card/60 backdrop-blur-xs text-muted-foreground shadow-xs mb-3 sm:mb-4 select-none"
        aria-hidden="true"
      >
        <LuCompass className="w-5 h-5 text-muted-foreground/80" />
      </div>

      {/* Large 404 display number */}
      <div className="relative select-none leading-none">
        <span
          className="font-serif text-[100px] sm:text-[145px] md:text-[180px] lg:text-[210px] font-normal leading-none tracking-tight text-foreground/90 dark:text-foreground"
          aria-hidden="true"
        >
          {t("code")}
        </span>
      </div>

      {/* Primary heading */}
      <h1
        id="not-found-heading"
        className="mt-2 sm:mt-4 font-serif rtl:font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
      >
        {t("title")}
      </h1>

      {/* Supporting subtitle */}
      <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed text-balance">
        {t("description")}
      </p>

      {/* Primary Recovery Actions */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Primary Action: Back to Home */}
        <Link
          href="/"
          className={cn(
            "w-full sm:w-auto inline-flex items-center justify-center select-none cursor-pointer",
            "h-11 sm:h-12 px-6 rounded-xl font-medium text-sm sm:text-base gap-2.5",
            "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]",
            "shadow-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <LuArrowLeft
            className="w-4 h-4 rtl:rotate-180 shrink-0 transition-transform"
            aria-hidden="true"
          />
          <span>{t("backHome")}</span>
        </Link>

        {/* Secondary Action: Search for a Page */}
        <Link
          href="/projects"
          className={cn(
            "w-full sm:w-auto inline-flex items-center justify-center select-none cursor-pointer",
            "h-11 sm:h-12 px-5 rounded-xl font-medium text-sm sm:text-base gap-2.5",
            "bg-card hover:bg-secondary/70 text-foreground border border-border/80 active:scale-[0.98]",
            "shadow-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          title={t("searchForPage")}
        >
          <LuSearch
            className="w-4 h-4 text-muted-foreground shrink-0"
            aria-hidden="true"
          />
          <span>{t("searchForPage")}</span>
          <kbd className="inline-flex items-center justify-center text-[10px] sm:text-[11px] font-mono font-medium tracking-tight text-muted-foreground/80 bg-secondary/80 px-1.5 py-0.5 rounded border border-border/60 select-none ms-1">
            {t("keyboardHint")}
          </kbd>
        </Link>
      </div>
    </section>
  );
}
