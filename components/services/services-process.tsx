import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { HOW_WE_WORK_STEPS } from "./services-data";
import type { ServicesProcessProps } from "./services-types";
import { cn } from "@/lib/utils";

export function ServicesProcess({ className = "" }: ServicesProcessProps) {
  const t = useTranslations("Services.process");

  return (
    <section
      aria-labelledby="how-we-work-heading"
      className={cn("w-full py-16 sm:py-20 lg:py-24 border-t border-border/60", className)}
    >
      {/* Section Header */}
      <div className="max-w-2xl text-start mb-12 sm:mb-14">
        <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 select-none">
          {t("eyebrow")}
        </span>
        <h2
          id="how-we-work-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]"
        >
          {t("heading")}
        </h2>
        <p className="mt-3.5 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* 4 Steps Grid: 4 cols Desktop, 2 cols Tablet, 1 col Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {HOW_WE_WORK_STEPS.map((step) => {
          const number = t(`steps.${step.stepKey}.number`);
          const title = t(`steps.${step.stepKey}.title`);
          const description = t(`steps.${step.stepKey}.description`);

          return (
            <Card
              key={step.id}
              className="flex flex-col justify-start p-6 sm:p-7 border border-border/80 bg-card rounded-2xl shadow-2xs"
            >
              {/* Number Badge */}
              <div
                aria-hidden="true"
                className="inline-flex items-center justify-center px-2.5 py-1 rounded-md border border-border/80 bg-muted/50 text-xs font-mono font-bold text-foreground mb-5 self-start select-none"
              >
                <span>{number}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight mb-2.5">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
