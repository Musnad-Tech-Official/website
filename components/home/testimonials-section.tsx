import { useLocale, useTranslations } from "next-intl";
import { LuQuote } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { TESTIMONIALS } from "./home-data";
import { cn } from "@/lib/utils";

export interface TestimonialsSectionProps {
  className?: string;
}

export function TestimonialsSection({ className = "" }: TestimonialsSectionProps) {
  const t = useTranslations("Home.testimonials");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Prepare full-width duplicated card sets for each track
  // Row 1 starts with Ahmed, Reem, Faisal, Tariq, Mona, Khalid
  const row1Base = [...TESTIMONIALS, ...TESTIMONIALS];
  // Row 2 starts with Tariq, Mona, Khalid, Ahmed, Reem, Faisal for visual variety
  const row2Base = [
    TESTIMONIALS[3],
    TESTIMONIALS[4],
    TESTIMONIALS[5],
    TESTIMONIALS[0],
    TESTIMONIALS[1],
    TESTIMONIALS[2],
    TESTIMONIALS[3],
    TESTIMONIALS[4],
    TESTIMONIALS[5],
    TESTIMONIALS[0],
    TESTIMONIALS[1],
    TESTIMONIALS[2],
  ];

  const renderCard = (
    item: (typeof TESTIMONIALS)[number],
    keyPrefix: string,
    idx: number
  ) => {
    const quote = t(`items.${item.itemKey}.quote`);
    const author = t(`items.${item.itemKey}.author`);
    const role = t(`items.${item.itemKey}.role`);

    return (
      <Card
        key={`${keyPrefix}-${item.id}-${idx}`}
        dir={isRtl ? "rtl" : "ltr"}
        variant="default"
        className={cn(
          "w-77.5 sm:w-95 lg:w-105 shrink-0",
          "relative flex flex-col justify-between",
          "p-6 sm:p-7 rounded-2xl",
          "border border-border/80 bg-card",
          "hover:border-primary/40 hover:shadow-lg dark:hover:shadow-primary/5 hover:-translate-y-1",
          "transition-all duration-300 select-none cursor-default"
        )}
      >
        <div>
          {/* Prominent Brand Quote Icon */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <LuQuote
              className="h-8 w-8 sm:h-9 sm:w-9 text-primary fill-primary/15 rtl:-scale-x-100 shrink-0"
              aria-hidden="true"
            />
          </div>

          {/* Testimonial Quote Statement */}
          <blockquote className="m-0 text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
            {isRtl ? `«${quote}»` : `“${quote}”`}
          </blockquote>
        </div>

        {/* Author Metadata with Design System Avatar */}
        <div className="mt-6 pt-5 border-t border-border/60 flex items-center gap-3.5">
          <Avatar
            fallback={item.initial}
            size="md"
            className="border border-border/80 bg-muted/60 text-foreground font-bold shrink-0"
          />
          <div className="flex flex-col text-start min-w-0">
            <span className="text-sm font-semibold text-foreground tracking-tight truncate">
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
        "w-full pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 border-t border-border/40 overflow-hidden relative",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        {/* Section Header */}
        <div className="max-w-2xl text-start">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("eyebrow")}
          </span>
          <h2
            id="testimonials-heading"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
          >
            {t("heading")}
          </h2>
        </div>
      </div>

      {/* Marquee Container with dual-edge fade masks & soft fog blur */}
      <div className="relative w-full overflow-hidden flex flex-col gap-6 py-2 mask-[linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)] sm:mask-[linear-gradient(to_right,transparent,black_128px,black_calc(100%-128px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)] sm:[-webkit-mask-image:linear-gradient(to_right,transparent,black_128px,black_calc(100%-128px),transparent)]">
        {/* Soft edge blur layers for subtle fog effect */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-10 backdrop-blur-[2px] mask-[linear-gradient(to_right,black,transparent)] [-webkit-mask-image:linear-gradient(to_right,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-10 backdrop-blur-[2px] mask-[linear-gradient(to_left,black,transparent)] [-webkit-mask-image:linear-gradient(to_left,black,transparent)]"
          aria-hidden="true"
        />

        {/* Row 1: Continuous horizontal marquee from right to left */}
        <div
          dir="ltr"
          className="group/row flex overflow-hidden w-full select-none gap-(--marquee-gap,1.5rem) [--marquee-gap:1.5rem]"
        >
          {/* Track 1 */}
          <div className="flex shrink-0 items-stretch gap-(--marquee-gap,1.5rem) animate-marquee-left group-hover/row:[animation-play-state:paused]">
            {row1Base.map((item, idx) => renderCard(item, "r1-t1", idx))}
          </div>
          {/* Track 2 (Clone for infinite seamless loop) */}
          <div
            aria-hidden="true"
            className="flex shrink-0 items-stretch gap-(--marquee-gap,1.5rem) animate-marquee-left group-hover/row:[animation-play-state:paused]"
          >
            {row1Base.map((item, idx) => renderCard(item, "r1-t2", idx))}
          </div>
        </div>

        {/* Row 2: Continuous horizontal marquee from left to right */}
        <div
          dir="ltr"
          className="group/row flex overflow-hidden w-full select-none gap-(--marquee-gap,1.5rem) [--marquee-gap:1.5rem]"
        >
          {/* Track 1 */}
          <div className="flex shrink-0 items-stretch gap-(--marquee-gap,1.5rem) animate-marquee-right group-hover/row:[animation-play-state:paused]">
            {row2Base.map((item, idx) => renderCard(item, "r2-t1", idx))}
          </div>
          {/* Track 2 (Clone for infinite seamless loop) */}
          <div
            aria-hidden="true"
            className="flex shrink-0 items-stretch gap-(--marquee-gap,1.5rem) animate-marquee-right group-hover/row:[animation-play-state:paused]"
          >
            {row2Base.map((item, idx) => renderCard(item, "r2-t2", idx))}
          </div>
        </div>
      </div>
    </section>
  );
}
