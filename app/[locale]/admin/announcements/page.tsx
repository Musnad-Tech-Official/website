import * as React from "react";
import { getAllAnnouncementsAction } from "@/lib/announcements/actions";
import { AnnouncementsClient } from "@/components/admin/announcements/announcements-client";

interface AdminAnnouncementsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminAnnouncementsPage({
  params,
}: AdminAnnouncementsPageProps) {
  const { locale } = await params;
  const announcements = await getAllAnnouncementsAction();

  return <AnnouncementsClient initialAnnouncements={announcements} locale={locale} />;
}
