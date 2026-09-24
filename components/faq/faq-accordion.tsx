"use client";

import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import type { FaqAccordionProps } from "./faq-types";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
  groupId,
  className = "",
}: FaqAccordionProps) {
  // Set of open item IDs for accessible disclosure
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs divide-y divide-border/60 transition-colors",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const triggerId = `faq-trigger-${groupId}-${item.id}`;
        const contentId = `faq-content-${groupId}-${item.id}`;

        return (
          <div key={item.id} className="transition-colors">
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-start font-medium text-foreground hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset transition-colors cursor-pointer select-none group"
              >
                <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full border border-border bg-muted/40 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/40 transition-all duration-200",
                    isOpen && "rotate-45 bg-foreground text-background border-transparent group-hover:text-background"
                  )}
                >
                  <LuPlus className="h-4 w-4 transition-transform duration-200" />
                </span>
              </button>
            </h3>
            <div
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn(
                "px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-muted-foreground text-sm sm:text-base leading-relaxed animate-in fade-in-50 duration-200",
                !isOpen && "hidden"
              )}
            >
              <p className="max-w-3xl whitespace-pre-line">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
