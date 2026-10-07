import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ServicesIntro,
  ServicesGrid,
  ServicesProcess,
} from "@/components/services";
import { CtaSection } from "@/components/ui/cta-section";
import { PageGuard } from "@/lib/page-control/guard";
import { getServicesAction } from "@/lib/services/actions";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const [t, services] = await Promise.all([
    getTranslations({ locale, namespace: "Services" }),
    getServicesAction(false),
  ]);

  return (
    <PageGuard slug="services" locale={locale}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* 1. Services Page Intro & Breadcrumb */}
      <ServicesIntro
        eyebrow={t("intro.eyebrow")}
        title={t("intro.title")}
        subtitle={t("intro.subtitle")}
        homeLabel={t("breadcrumb.home")}
        servicesLabel={t("breadcrumb.services")}
        breadcrumbLabel={t("breadcrumb.label")}
      />

      {/* 2. Services Grid (Core Capabilities from DB/Config) */}
      <ServicesGrid services={services} />

      {/* 3. How We Work Section (Deliberate 4-Step Process) */}
      <ServicesProcess />

      {/* 4. Shared Final CTA */}
      <CtaSection
        eyebrow={t("cta.badge")}
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryAction={{
          label: t("cta.button"),
          href: "/contact",
          variant: "primary",
          showArrow: true,
        }}
      />
    </div>
    </PageGuard>
  );
}
