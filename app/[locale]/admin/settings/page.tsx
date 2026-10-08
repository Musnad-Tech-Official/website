import * as React from "react";
import { SettingsClient } from "@/components/admin/settings/settings-client";
import { getSystemTelemetryAction } from "@/lib/settings/actions";

interface AdminSettingsProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminSettingsPage({ params }: AdminSettingsProps) {
  const { locale } = await params;
  const initialTelemetry = await getSystemTelemetryAction();

  return <SettingsClient initialTelemetry={initialTelemetry} locale={locale} />;
}
