import * as React from "react";
import { getFaqTopicsAction, getFaqQuestionsAction } from "@/lib/faqs/actions";
import { FaqsClient } from "@/components/admin/faqs/faqs-client";

interface AdminFaqsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminFaqsPage({ params }: AdminFaqsPageProps) {
  const { locale } = await params;

  const [topics, questions] = await Promise.all([
    getFaqTopicsAction(true),
    getFaqQuestionsAction(undefined, true),
  ]);

  return <FaqsClient initialTopics={topics} initialQuestions={questions} locale={locale} />;
}
