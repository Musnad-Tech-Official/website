import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ServiceDetailTemplate,
  PLATFORM_INFRASTRUCTURE_DETAIL,
} from "@/components/services/detail";

interface PlatformInfrastructurePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PlatformInfrastructurePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ServiceDetail.platformInfrastructure",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PlatformInfrastructurePage({
  params,
}: PlatformInfrastructurePageProps) {
  const { locale } = await params;

  return (
    <ServiceDetailTemplate
      serviceData={PLATFORM_INFRASTRUCTURE_DETAIL}
      locale={locale}
    />
  );
}
