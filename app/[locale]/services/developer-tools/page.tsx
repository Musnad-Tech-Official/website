import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ServiceDetailTemplate,
  DEVELOPER_TOOLS_DETAIL,
} from "@/components/services/detail";

interface DeveloperToolsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: DeveloperToolsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ServiceDetail.developerTools",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DeveloperToolsPage({
  params,
}: DeveloperToolsPageProps) {
  const { locale } = await params;

  return (
    <ServiceDetailTemplate
      serviceData={DEVELOPER_TOOLS_DETAIL}
      locale={locale}
    />
  );
}
