import { useTranslations } from "next-intl";
import { ALL_TECH_ITEMS } from "@/components/hero/tech-data";
import { TechIcon } from "@/components/hero/tech-icon";
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

        {/* Technology Badges Container matching Hero visual style */}
        <div
          className="mt-10 sm:mt-12 flex flex-wrap items-center gap-3 sm:gap-3.5"
          aria-label="Technologies list"
        >
          {ALL_TECH_ITEMS.map((tech) => (
            <div
              key={tech.id}
              dir="ltr"
              className={cn(
                "relative inline-flex items-center gap-3 pl-2.5 pr-4.5 py-2 sm:pl-3 sm:pr-5 sm:py-2.5 rounded-full select-none cursor-default",
                "bg-card text-card-foreground dark:bg-[#131418] dark:text-neutral-100 border border-border/75 dark:border-white/10",
                "shadow-xs dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-md dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.7)]",
                "hover:border-primary/40 dark:hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 group"
              )}
            >
              <TechIcon id={tech.id} className="w-4 h-4" />
              <span className="text-sm sm:text-[15px] font-semibold tracking-tight whitespace-nowrap text-foreground group-hover:text-primary transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
