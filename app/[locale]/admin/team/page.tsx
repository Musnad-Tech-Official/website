import * as React from "react";
import { getTranslations } from "next-intl/server";
import { LuUsers, LuExternalLink } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getTeamMembersAction } from "@/lib/team/actions";
import { TeamClient } from "@/components/admin/team/team-client";

interface AdminTeamProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminTeamPage({ params }: AdminTeamProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  const members = await getTeamMembersAction(false);
  const isRtl = locale === "ar";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <LuUsers className="w-5 h-5" />
            </div>
            <span>{t("nav.team")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? "إدارة وتخصيص أعضاء الفريق الهندسي، السير الذاتية، المهارات، والصور وربطهم بالمقالات المنشورة."
              : "Manage engineering leadership and team members, bios, skills, portraits, and author associations."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/team" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl text-xs font-semibold cursor-pointer h-9 px-3.5"
            >
              <LuExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{isRtl ? "زيارة صفحة الفريق" : "View Live Team"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Team Management Client */}
      <TeamClient initialMembers={members} locale={locale} />
    </div>
  );
}
