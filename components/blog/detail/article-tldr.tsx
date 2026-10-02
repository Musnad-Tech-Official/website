"use client";

import React from "react";
import { LuZap, LuCircleCheck } from "react-icons/lu";
import { cn } from "@/lib/utils";

export interface ArticleTldrProps {
  title?: string;
  items: string[];
  className?: string;
}

/**
 * ArticleTldr renders a structured "Key Takeaways" / TL;DR executive callout,
 * answering developer intent immediately before the deep technical dive.
 */
export function ArticleTldr({
  title = "Key Takeaways",
  items,
  className = "",
}: ArticleTldrProps) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={cn(
        "my-8 rounded-2xl border border-primary/25 bg-primary/[0.03] dark:bg-primary/[0.06] p-5 sm:p-6 shadow-xs relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-primary select-none">
        <LuZap className="h-4 w-4" aria-hidden="true" />
        <span>{title}</span>
      </div>

      <ul className="space-y-2.5 m-0 p-0 list-none">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/90 leading-relaxed">
            <LuCircleCheck className="h-4 w-4 text-primary shrink-0 mt-1 rtl:-scale-x-100" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
