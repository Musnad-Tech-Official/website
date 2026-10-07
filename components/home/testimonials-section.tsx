import { useLocale, useTranslations } from "next-intl";
import { LuQuote } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { TestimonialItem } from "@/lib/testimonials/types";
import { cn } from "@/lib/utils";

export interface TestimonialsSectionProps {
  className?: string;
  testimonials?: TestimonialItem[];
}

export function TestimonialsSection({
  className = "",
  testimonials,
}: TestimonialsSectionProps) {
  const t = useTranslations("Home.testimonials");
  const locale = useLocale();
  const isRtl = locale === "ar";

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Base list of dynamic items
  const baseItems = testimonials;

  // Prepare full-width duplicated card sets for seamless infinite tracks
  const row1Base = [...baseItems, ...baseItems];
  const row2Base =
    baseItems.length > 3
      ? [...baseItems.slice(3), ...baseItems.slice(0, 3), ...baseItems]
      : [...baseItems, ...baseItems];

  const renderCard = (
    item: TestimonialItem,
    keyPrefix: string,
    idx: number
  ) => {
    const quote = isRtl ? item.quoteAr || item.quoteEn : item.quoteEn || item.quoteAr;
    const author = isRtl ? item.authorNameAr || item.authorNameEn : item.authorNameEn || item.authorNameAr;
    const role = isRtl ? item.roleAr || item.roleEn : item.roleEn || item.roleAr;
    const initial = item.initial || author.charAt(0).toUpperCase();
    const avatarUrl = item.avatarUrl;

    return (
      <Card
        key={`${keyPrefix}-${item.id}-${idx}`}
        dir={isRtl ? "rtl" : "ltr"}
        variant="default"
        className={cn(
          "w-80 sm:w-96 lg:w-105 shrink-0",
          "relative flex flex-col justify-between",
          "p-6 sm:p-7 rounded-2xl",
          "border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-xs",
          "shadow-xs hover:border-primary/40 hover:shadow-lg dark:hover:shadow-primary/5 hover:-translate-y-1",
          "transition-all duration-300 select-none cursor-default"
        )}
      >
        <div>
          {/* Freestanding large quote icon */}
          <div className="flex items-center justify-start mb-3 sm:mb-4">
            <LuQuote
              className="h-10 w-10 sm:h-11 sm:w-11 text-primary/30 dark:text-primary/35 rtl:-scale-x-100 shrink-0 select-none"
              aria-hidden="true"
            />
          </div>

          {/* Testimonial Quote Statement */}
          <blockquote className="m-0 text-sm sm:text-base text-foreground/90 dark:text-foreground/90 leading-relaxed font-normal">
            {isRtl ? `«${quote}»` : `“${quote}”`}
          </blockquote>
        </div>

        {/* Author Metadata with Avatar */}
        <div className="mt-6 pt-5 border-t border-border/60 flex items-center gap-3.5">
          <Avatar
            src={avatarUrl}
            alt={author}
            fallback={initial}
            size="md"
            shape="circle"
            className="rounded-full border border-primary/20 bg-primary/10 text-primary font-bold shrink-0"
          />
          <div className="flex flex-col text-start min-w-0">
            <span className="text-sm font-bold text-foreground tracking-tight truncate">
              {author}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5 truncate">
              {role}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className={cn(
        "relative w-full py-16 sm:py-20 lg:py-28 overflow-hidden",
        "bg-background/90 dark:bg-background/40 transition-colors",
        className
      )}
    >
      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 text-center">
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary mb-2">
            {t("eyebrow")}
          </span>
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground"
          >
            {t("heading")}
          </h2>
        </div>
      </div>

      {/* Infinite Carousels Container with Edge Fade Mask */}
      <div className="relative w-full flex flex-col gap-6 sm:gap-8 overflow-hidden">
        {/* Left & Right Gradient Shadows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 sm:w-32 bg-linear-to-r rtl:bg-linear-to-l from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 sm:w-32 bg-linear-to-l rtl:bg-linear-to-r from-background to-transparent"
        />

        {/* Track 1: Normal Direction */}
        <div className="group flex w-max gap-6 sm:gap-8 animate-marquee-ltr rtl:animate-marquee-rtl hover:[animation-play-state:paused]">
          {row1Base.map((item, idx) => renderCard(item, "r1", idx))}
        </div>

        {/* Track 2: Reverse Direction */}
        <div className="group flex w-max gap-6 sm:gap-8 animate-marquee-rtl rtl:animate-marquee-ltr hover:[animation-play-state:paused]">
          {row2Base.map((item, idx) => renderCard(item, "r2", idx))}
        </div>
      </div>
    </section>
  );
}
