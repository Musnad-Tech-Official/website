import { useTranslations } from "next-intl";
import { MILESTONES } from "./about-data";
import type { MilestonesSectionProps } from "./about-types";
import { cn } from "@/lib/utils";

/**
 * MilestonesSection
 *
 * NOTE: The milestone records displayed here represent layout mock fixtures
 * derived from reference mockup `02-about.png`. They reflect known company projects
 * (Sahim, Naft, Rakeen) mapped to a chronological UI progression and are classified
 * as frontend mock content pending verified corporate documentation.
 */
export function MilestonesSection({ className = "" }: MilestonesSectionProps) {
  const t = useTranslations("About.milestones");

  return (
    <section
      aria-labelledby="milestones-heading"
      className={cn("w-full text-start", className)}
    >
      <h2
        id="milestones-heading"
        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-10 sm:mb-12 lg:mb-16"
      >
        {t("title")}
      </h2>

      {/* Desktop Horizontal Timeline */}
      <div className="relative hidden lg:block">
        {/* Continuous horizontal connecting rule across the dots */}
        <div
          aria-hidden="true"
          className="absolute top-[5px] start-0 end-0 h-px bg-border"
        />

        <ol className="grid grid-cols-5 gap-8 xl:gap-10 relative z-10 list-none p-0 m-0">
          {MILESTONES.map((item) => {
            const year = t(`items.${item.id}.year`);
            const title = t(`items.${item.id}.title`);
            const description = t(`items.${item.id}.description`);

            return (
              <li key={item.id} className="flex flex-col text-start">
                {/* Timeline Dot */}
                <div className="mb-6 flex items-center select-none">
                  <div
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full bg-foreground ring-4 ring-background"
                  />
                </div>

                {/* Year */}
                <span className="text-2xl xl:text-3xl font-black tracking-tight text-foreground font-mono">
                  {year}
                </span>

                {/* Milestone Title */}
                <h3 className="mt-2 text-base font-bold tracking-tight text-foreground">
                  {title}
                </h3>

                {/* Milestone Description */}
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile & Tablet Vertical Timeline (Clean stacked, zero horizontal scrolling) */}
      <ol className="lg:hidden space-y-6 sm:space-y-8 list-none p-0 m-0">
        {MILESTONES.map((item, index) => {
          const isLast = index === MILESTONES.length - 1;
          const year = t(`items.${item.id}.year`);
          const title = t(`items.${item.id}.title`);
          const description = t(`items.${item.id}.description`);

          return (
            <li key={item.id} className="flex gap-4 sm:gap-6">
              {/* Vertical connector line & dot */}
              <div className="flex flex-col items-center select-none">
                <div
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full bg-foreground ring-4 ring-background shrink-0 mt-1.5"
                />
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="w-px flex-1 bg-border my-2"
                  />
                )}
              </div>

              {/* Milestone Details */}
              <div className="flex flex-col text-start pb-4">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
                  {year}
                </span>
                <h3 className="mt-1 text-base font-bold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-lg">
                  {description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
