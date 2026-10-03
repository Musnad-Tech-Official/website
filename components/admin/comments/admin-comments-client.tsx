"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import {
  LuMessageSquare,
  LuCircleCheck,
  LuFlag,
  LuClock,
  LuTrash2,
  LuSearch,
  LuExternalLink,
  LuLoader,
  LuCornerDownRight,
  LuRefreshCw,
} from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ArticleComment } from "@/lib/comments/types";
import {
  useAdminCommentsQuery,
  useAdminCommentStatsQuery,
  useUpdateCommentStatusMutation,
  useAdminDeleteCommentMutation,
} from "@/lib/comments/hooks";
import { cn } from "@/lib/utils";

interface AdminCommentsClientProps {
  initialComments: ArticleComment[];
  initialStats: {
    total: number;
    approved: number;
    pending: number;
    flagged: number;
  };
  locale: string;
}

export function AdminCommentsClient({
  initialComments,
  initialStats,
  locale,
}: AdminCommentsClientProps) {
  const isRtl = locale === "ar";

  const [search, setSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedArticle, setSelectedArticle] = React.useState<string>("all");
  const [notification, setNotification] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Queries
  const {
    data: comments = initialComments,
    isLoading,
    refetch,
    isFetching,
  } = useAdminCommentsQuery(
    {
      status: selectedStatus,
      articleSlug: selectedArticle,
      search,
    },
    initialComments
  );

  const { data: stats = initialStats } = useAdminCommentStatsQuery(initialStats);

  // Mutations
  const updateStatusMutation = useUpdateCommentStatusMutation();
  const deleteMutation = useAdminDeleteCommentMutation();

  // Distinct article slugs for filter dropdown
  const articleSlugs = React.useMemo(() => {
    const slugs = new Set(initialComments.map((c) => c.articleSlug).filter(Boolean));
    return Array.from(slugs);
  }, [initialComments]);

  // Action handlers
  const handleUpdateStatus = async (
    commentId: string,
    status: ArticleComment["status"]
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ commentId, status });
      const msg =
        status === "approved"
          ? isRtl
            ? "تمت الموافقة على التعليق"
            : "Comment approved"
          : isRtl
          ? "تم تصنيف التعليق كمزعج (Spam)"
          : "Comment flagged as spam";
      showToast(msg);
    } catch {
      alert(isRtl ? "حدث خطأ أثناء تعديل الحالة" : "Failed to update status");
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = window.confirm(
      isRtl
        ? "هل أنت متأكد من رغبتك في حذف هذا التعليق نهائياً؟"
        : "Are you sure you want to permanently delete this comment?"
    );
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(commentId);
      showToast(isRtl ? "تم حذف التعليق بنجاح" : "Comment permanently deleted");
    } catch {
      alert(isRtl ? "فشل حذف التعليق" : "Failed to delete comment");
    }
  };

  const getStatusBadge = (status: ArticleComment["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" size="sm" dot>
            {isRtl ? "معتمد" : "Approved"}
          </Badge>
        );
      case "flagged":
        return (
          <Badge variant="destructive" size="sm" dot>
            {isRtl ? "مخالف" : "Flagged"}
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="warning" size="sm" dot>
            {isRtl ? "قيد المراجعة" : "Pending"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 end-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-foreground text-background shadow-xl text-xs font-semibold">
            <LuCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {isRtl ? "إجمالي التعليقات" : "Total Comments"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <LuMessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {stats.total}
          </div>
        </div>

        {/* Approved */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {isRtl ? "معتمدة" : "Approved"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <LuCircleCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.approved}
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {isRtl ? "قيد المراجعة" : "Pending"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <LuClock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {stats.pending}
          </div>
        </div>

        {/* Flagged */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {isRtl ? "مخالفة / Spam" : "Flagged"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
              <LuFlag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-destructive">
            {stats.flagged}
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder={
                isRtl
                  ? "البحث في التعليقات أو أسماء الكتاب..."
                  : "Search comments, authors, or articles..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<LuSearch className="w-4 h-4 text-muted-foreground" />}
              className="h-9 text-xs rounded-xl bg-background"
            />
          </div>

          {/* Filters & Refresh */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
              {[
                { id: "all", labelEn: "All", labelAr: "الكل" },
                { id: "approved", labelEn: "Approved", labelAr: "معتمد" },
                { id: "pending", labelEn: "Pending", labelAr: "مراجعة" },
                { id: "flagged", labelEn: "Flagged", labelAr: "مخالف" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStatus(s.id)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer",
                    selectedStatus === s.id
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isRtl ? s.labelAr : s.labelEn}
                </button>
              ))}
            </div>

            {/* Article Selector (if multiple articles) */}
            {articleSlugs.length > 0 && (
              <div className="relative">
                <select
                  value={selectedArticle}
                  onChange={(e) => setSelectedArticle(e.target.value)}
                  aria-label="Filter by article"
                  className="h-9 px-3 py-1.5 text-xs font-medium rounded-xl bg-background text-foreground border border-border/80 focus:outline-hidden focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="all">
                    {isRtl ? "جميع المقالات" : "All Articles"}
                  </option>
                  {articleSlugs.map((slug) => (
                    <option key={slug} value={slug}>
                      {slug}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              title={isRtl ? "تحديث" : "Refresh"}
              className="h-9 w-9 p-0 rounded-xl cursor-pointer"
            >
              <LuRefreshCw
                className={cn("w-3.5 h-3.5", isFetching && "animate-spin text-primary")}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Comments List / Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <LuLoader className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs font-medium">
              {isRtl ? "جاري تحميل التعليقات..." : "Loading comments..."}
            </p>
          </div>
        ) : comments.length > 0 ? (
          <div className="divide-y divide-border/50">
            {comments.map((comment) => {
              const isReplying = Boolean(comment.parentId);

              return (
                <div
                  key={comment.id}
                  className="p-4 sm:p-5 hover:bg-muted/20 transition-colors flex flex-col sm:flex-row items-start gap-4"
                >
                  {/* Author Avatar */}
                  <Avatar
                    src={comment.userAvatar}
                    alt={comment.userName}
                    fallback={comment.userName.slice(0, 2).toUpperCase()}
                    size="md"
                    className="shrink-0 border border-border/70 mt-1 shadow-2xs"
                  />

                  {/* Comment Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {comment.userName}
                      </span>

                      {comment.userRole === "admin" && (
                        <Badge variant="secondary" size="sm" className="text-[10px]">
                          {isRtl ? "فريق مسند" : "Musnad Team"}
                        </Badge>
                      )}

                      {getStatusBadge(comment.status)}

                      {isReplying && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md">
                          <LuCornerDownRight className="w-3 h-3 rtl:-scale-x-100" />
                          <span>{isRtl ? "رد" : "Reply"}</span>
                        </span>
                      )}

                      <span className="text-xs text-muted-foreground ms-auto">
                        {new Date(comment.createdAt).toLocaleDateString(
                          isRtl ? "ar-EG" : "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>

                    {/* Comment text */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line break-words">
                      {comment.content}
                    </div>

                    {/* Article Reference & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {/* Target article link */}
                      <Link
                        href={`/blog/${comment.articleSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-2"
                      >
                        <LuExternalLink className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px] truncate max-w-xs sm:max-w-md">
                          /blog/{comment.articleSlug}
                        </span>
                      </Link>

                      {/* Moderation Action Buttons */}
                      <div className="flex items-center gap-1.5 ms-auto">
                        {comment.status !== "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(comment.id, "approved")}
                            disabled={updateStatusMutation.isPending}
                            className="h-7 text-xs rounded-lg px-2.5 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 cursor-pointer"
                          >
                            <LuCircleCheck className="w-3.5 h-3.5" />
                            <span>{isRtl ? "اعتماد" : "Approve"}</span>
                          </Button>
                        )}

                        {comment.status !== "flagged" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(comment.id, "flagged")}
                            disabled={updateStatusMutation.isPending}
                            className="h-7 text-xs rounded-lg px-2.5 gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 border-amber-300 dark:border-amber-800 cursor-pointer"
                          >
                            <LuFlag className="w-3.5 h-3.5" />
                            <span>{isRtl ? "مخالفة" : "Flag"}</span>
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          disabled={deleteMutation.isPending}
                          title={isRtl ? "حذف نهائي" : "Delete permanently"}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                        >
                          <LuTrash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
              <LuMessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {isRtl ? "لا توجد تعليقات" : "No comments found"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {isRtl
                  ? "لم يتم العثور على تعليقات مطابقة لمعايير البحث الحالية."
                  : "No comments match the selected filters or search criteria."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
