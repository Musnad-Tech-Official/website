import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProjectBySlugAction, getProjectsAction } from "@/lib/projects/actions";
import { getLocalizedProjectCategory } from "@/lib/projects/types";
import { getProjectDetail } from "@/data/project-details";
import { getProjects } from "@/data/projects";
import {
  ProjectDetailHeader,
  ProjectDetailRelated,
  ProjectDetailComments,
} from "@/components/projects/detail";
import { CTA } from "@/components/ui";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const dbProject = await getProjectBySlugAction(slug);
  const fallbackProject = !dbProject ? getProjectDetail(slug, locale) : null;

  const title = dbProject
    ? isAr
      ? dbProject.titleAr || dbProject.titleEn
      : dbProject.titleEn || dbProject.titleAr
    : fallbackProject?.title;
  const subtitle = dbProject
    ? isAr
      ? dbProject.descriptionAr || dbProject.descriptionEn
      : dbProject.descriptionEn || dbProject.descriptionAr
    : fallbackProject?.subtitle;

  if (!title) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "ProjectDetail" });

  return {
    title: t("meta.titleTemplate", { title }),
    description: subtitle || t("meta.defaultDescription"),
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const dbProject = await getProjectBySlugAction(slug);
  const fallbackProject = !dbProject ? getProjectDetail(slug, locale) : null;

  if (!dbProject && !fallbackProject) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ProjectDetail" });

  const projectTitle = dbProject
    ? isAr
      ? dbProject.titleAr || dbProject.titleEn
      : dbProject.titleEn || dbProject.titleAr
    : fallbackProject!.title;

  const projectSubtitle = dbProject
    ? isAr
      ? dbProject.descriptionAr || dbProject.descriptionEn
      : dbProject.descriptionEn || dbProject.descriptionAr
    : fallbackProject!.subtitle;

  const contentHtml = dbProject
    ? isAr
      ? dbProject.contentHtmlAr || dbProject.contentHtmlEn
      : dbProject.contentHtmlEn || dbProject.contentHtmlAr
    : null;

  const rawCategory = dbProject?.category || fallbackProject?.metaBar?.find(m => m.id === "category")?.value || "Case Study";
  const category = getLocalizedProjectCategory(rawCategory, locale);
  const gradient = dbProject?.gradient || "from-zinc-900 via-neutral-900 to-zinc-950";
  const projectImage = dbProject?.image || dbProject?.coverImage || undefined;
  const liveDemoUrl = dbProject?.liveDemoUrl || undefined;
  const githubUrl = dbProject?.githubUrl || undefined;
  const technologies = dbProject?.technologies || (fallbackProject?.tools?.items?.map(t => t.name) || ["TypeScript", "Next.js", "PostgreSQL"]);

  // Related projects
  const dbAll = await getProjectsAction("published");
  const relatedProjects = (
    dbAll.length > 0
      ? dbAll.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: isAr ? p.titleAr || p.titleEn : p.titleEn || p.titleAr,
          description: isAr ? p.descriptionAr || p.descriptionEn : p.descriptionEn || p.descriptionAr,
          category: p.category,
          year: p.year,
          featured: p.featured,
          liveDemo: Boolean(p.liveDemoUrl),
          technologies: p.technologies,
          rating: 5.0,
          reviewCount: 0,
          gradient: p.gradient,
          completed: true,
          image: p.image || p.coverImage || undefined,
          clientName: p.clientName || undefined,
        }))
      : getProjects(locale)
  )
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Clean Header with Category, Title, Short Description, Cover & Techs */}
      <ProjectDetailHeader
        title={projectTitle}
        subtitle={projectSubtitle}
        category={category}
        image={projectImage}
        gradient={gradient}
        liveDemoUrl={liveDemoUrl}
        githubUrl={githubUrl}
        liveDemoLabel={t("actions.liveDemo")}
        repositoryLabel={t("actions.repository")}
        technologies={technologies}
        homeLabel={t("breadcrumb.home")}
        projectsLabel={t("breadcrumb.projects")}
        breadcrumbLabel={t("breadcrumb.label")}
      />

      {/* 2. Focused Editorial Case Study (Clean Rich Text Article) */}
      <main className="max-w-4xl mx-auto py-12 sm:py-16">
        {contentHtml ? (
          <article className="prose prose-zinc dark:prose-invert max-w-none text-foreground leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-code:font-mono prose-code:text-primary prose-code:bg-muted/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/60 prose-img:rounded-2xl prose-img:border prose-img:border-border/60 shadow-xs">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </article>
        ) : (
          <div className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            <p>{projectSubtitle}</p>
          </div>
        )}

        {/* 3. User Reviews & Discussion */}
        <div className="mt-14 pt-10 border-t border-border/50">
          <ProjectDetailComments
            title={fallbackProject?.commentsConfig?.title || (isAr ? "مراجعات ونقاشات المشروع" : "Project Reviews & Discussion")}
            placeholder={fallbackProject?.commentsConfig?.placeholder || (isAr ? "اكتب تعليقك أو مراجعتك حول هذا المشروع..." : "Write your review or comment on this project...")}
            submitLabel={fallbackProject?.commentsConfig?.submitLabel || (isAr ? "نشر المراجعة" : "Post Review")}
            replyLabel={fallbackProject?.commentsConfig?.replyLabel || (isAr ? "رد" : "Reply")}
            emptyMessage={fallbackProject?.commentsConfig?.emptyMessage || (isAr ? "لا توجد مراجعات حتى الآن. شارك برأيك الأول!" : "No reviews yet. Be the first to share your thoughts!")}
            items={fallbackProject?.commentsConfig?.items || []}
            eligibility={{
              isAuthenticated: true,
              hasVerifiedExperience: true,
              canRate: false,
              canComment: true,
              reason: "eligible",
            }}
          />
        </div>
      </main>

      {/* 4. Related Projects Grid */}
      {relatedProjects.length > 0 && (
        <section aria-labelledby="related-heading" className="py-14 sm:py-20 border-t border-border/50">
          <ProjectDetailRelated
            title={fallbackProject?.relatedProjectsHeading || t("relatedProjects")}
            projects={relatedProjects}
            locale={locale}
          />
        </section>
      )}

      {/* 5. Final Call To Action */}
      <CTA
        variant="default"
        align="center"
        title={fallbackProject?.cta?.title || (isAr ? "ابدأ العمل على مشروعك القادم" : "Ready to Build Something Great?")}
        subtitle={
          fallbackProject?.cta?.subtitle ||
          (isAr
            ? "فريق مسند الهندسي مستعد لمساعدتك في معمارية وتطوير منتجك القادم بأعلى معايير الجودة."
            : "Musnad Tech engineering leads are ready to partner with you on high-scale architecture and delivery.")
        }
        primaryAction={{
          label: fallbackProject?.cta?.primaryLabel || (isAr ? "ناقش مشروعك" : "Discuss Project"),
          href: "/contact",
          variant: "primary",
          showArrow: true,
        }}
        secondaryAction={{
          label: fallbackProject?.cta?.secondaryLabel || (isAr ? "استكشف كافة المشاريع" : "Explore Projects"),
          href: "/projects",
          variant: "outline",
        }}
      />
    </div>
  );
}
