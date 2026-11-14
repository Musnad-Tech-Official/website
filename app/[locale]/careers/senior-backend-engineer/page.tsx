import { getPageMetadata } from "@/lib/seo/page-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCareerJobBySlugAction } from "@/lib/careers/actions";
import { JobDetailTemplate } from "@/components/careers/detail";

interface SeniorBackendEngineerPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const job = await getCareerJobBySlugAction("senior-backend-engineer");
  if (!job) notFound();

  return getPageMetadata({
    locale,
    path: "/careers/senior-backend-engineer",
    title: `${locale === "ar" ? job.titleAr : job.titleEn} — Musnad Tech`,
    description: locale === "ar" ? job.descriptionAr : job.descriptionEn,
  });
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
