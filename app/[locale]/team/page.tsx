import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getTeamCultureStats } from "@/components/team/team-types";
import { getTeamMembersAction } from "@/lib/team/actions";
import {
  TeamHeader,
  TeamGrid,
  TeamCulture,
} from "@/components/team";
import { CtaSection } from "@/components/ui/cta-section";
import { PageGuard } from "@/lib/page-control/guard";

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

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Team" });

  const isAr = locale === "ar";
  const dbMembers = await getTeamMembersAction(true);
  const members = dbMembers.map((m) => ({
    id: m.slug || m.id,
    slug: m.slug,
    name: isAr ? m.nameAr : m.nameEn,
    role: isAr ? m.roleAr : m.roleEn,
    bio: isAr ? m.bioAr : m.bioEn,
    initials: m.initials,
    image: m.image,
    skills: m.skills,
    socialLinks: m.socialLinks,
  }));
  const stats = getTeamCultureStats(locale);

  return (
    <PageGuard slug="team" locale={locale}>
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

      {/* 2. Team Members Horizontal Slider */}
      <TeamGrid members={members} />

      {/* 3. Culture Narrative & Stats */}
      <TeamCulture
        eyebrow={t("culture.eyebrow")}
        title={t("culture.title")}
        p1={t("culture.p1")}
        p2={t("culture.p2")}
        stats={stats}
      />

      {/* 4. Project Inquiry Callout (Reusable CTA) */}
      <CtaSection
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryAction={{
          label: t("cta.discussProject"),
          href: "/contact",
          variant: "primary",
          showArrow: true,
        }}
        secondaryAction={{
          label: t("cta.exploreProjects"),
          href: "/projects",
          variant: "outline",
        }}
      />
    </div>
    </PageGuard>
  );
}
