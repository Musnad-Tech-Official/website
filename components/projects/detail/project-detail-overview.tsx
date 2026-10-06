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
      className={cn("py-12 sm:py-16 border-b border-border/50", className)}
    >
      {/* 1. Highlight Metrics Grid (Linear / Stripe Outcome-Driven Focus) */}
      {hasMetrics && (
        <div className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {metrics.map((metric, idx) => (
              <Card
                key={metric.id || idx}
                variant="default"
                className="relative overflow-hidden p-6 sm:p-7 border border-border/70 bg-card/80 backdrop-blur-xs hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Glowing subtle top accent line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-primary/80 via-primary/40 to-transparent" />

                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-3xl sm:text-5xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {metric.value}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-foreground mt-3 tracking-tight">
                      {metric.label}
                    </h3>
                  </div>
                  {metric.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                      {metric.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 2. Executive Overview Narrative */}
      <div className="max-w-4xl">
        <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
          OVERVIEW // CONTEXT
        </span>
        <h2
          id="detail-overview-heading"
          className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2"
        >
          {title}
        </h2>
        <div className="mt-6 space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectDetailOverview;
