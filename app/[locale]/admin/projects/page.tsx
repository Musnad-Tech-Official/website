import * as React from "react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LuFolderGit2, LuPlus, LuFilter, LuSearch } from "react-icons/lu";

interface AdminProjectsProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminProjectsPage({ params }: AdminProjectsProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuFolderGit2 className="w-6 h-6 text-primary" />
            {t("nav.projects")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage engineering projects, showcase case studies, media, and technology stacks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="gap-2">
            <LuPlus className="w-4 h-4" />
            <span>New Project</span>
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
              placeholder="Search projects by title, client, or category..."
              className="w-full h-9 ps-9 pe-4 bg-muted/40 border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <LuFilter className="w-3.5 h-3.5" />
              <span>Status Filter</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <EmptyState
        icon={<LuFolderGit2 className="w-6 h-6 text-muted-foreground" />}
        title="No projects found in database"
        description="Your database schema has been cleanly reset. The projects table will be created in the next migration step."
        action={
          <Button variant="secondary" size="sm" className="gap-2">
            <LuPlus className="w-4 h-4" />
            <span>Register First Project</span>
          </Button>
        }
      />
    </div>
  );
}
