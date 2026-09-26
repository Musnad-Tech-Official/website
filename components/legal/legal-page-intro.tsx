import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { LuInfo } from "react-icons/lu";
import type { LegalPageIntroProps } from "./legal-types";
import { cn } from "@/lib/utils";

export function LegalPageIntro({
  breadcrumbHome,
  breadcrumbLegal,
  breadcrumbCurrent,
  breadcrumbLabel,
  eyebrow,
  title,
  lastUpdatedLabel,
  lastUpdatedDate,
  introNote,
  className = "",
}: LegalPageIntroProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <PageHeader
        breadcrumbs={[
          { label: breadcrumbHome, href: "/" },
          { label: breadcrumbLegal },
          { label: breadcrumbCurrent },
        ]}
        breadcrumbLabel={breadcrumbLabel}
        eyebrow={eyebrow}
        title={
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-2 sm:mb-3 rtl:font-sans">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal">
              {lastUpdatedLabel}: {lastUpdatedDate}
            </p>
          </div>
        }
        className="pt-4 sm:pt-6 lg:pt-8 pb-2"
      />

      {/* Intro note callout box */}
      <div className="border border-border/80 rounded-2xl bg-muted/40 p-4 sm:p-5 flex items-start sm:items-center gap-3.5 transition-colors">
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-background text-muted-foreground border border-border/60 shrink-0"
        >
          <LuInfo className="w-4 h-4" />
        </span>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {introNote}
        </p>
      </div>
    </div>
  );
}
