import React from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getJobDetailConfig } from "./job-detail-data";
import { JobDetailIntro } from "./job-detail-intro";
import { JobResponsibilities } from "./job-responsibilities";
import { JobRequirements } from "./job-requirements";
import { JobNiceToHave } from "./job-nice-to-have";
import { JobApplicationForm } from "./job-application-form";
import { OtherOpenPositions } from "./other-open-positions";
import type { JobDetailTemplateProps } from "./job-detail-types";

export async function JobDetailTemplate({
  slug,
  locale,
}: JobDetailTemplateProps) {
  const config = getJobDetailConfig(slug);
  if (!config) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "JobDetail" });
  const tPositions = await getTranslations({ locale, namespace: "Careers.positions" });

  const isRtl = locale === "ar";
  const deadlineFormatted = isRtl ? config.deadlineAr : config.deadlineEn;
  const jobTitle = t(`${config.translationKey}.title`);
  const subtitle = t(`${config.translationKey}.subtitle`);
  const responsibilities = t.raw(`${config.translationKey}.responsibilities`) as string[];
  const requirements = t.raw(`${config.translationKey}.requirements`) as string[];
  const niceToHave = t.raw(`${config.translationKey}.niceToHave`) as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Header with Breadcrumb and Meta Badges */}
      <JobDetailIntro
        homeLabel={t("common.breadcrumb.home")}
        careersLabel={t("common.breadcrumb.careers")}
        breadcrumbLabel={t("common.breadcrumb.label")}
        jobTitle={jobTitle}
        eyebrow={t("common.eyebrow")}
        subtitle={subtitle}
        departmentLabel={tPositions(`departments.${config.department}`)}
        workTypeLabel={tPositions(`workTypes.${config.workTypeKey}`)}
        locationLabel={tPositions(`locations.${config.locationKey}`)}
        modeLabel={tPositions(`modes.${config.mode}`)}
        deadlineFormatted={deadlineFormatted}
        deadlinePrefix={t("common.deadlinePrefix")}
      />

      {/* 2. Main 2-Column Section (Content + Sticky Application Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 py-10 sm:py-14">
        {/* Left Column: Responsibilities, Requirements, Nice to have */}
        <div className="lg:col-span-7">
          <JobResponsibilities
            heading={t("common.responsibilitiesHeading")}
            items={responsibilities}
          />
          <JobRequirements
            heading={t("common.requirementsHeading")}
            items={requirements}
          />
          <JobNiceToHave
            heading={t("common.niceToHaveHeading")}
            items={niceToHave}
          />
        </div>

        {/* Right Column: Sticky Application Form */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <JobApplicationForm
              cvRequired={config.cvRequired}
            />
          </div>
        </div>
      </div>

      {/* 3. Other Open Positions Section */}
      <OtherOpenPositions
        otherPositionsSlugs={config.otherPositionsSlugs}
      />
    </div>
  );
}
