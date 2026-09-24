import React from "react";
import { getTranslations } from "next-intl/server";
import { ServiceDetailIntro } from "./service-detail-intro";
import { ServiceOverview } from "./service-overview";
import { ServiceCapabilities } from "./service-capabilities";
import { ServiceDetailSidebar } from "./service-detail-sidebar";
import { RelatedProjects } from "./related-projects";
import { RelatedByTechnology } from "./related-by-technology";
import { CtaSection } from "@/components/ui/cta-section";
import type { ServiceDetailTemplateProps } from "./service-detail-types";

export async function ServiceDetailTemplate({
  serviceData,
  locale,
}: ServiceDetailTemplateProps) {
  const tCommon = await getTranslations({ locale, namespace: "ServiceDetail.common" });
  const tService = await getTranslations({
    locale,
    namespace: `ServiceDetail.${serviceData.translationKey}`,
  });
  const tProjects = await getTranslations({ locale, namespace: "ServiceDetail.projects" });
  const tServicesList = await getTranslations({ locale, namespace: "Services.items" });

  const capabilitiesWithTranslations = serviceData.capabilities.map((cap) => ({
    id: cap.id,
    title: tService(`capabilities.${cap.translationKey}`),
    icon: cap.icon,
  }));

  const getProjectTranslations = (itemKey: string) => ({
    title: tProjects(`${itemKey}.title`),
    category: tProjects(`${itemKey}.category`),
    description: tProjects(`${itemKey}.description`),
  });

  const getServiceTranslations = (serviceKey: string) => ({
    title: tServicesList(`${serviceKey}.title`),
    description: tServicesList(`${serviceKey}.description`),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 pb-16">
      {/* 1. Service Detail Intro & Breadcrumb */}
      <ServiceDetailIntro
        eyebrow={tService("intro.eyebrow")}
        title={tService("intro.title")}
        subtitle={tService("intro.subtitle")}
        homeLabel={tCommon("breadcrumb.home")}
        servicesLabel={tCommon("breadcrumb.services")}
        breadcrumbLabel={tCommon("breadcrumb.label")}
        icon={serviceData.icon}
      />

      {/* 2. Overview + Capabilities (Main Column) + Service Detail Sidebar (Right Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-6 sm:mt-10">
        <div className="lg:col-span-8 space-y-12 sm:space-y-16">
          <ServiceOverview statement={tService("overview.statement")} />
          <ServiceCapabilities
            eyebrow={tCommon("capabilities.eyebrow")}
            heading={tCommon("capabilities.heading")}
            capabilities={capabilitiesWithTranslations}
          />
        </div>

        <div className="lg:col-span-4 w-full">
          <ServiceDetailSidebar
            onThisPageLabel={tCommon("onThisPage")}
            overviewLabel={tCommon("anchors.overview")}
            capabilitiesLabel={tCommon("anchors.capabilities")}
            relatedProjectsLabel={tCommon("anchors.relatedProjects")}
            serviceTitle={tService("intro.title")}
            serviceDescription={tService("intro.subtitle")}
            ctaLabel={tService("sidebar.ctaButton")}
            relatedTechnologiesLabel={tCommon("relatedTechnologies")}
            technologies={serviceData.technologies}
          />
        </div>
      </div>

      {/* 3. Related Projects */}
      <RelatedProjects
        eyebrow={tCommon("relatedProjects.eyebrow")}
        heading={tCommon("relatedProjects.heading")}
        projects={serviceData.relatedProjects}
        featuredLabel={tCommon("relatedProjects.featured")}
        liveDemoLabel={tCommon("relatedProjects.liveDemo")}
        completedLabel={tCommon("relatedProjects.completed")}
        inDevelopmentLabel={tCommon("relatedProjects.inDevelopment")}
        getProjectTranslations={getProjectTranslations}
      />

      {/* 4. Related by Technology */}
      <RelatedByTechnology
        eyebrow={tCommon("relatedByTechnology.eyebrow")}
        heading={tCommon("relatedByTechnology.heading")}
        projectsEyebrow={tCommon("relatedByTechnology.projectsEyebrow")}
        servicesEyebrow={tCommon("relatedByTechnology.servicesEyebrow")}
        projects={serviceData.relatedByTechnology.projects}
        services={serviceData.relatedByTechnology.services}
        getProjectTranslations={getProjectTranslations}
        getServiceTranslations={getServiceTranslations}
      />

      {/* 5. Shared Final CTA */}
      <CtaSection
        eyebrow={tCommon("cta.badge")}
        title={tCommon("cta.title")}
        subtitle={tCommon("cta.subtitle")}
        primaryAction={{
          label: tService("cta.primaryButton"),
          href: "/contact",
          variant: "primary",
          showArrow: true,
        }}
        secondaryAction={{
          label: tCommon("cta.backToServices"),
          href: "/services",
          variant: "outline",
        }}
      />
    </div>
  );
}
