import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProjectBySlugAction, getProjectsAction } from "@/lib/projects/actions";
import { getArticleCommentsAction } from "@/lib/comments/actions";
import { getLocalizedProjectCategory } from "@/lib/projects/types";
import {
  ProjectDetailHeader,
  ProjectDetailRelated,
  ProjectDetailComments,
  ProjectTableOfContents,
  type ProjectTableOfContentsItem,
} from "@/components/projects/detail";
import { CTA } from "@/components/ui";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function processProjectHtmlHeadings(html: string) {
  let counter = 0;
  const items: ProjectTableOfContentsItem[] = [];

  const processedHtml = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (full, levelStr, attrs, inner) => {
    const level = parseInt(levelStr, 10) as 2 | 3;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return full;

    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const id = idMatch ? idMatch[1] : `section-${++counter}-${text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;

    items.push({ id, label: text, level });

    if (idMatch) {
      return full;
    }
    return `<h${level}${attrs} id="${id}" class="scroll-mt-24">${inner}</h${level}>`;
  });

  return { processedHtml, tocItems: items };
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const dbProject = await getProjectBySlugAction(slug);

  if (!dbProject) {
    return {};
  }

  const title = isAr
    ? dbProject.titleAr || dbProject.titleEn
    : dbProject.titleEn || dbProject.titleAr;
  const subtitle = isAr
    ? dbProject.descriptionAr || dbProject.descriptionEn
    : dbProject.descriptionEn || dbProject.descriptionAr;

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

  if (!dbProject) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ProjectDetail" });

  const projectTitle = isAr
    ? dbProject.titleAr || dbProject.titleEn
    : dbProject.titleEn || dbProject.titleAr;

  const projectSubtitle = isAr
    ? dbProject.descriptionAr || dbProject.descriptionEn
    : dbProject.descriptionEn || dbProject.descriptionAr;

  const contentHtml = isAr
    ? dbProject.contentHtmlAr || dbProject.contentHtmlEn
    : dbProject.contentHtmlEn || dbProject.contentHtmlAr;

  let processedContentHtml = contentHtml;
  let tocItems: ProjectTableOfContentsItem[] = [];

  if (contentHtml) {
    const result = processProjectHtmlHeadings(contentHtml);
    processedContentHtml = result.processedHtml;
    tocItems = result.tocItems;
  }

  // Always append Discussion & Reviews so readers can jump straight to feedback
  tocItems.push({
    id: "project-discussion",
    label: t("toc.discussion"),
    level: 2,
  });

  const category = getLocalizedProjectCategory(dbProject.category, locale);
  const gradient = dbProject.gradient || "from-zinc-900 via-neutral-900 to-zinc-950";
  const projectImage = dbProject.image || dbProject.coverImage || undefined;
  const liveDemoUrl = dbProject.liveDemoUrl || undefined;
  const githubUrl = dbProject.githubUrl || undefined;
  const technologies = dbProject.technologies || [];

  // Related projects from database
  const dbAll = await getProjectsAction("published");
  const relatedProjects = dbAll
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: isAr ? p.titleAr || p.titleEn : p.titleEn || p.titleAr,
      description: isAr ? p.descriptionAr || p.descriptionEn : p.descriptionEn || p.descriptionAr,
      category: p.category,
      year: p.year,
      featured: p.featured,
      liveDemo: Boolean(p.liveDemoUrl),
      technologies: p.technologies,
      rating: p.rating || 5.0,
      reviewCount: p.reviewCount || 0,
      gradient: p.gradient,
      completed: true,
      image: p.image || p.coverImage || undefined,
      clientName: p.clientName || undefined,
    }));

  const initialComments = await getArticleCommentsAction(slug);

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
        {/* Table of Contents Box */}
        {tocItems.length > 0 && (
          <ProjectTableOfContents
            items={tocItems}
            title={t("toc.title")}
            onThisPageText={t("toc.onThisPage")}
            sectionsCountLabel={t("toc.sectionsCount", { count: tocItems.length })}
            toggleOpenLabel={t("toc.toggleOpen")}
            toggleCloseLabel={t("toc.toggleClose")}
          />
        )}

        {processedContentHtml ? (
          <article className="prose prose-zinc dark:prose-invert max-w-none text-foreground leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl prose-h2:scroll-mt-24 prose-h3:scroll-mt-24 prose-p:text-muted-foreground prose-p:leading-relaxed prose-code:font-mono prose-code:text-primary prose-code:bg-muted/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/60 prose-img:rounded-2xl prose-img:border prose-img:border-border/60 shadow-xs">
            <div dangerouslySetInnerHTML={{ __html: processedContentHtml }} />
          </article>
        ) : (
          <div id="overview" className="text-base sm:text-lg text-muted-foreground leading-relaxed scroll-mt-24">
            <p>{projectSubtitle}</p>
          </div>
        )}

        {/* 3. User Reviews & Discussion */}
        <div id="project-discussion" className="mt-14 pt-10 border-t border-border/50 scroll-mt-24">
          <ProjectDetailComments
            title={isAr ? "مراجعات ونقاشات المشروع" : "Project Reviews & Discussion"}
            projectSlug={slug}
            projectId={dbProject.id}
            initialComments={initialComments}
            placeholder={isAr ? "اكتب تعليقك أو مراجعتك حول هذا المشروع..." : "Write your review or comment on this project..."}
            submitLabel={isAr ? "نشر المراجعة" : "Post Review"}
            replyLabel={isAr ? "رد" : "Reply"}
            emptyMessage={isAr ? "لا توجد مراجعات أو تعليقات حتى الآن. شارك برأيك الأول!" : "No reviews yet. Be the first to share your thoughts!"}
          />
        </div>
      </main>

      {/* 4. Related Projects Carousel / Grid from Real Database */}
      {relatedProjects.length > 0 && (
        <ProjectDetailRelated
          projects={relatedProjects}
          title={t("related.title")}
          locale={locale}
        />
      )}

      {/* 5. Project Inquiry Callout Banner */}
      <CTA
        variant="projects"
        title={t("cta.title")}
        subtitle={t("cta.description")}
        buttonLabel={t("cta.buttonText")}
        contactHref="/contact"
      />
    </div>
  );
}
