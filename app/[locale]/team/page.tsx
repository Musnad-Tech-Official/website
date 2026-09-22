import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getTeamMembers, getTeamStats } from "@/data/team";
import {
  TeamHeader,
  TeamGrid,
  TeamCulture,
  TeamCta,
} from "@/components/team";

interface TeamPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Team" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

/**
 * TeamPage renders Page 03 — Team:
 * - Breadcrumb & Header
 * - 3-column Team Members Grid
 * - Culture narrative & Stat highlight cards
 * - Project inquiry & Hiring CTA
 */
export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Team" });

  const members = getTeamMembers(locale);
  const stats = getTeamStats(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Header & Breadcrumbs */}
      <TeamHeader
        eyebrow={t("header.eyebrow")}
        title={t("header.title")}
        subtitle={t("header.subtitle")}
        homeLabel={t("breadcrumb.home")}
        teamLabel={t("breadcrumb.team")}
        breadcrumbLabel={t("breadcrumb.label")}
      />

      {/* 2. Team Members Grid */}
      <TeamGrid members={members} />

      {/* 3. Culture Narrative & Stats */}
      <TeamCulture
        eyebrow={t("culture.eyebrow")}
        title={t("culture.title")}
        p1={t("culture.p1")}
        p2={t("culture.p2")}
        stats={stats}
      />

      {/* 4. Hiring & Project Inquiry Callout */}
      <TeamCta
        eyebrow={t("cta.eyebrow")}
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        careersLabel={t("cta.careers")}
        startProjectLabel={t("cta.startProject")}
        careersHref="/careers"
        contactHref="/contact"
      />
    </div>
  );
}
