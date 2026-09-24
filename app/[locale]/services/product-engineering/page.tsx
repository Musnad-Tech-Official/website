import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ServiceDetailTemplate,
  PRODUCT_ENGINEERING_DETAIL,
} from "@/components/services/detail";

interface ProductEngineeringPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProductEngineeringPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ServiceDetail.productEngineering",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ProductEngineeringPage({
  params,
}: ProductEngineeringPageProps) {
  const { locale } = await params;

  return (
    <ServiceDetailTemplate
      serviceData={PRODUCT_ENGINEERING_DETAIL}
      locale={locale}
    />
  );
}
