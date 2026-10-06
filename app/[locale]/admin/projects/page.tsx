import * as React from "react";
import { getTranslations } from "next-intl/server";
import { LuFolderGit2, LuExternalLink } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getProjectsAction } from "@/lib/projects/actions";
import { ProjectsClient } from "@/components/admin/projects/projects-client";

interface AdminProjectsProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminProjectsPage({ params }: AdminProjectsProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  const projects = await getProjectsAction();
  const isRtl = locale === "ar";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <LuFolderGit2 className="w-5 h-5" />
            </div>
            <span>{t("nav.projects")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? "إدارة المشاريع ودراسات الحالة الهندسية، التحرير المتقدم باستخدام محرر Tiptap، ورفع الصور والربط مع قاعدة البيانات."
              : "Manage engineering projects, case studies with Tiptap rich editor, technical metrics, and live portfolio showcase."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/projects" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl text-xs font-semibold cursor-pointer h-9 px-3.5"
            >
              <LuExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{isRtl ? "زيارة صفحة المشاريع" : "View Live Projects"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Projects Management Client */}
      <ProjectsClient initialProjects={projects} locale={locale} />
    </div>
  );
}
