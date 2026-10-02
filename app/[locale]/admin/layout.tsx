import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export const metadata = {
  title: "Admin Portal | Musnad Tech",
  description: "Musnad Tech Administrative Cockpit and Operations Center",
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;
  const { userId, sessionClaims } = await auth();

  // Layer 2: Server Component Security Guard
  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  const role = sessionClaims?.metadata?.role;
  if (role !== "admin") {
    // Return 404 to avoid endpoint enumeration
    notFound();
  }

  return <AdminShell locale={locale}>{children}</AdminShell>;
}
