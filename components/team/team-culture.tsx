"use client";

import React from "react";
import { useLocale } from "next-intl";
import { HiRocketLaunch, HiLanguage, HiSparkles } from "react-icons/hi2";
import { DraggableCultureCard } from "./draggable-culture-card";
import type { TeamCultureProps } from "./team-types";
import { cn } from "@/lib/utils";

export function TeamCulture({
  eyebrow,
  title,
  p1,
  p2,
  stats,
  className = "",
}: TeamCultureProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Card icons rendered with theme primary brand color
  const statIcons: Record<string, React.ReactNode> = {
    capabilities: <HiRocketLaunch className="w-4.5 h-4.5" />,
    bilingual: <HiLanguage className="w-4.5 h-4.5" />,
    architecture: <HiSparkles className="w-4.5 h-4.5" />,
  };

  // Stack rotation angles for the card deck
  const rotationsLTR = [-2.5, 1.5, 3];
  const rotationsRTL = [2.5, -1.5, -3];

  return (
    <section
      className={cn(
        "py-16 sm:py-20 lg:py-24 border-t border-border/80",
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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

        {/* Right Column: Interactive Draggable Card Deck */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full py-4">
          {stats.map((stat, index) => {
            const icon = statIcons[stat.iconType] || statIcons.capabilities;
            const initialRotation = isRtl
              ? (rotationsRTL[index] ?? 0)
              : (rotationsLTR[index] ?? 0);

            return (
              <DraggableCultureCard
                key={stat.id}
                stat={stat}
                index={index}
                initialRotation={initialRotation}
                icon={icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
