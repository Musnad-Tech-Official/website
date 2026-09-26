import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { LuCircleDot, LuMapPin, LuArrowRight, LuPlus } from "react-icons/lu";
import { getJobPositionBySlug } from "@/data/careers";
import type { OtherOpenPositionsProps } from "./job-detail-types";
import { cn } from "@/lib/utils";

export function OtherOpenPositions({
  otherPositionsSlugs,
  className = "",
}: OtherOpenPositionsProps) {
  const tJobDetail = useTranslations("JobDetail");
  const tPositions = useTranslations("Careers.positions");
  const tOther = useTranslations("JobDetail.common.otherPositions");

  const positions = otherPositionsSlugs
    .map((slug) => getJobPositionBySlug(slug))
    .filter(Boolean);

  return (
    <section
      aria-labelledby="other-open-positions-heading"
      className={cn("py-12 sm:py-16 border-t border-border/60", className)}
    >
      <div className="text-start mb-8 sm:mb-10">
        <h2
          id="other-open-positions-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif rtl:font-sans text-foreground"
        >
          {tOther("heading")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {positions.map((pos) => {
          if (!pos) return null;
          const jobTitle = tJobDetail(`${pos.translationKey}.title`);

          return (
            <div
              key={pos.id}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs hover:border-border hover:shadow-md transition-all group flex flex-col justify-between text-start"
            >
              <div>
                {/* Top Badge and Action Icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="secondary" size="sm">
                    {tPositions(`departments.${pos.department}`)}
                  </Badge>
                  <div className="h-7 w-7 rounded-full border border-border/80 bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors shrink-0">
                    <LuPlus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
                  </div>
                </div>

                {/* Job Title */}
                <h3 className="text-xl sm:text-2xl font-bold font-serif rtl:font-sans text-foreground group-hover:text-primary transition-colors mb-3">
                  <Link
                    href={pos.href}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    {jobTitle}
                  </Link>
                </h3>
              </div>

              {/* Sub-meta */}
              <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border/40 mt-3">
                <span className="inline-flex items-center gap-1.5">
                  <LuCircleDot className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
                  <span>{tPositions(`workTypes.${pos.workTypeKey}`)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <LuMapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
                  <span>{tPositions(`locations.${pos.locationKey}`)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return to All Positions Link */}
      <div className="mt-8 sm:mt-10 text-start">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm py-1"
        >
          <span>{tOther("viewAll")}</span>
          <LuArrowRight
            className="h-4 w-4 rtl:rotate-180 transition-transform duration-200 hover:translate-x-0.5 rtl:hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
