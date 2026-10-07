"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  LuMessageSquare,
  LuCornerDownRight,
  LuTrash2,
  LuLoader,
  LuSend,
  LuLogIn,
  LuInfo,
} from "react-icons/lu";
import type {
  ProjectDetailCommentsProps,
} from "./project-detail-types";
import type { ArticleComment } from "@/lib/comments/types";
import {
  useArticleCommentsQuery,
  useAddArticleCommentMutation,
  useDeleteArticleCommentMutation,
} from "@/lib/comments/hooks";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString: string, locale: string, justNowText: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return justNowText;
    }

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return rtf.format(-minutes, "minute");
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return rtf.format(-hours, "hour");
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return rtf.format(-days, "day");
    }

    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

interface ProjectCommentItemProps {
  comment: ArticleComment;
  projectSlug: string;
  projectId?: string;
  currentUserId?: string | null;
  isAdmin?: boolean;
  locale: string;
  replyLabel: string;
  isNested?: boolean;
}

function ProjectCommentItem({
  comment,
  projectSlug,
  projectId,
  currentUserId,
  isAdmin,
  locale,
  replyLabel,
  isNested = false,
}: ProjectCommentItemProps) {
  const isAr = locale === "ar";
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);

  const addCommentMutation = useAddArticleCommentMutation();
  const deleteCommentMutation = useDeleteArticleCommentMutation();

  const isOwner = Boolean(currentUserId && currentUserId === comment.userId);
  const canDelete = isOwner || isAdmin;
  const isTeam = comment.userRole === "admin" || comment.userRole === "team";

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError(null);

    const trimmed = replyContent.trim();
    if (!trimmed) {
      setReplyError(isAr ? "يرجى إدخال نص الرد." : "Please enter a reply.");
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        articleId: projectId,
        articleSlug: projectSlug,
        content: trimmed,
        parentId: comment.id,
      });
      setReplyContent("");
      setIsReplying(false);
    } catch {
      setReplyError(isAr ? "فشل إرسال الرد، يرجى المحاولة لاحقاً." : "Failed to post reply. Please try again.");
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      await deleteCommentMutation.mutateAsync({
        commentId: comment.id,
        articleSlug: projectSlug,
      });
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Failed to delete project comment:", err);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3.5 sm:gap-4 transition-all",
        isNested ? "mt-4 pt-4 border-t border-border/40" : "pt-6 first:pt-0"
      )}
    >
      <Avatar
        src={comment.userAvatar}
        alt={comment.userName}
        fallback={comment.userName.slice(0, 2).toUpperCase()}
        size={isNested ? "sm" : "md"}
        className="shrink-0 border border-border/70 mt-0.5 shadow-2xs"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-semibold text-sm text-foreground">
            {comment.userName}
          </span>

          {isTeam && (
            <Badge variant="secondary" size="sm" className="text-[10px] font-medium py-0">
              {isAr ? "فريق مسند" : "Musnad Team"}
            </Badge>
          )}

          <span className="text-xs text-muted-foreground ms-auto">
            {formatRelativeTime(comment.createdAt, locale, isAr ? "الآن" : "Just now")}
          </span>
        </div>

        <p className="text-sm text-foreground/90 mt-2 leading-relaxed whitespace-pre-line break-words">
          {comment.content}
        </p>

        <div className="mt-3 flex items-center gap-3">
          {currentUserId && !isNested && (
            <button
              type="button"
              onClick={() => {
                setIsReplying(!isReplying);
                setReplyError(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <LuCornerDownRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
              <span>{isReplying ? (isAr ? "إلغاء" : "Cancel") : replyLabel}</span>
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteCommentMutation.isPending}
              aria-label={isAr ? "حذف" : "Delete"}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 border border-destructive/25 rounded-lg px-2 py-0.5 transition-colors cursor-pointer ms-auto"
            >
              {deleteCommentMutation.isPending ? (
                <LuLoader className="h-3 w-3 animate-spin" />
              ) : (
                <LuTrash2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{isAr ? "حذف" : "Delete"}</span>
            </button>
          )}
        </div>

        {isReplying && (
          <form
            onSubmit={handleReplySubmit}
            className="mt-4 p-3 rounded-xl bg-muted/40 border border-border/70 space-y-2.5 animate-in fade-in duration-150"
          >
            <textarea
              required
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={isAr ? "اكتب ردك هنا..." : "Write your reply here..."}
              aria-label={isAr ? "اكتب ردك هنا..." : "Write your reply here..."}
              className="w-full text-xs bg-background text-foreground placeholder:text-muted-foreground/70 rounded-lg p-2.5 border border-border/80 focus:outline-hidden focus:ring-2 focus:ring-primary/20 resize-none transition-colors"
            />
            {replyError && (
              <p className="text-[11px] font-medium text-destructive">{replyError}</p>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent("");
                }}
                className="h-7 text-xs rounded-lg px-2.5 cursor-pointer"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={addCommentMutation.isPending}
                className="h-7 text-xs rounded-lg px-3 gap-1 cursor-pointer"
              >
                {addCommentMutation.isPending ? (
                  <LuLoader className="h-3 w-3 animate-spin" />
                ) : (
                  <LuSend className="h-3 w-3 rtl:-scale-x-100" />
                )}
                <span>
                  {addCommentMutation.isPending
                    ? isAr
                      ? "جارٍ النشر..."
                      : "Posting..."
                    : isAr
                    ? "إرسال الرد"
                    : "Post Reply"}
                </span>
              </Button>
            </div>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 ps-3.5 sm:ps-5 border-s-2 border-border/60 space-y-1">
            {comment.replies.map((reply) => (
              <ProjectCommentItem
                key={reply.id}
                comment={reply}
                projectSlug={projectSlug}
                projectId={projectId}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                locale={locale}
                replyLabel={replyLabel}
                isNested
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={isAr ? "حذف التعليق" : "Delete Comment"}
        description={
          isAr
            ? "هل أنت متأكد من رغبتك في حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to delete this comment? This action cannot be undone."
        }
        confirmLabel={isAr ? "حذف" : "Delete"}
        cancelLabel={isAr ? "إلغاء" : "Cancel"}
        variant="destructive"
        isLoading={deleteCommentMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export function ProjectDetailComments({
  title,
  projectSlug,
  projectId,
  initialComments = [],
  placeholder = "Write a thoughtful review or comment...",
  submitLabel = "Post review",
  replyLabel = "Reply",
  emptyMessage = "No comments or reviews yet. Be the first to share your thoughts!",
  integrationNotice,
  className = "",
}: ProjectDetailCommentsProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { isSignedIn, user } = useUser();

  const [commentText, setCommentText] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // TanStack Query for live comments management
  const slug = projectSlug || "project";
  const { data: comments = initialComments, isLoading } = useArticleCommentsQuery(
    slug,
    initialComments
  );
  const addCommentMutation = useAddArticleCommentMutation();

  const isAdmin = (user?.publicMetadata?.role as string) === "admin";

  // Calculate total count (root + nested)
  const countAll = (list: ArticleComment[]): number =>
    list.reduce((acc, c) => acc + 1 + (c.replies ? countAll(c.replies) : 0), 0);
  const totalComments = countAll(comments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const trimmed = commentText.trim();
    if (!trimmed) {
      setSubmitError(isAr ? "يرجى كتابة نص التعليق أولاً." : "Please enter your comment.");
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        articleId: projectId,
        articleSlug: slug,
        content: trimmed,
      });
      setCommentText("");
    } catch {
      setSubmitError(isAr ? "حدث خطأ أثناء نشر التعليق. يرجى المحاولة لاحقاً." : "Failed to post comment. Please try again.");
    }
  };

  return (
    <section
      aria-labelledby="detail-comments-heading"
      className={cn("py-12 sm:py-16 border-t border-border/60", className)}
    >
      {/* 1. Header & Section Title with Count Badge */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <h2
            id="detail-comments-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
          >
            {title}
          </h2>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border/60">
            {totalComments}
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mb-8 leading-relaxed">
        {isAr
          ? "شارك تجربتك وملاحظاتك حول هذا المشروع أو اطرح أسئلتك على فريق العمل والمهندسين المشرفين."
          : "Share your thoughts, review engineering decisions, or discuss technical insights with the project team."}
      </p>

      {/* Integration Notice if explicitly provided */}
      {integrationNotice && (
        <div
          role="note"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground mb-6"
        >
          <LuInfo className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span className="leading-relaxed">{integrationNotice}</span>
        </div>
      )}

      {/* 2. Interactive Comment Box */}
      {isSignedIn ? (
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs mb-10 transition-all">
          <div className="flex items-start gap-3 sm:gap-4">
            <Avatar
              src={user.imageUrl}
              alt={user.fullName || "User"}
              fallback={(user.fullName || "U").slice(0, 2).toUpperCase()}
              size="md"
              className="shrink-0 border border-border/70 mt-1 shadow-2xs"
            />
            <form onSubmit={handleSubmit} className="flex-1 space-y-3">
              <textarea
                required
                rows={3}
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  if (submitError) setSubmitError(null);
                }}
                placeholder={placeholder}
                aria-label={placeholder}
                disabled={addCommentMutation.isPending}
                className="w-full text-sm bg-background text-foreground placeholder:text-muted-foreground/70 rounded-xl p-3 border border-border/80 focus:outline-hidden focus:ring-2 focus:ring-primary/20 resize-y transition-colors min-h-[80px]"
              />

              {submitError && (
                <p className="text-xs font-medium text-destructive">{submitError}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={addCommentMutation.isPending}
                  className="rounded-xl px-4 py-2 font-semibold gap-1.5 shadow-xs cursor-pointer"
                >
                  {addCommentMutation.isPending ? (
                    <>
                      <LuLoader className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      <span>{isAr ? "جارٍ النشر..." : "Posting..."}</span>
                    </>
                  ) : (
                    <>
                      <LuSend className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
                      <span>{submitLabel}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div
              aria-hidden="true"
              className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0"
            >
              <LuLogIn className="h-5 w-5 rtl:-scale-x-100" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isAr ? "سجّل الدخول للمشاركة في النقاش" : "Sign in to join the discussion"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isAr
                  ? "تسجيل الدخول يتيح لك نشر المراجعات والرد على مناقشات المشاريع."
                  : "Accounts unlock project discussions, reviews, and community replies."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
              >
                {isAr ? "تسجيل الدخول" : "Sign In"}
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors border border-border/60 cursor-pointer"
              >
                {isAr ? "إنشاء حساب" : "Sign Up"}
              </button>
            </SignUpButton>
          </div>
        </div>
      )}

      {/* 3. Comments Feed or Empty State */}
      {isLoading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <LuLoader className="h-4 w-4 animate-spin text-primary" />
          <span>{isAr ? "جارٍ تحميل التعليقات والمراجعات..." : "Loading comments & reviews..."}</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs divide-y divide-border/40">
          {comments.map((comment) => (
            <ProjectCommentItem
              key={comment.id}
              comment={comment}
              projectSlug={slug}
              projectId={projectId}
              currentUserId={user?.id || null}
              isAdmin={isAdmin}
              locale={locale}
              replyLabel={replyLabel}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 py-12 px-6 text-center space-y-2">
          <LuMessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">
            {emptyMessage}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {isAr
              ? "كن أول من يكتب تعليقاً أو يشارك رأيه حول هذا المشروع التقني."
              : "Be the first to share your thoughts or start a technical conversation."}
          </p>
        </div>
      )}
    </section>
  );
}
