import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { ABOUT_VALUES } from "./about-data";
import type { ValuesSectionProps } from "./about-types";
import { cn } from "@/lib/utils";

export function ValuesSection({ className = "" }: ValuesSectionProps) {
  const t = useTranslations("About.values");

  return (
    <section
      aria-labelledby="values-heading"
      className={cn("w-full text-start", className)}
    >
      {/* Header */}
      <div>
        <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 select-none">
          {t("eyebrow")}
        </span>
        <h2
          id="values-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground"
        >
          {t("title")}
        </h2>
        <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* 4 Cards Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
      <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {ABOUT_VALUES.map((val) => {
          const Icon = val.icon;
          const title = t(`items.${val.id}.title`);
          const description = t(`items.${val.id}.description`);

          return (
            <Card
              key={val.id}
              className="p-6 sm:p-7 flex flex-col justify-start rounded-2xl border-border/80 bg-card shadow-xs transition-all duration-200 hover:border-primary/30"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/60 text-foreground mb-6 select-none"
                aria-hidden="true"
              >
                <Icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
