import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getProjectBySlugAction, getProjectsAction } from "@/lib/projects/actions";
import { getProjectDetail } from "@/data/project-details";
import { getProjects } from "@/data/projects";
import {
  ProjectDetailHeader,
  ProjectDetailContext,
  ProjectDetailSolution,
  ProjectDetailGallery,
  ProjectDetailRelated,
  ProjectDetailComments,
} from "@/components/projects/detail";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/ui";
import { TechnologyBadge } from "@/components/ui/technology-badge";
import { LuArrowUpRight, LuCheck } from "react-icons/lu";

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

  const category = dbProject?.category || fallbackProject?.metaBar?.find(m => m.id === "category")?.value || "Case Study";
  const clientName = dbProject?.clientName || fallbackProject?.metaBar?.find(m => m.id === "user")?.value || "Musnad Tech";
  const year = dbProject?.year || fallbackProject?.metaBar?.find(m => m.id === "year")?.value || "2025";
  const gradient = dbProject?.gradient || "from-blue-600 via-indigo-600 to-violet-700";
  const projectImage = dbProject?.image || dbProject?.coverImage || undefined;
  const liveDemoUrl = dbProject?.liveDemoUrl || undefined;
  const githubUrl = dbProject?.githubUrl || undefined;
  const technologies = dbProject?.technologies || (fallbackProject?.tools?.items?.map(t => t.name) || ["TypeScript", "Next.js", "PostgreSQL"]);

  // Key metrics
  const metrics = dbProject
    ? dbProject.metrics?.map((m) => ({
        id: m.label,
        value: m.value,
        label: isAr ? m.labelAr || m.labelEn || m.label : m.labelEn || m.labelAr || m.label,
        description: isAr ? m.descriptionAr || m.descriptionEn || m.description : m.descriptionEn || m.descriptionAr || m.description,
      })) || []
    : fallbackProject?.overview?.metrics || [];

  const projectActions = dbProject
    ? [
        ...(dbProject.liveDemoUrl
          ? [{ label: isAr ? "معاينة حية" : "Live Demo", href: dbProject.liveDemoUrl, variant: "primary" as const, isExternal: true }]
          : [{ label: isAr ? "ناقش مشروعك" : "Discuss Project", href: "/contact", variant: "primary" as const }]),
        ...(dbProject.githubUrl
          ? [{ label: "GitHub", href: dbProject.githubUrl, variant: "outline" as const, isExternal: true }]
          : [{ label: isAr ? "كافة المشاريع" : "All Projects", href: "/projects", variant: "outline" as const }]),
      ]
    : fallbackProject!.actions;

  const contextCards = fallbackProject?.context?.cards || [];
  const solution = fallbackProject?.solution;
  const galleryItems = fallbackProject?.gallery?.items || [];

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
        }))
      : getProjects(locale)
  )
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Cinematic Hero Header with Prominent Cover and Technologies */}
      <ProjectDetailHeader
        title={projectTitle}
        subtitle={projectSubtitle}
        category={category}
        clientName={clientName}
        year={year}
        image={projectImage}
        gradient={gradient}
        liveDemoUrl={liveDemoUrl}
        githubUrl={githubUrl}
        technologies={technologies}
        actions={projectActions}
        homeLabel={t("breadcrumb.home")}
        projectsLabel={t("breadcrumb.projects")}
        breadcrumbLabel={t("breadcrumb.label")}
      />

      {/* 2. Key Impact Metrics Strip (Linear / Stripe Outcome-Driven Focus) */}
      {metrics.length > 0 && (
        <section aria-labelledby="metrics-heading" className="py-10 sm:py-14 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                {isAr ? "النتائج المعتمدة // مؤشرات الأداء" : "VERIFIED IMPACT // KEY METRICS"}
              </span>
              <h2 id="metrics-heading" className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-1">
                {isAr ? "الأثر التقني والتشغيلي للأعمال" : "Measured Technical & Business Outcomes"}
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {isAr ? "مؤشرات حية موثقة" : "Production Benchmarks"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {metrics.map((metric, idx) => (
              <Card
                key={metric.id || idx}
                variant="default"
                className="relative overflow-hidden p-6 sm:p-7 border border-border/70 bg-card/70 backdrop-blur-xs hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-primary via-primary/50 to-transparent" />
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-3xl sm:text-5xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {metric.value}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-foreground mt-3 tracking-tight">
                      {metric.label}
                    </h3>
                  </div>
                  {metric.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                      {metric.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 3. Strategic Two-Column Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 py-12 lg:py-16 items-start">
        {/* Main Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-12 sm:space-y-16">
          {/* Section A: The Problem & Context */}
          <section aria-labelledby="challenge-heading">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              {isAr ? "التحدي والهدف // 01" : "CHALLENGE & CONTEXT // 01"}
            </span>
            <h2 id="challenge-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2">
              {isAr ? "سياق المشروع والتحديات التقنية" : "The Core Problem & Architecture Goals"}
            </h2>
            <div className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>{projectSubtitle}</p>
            </div>

            {contextCards.length > 0 && (
              <div className="mt-8">
                <ProjectDetailContext cards={contextCards} title="" />
              </div>
            )}
          </section>

          {/* Section B: The Architecture & Technical Solution (Rich Tiptap Case Study) */}
          {contentHtml ? (
            <section aria-labelledby="solution-heading" className="border-t border-border/50 pt-10">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                {isAr ? "الحل الهندسي والتنفيذ // 02" : "ENGINEERING SOLUTION // 02"}
              </span>
              <h2 id="solution-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2 mb-6">
                {isAr ? "المعمارية التقنية ومراحل التنفيذ" : "Technical Architecture & Execution"}
              </h2>
              <div
                className="prose prose-zinc dark:prose-invert max-w-none text-foreground leading-relaxed prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-code:font-mono prose-code:text-primary prose-code:bg-muted/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/60 prose-img:rounded-xl prose-img:border prose-img:border-border/60 shadow-xs"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </section>
          ) : solution ? (
            <div className="border-t border-border/50 pt-10">
              <ProjectDetailSolution
                title={solution.title}
                description={solution.description}
                features={solution.features}
                highlight={solution.highlight}
              />
            </div>
          ) : null}

          {/* Section C: Visual Showcase Gallery (if available) */}
          {galleryItems.length > 0 && (
            <div className="border-t border-border/50 pt-10">
              <ProjectDetailGallery
                title={fallbackProject?.gallery?.title || (isAr ? "معرض الواجهات والمعمارية" : "UI & Architecture Showcase")}
                items={galleryItems}
                previewPrefix={t("gallery.previewPrefix")}
              />
            </div>
          )}

          {/* Section D: User Reviews & Comments */}
          <div className="border-t border-border/50 pt-10">
            <ProjectDetailComments
              title={fallbackProject?.commentsConfig?.title || (isAr ? "مراجعات ونقاشات المشروع" : "Project Reviews & Discussion")}
              placeholder={fallbackProject?.commentsConfig?.placeholder || (isAr ? "اكتب تعليقك أو مراجعتك الهندسية حول هذا المشروع..." : "Write your review or comment on this project...")}
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
        </div>

        {/* Sticky Project Specs Sidebar (4 cols) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          {/* Card 1: Project Specifications */}
          <Card className="p-6 border border-border/70 bg-card/80 backdrop-blur-xs rounded-2xl shadow-xs">
            <h3 className="font-bold text-base text-foreground mb-4 pb-3 border-b border-border/50 flex items-center justify-between">
              <span>{isAr ? "مواصفات المشروع" : "Project Specifications"}</span>
              <span className="text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full font-semibold">
                SYSTEM // PROD
              </span>
            </h3>

            <dl className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <dt className="text-muted-foreground">{isAr ? "العميل" : "Client"}</dt>
                <dd className="font-semibold text-foreground">{clientName}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-muted-foreground">{isAr ? "التصنيف" : "Category"}</dt>
                <dd className="font-semibold text-foreground">{category}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-muted-foreground">{isAr ? "سنة الإطلاق" : "Year"}</dt>
                <dd className="font-semibold font-mono text-foreground">{year}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-muted-foreground">{isAr ? "حالة النظام" : "Status"}</dt>
                <dd className="inline-flex items-center gap-1.5 font-medium text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAr ? "في الإنتاج" : "Production"}</span>
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-muted-foreground">{isAr ? "معمارية النظام" : "Architecture"}</dt>
                <dd className="font-mono text-xs font-semibold text-foreground">
                  {technologies.length > 0 ? `${technologies.length} Stack Modules` : "Production Stack"}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Card 2: Technologies & Architecture with Home-Style Badges */}
          {technologies.length > 0 && (
            <Card className="p-6 border border-border/70 bg-card/80 backdrop-blur-xs rounded-2xl shadow-xs">
              <h3 className="font-bold text-base text-foreground mb-4 pb-3 border-b border-border/50">
                {isAr ? "التقنيات والأدوات المستخدمة" : "Technologies & Infrastructure"}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {technologies.map((tech, idx) => (
                  <TechnologyBadge key={idx} name={tech} size="sm" />
                ))}
              </div>
            </Card>
          )}

          {/* Card 3: Direct Architecture Consultation CTA */}
          <Card className="p-6 border border-primary/30 bg-primary/5 rounded-2xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="font-bold text-base text-foreground">
              {isAr ? "هل ترغب في بناء منظومة مماثلة؟" : "Need a similar high-scale system?"}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "مهندسونا مستعدون لمناقشة متطلبات مشروعك، التحديات المعمارية، وتقديم خطة تنفيذ محكمة."
                : "Our principal engineers are ready to scope your requirements, evaluate architecture trade-offs, and deliver."}
            </p>

            <ul className="mt-4 space-y-2 text-xs text-foreground/80">
              <li className="flex items-center gap-2">
                <LuCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{isAr ? "استشارة معمارية متخصصة" : "Dedicated architecture review"}</span>
              </li>
              <li className="flex items-center gap-2">
                <LuCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{isAr ? "تخطيط النطاق والامتثال" : "Scope & compliance roadmap"}</span>
              </li>
            </ul>

            <Link href="/contact" className="block mt-5">
              <Button variant="primary" size="md" className="w-full gap-2 shadow-md shadow-primary/20">
                <span>{isAr ? "احجز جلسة معمارية" : "Book Architecture Call"}</span>
                <LuArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
              </Button>
            </Link>
          </Card>
        </aside>
      </div>

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

      {/* 5. Final Call To Action Banner */}
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
