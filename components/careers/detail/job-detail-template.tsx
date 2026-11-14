import React from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getJobDetailConfig } from "./job-detail-data";
import { JobDetailIntro } from "./job-detail-intro";
import { JobResponsibilities } from "./job-responsibilities";
import { JobRequirements } from "./job-requirements";
import { JobApplicationForm } from "./job-application-form";
import { OtherOpenPositions } from "./other-open-positions";
import { getCareerJobBySlugAction, getCareerJobsAction } from "@/lib/careers/actions";
import type { JobDetailTemplateProps } from "./job-detail-types";
import { localizedUrl } from "@/lib/seo/config";
import { breadcrumbsJsonLd, organizationJsonLd, serializeJsonLd } from "@/lib/seo/structured-data";

export async function JobDetailTemplate({
  slug,
  locale,
}: JobDetailTemplateProps) {
  const config = getJobDetailConfig(slug);
  if (!config) notFound();
  const [job, openJobs] = await Promise.all([
    getCareerJobBySlugAction(slug),
    getCareerJobsAction(false),
  ]);
  if (!job) notFound();

  const t = await getTranslations({ locale, namespace: "JobDetail" });
  const tPositions = await getTranslations({ locale, namespace: "Careers.positions" });

  const isRtl = locale === "ar";
  const jobTitle = isRtl ? job.titleAr : job.titleEn;
  const subtitle = isRtl ? job.descriptionAr : job.descriptionEn;
  const responsibilities = isRtl ? job.responsibilitiesAr : job.responsibilitiesEn;
  const requirements = isRtl ? job.requirementsAr : job.requirementsEn;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org",
        "@graph": [
          organizationJsonLd(),
          breadcrumbsJsonLd([
            { name: t("common.breadcrumb.home"), url: localizedUrl(locale, "/") },
            { name: t("common.breadcrumb.careers"), url: localizedUrl(locale, "/careers") },
            { name: jobTitle, url: localizedUrl(locale, `/careers/${slug}`) },
          ]),
        ],
      }) }} />
      {/* 1. Header with Breadcrumb and Meta Badges */}
      <JobDetailIntro
        homeLabel={t("common.breadcrumb.home")}
        careersLabel={t("common.breadcrumb.careers")}
        breadcrumbLabel={t("common.breadcrumb.label")}
        jobTitle={jobTitle}
        eyebrow={t("common.eyebrow")}
        subtitle={subtitle}
        departmentLabel={tPositions(`departments.${job.department}`)}
        workTypeLabel={isRtl ? job.workTypeAr : job.workTypeEn}
        locationLabel={isRtl ? job.locationAr : job.locationEn}
        modeLabel={tPositions(`modes.${job.workMode}`)}
        deadlineFormatted=""
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
        positions={openJobs.filter((item) => item.slug !== slug)}
        locale={locale}
      />
    </div>
  );
}
