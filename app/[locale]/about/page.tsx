import { getPageMetadata } from "@/lib/seo/page-metadata";
import { localizedUrl } from "@/lib/seo/config";
import { aboutPageJsonLd, breadcrumbsJsonLd, organizationJsonLd, serializeJsonLd } from "@/lib/seo/structured-data";
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
import { PageGuard } from "@/lib/page-control/guard";
import {
  getAboutContentAction,
  getAboutValuesAction,
  getAboutMilestonesAction,
  getAboutApproachAction,
} from "@/lib/about/actions";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return getPageMetadata({
    locale,
    path: "/about",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [content, dbValues, dbMilestones, dbApproach] = await Promise.all([
    getAboutContentAction(),
    getAboutValuesAction(false),
    getAboutMilestonesAction(false),
    getAboutApproachAction(false),
  ]);

  const missionVisionData = {
    missionTitle: isAr ? content.missionTitleAr : content.missionTitleEn,
    missionDescription: isAr ? content.missionDescAr : content.missionDescEn,
    visionTitle: isAr ? content.visionTitleAr : content.visionTitleEn,
    visionDescription: isAr ? content.visionDescAr : content.visionDescEn,
  };

  const storyData = {
    title: isAr ? content.storyTitleAr : content.storyTitleEn,
    p1: isAr ? content.storyP1Ar : content.storyP1En,
    p2: isAr ? content.storyP2Ar : content.storyP2En,
  };

  const values = dbValues.map((v) => ({
    id: v.id,
    title: isAr ? v.titleAr : v.titleEn,
    description: isAr ? v.descriptionAr : v.descriptionEn,
    icon: v.icon,
  }));

  const steps = dbApproach.map((a) => ({
    id: a.id,
    stepNumber: a.stepNumber,
    title: isAr ? a.titleAr : a.titleEn,
    description: isAr ? a.descriptionAr : a.descriptionEn,
  }));

  const milestones = dbMilestones.map((m) => ({
    id: m.id,
    year: m.year,
    title: isAr ? m.titleAr : m.titleEn,
    description: isAr ? m.descriptionAr : m.descriptionEn,
  }));

  return (
    <PageGuard slug="about" locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org",
        "@graph": [
          organizationJsonLd(),
          aboutPageJsonLd(locale),
          breadcrumbsJsonLd([
            { name: locale === "ar" ? "الرئيسية" : "Home", url: localizedUrl(locale, "/") },
            { name: locale === "ar" ? "من نحن" : "About Us", url: localizedUrl(locale, "/about") },
          ]),
        ],
      }) }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-16 sm:space-y-24 lg:space-y-28 py-4 sm:py-6 lg:py-8">
        {/* 1. About Intro / Page Hero */}
        <AboutIntro />

        {/* 2. Mission & Vision */}
        <MissionVision data={missionVisionData} />

        {/* 3. Values */}
        <ValuesSection values={values} />

        {/* 4. How We Work / Approach */}
        <ApproachSection steps={steps} />

        {/* 5. How We Got Here / Story */}
        <StorySection data={storyData} />

        {/* 6. Milestones */}
        <MilestonesSection milestones={milestones} />

        {/* 7. Final Project CTA */}
        <AboutCta />
      </div>
    </PageGuard>
  );
}
