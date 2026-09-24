"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuCornerDownRight, LuMessageSquare, LuLock, LuInfo } from "react-icons/lu";
import type {
  ProjectDetailComment,
  ProjectDetailCommentsProps,
} from "./project-detail-types";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * SECURITY BOUNDARY & ARCHITECTURAL NOTE:
 * Frontend gating is UX only.
 * Real security enforcement must happen later in the Backend / Supabase RLS
 * layer using:
 *   authenticated user ID + project ID + verified project experience record.
 * The frontend must NEVER be treated as the security boundary.
 *
 * FUTURE BACKEND FLOW:
 *   Clerk authenticated user
 *   → project resolved by slug
 *   → backend obtains stable project ID
 *   → backend checks verified project experience
 *   → backend returns interaction eligibility
 *   → Project Detail UI enables/disables Comments input
 * ============================================================================
 */

function CommentItem({
  comment,
  replyLabel,
  isNested = false,
}: {
  comment: ProjectDetailComment;
  replyLabel: string;
  isNested?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-3.5 sm:gap-4",
        isNested ? "mt-4 pt-4 border-t border-border/50" : "pt-6 first:pt-0"
      )}
    >
      <Avatar
        size={isNested ? "sm" : "md"}
        fallback={comment.initials}
        alt={comment.authorName}
        className="shrink-0 border border-border/70"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-semibold text-sm text-foreground">
            {comment.authorName}
          </span>
          {comment.authorRole && (
            <Badge variant="secondary" size="sm" className="text-[10px]">
              {comment.authorRole}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ms-auto">
            {comment.timestamp}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {comment.content}
        </p>

        {!isNested && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60 transition-colors cursor-not-allowed opacity-60"
            >
              <LuCornerDownRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
              <span>{replyLabel}</span>
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 ps-4 border-s-2 border-border/80">
            {comment.replies.map((reply: ProjectDetailComment) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replyLabel={replyLabel}
                isNested
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectDetailComments({
  title,
  placeholder = "Write a thoughtful comment...",
  submitLabel = "Post comment",
  replyLabel = "Reply",
  emptyMessage = "No comments yet.",
  integrationNotice = "Comments will be available when account interactions are connected.",
  items = [],
  eligibility,
  eligibilityMessages,
  onSubmitComment,
  className = "",
}: ProjectDetailCommentsProps) {
  const [commentText, setCommentText] = useState("");

  // Lock gating: locked if not eligible or if no eligibility provider connected
  const isLocked = eligibility ? !eligibility.canComment : true;
  const reason = eligibility?.reason || "signed_out";

  // No fake local comments — strictly presentation of passed items
  const commentsList = items;

  const totalCommentCount = commentsList.reduce((acc, c) => {
    return acc + 1 + (c.replies ? c.replies.length : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || !commentText.trim()) return;

    // Optional callback for future integration without faking local storage
    onSubmitComment?.(commentText.trim());
    setCommentText("");
  };

  return (
    <section
      aria-labelledby="detail-comments-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      {/* Heading & Count */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2
            id="detail-comments-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          >
            {title}
          </h2>
          <Badge variant="secondary" size="md">
            {totalCommentCount}
          </Badge>
        </div>
      </div>

      {/* 1. Integration Status Notice */}
      {integrationNotice && (
        <div
          role="note"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground mb-6"
        >
          <LuInfo className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span className="leading-relaxed">{integrationNotice}</span>
        </div>
      )}

      {/* 2. Eligibility Gating Banner (Locked States) */}
      {isLocked && eligibilityMessages && (
        <div
          role="status"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 text-foreground mb-6"
        >
          <div className="flex items-start gap-2.5">
            <LuLock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-medium">
                {reason === "signed_out"
                  ? eligibilityMessages.signedOut
                  : eligibilityMessages.experienceRequired}
              </p>
              {reason === "experience_required" &&
                eligibilityMessages.experienceRequiredSecondary && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {eligibilityMessages.experienceRequiredSecondary}
                  </p>
                )}
            </div>
          </div>

          {reason === "signed_out" && (
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center h-8 px-3.5 text-xs rounded-lg font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors shrink-0 shadow-sm"
            >
              {eligibilityMessages.signIn}
            </Link>
          )}
        </div>
      )}

      {/* 3. Visual Comment Form Structure */}
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card mb-8 sm:mb-10"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0 mt-1">
            <LuMessageSquare className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              rows={3}
              value={commentText}
              disabled={isLocked}
              aria-disabled={isLocked}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={placeholder}
              className={cn(
                "w-full resize-none bg-transparent border-0 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground leading-relaxed",
                isLocked && "opacity-60 cursor-not-allowed"
              )}
            />
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-end">
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={isLocked || !commentText.trim()}
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* 4. Comments List or Empty State */}
      {commentsList.length > 0 ? (
        <div className="space-y-6 divide-y divide-border/60">
          {commentsList.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replyLabel={replyLabel}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-border/60 bg-muted/15 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
