"use client";

import * as React from "react";
import type { Project, ProjectFormData, ProjectStatus } from "@/lib/projects/types";
import {
  useProjectsQuery,
  useSaveProjectMutation,
  useToggleProjectStatusMutation,
  useToggleProjectFeaturedMutation,
  useDeleteProjectMutation,
} from "@/lib/projects/hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProjectsFilters, type ProjectFiltersState } from "./projects-filters";
import { ProjectsTable } from "./projects-table";
import { ProjectEditorModal } from "./project-editor-modal";

interface ProjectsClientProps {
  initialProjects: Project[];
  locale: string;
}

export function ProjectsClient({ initialProjects, locale }: ProjectsClientProps) {
  const isRtl = locale === "ar";

  // 1. TanStack Query for cache & live sync
  const { data: projects = initialProjects } = useProjectsQuery({
    initialData: initialProjects,
  });

  const [filters, setFilters] = React.useState<ProjectFiltersState>({
    search: "",
    status: "all",
    category: "all",
  });

  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [deleteProjectId, setDeleteProjectId] = React.useState<string | null>(null);
  const [alertNotification, setAlertNotification] = React.useState<{
    type: "success" | "destructive" | "warning" | "info";
    message: string;
  } | null>(null);

  const showAlert = (
    message: string,
    type: "success" | "destructive" | "warning" | "info" = "success"
  ) => {
    setAlertNotification({ type, message });
    setTimeout(() => setAlertNotification(null), 4000);
  };

  // 2. Mutations
  const saveMutation = useSaveProjectMutation();
  const toggleStatusMutation = useToggleProjectStatusMutation();
  const toggleFeaturedMutation = useToggleProjectFeaturedMutation();
  const deleteMutation = useDeleteProjectMutation();

  // Distinct categories
  const categories = React.useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [projects]);

  // Counts
  const counts = React.useMemo(() => {
    return {
      total: projects.length,
      published: projects.filter((p) => p.status === "published").length,
      draft: projects.filter((p) => p.status === "draft").length,
    };
  }, [projects]);

  // Filtered projects
  const filteredProjects = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return projects.filter((proj) => {
      const matchSearch =
        q === "" ||
        proj.titleEn.toLowerCase().includes(q) ||
        proj.titleAr.includes(q) ||
        proj.slug.toLowerCase().includes(q) ||
        proj.technologies.some((t) => t.toLowerCase().includes(q));

      const matchStatus = filters.status === "all" || proj.status === filters.status;
      const matchCat = filters.category === "all" || proj.category === filters.category;

      return matchSearch && matchStatus && matchCat;
    });
  }, [projects, filters]);

  // Handlers
  const handleOpenNew = () => {
    setEditingProject(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleSave = async (data: ProjectFormData): Promise<boolean> => {
    try {
      await saveMutation.mutateAsync(data);
      showAlert(
        isRtl ? "تم حفظ بيانات المشروع بنجاح" : "Project saved successfully",
        "success"
      );
      return true;
    } catch (err: unknown) {
      showAlert((err as Error).message || "Failed to save project", "destructive");
      return false;
    }
  };

  const handleToggleStatus = (id: string, newStatus: ProjectStatus) => {
    toggleStatusMutation.mutate(
      { id, newStatus },
      {
        onSuccess: () => {
          showAlert(
            isRtl
              ? `تم تحديث حالة المشروع إلى ${newStatus === "published" ? "منشور" : "مسودة"}`
              : `Project status updated to ${newStatus}`,
            "success"
          );
        },
        onError: (err: Error) => {
          showAlert(err.message || "Failed to update project status", "destructive");
        },
      }
    );
  };

  const handleToggleFeatured = (id: string, featured: boolean) => {
    toggleFeaturedMutation.mutate(
      { id, featured },
      {
        onSuccess: () => {
          showAlert(
            isRtl
              ? featured
                ? "تم تمييز المشروع في الصفحة الرئيسية"
                : "تمت إزالة التمييز عن المشروع"
              : featured
              ? "Project is now featured on home page"
              : "Project removed from featured list",
            "success"
          );
        },
        onError: (err: Error) => {
          showAlert(err.message || "Failed to update featured flag", "destructive");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    setDeleteProjectId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProjectId) return;
    try {
      await deleteMutation.mutateAsync(deleteProjectId);
      showAlert(isRtl ? "تم حذف المشروع بنجاح" : "Project deleted successfully", "success");
    } catch (err: unknown) {
      showAlert((err as Error).message || "Failed to delete project", "destructive");
    } finally {
      setDeleteProjectId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification Toast */}
      {alertNotification && (
        <div className="fixed bottom-6 end-6 z-50 max-w-md w-full shadow-2xl animate-in fade-in-50 slide-in-from-bottom-5">
          <Alert
            variant={alertNotification.type}
            onClose={() => setAlertNotification(null)}
            className="bg-card/95 backdrop-blur-md shadow-xl border"
          >
            <AlertDescription className="text-xs sm:text-sm font-medium">
              {alertNotification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Control Filter Bar */}
      <ProjectsFilters
        filters={filters}
        onFiltersChange={setFilters}
        onNewProject={handleOpenNew}
        categories={categories}
        counts={counts}
        isRtl={isRtl}
      />

      {/* Projects Table */}
      <ProjectsTable
        projects={filteredProjects}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
        onDelete={handleDelete}
        onResetFilters={() => setFilters({ search: "", status: "all", category: "all" })}
        isRtl={isRtl}
      />

      {/* Project Editor Modal with Tiptap */}
      <ProjectEditorModal
        key={editingProject?.id || "new-project"}
        project={editingProject}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        isRtl={isRtl}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteProjectId)}
        onOpenChange={(open) => {
          if (!open) setDeleteProjectId(null);
        }}
        title={isRtl ? "حذف المشروع" : "Delete Project"}
        description={
          isRtl
            ? "هل أنت متأكد من رغبتك في حذف هذا المشروع نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to permanently delete this project? This action cannot be undone."
        }
        confirmLabel={isRtl ? "حذف نهائي" : "Delete Project"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
