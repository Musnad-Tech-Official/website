import * as React from "react";
import { getServicesAction } from "@/lib/services/actions";
import { ServicesClient } from "@/components/admin/services/services-client";

interface AdminServicesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminServicesPage({
  params,
}: AdminServicesPageProps) {
  const { locale } = await params;
  const services = await getServicesAction(true); // include inactive for admin management

  return <ServicesClient initialServices={services} locale={locale} />;
}
