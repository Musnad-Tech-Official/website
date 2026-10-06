/* eslint-disable @next/next/no-img-element */
"use client";

import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LuPencil,
  LuTrash2,
  LuExternalLink,
  LuSparkles,
  LuFolderGit2,
  LuGlobe,
} from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import type { Project, ProjectStatus } from "@/lib/projects/types";
import { cn } from "@/lib/utils";

interface ProjectsTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onToggleStatus: (id: string, newStatus: ProjectStatus) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onDelete: (id: string) => void;
  onResetFilters: () => void;
  isRtl: boolean;
}

export function ProjectsTable({
  projects,
  onEdit,
  onToggleStatus,
  onToggleFeatured,
  onDelete,
  onResetFilters,
  isRtl,
}: ProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted/60 border border-border/70 flex items-center justify-center mx-auto text-muted-foreground/80 mb-3">
          <LuFolderGit2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          {isRtl ? "لم يتم العثور على أي مشاريع" : "No projects found"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {isRtl
            ? "لم نجد أي مشاريع تطابق معايير البحث الحالية أو لم يتم إضافة مشاريع بعد."
            : "No projects match your current filters or no projects have been registered yet."}
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onResetFilters} className="text-xs h-8">
            {isRtl ? "إعادة ضبط التصفية" : "Reset Filters"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start border-collapse">
          <thead>
            <tr className="border-b border-border/70 bg-muted/40 text-muted-foreground font-semibold">
              <th className="py-3 px-4 text-start font-medium">{isRtl ? "المشروع" : "Project"}</th>
              <th className="py-3 px-3 text-start font-medium">{isRtl ? "التصنيف والسنة" : "Category & Year"}</th>
              <th className="py-3 px-3 text-start font-medium">{isRtl ? "التقنيات" : "Technologies"}</th>
              <th className="py-3 px-3 text-start font-medium">{isRtl ? "مميز بالموقع" : "Featured"}</th>
              <th className="py-3 px-3 text-start font-medium">{isRtl ? "الحالة" : "Status"}</th>
              <th className="py-3 px-4 text-end font-medium">{isRtl ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {projects.map((proj) => {
              const displayTitle = isRtl ? proj.titleAr || proj.titleEn : proj.titleEn || proj.titleAr;
              const displaySubtitle = isRtl
                ? proj.subtitleAr || proj.descriptionAr
                : proj.subtitleEn || proj.descriptionEn;

              return (
                <tr
                  key={proj.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Project Info & Thumbnail */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-muted flex items-center justify-center">
                        {proj.coverImage ? (
                          <img
                            src={proj.coverImage}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={cn(
                              "w-full h-full bg-linear-to-br flex items-center justify-center text-[10px] font-bold text-white/80",
                              proj.gradient || "from-zinc-900 to-black"
                            )}
                          >
                            <LuFolderGit2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 max-w-[240px] sm:max-w-[320px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground truncate text-xs sm:text-sm">
                            {displayTitle}
                          </span>
                          <Link
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                            title={isRtl ? "معاينة الصفحة العامة" : "View public page"}
                          >
                            <LuExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {displaySubtitle}
                        </p>
                        <span className="text-[10px] font-mono text-muted-foreground/80 block mt-0.5">
                          /{proj.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category & Year */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <Badge variant="secondary" size="sm" className="text-[10px] font-medium">
                        {proj.category}
                      </Badge>
                      <span className="block text-[10px] font-mono text-muted-foreground">
                        {proj.year}
                      </span>
                    </div>
                  </td>

                  {/* Technologies */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {proj.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted/60 text-muted-foreground border border-border/40"
                        >
                          {tech}
                        </span>
                      ))}
                      {proj.technologies.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{proj.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>



                  {/* Featured Toggle */}
                  <td className="py-3.5 px-3">
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(proj.id, !proj.featured)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer border transition-colors ${
                        proj.featured
                          ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/15"
                          : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                      }`}
                      title={
                        proj.featured
                          ? isRtl
                            ? "إلغاء التمييز في الصفحة الرئيسية"
                            : "Remove from home featured"
                          : isRtl
                          ? "تمييز في الصفحة الرئيسية"
                          : "Feature on home page"
                      }
                    >
                      <LuSparkles className="w-3 h-3" />
                      <span>{proj.featured ? (isRtl ? "نعم" : "Yes") : isRtl ? "لا" : "No"}</span>
                    </button>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-3">
                    <button
                      type="button"
                      onClick={() =>
                        onToggleStatus(proj.id, proj.status === "published" ? "draft" : "published")
                      }
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors border ${
                        proj.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          proj.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      <span>
                        {proj.status === "published"
                          ? isRtl
                            ? "منشور"
                            : "Published"
                          : isRtl
                          ? "مسودة"
                          : "Draft"}
                      </span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      {proj.liveDemoUrl && (
                        <a
                          href={proj.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                          title="Live Demo"
                        >
                          <LuGlobe className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                          title="GitHub Repository"
                        >
                          <FaGithub className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(proj)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                        title={isRtl ? "تعديل المشروع" : "Edit project"}
                      >
                        <LuPencil className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(proj.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                        title={isRtl ? "حذف المشروع" : "Delete project"}
                      >
                        <LuTrash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
