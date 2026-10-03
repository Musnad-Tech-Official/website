import * as React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LuMessageSquare, LuExternalLink } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  getAllCommentsAdminAction,
  getCommentsStatsAdminAction,
} from "@/lib/comments/actions";
import { AdminCommentsClient } from "@/components/admin/comments/admin-comments-client";

interface AdminCommentsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AdminCommentsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === "ar";
  return {
    title: isRtl ? "إدارة التعليقات — مسند للتقنية" : "Comments Moderation — Musnad Tech",
  };
}

export default async function AdminCommentsPage({ params }: AdminCommentsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  const isRtl = locale === "ar";

  const [initialComments, initialStats] = await Promise.all([
    getAllCommentsAdminAction(),
    getCommentsStatsAdminAction(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <LuMessageSquare className="w-5 h-5" />
            </div>
            <span>{t("nav.comments")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? "متابعة وإدارة تعليقات ومناقشات القراء على مقالات المدونة، واعتماد التعليقات أو تصنيف المخالف منها وحذفه."
              : "Review, approve, and moderate reader comments and discussion threads across all published articles."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/blog" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl text-xs font-semibold cursor-pointer h-9 px-3.5"
            >
              <LuExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{isRtl ? "زيارة المدونة" : "View Blog"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Comments Moderation Client */}
      <AdminCommentsClient
        initialComments={initialComments}
        initialStats={initialStats}
        locale={locale}
      />
    </div>
  );
}
