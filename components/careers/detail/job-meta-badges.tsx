import React from "react";
import { Badge } from "@/components/ui/badge";
import { LuMapPin, LuCircleDot } from "react-icons/lu";
import type { JobMetaBadgesProps } from "./job-detail-types";
import { cn } from "@/lib/utils";

export function JobMetaBadges({
  departmentLabel,
  workTypeLabel,
  locationLabel,
  modeLabel,
  deadlineFormatted,
  deadlinePrefix,
  className = "",
}: JobMetaBadgesProps) {
  return (
    <div className={cn("flex items-center flex-wrap gap-2.5 mt-5 sm:mt-6", className)}>
      {/* 1. Department */}
      <Badge variant="secondary" size="md">
        {departmentLabel}
      </Badge>

      {/* 2. Work Type */}
      <Badge variant="outline" size="md">
        {workTypeLabel}
      </Badge>

      {/* 3. Location */}
      <span className="inline-flex items-center gap-1.5 border border-border text-foreground px-2.5 py-1 text-xs rounded-md font-medium select-none bg-background">
        <LuMapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
        <span>{locationLabel}</span>
      </span>

      {/* 4. Mode */}
      <span className="inline-flex items-center border border-rose-200 dark:border-rose-900/60 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 px-2.5 py-1 text-xs rounded-md font-medium select-none">
        {modeLabel}
      </span>

      {/* 5. Application Deadline */}
      <span className="inline-flex items-center gap-1.5 border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 px-2.5 py-1 text-xs rounded-md font-medium select-none">
        <LuCircleDot className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
        <span>{deadlinePrefix}{deadlineFormatted}</span>
      </span>
    </div>
  );
}
