import { getPageMetadata } from "@/lib/seo/page-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCareerJobBySlugAction } from "@/lib/careers/actions";
import { JobDetailTemplate } from "@/components/careers/detail";

interface DesignEngineerPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const job = await getCareerJobBySlugAction("design-engineer");
  if (!job) notFound();

  return getPageMetadata({
    locale,
    path: "/careers/design-engineer",
    title: `${locale === "ar" ? job.titleAr : job.titleEn} — Musnad Tech`,
    description: locale === "ar" ? job.descriptionAr : job.descriptionEn,
  });
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
