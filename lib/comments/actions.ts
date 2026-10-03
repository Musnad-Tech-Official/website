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
      article_id: newComment.articleId,
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
      console.warn("Supabase insert comment notice:", error.message);
      // Fallback in-memory persistence
      const currentList = fallbackCommentsStore.get(params.articleSlug) || [];
      currentList.push(newComment);
      fallbackCommentsStore.set(params.articleSlug, currentList);
    }
  } catch (err) {
    console.error("addArticleCommentAction exception:", err);
    // Fallback in-memory persistence
    const currentList = fallbackCommentsStore.get(params.articleSlug) || [];
    currentList.push(newComment);
    fallbackCommentsStore.set(params.articleSlug, currentList);
  }

  revalidatePath(`/blog/${params.articleSlug}`);

  return {
    success: true,
    comment: newComment,
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
