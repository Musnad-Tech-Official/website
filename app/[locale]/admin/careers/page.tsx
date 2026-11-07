import * as React from "react";
import { getCareerJobsAction, getCareerValuesAction } from "@/lib/careers/actions";
import { CareersClient } from "@/components/admin/careers/careers-client";

interface AdminCareersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminCareersPage({ params }: AdminCareersPageProps) {
  const { locale } = await params;

  const [jobs, values] = await Promise.all([
    getCareerJobsAction(true),
    getCareerValuesAction(true),
  ]);

  return <CareersClient initialJobs={jobs} initialValues={values} locale={locale} />;
}
