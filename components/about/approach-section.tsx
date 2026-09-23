import { useTranslations } from "next-intl";
import { APPROACH_STEPS } from "./about-data";
import type { ApproachSectionProps } from "./about-types";
import { cn } from "@/lib/utils";

export function ApproachSection({ className = "" }: ApproachSectionProps) {
  const t = useTranslations("About.approach");

  return (
    <section
      aria-labelledby="approach-heading"
      className={cn("w-full text-start", className)}
    >
      {/* Header */}
      <div>
        <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 select-none">
          {t("eyebrow")}
        </span>
        <h2
          id="approach-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground"
        >
          {t("title")}
        </h2>
        <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Semantic 4-step vertical process */}
      <ol className="mt-10 sm:mt-12 space-y-8 sm:space-y-10 list-none p-0 m-0">
        {APPROACH_STEPS.map((step) => {
          const title = t(`steps.${step.id}.title`);
          const description = t(`steps.${step.id}.description`);

          return (
            <li key={step.id} className="flex items-start gap-4 sm:gap-6">
              {/* Numbered marker */}
              <div
                className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-mono font-bold text-xs sm:text-sm select-none"
                aria-hidden="true"
              >
                {step.stepNumber}
              </div>

              {/* Step content */}
              <div className="flex flex-col text-start pt-1 sm:pt-1.5">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
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
