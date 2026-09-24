import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { LuCircleDot, LuMapPin, LuArrowRight, LuCalendar } from "react-icons/lu";
import type { CareerPositionCardProps } from "./careers-types";
import { cn } from "@/lib/utils";

export function CareerPositionCard({
  position,
  locale,
  className = "",
}: CareerPositionCardProps) {
  const tPositions = useTranslations("Careers.positions");
  const tJobDetail = useTranslations("JobDetail");

  const isRtl = locale === "ar";
  const dateFormatted = isRtl ? position.dateAr : position.dateEn;
  const jobTitle = tJobDetail(`${position.translationKey}.title`);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:border-border hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center md:justify-between gap-5",
        className
      )}
    >
      <div className="flex-1 text-start">
        {/* Top Badges */}
        <div className="flex items-center flex-wrap gap-2 mb-2.5">
          <Badge variant="secondary" size="sm">
            {tPositions(`departments.${position.department}`)}
          </Badge>
          <span className="inline-flex items-center border border-rose-200 dark:border-rose-900/60 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 px-2 py-0.5 text-[11px] rounded-md font-medium select-none">
            {tPositions(`modes.${position.mode}`)}
          </span>
          <span className="inline-flex items-center gap-1.5 border border-border text-muted-foreground px-2 py-0.5 text-[11px] rounded-md font-medium select-none">
            <LuCalendar className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{dateFormatted}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold font-serif rtl:font-sans text-foreground group-hover:text-primary transition-colors mb-3">
          <Link
            href={position.href}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {jobTitle}
          </Link>
        </h3>

        {/* Bottom Sub-Meta */}
        <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <LuCircleDot className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
            <span>{tPositions(`workTypes.${position.workTypeKey}`)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LuMapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
            <span>{tPositions(`locations.${position.locationKey}`)}</span>
          </span>
        </div>
      </div>

      {/* Right / End Apply CTA */}
      <div className="shrink-0 flex items-center pt-2 md:pt-0 border-t border-border/40 md:border-t-0">
        <Link
          href={position.href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md py-1"
        >
          <span>{tPositions("applyCta")}</span>
          <LuArrowRight
            className="h-4 w-4 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
