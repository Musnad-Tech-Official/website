import React from "react";
import type { ServiceOverviewProps } from "./service-detail-types";
import { cn } from "@/lib/utils";

export function ServiceOverview({ statement, className = "" }: ServiceOverviewProps) {
  return (
    <section id="overview" className={cn("scroll-mt-24", className)} aria-label="Service Overview">
      <p className="text-xl sm:text-2xl lg:text-[1.75rem] font-normal text-foreground leading-relaxed sm:leading-relaxed lg:leading-[1.45] text-start">
        {statement}
      </p>
    </section>
  );
}
