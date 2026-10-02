import * as React from "react";
import { getTranslations } from "next-intl/server";
import { LuFileText, LuExternalLink } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getArticlesAction } from "@/lib/articles/actions";
import { ArticlesClient } from "@/components/admin/articles/articles-client";

interface AdminArticlesProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminArticlesPage({ params }: AdminArticlesProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  const articles = await getArticlesAction();
  const isRtl = locale === "ar";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <LuFileText className="w-5 h-5" />
            </div>
            <span>{t("nav.articles")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? "إدارة مقالات المدونة الهندسية، التحرير المتقدم باستخدام محرر Tiptap، ورفع الصور وإدارتها مع التخزين وقاعدة البيانات."
              : "Manage technical articles, create and paste rich media with Tiptap editor, and publish live to the blog."}
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
              <span>{isRtl ? "زيارة المدونة المباشرة" : "View Live Blog"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Articles Management Client */}
      <ArticlesClient initialArticles={articles} locale={locale} />
    </div>
  );
}

