import * as React from "react";
import {
  getOptionalAboutContentForAdminAction,
  getAboutValuesAction,
  getAboutMilestonesAction,
  getAboutApproachAction,
} from "@/lib/about/actions";
import { AboutClient } from "@/components/admin/about/about-client";

interface AdminAboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminAboutPage({ params }: AdminAboutPageProps) {
  const { locale } = await params;

  const [content, values, milestones, approach] = await Promise.all([
    getOptionalAboutContentForAdminAction(),
    getAboutValuesAction(true),
    getAboutMilestonesAction(true),
    getAboutApproachAction(true),
  ]);

  return (
    <AboutClient
      initialContent={content}
      initialValues={values}
      initialMilestones={milestones}
      initialApproach={approach}
      locale={locale}
    />
  );
}
