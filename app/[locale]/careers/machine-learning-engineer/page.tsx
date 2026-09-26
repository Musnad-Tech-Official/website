import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JobDetailTemplate } from "@/components/careers/detail";

interface MachineLearningEngineerPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: MachineLearningEngineerPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "JobDetail.machineLearningEngineer",
  });

  return {
    title: `${t("title")} — Musnad Tech`,
    description: t("subtitle"),
  };
}

export default async function MachineLearningEngineerPage({
  params,
}: MachineLearningEngineerPageProps) {
  const { locale } = await params;

  return (
    <JobDetailTemplate
      slug="machine-learning-engineer"
      locale={locale}
    />
  );
}
