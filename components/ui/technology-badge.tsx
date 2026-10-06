import React from "react";
import { findTechItem } from "@/components/hero/tech-data";
import { TechIcon } from "@/components/hero/tech-icon";
import { cn } from "@/lib/utils";

export interface TechnologyBadgeProps {
  name: string;
  className?: string;
  size?: "sm" | "md";
}

export function TechnologyBadge({
  name,
  className = "",
  size = "md",
}: TechnologyBadgeProps) {
  const item = findTechItem(name);

  return (
    <div
      dir="ltr"
      className={cn(
        "relative inline-flex items-center select-none cursor-default",
        size === "sm"
          ? "gap-2 pl-1.5 pr-3 py-1 rounded-full text-xs font-semibold"
          : "gap-3 pl-2.5 pr-4.5 py-2 sm:pl-3 sm:pr-5 sm:py-2.5 rounded-full text-sm sm:text-[15px] font-semibold",
        "bg-card text-card-foreground dark:bg-[#131418] dark:text-neutral-100 border border-border/75 dark:border-white/10",
        "shadow-xs dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-md dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.7)]",
        "hover:border-primary/40 dark:hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 group",
        className
      )}
    >
      <TechIcon id={item.id} className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      <span className="tracking-tight whitespace-nowrap text-foreground group-hover:text-primary transition-colors">
        {item.name}
      </span>
    </div>
  );
}

export default TechnologyBadge;
