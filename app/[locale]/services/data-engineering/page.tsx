import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ServiceDetailTemplate,
  DATA_ENGINEERING_DETAIL,
} from "@/components/services/detail";

interface DataEngineeringPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: DataEngineeringPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ServiceDetail.dataEngineering",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DataEngineeringPage({
  params,
}: DataEngineeringPageProps) {
  const { locale } = await params;

  return (
    <ServiceDetailTemplate
      serviceData={DATA_ENGINEERING_DETAIL}
      locale={locale}
    />
  );
}
