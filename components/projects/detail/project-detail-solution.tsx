import React from "react";
import { Card } from "@/components/ui/card";
import {
  LuZap,
  LuShieldCheck,
  LuRefreshCw,
  LuScale,
  LuSparkles,
} from "react-icons/lu";
import type { ProjectDetailSolutionProps } from "./project-detail-types";
import { cn } from "@/lib/utils";

function renderFeatureIcon(iconType: string) {
  const iconProps = { className: "h-5 w-5 text-primary shrink-0" };
  switch (iconType) {
    case "speed":
      return <LuZap {...iconProps} />;
    case "shield":
      return <LuShieldCheck {...iconProps} />;
    case "refresh":
      return <LuRefreshCw {...iconProps} />;
    case "scale":
    default:
      return <LuScale {...iconProps} />;
  }
}

export function ProjectDetailSolution({
  title,
  description,
  features,
  highlight,
  className = "",
}: ProjectDetailSolutionProps) {
  return (
    <section
      aria-labelledby="detail-solution-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      <h2
        id="detail-solution-heading"
        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
      >
        {title}
      </h2>

      <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
        {description}
      </p>

      {/* 2x2 Key Features Grid */}
      {features && features.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-10">
          {features.map((feature) => (
            <Card
              key={feature.id}
              variant="default"
              className="p-5 sm:p-6 border border-border/70 bg-card hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                  {renderFeatureIcon(feature.iconType)}
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Highlight Box: Musnad Tech Contribution */}
      {highlight && (
        <div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl border border-primary/25 bg-primary/[0.03] dark:bg-primary/[0.06] relative overflow-hidden">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              <LuSparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                <span>{highlight.title}</span>
              </h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {highlight.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
