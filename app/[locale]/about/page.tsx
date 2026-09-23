import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  AboutIntro,
  MissionVision,
  ValuesSection,
  ApproachSection,
  StorySection,
  MilestonesSection,
  AboutCta,
} from "@/components/about";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  // Await params per Next.js 15+ conventions
  await params;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-16 sm:space-y-24 lg:space-y-28 py-4 sm:py-6 lg:py-8">
      {/* 1. About Intro / Page Hero */}
      <AboutIntro />

      {/* 2. Mission & Vision */}
      <MissionVision />

      {/* 3. Values */}
      <ValuesSection />

      {/* 4. How We Work / Approach */}
      <ApproachSection />

      {/* 5. How We Got Here / Story */}
      <StorySection />

      {/* 6. Milestones */}
      <MilestonesSection />

      {/* 7. Final Project CTA */}
      <AboutCta />
    </div>
  );
}
