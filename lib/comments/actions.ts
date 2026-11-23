"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type {
  ArticleComment,
  AddCommentParams,
  CommentActionResult,
  ArticleCommentDbRow,
} from "./types";

function mapRowToComment(row: ArticleCommentDbRow): ArticleComment {
  return {
    id: row.id,
    articleId: row.article_id,
    articleSlug: row.article_slug,
    userId: row.user_id,
    userName: row.user_name,
    userAvatar: row.user_avatar,
    userRole: (row.user_role as ArticleComment["userRole"]) || "member",
    content: row.content,
    status: (row.status as ArticleComment["status"]) || "approved",
    parentId: row.parent_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    replies: [],
  };
}

function assembleCommentTree(flatComments: ArticleComment[]): ArticleComment[] {
  const commentMap = new Map<string, ArticleComment>();
  const rootComments: ArticleComment[] = [];

  for (const c of flatComments) {
    commentMap.set(c.id, { ...c, replies: [] });
  }

  for (const c of flatComments) {
    const node = commentMap.get(c.id)!;
    if (c.parentId && commentMap.has(c.parentId)) {
      commentMap.get(c.parentId)!.replies!.push(node);
    } else {
      rootComments.push(node);
    }
  }

  return rootComments;
}

/**
 * Retrieves all approved comments for a specific article.
 */
export async function getArticleCommentsAction(articleSlug: string): Promise<ArticleComment[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("article_comments")
      .select("*")
      .eq("article_slug", articleSlug)
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    if (!error && data) {
      const flat = (data as unknown as ArticleCommentDbRow[]).map(mapRowToComment);
      return assembleCommentTree(flat);
    }

    if (error) {
      console.warn("Supabase article_comments notice:", error.message);
    }
  } catch (err) {
    console.error("getArticleCommentsAction exception:", err);
  }

  // Do not substitute transient memory records for durable database comments.
  return [];
}

/**
 * Adds a new comment or reply to an article.
 * Enforces Clerk authentication and sanitizes inputs.
 */
export async function addArticleCommentAction(
  params: AddCommentParams
): Promise<CommentActionResult> {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return {
      success: false,
      error: "unauthorized",
    };
  }

  const text = params.content?.trim();
  if (!text) {
    return {
      success: false,
      error: "empty_content",
    };
  }

  if (text.length > 2500) {
    return {
      success: false,
      error: "content_too_long",
    };
  }

  const userName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Member";

  const userAvatar = user.imageUrl || undefined;
  const role = (user.publicMetadata?.role as string) === "admin" ? "admin" : "member";

  const newComment: ArticleComment = {
    id: crypto.randomUUID(),
    articleId: params.articleId,
    articleSlug: params.articleSlug,
    userId,
    userName,
    userAvatar,
    userRole: role,
    content: text,
    status: "approved",
    parentId: params.parentId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: [],
  };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("article_comments").insert({
      id: newComment.id,
      article_id: newComment.articleId || null,
      article_slug: newComment.articleSlug,
      user_id: newComment.userId,
      user_name: newComment.userName,
      user_avatar: newComment.userAvatar,
      user_role: newComment.userRole,
      content: newComment.content,
      status: newComment.status,
      parent_id: newComment.parentId,
      created_at: newComment.createdAt,
      updated_at: newComment.updatedAt,
    });
    if (error) {
      console.error("Comment persistence failed:", error.code);
      return { success: false, error: "Comment was not saved. Please retry." };
    }
  } catch (err) {
    console.error("addArticleCommentAction exception:", err instanceof Error ? err.message : "unknown");
    return { success: false, error: "Comment was not saved. Please retry." };
  }

  revalidatePath(`/blog/${params.articleSlug}`);
  revalidatePath(`/projects/${params.articleSlug}`);
  return { success: true, comment: newComment };
}

/**
 * Deletes a comment (restricted to comment author or admins).
 */
export async function deleteArticleCommentAction(
  commentId: string,
  articleSlug: string
): Promise<CommentActionResult> {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return {
      success: false,
      error: "unauthorized",
    };
  }

  const isAdmin = (user.publicMetadata?.role as string) === "admin";

  try {
    const supabase = await createClient();
    let query = supabase.from("article_comments").delete({ count: "exact" }).eq("id", commentId);
    if (articleSlug) query = query.eq("article_slug", articleSlug);
    if (!isAdmin) query = query.eq("user_id", userId);
    const { error, count } = await query;
    if (error || count !== 1) {
      console.error("Comment deletion failed:", error?.code || "not_found_or_forbidden");
      return { success: false, error: "Comment could not be deleted." };
    }
  } catch (err) {
    console.error("deleteArticleCommentAction exception:", err instanceof Error ? err.message : "unknown");
    return { success: false, error: "Comment could not be deleted." };
  }

  revalidatePath(`/blog/${articleSlug}`);
  revalidatePath(`/projects/${articleSlug}`);
  revalidatePath("/admin/comments");
  return { success: true };
}

export interface AdminCommentFilters {
  status?: string;
  articleSlug?: string;
  search?: string;
}

export interface AdminCommentsStats {
  total: number;
  approved: number;
  pending: number;
  flagged: number;
}

/**
 * Retrieves all comments across all articles for admin moderation.
 */
export async function getAllCommentsAdminAction(
  filters?: AdminCommentFilters
): Promise<ArticleComment[]> {
  const { userId } = await auth();
  const user = await currentUser();
  const isAdmin = (user?.publicMetadata?.role as string) === "admin";

  if (!userId || !isAdmin) {
    return [];
  }

  let comments: ArticleComment[] = [];

  try {
    const supabase = await createClient();
    let query = supabase
      .from("article_comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }
    if (filters?.articleSlug && filters.articleSlug !== "all") {
      query = query.eq("article_slug", filters.articleSlug);
    }

    const { data, error } = await query;

    if (!error && data) {
      comments = (data as unknown as ArticleCommentDbRow[]).map(mapRowToComment);
    }
  } catch (err) {
    console.error("getAllCommentsAdminAction exception:", err);
  }

  // Apply search query filter if provided
  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    comments = comments.filter(
      (c) =>
        c.userName.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.articleSlug.toLowerCase().includes(q)
    );
  }

  return comments;
}

/**
 * Updates a comment's moderation status (e.g. approved, flagged, pending, deleted).
 */
export async function updateCommentStatusAction(
  commentId: string,
  status: ArticleComment["status"]
): Promise<CommentActionResult> {
  const { userId } = await auth();
  const user = await currentUser();
  const isAdmin = (user?.publicMetadata?.role as string) === "admin";

  if (!userId || !isAdmin) {
    return { success: false, error: "unauthorized" };
  }

  if (!["approved", "flagged", "pending"].includes(status)) {
    return { success: false, error: "invalid_comment_status" };
  }

  try {
    const supabase = await createClient();
    const { error, count } = await supabase
      .from("article_comments")
      .update({ status, updated_at: new Date().toISOString() }, { count: "exact" })
      .eq("id", commentId);

    if (error || count !== 1) {
      console.error("Comment moderation failed:", error?.code || "not_found");
      return { success: false, error: "Comment moderation was not saved." };
    }
  } catch (err) {
    console.error("updateCommentStatusAction exception:", err instanceof Error ? err.message : "unknown");
    return { success: false, error: "Comment moderation was not saved." };
  }

  revalidatePath("/admin/comments");
  revalidatePath("/blog");
  revalidatePath("/projects");
  return { success: true };
}

/**
 * Returns comment statistics for the admin dashboard.
 */
export async function getCommentsStatsAdminAction(): Promise<AdminCommentsStats> {
  const { userId } = await auth();
  const user = await currentUser();
  const isAdmin = (user?.publicMetadata?.role as string) === "admin";

  if (!userId || !isAdmin) {
    return { total: 0, approved: 0, pending: 0, flagged: 0 };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("article_comments").select("status");

    if (!error && data) {
      const rows = data as { status: string }[];
      return {
        total: rows.length,
        approved: rows.filter((r) => r.status === "approved").length,
        pending: rows.filter((r) => r.status === "pending").length,
        flagged: rows.filter((r) => r.status === "flagged").length,
      };
    }
  } catch (err) {
    console.error("getCommentsStatsAdminAction exception:", err);
  }

  // An unavailable database is not a valid statistical result.
  throw new Error("Unable to load comment statistics from Supabase.");
}
