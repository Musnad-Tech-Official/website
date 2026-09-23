import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAPABILITY_CARDS } from "./home-data";
import { cn } from "@/lib/utils";

export interface CapabilitiesSectionProps {
  className?: string;
}

export function CapabilitiesSection({ className = "" }: CapabilitiesSectionProps) {
  const t = useTranslations("Home.capabilities");

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className={cn("w-full py-16 sm:py-20 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="max-w-2xl text-start">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("eyebrow")}
            </span>
            <h2
              id="capabilities-heading"
              className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            >
              {t("heading")}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/services"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md py-1"
            >
              <span>{t("viewAll")}</span>
              <LuArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* 6 Capabilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITY_CARDS.map((card) => {
            const Icon = card.icon;
            const title = t(`services.${card.serviceKey}.title`);
            const description = t(`services.${card.serviceKey}.description`);
            const tag1 = t(`services.${card.serviceKey}.tag1`);
            const tag2 = t(`services.${card.serviceKey}.tag2`);
            const tag3 = t(`services.${card.serviceKey}.tag3`);
            const tags = [tag1, tag2, tag3];

            return (
              <Card
                key={card.id}
                variant="interactive"
                className="group relative flex flex-col justify-between p-6 sm:p-7"
              >
                <div>
                  {/* Icon */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/40 text-primary mb-5 group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Capability skills">
                    {tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        size="sm"
                        className="font-normal text-[11px] text-muted-foreground/90 bg-muted/60 hover:bg-muted"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Learn More Action */}
                <div className="mt-6 pt-4 border-t border-border/40">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/80 group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
                  >
                    <span>{t("learnMore")}</span>
                    <LuArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
