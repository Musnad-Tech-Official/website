import * as React from "react";
import { getTrustedCompaniesAction } from "@/lib/companies/actions";
import { CompaniesClient } from "@/components/admin/companies/companies-client";

interface AdminCompaniesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminCompaniesPage({
  params,
}: AdminCompaniesPageProps) {
  const { locale } = await params;
  const companies = await getTrustedCompaniesAction(true); // include inactive for admin

  return <CompaniesClient initialCompanies={companies} locale={locale} />;
}
