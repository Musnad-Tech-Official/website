import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageTemplate, getCookiePolicyData } from "@/components/legal";

interface CookiePolicyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CookiePolicyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.cookiePolicy" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CookiePolicyPage({
  params,
}: CookiePolicyPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.cookiePolicy" });
  const tCommon = await getTranslations({ locale, namespace: "Legal.common" });

  const config = getCookiePolicyData(
    (key) => t(key),
    (key) => tCommon(key)
  );

  return <LegalPageTemplate config={config} />;
}
