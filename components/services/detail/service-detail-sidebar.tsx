import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LuArrowRight } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { ServiceDetailSidebarProps } from "./service-detail-types";

export function ServiceDetailSidebar({
  onThisPageLabel,
  overviewLabel,
  capabilitiesLabel,
  relatedProjectsLabel,
  serviceTitle,
  serviceDescription,
  ctaLabel,
  relatedTechnologiesLabel,
  technologies,
  className = "",
}: ServiceDetailSidebarProps) {
  return (
    <aside
      className={cn("lg:sticky lg:top-24 w-full", className)}
      aria-label={onThisPageLabel}
    >
      <Card className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs space-y-6 text-start">
        {/* A. ON THIS PAGE Anchor Navigation */}
        <nav aria-label={onThisPageLabel} className="space-y-3">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            {onThisPageLabel}
          </span>
          <ul className="space-y-2 list-none p-0 m-0">
            <li>
              <a
                href="#overview"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
              >
                {overviewLabel}
              </a>
            </li>
            <li>
              <a
                href="#capabilities"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
              >
                {capabilitiesLabel}
              </a>
            </li>
            <li>
              <a
                href="#related-projects"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
              >
                {relatedProjectsLabel}
              </a>
            </li>
          </ul>
        </nav>

        {/* B. Separator */}
        <div className="border-t border-border/60" role="separator" />

        {/* C. Service Summary */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-foreground">
            {serviceTitle}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {serviceDescription}
          </p>
        </div>

        {/* D. Primary CTA Button */}
        <div>
          <Link href="/contact" className="block w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-full justify-between px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs group cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <LuArrowRight
                className="h-4 w-4 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
          </Link>
        </div>

        {/* E. Separator */}
        <div className="border-t border-border/60" role="separator" />

        {/* F. RELATED TECHNOLOGIES Chips */}
        <div className="space-y-3">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            {relatedTechnologiesLabel}
          </span>
          <div className="flex flex-wrap gap-2" aria-label={relatedTechnologiesLabel}>
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-foreground border border-border/50"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-blue-500"
                  aria-hidden="true"
                />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </aside>
  );
}
