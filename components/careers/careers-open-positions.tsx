"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { LuCircleDot, LuChevronDown } from "react-icons/lu";
import type { JobDepartment } from "@/data/careers";
import type { CareersOpenPositionsProps } from "./careers-types";
import { CareerPositionCard } from "./career-position-card";
import { cn } from "@/lib/utils";

export function CareersOpenPositions({
  positions,
  locale,
  className = "",
}: CareersOpenPositionsProps) {
  const t = useTranslations("Careers.positions");
  const [selectedDepartment, setSelectedDepartment] = useState<JobDepartment>("all");

  const filteredPositions = positions.filter((pos) => {
    if (selectedDepartment === "all") return true;
    return pos.department === selectedDepartment;
  });

  return (
    <section
      id="open-positions"
      aria-labelledby="open-positions-heading"
      className={cn("py-12 sm:py-16 border-t border-border/60", className)}
    >
      {/* Section Heading */}
      <div className="max-w-3xl mb-8 sm:mb-10 text-start">
        <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 select-none">
          {t("eyebrow")}
        </span>
        <h2
          id="open-positions-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif rtl:font-sans text-foreground leading-[1.15] mb-4"
        >
          {t("title")}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative inline-flex items-center">
          <div className="flex items-center gap-2 h-10 px-3.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:border-border/80 transition-colors shadow-2xs">
            <LuCircleDot className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value as JobDepartment)}
              className="bg-transparent text-sm font-medium text-foreground focus:outline-none cursor-pointer pe-6 appearance-none"
              aria-label={t("filterPlaceholder")}
            >
              <option value="all" className="bg-popover text-popover-foreground">
                {t("departments.all")}
              </option>
              <option value="engineering" className="bg-popover text-popover-foreground">
                {t("departments.engineering")}
              </option>
              <option value="ai" className="bg-popover text-popover-foreground">
                {t("departments.ai")}
              </option>
              <option value="design" className="bg-popover text-popover-foreground">
                {t("departments.design")}
              </option>
            </select>
            <LuChevronDown
              className="h-4 w-4 text-muted-foreground pointer-events-none absolute inset-e-3"
              aria-hidden="true"
            />
          </div>
        </div>

        <span className="text-xs sm:text-sm text-muted-foreground font-medium select-none">
          {t("positionsCount", { count: filteredPositions.length })}
        </span>
      </div>

      {/* Position Cards Stack */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {filteredPositions.length > 0 ? (
          filteredPositions.map((pos) => (
            <CareerPositionCard
              key={pos.id}
              position={pos}
              locale={locale}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20">
            <p className="text-sm text-muted-foreground">
              {t("noPositions")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
