import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CAREER_VALUES, JOB_POSITIONS } from "@/data/careers";
import {
  CareersIntro,
  CareersValues,
  CareersOpenPositions,
  CareersFinalCta,
} from "@/components/careers";

interface CareersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CareersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CareersPage({ params }: CareersPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Intro & Breadcrumbs */}
      <CareersIntro
        homeLabel={t("breadcrumb.home")}
        careersLabel={t("breadcrumb.careers")}
        breadcrumbLabel={t("breadcrumb.label")}
        eyebrow={t("intro.eyebrow")}
        title={t("intro.title")}
        subtitle={t("intro.subtitle")}
      />

      {/* 2. Why Work With Us Value Cards */}
      <CareersValues
        eyebrow={t("values.eyebrow")}
        title={t("values.title")}
        subtitle={t("values.subtitle")}
        items={CAREER_VALUES}
      />

      {/* 3. Open Positions with Filter */}
      <CareersOpenPositions
        positions={JOB_POSITIONS}
        locale={locale}
      />

      {/* 4. Final CTA Section */}
      <CareersFinalCta
        badge={t("finalCta.badge")}
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryActionLabel={t("finalCta.primaryAction")}
        secondaryActionLabel={t("finalCta.secondaryAction")}
      />
    </div>
  );
}
