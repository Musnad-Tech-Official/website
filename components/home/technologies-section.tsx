import { useTranslations } from "next-intl";
import { TECHNOLOGIES_LIST } from "./home-data";
import { cn } from "@/lib/utils";

export interface TechnologiesSectionProps {
  className?: string;
}

export function TechnologiesSection({ className = "" }: TechnologiesSectionProps) {
  const t = useTranslations("Home.technologies");

  return (
    <section
      id="technologies"
      aria-labelledby="technologies-heading"
      className={cn("w-full py-16 sm:py-20 lg:py-24 border-t border-border/40", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl text-start">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("eyebrow")}
          </span>
          <h2
            id="technologies-heading"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
          >
            {t("heading")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Technology Pills Wrapping Container */}
        <div
          className="mt-8 sm:mt-10 flex flex-wrap items-center gap-2.5 sm:gap-3"
          aria-label="Technologies list"
        >
          {TECHNOLOGIES_LIST.map((tech) => {
            const categoryLabel = t(`categories.${tech.category}`);

            return (
              <div
                key={tech.id}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-card text-xs sm:text-sm font-medium text-foreground hover:border-primary/50 hover:bg-muted/40 transition-colors shadow-2xs select-none cursor-default group"
              >
                <span
                  className={cn("h-2 w-2 rounded-full shrink-0", tech.dotColor)}
                  aria-hidden="true"
                />
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </span>
                <span className="text-muted-foreground/75 font-normal text-xs">
                  · {categoryLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
