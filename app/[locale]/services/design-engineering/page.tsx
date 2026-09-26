import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ServiceDetailTemplate,
  DESIGN_ENGINEERING_DETAIL,
} from "@/components/services/detail";

interface DesignEngineeringPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: DesignEngineeringPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ServiceDetail.designEngineering",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DesignEngineeringPage({
  params,
}: DesignEngineeringPageProps) {
  const { locale } = await params;

  return (
    <ServiceDetailTemplate
      serviceData={DESIGN_ENGINEERING_DETAIL}
      locale={locale}
    />
  );
}
