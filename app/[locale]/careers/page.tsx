import { getPageMetadata } from "@/lib/seo/page-metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  CareersIntro,
  CareersValues,
  CareersOpenPositions,
  CareersFinalCta,
} from "@/components/careers";
import { PageGuard } from "@/lib/page-control/guard";
import { getCareerJobsAction, getCareerValuesAction } from "@/lib/careers/actions";
import type { CareerValueItem, JobPositionSummary } from "@/data/careers";

interface CareersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CareersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });

  return getPageMetadata({
    locale,
    path: "/careers",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function CareersPage({ params }: CareersPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });

  const [dbJobs, dbValues] = await Promise.all([
    getCareerJobsAction(false),
    getCareerValuesAction(false),
  ]);

  const positions: JobPositionSummary[] = dbJobs.map((j) => ({
    id: j.id,
    slug: j.slug,
    translationKey: (j.slug === "senior-backend-engineer"
      ? "seniorBackendEngineer"
      : j.slug === "machine-learning-engineer"
      ? "machineLearningEngineer"
      : "designEngineer") as "seniorBackendEngineer" | "machineLearningEngineer" | "designEngineer",
    department: j.department,
    workTypeKey: "fullTime",
    locationKey: "riyadhRemote",
    mode: j.workMode,
    dateEn: j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active",
    dateAr: j.createdAt ? new Date(j.createdAt).toLocaleDateString("ar-SA", { month: "short", day: "numeric", year: "numeric" }) : "متاح",
    href: `/careers/${j.slug}`,
  }));

  const careerValues: CareerValueItem[] = dbValues.map((v) => ({
    id: v.id,
    iconType: (v.id === "senior"
      ? "senior"
      : v.id === "bilingual"
      ? "bilingual"
      : v.id === "openSource"
      ? "openSource"
      : "remote") as "senior" | "bilingual" | "openSource" | "remote",
    translationKey: (v.id === "senior"
      ? "seniorByDefault"
      : v.id === "bilingual"
      ? "bilingualFirst"
      : v.id === "openSource"
      ? "openSourceFriendly"
      : "remoteFriendly") as "seniorByDefault" | "bilingualFirst" | "openSourceFriendly" | "remoteFriendly",
  }));

  return (
    <PageGuard slug="careers" locale={locale}>
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
          items={careerValues}
        />

        {/* 3. Open Positions with Filter */}
        <CareersOpenPositions
          positions={positions}
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
    </PageGuard>
  );
}
