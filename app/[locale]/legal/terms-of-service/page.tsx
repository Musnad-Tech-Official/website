import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageTemplate, getTermsOfServiceData } from "@/components/legal";

interface TermsOfServicePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TermsOfServicePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.termsOfService" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function TermsOfServicePage({
  params,
}: TermsOfServicePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.termsOfService" });
  const tCommon = await getTranslations({ locale, namespace: "Legal.common" });

  const config = getTermsOfServiceData(
    (key) => t(key),
    (key) => tCommon(key)
  );

  return <LegalPageTemplate config={config} />;
}
