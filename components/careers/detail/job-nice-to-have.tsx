import React from "react";
import { LuCircleDot } from "react-icons/lu";
import type { JobNiceToHaveProps } from "./job-detail-types";
import { cn } from "@/lib/utils";

export function JobNiceToHave({
  heading,
  items,
  className = "",
}: JobNiceToHaveProps) {
  return (
    <section
      aria-labelledby="job-nice-to-have-heading"
      className={cn(
        "rounded-2xl border border-dashed border-border/90 bg-muted/20 dark:bg-muted/10 p-6 sm:p-7 mt-10 sm:mt-12 text-start",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4 text-primary font-bold text-base sm:text-lg font-serif rtl:font-sans">
        <LuCircleDot className="h-4 w-4 shrink-0" aria-hidden="true" />
        <h3 id="job-nice-to-have-heading" className="text-foreground font-semibold">
          {heading}
        </h3>
      </div>
      <ul className="space-y-3 list-none p-0 m-0">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="p-0.5 mt-0.5 shrink-0 text-primary" aria-hidden="true">
              <LuCircleDot className="h-4 w-4" />
            </span>
            <span className="text-sm sm:text-base text-foreground/85 leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
