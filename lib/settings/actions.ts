"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getArticlesAction } from "@/lib/articles/actions";
import { getProjectsAction } from "@/lib/projects/actions";
import { getServicesAction } from "@/lib/services/actions";
import { getTeamMembersAction } from "@/lib/team/actions";
import { getInquiriesAction } from "@/lib/inquiries/actions";
import { getAllAnnouncementsAction } from "@/lib/announcements/actions";
import { getNewsletterSubscribersCountAction } from "@/lib/newsletter/actions";
import { getUsersAction } from "@/lib/users/actions";

async function verifyAdminAuth(): Promise<string> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const role = sessionClaims?.metadata?.role;
  if (role !== "admin") {
    throw new Error("Forbidden: Administrator privileges required.");
  }

  return userId;
}

export interface SystemTelemetry {
  articlesCount: number;
  projectsCount: number;
  servicesCount: number;
  teamCount: number;
  inquiriesCount: number;
  announcementsCount: number;
  subscribersCount: number;
  usersCount: number;
  supabaseConfigured: boolean;
  clerkConfigured: boolean;
  nodeEnv: string;
}

export async function getSystemTelemetryAction(): Promise<SystemTelemetry> {
  await verifyAdminAuth();

  const [
    articles,
    projects,
    services,
    team,
    inquiries,
    announcements,
    subscribersCount,
    users,
  ] = await Promise.all([
    getArticlesAction().catch(() => []),
    getProjectsAction().catch(() => []),
    getServicesAction().catch(() => []),
    getTeamMembersAction().catch(() => []),
    getInquiriesAction().catch(() => []),
    getAllAnnouncementsAction().catch(() => []),
    getNewsletterSubscribersCountAction().catch(() => 0),
    getUsersAction().catch(() => []),
  ]);

  return {
    articlesCount: articles.length,
    projectsCount: projects.length,
    servicesCount: services.length,
    teamCount: team.length,
    inquiriesCount: inquiries.length,
    announcementsCount: announcements.length,
    subscribersCount,
    usersCount: users.length,
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    clerkConfigured: Boolean(process.env.CLERK_SECRET_KEY),
    nodeEnv: process.env.NODE_ENV || "production",
  };
}

export async function purgeSystemCacheAction(): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  const routes = [
    "/",
    "/en",
    "/ar",
    "/en/blog",
    "/ar/blog",
    "/en/projects",
    "/ar/projects",
    "/en/services",
    "/ar/services",
    "/en/about",
    "/ar/about",
    "/en/contact",
    "/ar/contact",
  ];

  for (const route of routes) {
    revalidatePath(route, "layout");
  }

  return {
    success: true,
    message: "Global page cache purged and ISR revalidation triggered across all locales.",
  };
}
