"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { Article, ArticleFormData, ArticleStatus } from "./types";

/**
 * Ensures the caller is an authenticated administrator.
 */
async function verifyAdminAuth(): Promise<string> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const role = sessionClaims?.metadata?.role;
  if (role !== "admin") {
    throw new Error("Forbidden: Administrator privileges required.");
  }

  return userId;
}

interface ArticleDbRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  content_html_en: string | null;
  content_html_ar: string | null;
  content_en?: unknown;
  content_ar?: unknown;
  cover_image: string | null;
  category: string;
  category_slug: string;
  tags: string[] | null;
  layout_variant: string;
  status: string;
  read_time_en: string | null;
  read_time_ar: string | null;
  author_name: string;
  author_role: string | null;
  author_avatar: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

function mapRowToArticle(row: ArticleDbRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    excerptEn: row.excerpt_en || "",
    excerptAr: row.excerpt_ar || "",
    contentHtmlEn: row.content_html_en || "",
    contentHtmlAr: row.content_html_ar || "",
    contentEn: row.content_en,
    contentAr: row.content_ar,
    coverImage: row.cover_image || undefined,
    category: row.category,
    categorySlug: row.category_slug,
    tags: row.tags || [],
    layoutVariant: (row.layout_variant as Article["layoutVariant"]) || "default",
    status: (row.status as ArticleStatus) || "draft",
    readTimeEn: row.read_time_en || "5 min read",
    readTimeAr: row.read_time_ar || "5 دقائق للقراءة",
    authorName: row.author_name || "Admin",
    authorRole: row.author_role || "Administrator",
    authorAvatar: row.author_avatar || undefined,
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by || undefined,
  };
}

/**
 * Retrieves all articles directly from database (with optional status filter).
 */
export async function getArticlesAction(statusFilter?: ArticleStatus): Promise<Article[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("articles").select("*").order("created_at", { ascending: false });

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      return (data as unknown as ArticleDbRow[]).map(mapRowToArticle);
    }
    if (error) {
      console.error("Supabase getArticlesAction error:", error.message);
    }
  } catch (err) {
    console.error("Supabase getArticlesAction exception:", err);
  }

  return [];
}

/**
 * Retrieves a single article by slug directly from database.
 */
export async function getArticleBySlugAction(slug: string): Promise<Article | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return mapRowToArticle(data as unknown as ArticleDbRow);
    }
    if (error) {
      console.error("Supabase getArticleBySlugAction error:", error.message);
    }
  } catch (err) {
    console.error("Supabase getArticleBySlugAction exception:", err);
  }

  return null;
}

/**
 * Saves or updates an article in Supabase with author automatically resolved from Clerk.
 */
export async function saveArticleAction(
  formData: ArticleFormData
): Promise<{ success: boolean; article?: Article; error?: string }> {
  try {
    const user = await currentUser();
    const adminId = await verifyAdminAuth();
    const now = new Date().toISOString();

    // Automatically resolve author name, avatar and role from the current Clerk user
    const authorName =
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.username ||
      user?.primaryEmailAddress?.emailAddress ||
      "Administrator";

    const authorAvatar = user?.imageUrl || undefined;
    const authorRole = (user?.publicMetadata?.role as string) || "Administrator";

    // Generate slug from title if empty
    const cleanSlug = (formData.slug || formData.titleEn)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const id = formData.id || crypto.randomUUID();
    const categorySlug = (formData.category || "engineering").toLowerCase().replace(/\s+/g, "-");

    // Auto-calculate read time if not provided
    const words = formData.contentHtmlEn.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    const calcMinutes = Math.max(1, Math.ceil(words / 200));
    const readTimeEn = formData.readTimeEn || `${calcMinutes} min read`;
    const readTimeAr = formData.readTimeAr || `${calcMinutes} دقائق للقراءة`;

    const articleItem: Article = {
      id,
      slug: cleanSlug,
      titleEn: formData.titleEn,
      titleAr: formData.titleAr,
      excerptEn: formData.excerptEn,
      excerptAr: formData.excerptAr,
      contentHtmlEn: formData.contentHtmlEn,
      contentHtmlAr: formData.contentHtmlAr,
      coverImage: formData.coverImage,
      category: formData.category || "Engineering",
      categorySlug,
      tags: formData.tags || [],
      layoutVariant: formData.layoutVariant || "default",
      status: formData.status || "draft",
      readTimeEn,
      readTimeAr,
      authorName,
      authorRole,
      authorAvatar,
      publishedAt: formData.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
      createdBy: adminId,
    };

    // Persist directly to Supabase
    const supabase = await createClient();
    const { error: upsertError } = await supabase.from("articles").upsert({
      id: articleItem.id,
      slug: articleItem.slug,
      title_en: articleItem.titleEn,
      title_ar: articleItem.titleAr,
      excerpt_en: articleItem.excerptEn || null,
      excerpt_ar: articleItem.excerptAr || null,
      content_html_en: articleItem.contentHtmlEn || null,
      content_html_ar: articleItem.contentHtmlAr || null,
      cover_image: articleItem.coverImage || null,
      category: articleItem.category,
      category_slug: articleItem.categorySlug,
      tags: articleItem.tags,
      layout_variant: articleItem.layoutVariant,
      status: articleItem.status,
      read_time_en: articleItem.readTimeEn,
      read_time_ar: articleItem.readTimeAr,
      author_name: authorName,
      author_role: authorRole,
      author_avatar: authorAvatar || null,
      published_at: articleItem.publishedAt || null,
      updated_at: now,
      created_by: adminId,
    });

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      return { success: false, error: upsertError.message };
    }

    // Revalidate affected paths
    revalidatePath("/admin/articles");
    revalidatePath("/[locale]/blog", "page");
    revalidatePath(`/[locale]/blog/${cleanSlug}`, "page");

    return { success: true, article: articleItem };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to save article." };
  }
}

/**
 * Toggles status (e.g. quick publish/unpublish from table).
 */
export async function toggleArticleStatusAction(
  id: string,
  status: ArticleStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminId = await verifyAdminAuth();
    const now = new Date().toISOString();

    const supabase = await createClient();
    const { error } = await supabase
      .from("articles")
      .update({
        status,
        published_at: status === "published" ? now : null,
        updated_at: now,
        created_by: adminId,
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase toggleArticleStatusAction error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/articles");
    revalidatePath("/[locale]/blog", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update article status." };
  }
}

/**
 * Deletes an article by ID.
 */
export async function deleteArticleAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();

    const supabase = await createClient();
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      console.error("Supabase deleteArticleAction error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/articles");
    revalidatePath("/[locale]/blog", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete article." };
  }
}
