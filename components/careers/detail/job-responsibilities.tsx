import React from "react";
import { LuCircleDot } from "react-icons/lu";
import type { JobResponsibilitiesProps } from "./job-detail-types";
import { cn } from "@/lib/utils";

export function JobResponsibilities({
  heading,
  items,
  className = "",
}: JobResponsibilitiesProps) {
  return (
    <section aria-labelledby="job-responsibilities-heading" className={cn("text-start", className)}>
      <h2
        id="job-responsibilities-heading"
        className="text-2xl sm:text-3xl font-bold font-serif rtl:font-sans text-foreground mb-5"
      >
        {heading}
      </h2>
      <ul className="space-y-3.5 list-none p-0 m-0">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="p-0.5 mt-0.5 shrink-0 text-muted-foreground/70" aria-hidden="true">
              <LuCircleDot className="h-4 w-4" />
            </span>
            <span className="text-base text-foreground/90 leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
