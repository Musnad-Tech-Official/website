import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  FaqIntro,
  FaqTopicGroup,
  FaqSidebar,
  getFaqData,
} from "@/components/faq";

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Faq" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Faq" });
  const faqData = getFaqData((key) => t(key));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 pb-16 sm:pb-24">
      {/* 1. Page Header & Intro */}
      <FaqIntro />

      {/* 2. Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-6 sm:mt-8">
        {/* Left Column: FAQ Groups */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {faqData.topicGroups.map((group) => (
            <FaqTopicGroup key={group.id} group={group} />
          ))}
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <FaqSidebar
            sidebarTopics={faqData.sidebarTopics}
            browseTitle={t("sidebar.browseTitle")}
            quickLinksTitle={t("sidebar.quickLinks.title")}
            quickLinks={faqData.quickLinks}
            stillHaveQuestions={faqData.stillHaveQuestions}
          />
        </div>
      </div>
    </div>
  );
}
