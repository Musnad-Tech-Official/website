import * as React from "react";
import { getInquiriesAction } from "@/lib/inquiries/actions";
import { InquiriesClient } from "@/components/admin/inquiries/inquiries-client";

interface AdminInquiriesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminInquiriesPage({
  params,
}: AdminInquiriesPageProps) {
  const { locale } = await params;
  const inquiries = await getInquiriesAction();

  return <InquiriesClient initialInquiries={inquiries} locale={locale} />;
}
