import { useTranslations } from "next-intl";
import { TRUST_METRICS } from "./home-data";
import { cn } from "@/lib/utils";

export interface TrustMetricsProps {
  className?: string;
}

export function TrustMetrics({ className = "" }: TrustMetricsProps) {
  const t = useTranslations("Home.trustMetrics");

  return (
    <div
      aria-label="Trust principles"
      className={cn("w-full pb-16 sm:pb-20 lg:pb-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pt-10 sm:pt-14 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_METRICS.map((metric) => {
            const Icon = metric.icon;
            const title = t(`${metric.metricKey}.title`);
            const description = t(`${metric.metricKey}.description`);

            return (
              <div key={metric.id} className="flex flex-col text-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-muted/40 text-foreground mb-3.5">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
