import * as React from "react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LuFileText, LuPlus, LuFilter, LuSearch } from "react-icons/lu";

interface AdminArticlesProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminArticlesPage({ params }: AdminArticlesProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuFileText className="w-6 h-6 text-primary" />
            {t("nav.articles")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage engineering blog posts, draft insights, categories, and tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="gap-2">
            <LuPlus className="w-4 h-4" />
            <span>New Article</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <LuSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles by title, slug, or tag..."
              className="w-full h-9 ps-9 pe-4 bg-muted/40 border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <LuFilter className="w-3.5 h-3.5" />
              <span>Filter Status</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State / Table Container */}
      <EmptyState
        icon={<LuFileText className="w-6 h-6 text-muted-foreground" />}
        title="No articles found in database"
        description="Your database schema has been cleanly reset. Articles table will be created in the next migration step."
        action={
          <Button variant="secondary" size="sm" className="gap-2">
            <LuPlus className="w-4 h-4" />
            <span>Create First Article</span>
          </Button>
        }
      />
    </div>
  );
}
