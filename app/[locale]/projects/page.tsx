import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProjectsAction } from "@/lib/projects/actions";
import { getProjects } from "@/data/projects";
import {
  ProjectsHeader,
  ProjectsExplorer,
} from "@/components/projects";
import { CTA } from "@/components/ui";
import { PageGuard } from "@/lib/page-control/guard";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  const isAr = locale === "ar";

  const dbProjects = await getProjectsAction("published");

  const projects =
    dbProjects.length > 0
      ? dbProjects.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: isAr ? p.titleAr || p.titleEn : p.titleEn || p.titleAr,
          description: isAr ? p.descriptionAr || p.descriptionEn : p.descriptionEn || p.descriptionAr,
          category: p.category,
          year: p.year,
          featured: p.featured,
          liveDemo: Boolean(p.liveDemoUrl),
          technologies: p.technologies,
          rating: p.rating,
          reviewCount: p.reviewCount,
          gradient: p.gradient,
          completed: true,
          image: p.image || p.coverImage || undefined,
          clientName: p.clientName || undefined,
          keyMetric: p.metrics && p.metrics.length > 0 ? {
            label: isAr ? p.metrics[0].labelAr || p.metrics[0].labelEn || p.metrics[0].label : p.metrics[0].labelEn || p.metrics[0].labelAr || p.metrics[0].label,
            value: p.metrics[0].value,
          } : undefined,
          metrics: p.metrics?.map((m) => ({
            label: isAr ? m.labelAr || m.labelEn || m.label : m.labelEn || m.labelAr || m.label,
            value: m.value,
            description: isAr ? m.descriptionAr || m.descriptionEn || m.description : m.descriptionEn || m.descriptionAr || m.description,
          })),
        }))
      : getProjects(locale);

  return (
    <PageGuard slug="projects" locale={locale}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* 1. Header & Breadcrumbs */}
        <ProjectsHeader
          eyebrow={t("header.eyebrow")}
          title={t("header.title")}
          subtitle={t("header.subtitle")}
          homeLabel={t("breadcrumb.home")}
          projectsLabel={t("breadcrumb.projects")}
          breadcrumbLabel={t("breadcrumb.label")}
        />

        {/* 2. Interactive Search, Filter & Projects Grid */}
        <ProjectsExplorer projects={projects} locale={locale} />

        {/* 3. Project Inquiry Callout Banner (Reusable CTA component) */}
        <CTA
          variant="projects"
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          buttonLabel={t("cta.button")}
          contactHref="/contact"
        />
      </div>
    </PageGuard>
  );
}
