import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProjects } from "@/data/projects";
import {
  ProjectsHeader,
  ProjectsExplorer,
} from "@/components/projects";
import { CTA } from "@/components/ui";

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

  const projects = getProjects(locale);

  return (
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
  );
}
