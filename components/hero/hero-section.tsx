"use client";

import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { TechCloud } from "./tech-cloud";
import { SendIcon } from "./send-icon";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = "" }: HeroSectionProps) {
  const t = useTranslations("Hero");
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      aria-label="Hero"
      className={cn(
        "relative overflow-hidden w-full bg-background pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle, CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-start">
            <h1 className="tracking-tight text-foreground">
              {/* Brand statement (grand, bold, commanding scale) */}
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight">
                {t("titlePrefix")}
              </span>
              {/* Scope & services title (balanced slightly smaller scale) */}
              <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground/85 mt-3 sm:mt-4 leading-tight">
                {t("titleSuffix")}
              </span>
            </h1>

            <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              {t("description")}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <Link href="/contact">
                <Button
                  size="xl"
                  className="rounded-full px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-semibold gap-2.5 shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  <span>{t("discussProject")}</span>
                  <SendIcon className="w-5 h-5 rtl:rotate-180 transition-transform" />
                </Button>
              </Link>

              <a
                href="https://github.com/Musnad-Tech-Official"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="secondary"
                  size="xl"
                  className="rounded-full px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-semibold border border-border/80 shadow-xs hover:bg-muted active:scale-[0.98] transition-all"
                >
                  {t("github")}
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column: Floating Tech Cloud */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center items-center w-full">
            <TechCloud heroRef={heroRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
