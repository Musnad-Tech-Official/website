"use client";

import * as React from "react";
import { LuCircleCheck } from "react-icons/lu";
import type { Article, ArticleFormData, ArticleStatus } from "@/lib/articles/types";
import {
  useArticlesQuery,
  useSaveArticleMutation,
  useToggleArticleStatusMutation,
  useDeleteArticleMutation,
} from "@/lib/articles/hooks";
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
  const [notification, setNotification] = React.useState<string | null>(null);

  // Show toast notification
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
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
      showToast(isRtl ? "تم حفظ المقال بنجاح" : "Article saved successfully");
      return true;
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to save article");
      return false;
    }
  };

  const handleToggleStatus = (id: string, newStatus: ArticleStatus) => {
    toggleStatusMutation.mutate(
      { id, newStatus },
      {
        onSuccess: () => {
          showToast(
            isRtl
              ? `تم تحويل حالة المقال إلى ${newStatus === "published" ? "منشور" : "مسودة"}`
              : `Article status updated to ${newStatus}`
          );
        },
        onError: (err: Error) => {
          alert(err.message || "Failed to update status");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (
      !confirm(
        isRtl
          ? "هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً؟"
          : "Are you sure you want to permanently delete this article?"
      )
    ) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast(isRtl ? "تم حذف المقال بنجاح" : "Article deleted successfully");
      },
      onError: (err: Error) => {
        alert(err.message || "Failed to delete article");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 end-6 z-50 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in-50 slide-in-from-bottom-5">
          <LuCircleCheck className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
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
    </div>
  );
}
