import React from "react";
import type { ServiceCapabilitiesProps } from "./service-detail-types";
import { cn } from "@/lib/utils";
import { LuCircleCheck } from "react-icons/lu";

export function ServiceCapabilities({
  eyebrow,
  heading,
  capabilities,
  className = "",
}: ServiceCapabilitiesProps) {
  return (
    <section
      id="capabilities"
      className={cn("scroll-mt-24 space-y-6 pt-2 text-start", className)}
      aria-labelledby="capabilities-heading"
    >
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
          {eyebrow}
        </span>
        <h2
          id="capabilities-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground"
        >
          {heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1">
        {capabilities.map((item) => {
          const Icon = item.icon || LuCircleCheck;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3.5 px-5 py-3.5 rounded-full border border-border/80 bg-card hover:bg-muted/40 transition-colors shadow-2xs group"
            >
              <div
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:text-primary transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium text-foreground tracking-tight">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
