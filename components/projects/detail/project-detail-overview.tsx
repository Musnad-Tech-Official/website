import React from "react";
import { Card } from "@/components/ui/card";
import type { ProjectDetailOverviewProps } from "./project-detail-types";
import { cn } from "@/lib/utils";

export function ProjectDetailOverview({
  title,
  paragraphs,
  metrics,
  className = "",
}: ProjectDetailOverviewProps) {
  const hasMetrics = metrics && metrics.length > 0;

  return (
    <section
      aria-labelledby="detail-overview-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Narrative */}
        <div
          className={cn(
            "space-y-4 sm:space-y-6",
            hasMetrics ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl"
          )}
        >
          <h2
            id="detail-overview-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          >
            {title}
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Right Column: Key Metrics Stack (if present) */}
        {hasMetrics && (
          <div className="lg:col-span-5 flex flex-col gap-4">
            {metrics.map((metric) => (
              <Card
                key={metric.id}
                variant="default"
                className="p-5 sm:p-6 border border-border/70 bg-card hover:border-primary/40 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    {metric.value}
                  </span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground mt-2">
                  {metric.label}
                </h3>
                {metric.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
