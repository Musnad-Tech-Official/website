import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ServiceDetailTemplate,
  AI_INTEGRATION_DETAIL,
} from "@/components/services/detail";

interface AiIntegrationPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AiIntegrationPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ServiceDetail.aiIntegration",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AiIntegrationPage({
  params,
}: AiIntegrationPageProps) {
  const { locale } = await params;

  return (
    <ServiceDetailTemplate
      serviceData={AI_INTEGRATION_DETAIL}
      locale={locale}
    />
  );
}
