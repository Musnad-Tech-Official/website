import React from "react";
import { FaCode, FaGlobe, FaLayerGroup } from "react-icons/fa6";
import type { TeamCultureProps } from "./team-types";
import { cn } from "@/lib/utils";

/**
 * TeamCulture renders the engineering ethos and studio highlights section:
 * - Left: Culture narrative on craftsmanship, code quality, and bilingual foundation
 * - Right: 3 structural highlight cards (Capabilities, Bilingual Standards, Architecture)
 */
export function TeamCulture({
  eyebrow,
  title,
  p1,
  p2,
  stats,
  className = "",
}: TeamCultureProps) {
  const statIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    capabilities: FaCode,
    bilingual: FaGlobe,
    architecture: FaLayerGroup,
  };

  const topStats = stats.slice(0, 2);
  const bottomStat = stats[2];
  const BottomIcon = bottomStat ? statIcons[bottomStat.iconType] || FaLayerGroup : FaLayerGroup;

  return (
    <section
      className={cn(
        "py-16 sm:py-20 lg:py-24 border-t border-border/80",
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Narrative Story */}
        <div className="lg:col-span-7 flex flex-col text-start">
          {eyebrow && (
            <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 select-none">
              {eyebrow}
            </span>
          )}

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight mb-6">
            {title}
          </h2>

          {p1 && (
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-5">
              {p1}
            </p>
          )}

          {p2 && (
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {p2}
            </p>
          )}
        </div>

        {/* Right Column: Stat Highlights Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 w-full">
          {/* Top 2 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {topStats.map((stat) => {
              const Icon = statIcons[stat.iconType] || FaCode;
              return (
                <div
                  key={stat.id}
                  className="rounded-2xl border border-border/80 bg-card text-card-foreground p-5 sm:p-6 shadow-xs flex flex-col justify-between text-start"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-snug">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Architecture & Focus Card */}
          {bottomStat && (
            <div className="rounded-2xl border border-border/80 bg-card text-card-foreground p-5 sm:p-6 shadow-xs flex flex-col text-start">
              <div className="flex items-center justify-between mb-3">
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                >
                  <BottomIcon className="h-4 w-4" />
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {bottomStat.value}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 leading-relaxed">
                {bottomStat.label}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
