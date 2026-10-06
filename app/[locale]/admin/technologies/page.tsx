import * as React from "react";
import { getTechnologiesAction } from "@/lib/technologies/actions";
import { TechnologiesClient } from "@/components/admin/technologies/technologies-client";

interface AdminTechnologiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminTechnologiesPage({
  params,
}: AdminTechnologiesPageProps) {
  const { locale } = await params;
  const technologies = await getTechnologiesAction();

  return <TechnologiesClient initialTechnologies={technologies} locale={locale} />;
}
