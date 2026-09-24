import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageTemplate, getPrivacyPolicyData } from "@/components/legal";

interface PrivacyPolicyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.privacyPolicy" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.privacyPolicy" });
  const tCommon = await getTranslations({ locale, namespace: "Legal.common" });

  const config = getPrivacyPolicyData(
    (key) => t(key),
    (key) => tCommon(key)
  );

  return <LegalPageTemplate config={config} />;
}
