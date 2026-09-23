import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import type { TeamCtaProps } from "./team-types";
import { cn } from "@/lib/utils";

/**
 * TeamCta renders the bottom inquiry and hiring callout section:
 * - Hiring badge pill
 * - Bold display headline
 * - Clear project inquiry subtitle
 * - Dual action buttons (Careers + Start Project)
 */
export function TeamCta({
  eyebrow,
  title,
  subtitle,
  careersLabel,
  startProjectLabel,
  careersHref = "/careers",
  contactHref = "/contact",
  className = "",
}: TeamCtaProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-12 lg:p-16 text-center my-12 sm:my-16 lg:my-20 shadow-xs",
        className
      )}
    >
      {/* Subtle ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Hiring Status Pill */}
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-medium text-foreground mb-6 shadow-xs select-none">
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
              aria-hidden="true"
            />
            <span>{eyebrow}</span>
          </div>
        )}

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground max-w-2xl mx-auto mb-4 sm:mb-5">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <Link href={careersHref}>
            <Button
              variant="primary"
              size="lg"
              className="rounded-full px-6 sm:px-8 font-semibold shadow-xs gap-2 group cursor-pointer"
            >
              <span>{careersLabel}</span>
              <FaArrowRight className="h-3 w-3 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Button>
          </Link>

          <Link href={contactHref}>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 sm:px-8 font-medium cursor-pointer"
            >
              {startProjectLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
