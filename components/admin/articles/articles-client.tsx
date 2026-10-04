"use client";

import * as React from "react";
import type { Article, ArticleFormData, ArticleStatus } from "@/lib/articles/types";
import {
  useArticlesQuery,
  useSaveArticleMutation,
  useToggleArticleStatusMutation,
  useDeleteArticleMutation,
} from "@/lib/articles/hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ArticlesFilters, type ArticleFiltersState } from "./articles-filters";
import { ArticlesTable } from "./articles-table";
import { ArticleEditorModal } from "./article-editor-modal";

interface ArticlesClientProps {
  initialArticles: Article[];
  locale: string;
}

export function ArticlesClient({ initialArticles, locale }: ArticlesClientProps) {
  const isRtl = locale === "ar";

  // 1. TanStack Query for articles state & cache
  const { data: articles = initialArticles } = useArticlesQuery({
    initialData: initialArticles,
  });

  const [filters, setFilters] = React.useState<ArticleFiltersState>({
    search: "",
    status: "all",
    category: "all",
  });
  const [editingArticle, setEditingArticle] = React.useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [deleteArticleId, setDeleteArticleId] = React.useState<string | null>(null);
  const [alertNotification, setAlertNotification] = React.useState<{
    type: "success" | "destructive" | "warning" | "info";
    message: string;
  } | null>(null);

  // Show Alert notification
  const showAlert = (
    message: string,
    type: "success" | "destructive" | "warning" | "info" = "success"
  ) => {
    setAlertNotification({ type, message });
    setTimeout(() => setAlertNotification(null), 4000);
  };

  // 2. Mutations
  const saveMutation = useSaveArticleMutation();
  const toggleStatusMutation = useToggleArticleStatusMutation();
  const deleteMutation = useDeleteArticleMutation();

  // Distinct categories
  const categories = React.useMemo(() => {
    const set = new Set(articles.map((a) => a.category).filter(Boolean));
    return Array.from(set);
  }, [articles]);

  // Counts
  const counts = React.useMemo(() => {
    return {
      total: articles.length,
      published: articles.filter((a) => a.status === "published").length,
      draft: articles.filter((a) => a.status === "draft").length,
    };
  }, [articles]);

  // Filtered list
  const filteredArticles = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return articles.filter((art) => {
      const matchSearch =
        q === "" ||
        art.titleEn.toLowerCase().includes(q) ||
        art.titleAr.includes(q) ||
        art.slug.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q));

      const matchStatus = filters.status === "all" || art.status === filters.status;
      const matchCat = filters.category === "all" || art.category === filters.category;

      return matchSearch && matchStatus && matchCat;
    });
  }, [articles, filters]);

  // Action Handlers
  const handleOpenNew = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const handleSave = async (data: ArticleFormData): Promise<boolean> => {
    try {
      await saveMutation.mutateAsync(data);
      showAlert(isRtl ? "تم حفظ المقال بنجاح" : "Article saved successfully", "success");
      return true;
    } catch (err: unknown) {
      showAlert((err as Error).message || "Failed to save article", "destructive");
      return false;
    }
  };

  const handleToggleStatus = (id: string, newStatus: ArticleStatus) => {
    toggleStatusMutation.mutate(
      { id, newStatus },
      {
        onSuccess: () => {
          showAlert(
            isRtl
              ? `تم تحويل حالة المقال إلى ${newStatus === "published" ? "منشور" : "مسودة"}`
              : `Article status updated to ${newStatus}`,
            "success"
          );
        },
        onError: (err: Error) => {
          showAlert(err.message || "Failed to update status", "destructive");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    setDeleteArticleId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteArticleId) return;
    try {
      await deleteMutation.mutateAsync(deleteArticleId);
      showAlert(isRtl ? "تم حذف المقال بنجاح" : "Article deleted successfully", "success");
    } catch (err: unknown) {
      showAlert((err as Error).message || "Failed to delete article", "destructive");
    } finally {
      setDeleteArticleId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
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
      <ArticlesFilters
        filters={filters}
        onFiltersChange={setFilters}
        onNewArticle={handleOpenNew}
        categories={categories}
        counts={counts}
        isRtl={isRtl}
      />

      {/* Articles Table */}
      <ArticlesTable
        articles={filteredArticles}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onResetFilters={() => setFilters({ search: "", status: "all", category: "all" })}
        isRtl={isRtl}
      />

      {/* Create / Edit Article Modal (with Tiptap Editor) */}
      <ArticleEditorModal
        key={editingArticle?.id || "new-article"}
        article={editingArticle}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        isRtl={isRtl}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteArticleId)}
        onOpenChange={(open) => {
          if (!open) setDeleteArticleId(null);
        }}
        title={isRtl ? "حذف المقال" : "Delete Article"}
        description={
          isRtl
            ? "هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to permanently delete this article? This action cannot be undone."
        }
        confirmLabel={isRtl ? "حذف نهائي" : "Delete Article"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
