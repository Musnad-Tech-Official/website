import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { JobMetaBadges } from "./job-meta-badges";
import type { JobDetailIntroProps } from "./job-detail-types";
import { cn } from "@/lib/utils";

export function JobDetailIntro({
  homeLabel,
  careersLabel,
  breadcrumbLabel,
  jobTitle,
  eyebrow,
  subtitle,
  departmentLabel,
  workTypeLabel,
  locationLabel,
  modeLabel,
  deadlineFormatted,
  deadlinePrefix,
  className = "",
}: JobDetailIntroProps) {
  return (
    <div className={cn("pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 border-b border-border/60", className)}>
      <PageHeader
        breadcrumbs={[
          { label: homeLabel, href: "/" },
          { label: careersLabel, href: "/careers" },
          { label: jobTitle },
        ]}
        breadcrumbLabel={breadcrumbLabel || careersLabel}
        eyebrow={eyebrow}
        title={
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-serif rtl:font-sans text-foreground leading-[1.1] mb-4 sm:mb-5">
            {jobTitle}
          </h1>
        }
        subtitle={
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        }
        className="pb-0"
      >
        <JobMetaBadges
          departmentLabel={departmentLabel}
          workTypeLabel={workTypeLabel}
          locationLabel={locationLabel}
          modeLabel={modeLabel}
          deadlineFormatted={deadlineFormatted}
          deadlinePrefix={deadlinePrefix}
        />
      </PageHeader>
    </div>
  );
}
