import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";
import type { CareersFinalCtaProps } from "./careers-types";
import { cn } from "@/lib/utils";

export function CareersFinalCta({
  badge,
  title,
  subtitle,
  primaryActionLabel,
  secondaryActionLabel,
  className = "",
}: CareersFinalCtaProps) {
  return (
    <section
      aria-labelledby="careers-final-cta-heading"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-card via-card to-muted/20 p-8 sm:p-12 lg:p-16 my-12 sm:my-16 lg:my-20 text-center shadow-xs",
        className
      )}
    >
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10"
      />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-medium text-foreground shadow-2xs mb-6 select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>{badge}</span>
        </div>

        {/* Heading */}
        <h2
          id="careers-final-cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif rtl:font-sans text-foreground mb-4 sm:mb-5 leading-[1.15]"
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl">
          {subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <Link href="/contact" className="inline-block">
            <Button
              size="lg"
              className="rounded-full px-6 sm:px-8 font-semibold shadow-xs gap-2 group cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              <span>{primaryActionLabel}</span>
              <LuPlus className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
            </Button>
          </Link>

          <Link href="/about" className="inline-block">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 sm:px-8 font-medium shadow-xs hover:bg-muted transition-colors cursor-pointer"
            >
              <span>{secondaryActionLabel}</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
