import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JobDetailTemplate } from "@/components/careers/detail";

interface SeniorBackendEngineerPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SeniorBackendEngineerPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "JobDetail.seniorBackendEngineer",
  });

  return {
    title: `${t("title")} — Musnad Tech`,
    description: t("subtitle"),
  };
}

export default async function SeniorBackendEngineerPage({
  params,
}: SeniorBackendEngineerPageProps) {
  const { locale } = await params;

  return (
    <JobDetailTemplate
      slug="senior-backend-engineer"
      locale={locale}
    />
  );
}
