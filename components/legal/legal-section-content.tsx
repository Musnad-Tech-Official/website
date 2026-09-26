import React from "react";
import type { LegalSectionContentProps } from "./legal-types";
import { cn } from "@/lib/utils";

export function LegalSectionContent({
  section,
  className = "",
}: LegalSectionContentProps) {
  return (
    <article
      id={section.id}
      aria-labelledby={`heading-${section.id}`}
      className={cn("scroll-mt-28 space-y-4", className)}
    >
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden="true"
          className="text-xs sm:text-sm font-mono text-muted-foreground/70 font-semibold select-none"
        >
          {section.number}
        </span>
        <h2
          id={`heading-${section.id}`}
          className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground rtl:font-sans leading-snug"
        >
          {section.title}
        </h2>
      </div>

      {section.paragraphs && section.paragraphs.length > 0 && (
        <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {section.paragraphs.map((p, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      )}

      {section.bullets && section.bullets.length > 0 && (
        <ul className="space-y-2.5 list-disc list-outside ms-5 text-sm sm:text-base text-muted-foreground leading-relaxed marker:text-muted-foreground/60">
          {section.bullets.map((bullet, idx) => (
            <li key={idx} className="leading-relaxed">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
