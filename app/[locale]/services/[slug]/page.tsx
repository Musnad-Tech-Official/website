import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServiceBySlugAction } from "@/lib/services/actions";
import { getServiceIconComponent } from "@/lib/services/service-icons";
import { getProjectsAction } from "@/lib/projects/actions";
import { ServiceDetailIntro } from "@/components/services/detail/service-detail-intro";
import { ServiceOverview } from "@/components/services/detail/service-overview";
import { ServiceDetailSidebar } from "@/components/services/detail/service-detail-sidebar";
import { CtaSection } from "@/components/ui/cta-section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuCheck, LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { Link } from "@/i18n/routing";

interface DynamicServicePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: DynamicServicePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlugAction(slug);

  if (!service || !service.isActive) {
    return {
      title: "Service Not Found — Musnad Tech",
    };
  }

  const isAr = locale === "ar";
  const title = isAr ? service.titleAr || service.titleEn : service.titleEn;
  const description = isAr
    ? service.descriptionAr || service.descriptionEn
    : service.descriptionEn;

  return {
    title: `${title} — Musnad Tech`,
    description,
  };
}

export default async function DynamicServicePage({
  params,
}: DynamicServicePageProps) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";

  const [service, projects] = await Promise.all([
    getServiceBySlugAction(slug),
    getProjectsAction("published"),
  ]);

  if (!service || !service.isActive) {
    notFound();
  }

  const tCommon = await getTranslations({ locale, namespace: "ServiceDetail.common" });
  const tServices = await getTranslations({ locale, namespace: "Services" });

  const title = isAr ? service.titleAr || service.titleEn : service.titleEn;
  const description = isAr
    ? service.descriptionAr || service.descriptionEn
    : service.descriptionEn;
  const tags = isAr
    ? service.tagsAr?.length
      ? service.tagsAr
      : service.tagsEn
    : service.tagsEn?.length
    ? service.tagsEn
    : service.tagsAr;

  const Icon = getServiceIconComponent(service.icon);

  // Filter or take up to 2 showcase projects
  const relevantProjects = projects.slice(0, 2).map((p) => ({
    id: p.id,
    title: isAr ? p.titleAr || p.titleEn : p.titleEn || p.titleAr,
    category: p.category,
    description: isAr ? p.descriptionAr || p.descriptionEn : p.descriptionEn || p.descriptionAr,
    slug: p.slug,
    technologies: p.technologies || [],
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 pb-16">
      {/* 1. Header & Breadcrumbs */}
      <ServiceDetailIntro
        eyebrow={isAr ? "القدرات والخدمات الهندسية" : "Engineering Capability"}
        title={title}
        subtitle={description}
        homeLabel={tCommon("breadcrumb.home")}
        servicesLabel={tCommon("breadcrumb.services")}
        breadcrumbLabel={tCommon("breadcrumb.label")}
        icon={Icon}
      />

      {/* 2. Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-6 sm:mt-10">
        <div className="lg:col-span-8 space-y-12 sm:space-y-16">
          {/* Overview */}
          <ServiceOverview statement={description} />

          {/* Capabilities Grid */}
          <section id="capabilities" className="scroll-mt-24 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {tCommon("capabilities.eyebrow")}
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {tCommon("capabilities.heading")}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tags.map((tag, idx) => (
                <Card
                  key={idx}
                  className="flex items-start gap-3.5 p-4 sm:p-5 border border-border/80 bg-card hover:border-primary/40 transition-colors shadow-2xs"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                    <LuCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{tag}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {isAr
                        ? "تنفيذ ومتابعة بأعلى معايير الجودة والموثوقية."
                        : "Engineered and executed with enterprise-grade reliability and standards."}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Related Projects */}
          {relevantProjects.length > 0 && (
            <section id="related-projects" className="scroll-mt-24 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {tCommon("projects.eyebrow")}
                  </span>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {tCommon("projects.heading")}
                  </h2>
                </div>

                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>{isAr ? "جميع المشاريع" : "View All"}</span>
                  <LuArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {relevantProjects.map((p) => (
                  <Card
                    key={p.id}
                    variant="interactive"
                    className="flex flex-col justify-between p-5 sm:p-6 border border-border/80 bg-card hover:border-primary/40 transition-all rounded-2xl shadow-2xs group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge variant="secondary" size="sm" className="text-[11px] font-normal">
                          {p.category}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.technologies.slice(0, 3).map((tech, idx) => (
                          <Badge key={idx} variant="outline" size="sm" className="text-[10px]">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/40">
                      <Link
                        href={`/projects/${p.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>{isAr ? "عرض تفاصيل المشروع" : "View Case Study"}</span>
                        <LuArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <ServiceDetailSidebar
            onThisPageLabel={tCommon("sidebar.onThisPage")}
            overviewLabel={tCommon("sidebar.overview")}
            capabilitiesLabel={tCommon("sidebar.capabilities")}
            relatedProjectsLabel={tCommon("sidebar.relatedProjects")}
            serviceTitle={title}
            serviceDescription={description}
            ctaLabel={tCommon("sidebar.cta")}
            relatedTechnologiesLabel={tCommon("sidebar.technologies")}
            technologies={tags.slice(0, 5)}
          />
        </div>
      </div>

      {/* Final CTA */}
      <CtaSection
        eyebrow={tServices("cta.badge")}
        title={tServices("cta.title")}
        subtitle={tServices("cta.subtitle")}
        primaryAction={{
          label: tServices("cta.button"),
          href: "/contact",
          variant: "primary",
          showArrow: true,
        }}
      />
    </div>
  );
}
