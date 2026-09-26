import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JobDetailTemplate } from "@/components/careers/detail";

interface DesignEngineerPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: DesignEngineerPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "JobDetail.designEngineer",
  });

  return {
    title: `${t("title")} — Musnad Tech`,
    description: t("subtitle"),
  };
}

export default async function DesignEngineerPage({
  params,
}: DesignEngineerPageProps) {
  const { locale } = await params;

  return (
    <JobDetailTemplate
      slug="design-engineer"
      locale={locale}
    />
  );
}
