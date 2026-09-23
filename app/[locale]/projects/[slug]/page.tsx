import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProjectDetail } from "@/data/project-details";
import { getProjects } from "@/data/projects";
import {
  ProjectDetailHeader,
  ProjectDetailOverview,
  ProjectDetailContext,
  ProjectDetailSolution,
  ProjectDetailGallery,
  ProjectDetailContributors,
  ProjectDetailRelated,
  ProjectDetailRating,
  ProjectDetailComments,
  ProjectDetailTools,
  type ProjectInteractionEligibility,
} from "@/components/projects/detail";
import { CTA } from "@/components/ui";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectDetail(slug, locale);

  if (!project) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "ProjectDetail" });

  return {
    title: t("meta.titleTemplate", { title: project.title }),
    description: project.subtitle || t("meta.defaultDescription"),
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const project = getProjectDetail(slug, locale);

  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ProjectDetail" });

  // ============================================================================
  // SECURITY & ARCHITECTURAL NOTE:
  // Frontend gating is UX only. Real security enforcement must happen later
  // in the Backend / Supabase RLS layer using:
  //   authenticated user ID + project ID + verified project experience record.
  // The frontend must NEVER be treated as the security boundary.
  //
  // For the current frontend-only phase, interaction eligibility is established
  // as a presentation-only contract (signed_out by default until account integrations).
  // ============================================================================
  const eligibility: ProjectInteractionEligibility = {
    isAuthenticated: false,
    hasVerifiedExperience: false,
    canRate: false,
    canComment: false,
    reason: "signed_out",
  };

  const eligibilityMessages = {
    signedOut: t("eligibility.signedOut"),
    signIn: t("eligibility.signIn"),
    experienceRequired: t("eligibility.experienceRequired"),
    experienceRequiredSecondary: t("eligibility.experienceRequiredSecondary"),
  };

  // Related projects: select up to 3 other projects from approved data
  const relatedProjects = getProjects(locale)
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Header & Hero with Breadcrumbs & Meta Bar */}
      <ProjectDetailHeader
        title={project.title}
        subtitle={project.subtitle}
        eyebrowBadges={project.eyebrowBadges}
        actions={project.actions}
        metaBar={project.metaBar}
        homeLabel={t("breadcrumb.home")}
        projectsLabel={t("breadcrumb.projects")}
        breadcrumbLabel={t("breadcrumb.label")}
      />

      {/* 2. Overview Narrative & Optional Metrics */}
      {project.overview && (
        <ProjectDetailOverview
          title={project.overview.title}
          paragraphs={project.overview.paragraphs}
          metrics={project.overview.metrics}
        />
      )}

      {/* 3. Context (Optional) */}
      {project.context && project.context.cards.length > 0 && (
        <ProjectDetailContext
          title={project.context.title}
          cards={project.context.cards}
        />
      )}

      {/* 4. Solution & Features (Optional) */}
      {project.solution && (
        <ProjectDetailSolution
          title={project.solution.title}
          description={project.solution.description}
          features={project.solution.features}
          highlight={project.solution.highlight}
        />
      )}

      {/* 5. Gallery (Optional) */}
      {project.gallery && project.gallery.items.length > 0 && (
        <ProjectDetailGallery
          title={project.gallery.title}
          items={project.gallery.items}
          previewPrefix={t("gallery.previewPrefix")}
        />
      )}

      {/* 6. Contributors (Optional) */}
      {project.contributors && project.contributors.members.length > 0 && (
        <ProjectDetailContributors
          title={project.contributors.title}
          members={project.contributors.members}
        />
      )}

      {/* 7. Related Projects */}
      {relatedProjects.length > 0 && (
        <ProjectDetailRelated
          title={project.relatedProjectsHeading || t("relatedProjects")}
          projects={relatedProjects}
          locale={locale}
        />
      )}

      {/* 8. Rate this Project (Optional) */}
      {project.ratingConfig && (
        <ProjectDetailRating
          title={project.ratingConfig.title}
          subtitle={project.ratingConfig.subtitle}
          ratePrompt={project.ratingConfig.ratePrompt}
          summary={project.ratingConfig.summary}
          submitLabel={t("rating.submit")}
          ratingsLabel={t("rating.ratingsCount")}
          integrationNotice={t("rating.integrationNotice")}
          previewNotice={t("rating.previewNotice")}
          eligibility={eligibility}
          eligibilityMessages={eligibilityMessages}
        />
      )}

      {/* 9. Comments & Discussion (Optional) */}
      {project.commentsConfig && (
        <ProjectDetailComments
          title={project.commentsConfig.title}
          placeholder={project.commentsConfig.placeholder}
          submitLabel={t("comments.submit")}
          replyLabel={t("comments.reply")}
          emptyMessage={t("comments.empty")}
          integrationNotice={t("comments.integrationNotice")}
          items={project.commentsConfig.items}
          eligibility={eligibility}
          eligibilityMessages={eligibilityMessages}
        />
      )}

      {/* 10. Built with Similar Tools (Optional) */}
      {project.tools && project.tools.items.length > 0 && (
        <ProjectDetailTools
          title={project.tools.title}
          subtitle={project.tools.subtitle}
          items={project.tools.items}
        />
      )}

      {/* 11. Final Call To Action (Optional) */}
      {project.cta && (
        <CTA
          variant="default"
          align="center"
          title={project.cta.title}
          subtitle={project.cta.subtitle}
          primaryAction={{
            label: project.cta.primaryLabel,
            href: "/contact",
            variant: "primary",
            showArrow: true,
          }}
          secondaryAction={{
            label: project.cta.secondaryLabel,
            href: "/projects",
            variant: "outline",
          }}
        />
      )}
    </div>
  );
}
