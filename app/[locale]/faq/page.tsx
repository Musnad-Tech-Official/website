import { getPageMetadata } from "@/lib/seo/page-metadata";
import { localizedUrl } from "@/lib/seo/config";
import { breadcrumbsJsonLd, faqJsonLd, organizationJsonLd, serializeJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  FaqIntro,
  FaqTopicGroup,
  FaqSidebar,
  getFaqData,
} from "@/components/faq";
import { PageGuard } from "@/lib/page-control/guard";
import { getFaqTopicsAction, getFaqQuestionsAction } from "@/lib/faqs/actions";

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Faq" });

  return getPageMetadata({
    locale,
    path: "/faq",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const t = await getTranslations({ locale, namespace: "Faq" });

  const [dbTopics, dbQuestions] = await Promise.all([
    getFaqTopicsAction(false),
    getFaqQuestionsAction(undefined, false),
  ]);

  const fallbackData = getFaqData((key) => t(key));

  const topicGroups = dbTopics.length > 0 && dbQuestions.length > 0
    ? dbTopics.map((topic) => {
        const items = dbQuestions
          .filter((q) => q.topicId === topic.id)
          .map((q) => ({
            id: q.id,
            question: isAr ? q.questionAr : q.questionEn,
            answer: isAr ? q.answerAr : q.answerEn,
          }));

        return {
          id: topic.slug,
          title: isAr ? topic.titleAr : topic.titleEn,
          count: items.length,
          items,
        };
      }).filter((g) => g.items.length > 0)
    : fallbackData.topicGroups;

  const sidebarTopics = dbTopics.length > 0
    ? dbTopics.map((topic) => ({
        id: topic.slug,
        title: isAr ? topic.titleAr : topic.titleEn,
        count: dbQuestions.filter((q) => q.topicId === topic.id).length,
        href: `#${topic.slug}`,
      }))
    : fallbackData.sidebarTopics;

  const allFaqItems = topicGroups.flatMap((group) => group.items);

  return (
    <PageGuard slug="faq" locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org",
        "@graph": [
          organizationJsonLd(),
          faqJsonLd(allFaqItems),
          breadcrumbsJsonLd([
            { name: isAr ? "الرئيسية" : "Home", url: localizedUrl(locale, "/") },
            { name: t("breadcrumb.faq"), url: localizedUrl(locale, "/faq") },
          ]),
        ],
      }) }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 pb-16 sm:pb-24">
        {/* 1. Page Header & Intro */}
        <FaqIntro />

        {/* 2. Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-6 sm:mt-8">
          {/* Left Column: FAQ Groups */}
          <div className="lg:col-span-8 space-y-10 sm:space-y-12">
            {topicGroups.map((group) => (
              <FaqTopicGroup key={group.id} group={group} />
            ))}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <FaqSidebar
              sidebarTopics={sidebarTopics}
              browseTitle={t("sidebar.browseTitle")}
              quickLinksTitle={t("sidebar.quickLinks.title")}
              quickLinks={fallbackData.quickLinks}
              stillHaveQuestions={fallbackData.stillHaveQuestions}
            />
          </div>
        </div>
      </div>
    </PageGuard>
  );
}
