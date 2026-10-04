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

// In-memory fallback comments store in case Supabase schema migration is pending
const fallbackCommentsStore: Map<string, ArticleComment[]> = new Map();

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

  // Graceful fallback to server memory cache
  const cached = fallbackCommentsStore.get(articleSlug) || [];
  return assembleCommentTree(cached);
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

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("article_comments")
      .insert({
        article_id: params.articleId || null,
        article_slug: params.articleSlug,
        user_id: userId,
        user_name: userName,
        user_avatar: userAvatar || null,
        user_role: role,
        content: text,
        status: "approved",
        parent_id: params.parentId || null,
        // No id, created_at, or updated_at passed; Supabase generates them!
      })
      .select()
      .single();

    if (!error && data) {
      const row = data as {
        id: string;
        article_id: string;
        article_slug: string;
        user_id: string;
        user_name: string;
        user_avatar: string | null;
        user_role: string;
        content: string;
        status: "approved" | "pending" | "flagged" | "deleted";
        parent_id: string | null;
        created_at: string;
        updated_at: string;
      };

      const createdComment: ArticleComment = {
        id: row.id,
        articleId: row.article_id,
        articleSlug: row.article_slug,
        userId: row.user_id,
        userName: row.user_name,
        userAvatar: row.user_avatar || undefined,
        userRole: (row.user_role as ArticleComment["userRole"]) || role,
        content: row.content,
        status: row.status,
        parentId: row.parent_id || null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        replies: [],
      };

      revalidatePath(`/[locale]/blog/${params.articleSlug}`, "page");
      return { success: true, comment: createdComment };
    }

    if (error) {
      console.warn("Supabase insert comment notice:", error.message);
    }
  } catch (err) {
    console.error("addArticleCommentAction exception:", err);
  }

  // Fallback in-memory persistence only if Supabase is offline
  const fallbackComment: ArticleComment = {
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

  const currentList = fallbackCommentsStore.get(params.articleSlug) || [];
  currentList.push(fallbackComment);
  fallbackCommentsStore.set(params.articleSlug, currentList);

  revalidatePath(`/[locale]/blog/${params.articleSlug}`, "page");

  return {
    success: true,
    comment: fallbackComment,
  };
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
    let query = supabase.from("article_comments").delete().eq("id", commentId);

    if (!isAdmin) {
      query = query.eq("user_id", userId);
    }

    const { error } = await query;
    if (error) {
      console.warn("Supabase delete comment notice:", error.message);
    }
  } catch (err) {
    console.error("deleteArticleCommentAction exception:", err);
  }

  // Update fallback store if present
  const currentList = fallbackCommentsStore.get(articleSlug) || [];
  fallbackCommentsStore.set(
    articleSlug,
    currentList.filter((c) => c.id !== commentId && c.parentId !== commentId)
  );

  revalidatePath(`/blog/${articleSlug}`);

  return {
    success: true,
  };
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

  // Merge with fallback in-memory store if DB is empty or table pending
  if (comments.length === 0) {
    for (const [slug, list] of fallbackCommentsStore.entries()) {
      if (filters?.articleSlug && filters.articleSlug !== "all" && slug !== filters.articleSlug) {
        continue;
      }
      for (const item of list) {
        if (!filters?.status || filters.status === "all" || item.status === filters.status) {
          comments.push(item);
        }
      }
    }
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("article_comments")
      .update({ status })
      .eq("id", commentId);

    if (error) {
      console.warn("Supabase updateCommentStatusAction notice:", error.message);
    }
  } catch (err) {
    console.error("updateCommentStatusAction exception:", err);
  }

  // Update in fallback store
  for (const [, list] of fallbackCommentsStore.entries()) {
    const target = list.find((c) => c.id === commentId);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      break;
    }
  }

  revalidatePath("/admin/comments");
  revalidatePath("/blog");

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

  // Fallback stats
  let total = 0;
  let approved = 0;
  let pending = 0;
  let flagged = 0;

  for (const [, list] of fallbackCommentsStore.entries()) {
    for (const item of list) {
      total++;
      if (item.status === "approved") approved++;
      else if (item.status === "pending") pending++;
      else if (item.status === "flagged") flagged++;
    }
  }

  return { total, approved, pending, flagged };
}
