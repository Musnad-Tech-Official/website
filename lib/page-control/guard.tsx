import * as React from "react";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getPageControlsAction } from "./actions";
import { PageMaintenanceNotice, AdminPreviewBanner } from "@/components/ui/page-maintenance";

interface PageGuardProps {
  slug: string;
  locale: string;
  children: React.ReactNode;
}

/**
 * Server Component Guard that enforces admin-configured visibility rules
 * on any page. If the page is marked 'hidden', visitors get a 404.
 * If 'maintenance', visitors get the maintenance screen.
 * Admins are granted bypass with a preview indicator.
 */
export async function PageGuard({ slug, locale, children }: PageGuardProps) {
  const pages = await getPageControlsAction();
  const page = pages.find((p) => p.id === slug || p.path === slug);

  // If page is not managed or marked as live, render immediately
  if (!page || page.status === "live") {
    return <>{children}</>;
  }

  // Check current session
  const { sessionClaims } = await auth();
  const isAdmin = sessionClaims?.metadata?.role === "admin";
  const isRtl = locale === "ar";

  // Hidden status enforcement
  if (page.status === "hidden") {
    if (!isAdmin) {
      notFound();
    }
    return (
      <>
        <AdminPreviewBanner status="hidden" isRtl={isRtl} />
        {children}
      </>
    );
  }

  // Maintenance status enforcement
  if (page.status === "maintenance") {
    if (isAdmin) {
      return (
        <>
          <AdminPreviewBanner status="maintenance" isRtl={isRtl} />
          {children}
        </>
      );
    }

    const title = isRtl ? page.titleAr : page.titleEn;
    const message = isRtl ? page.maintenanceNoticeAr : page.maintenanceNoticeEn;

    return (
      <PageMaintenanceNotice
        locale={locale}
        pageTitle={title}
        customMessage={message}
      />
    );
  }

  return <>{children}</>;
}
