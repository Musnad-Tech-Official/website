"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { Project, ProjectFormData, ProjectStatus } from "./types";

/**
 * Ensures caller is an authenticated administrator.
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

interface ProjectDbRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  content_en?: unknown;
  content_ar?: unknown;
  content_html_en: string | null;
  content_html_ar: string | null;
  cover_image: string | null;
  image?: string | null;
  category: string;
  category_slug: string;
  client_name?: string | null;
  year: string;
  technologies: string[] | null;
  featured: boolean;
  live_demo_url: string | null;
  github_url: string | null;
  rating: number | null;
  review_count: number | null;
  gradient: string | null;
  metrics: unknown;
  gallery: unknown;
  status: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

function mapRowToProject(row: ProjectDbRow): Project {
  const img = row.cover_image || row.image || undefined;
  return {
    id: row.id,
    slug: row.slug,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    subtitleEn: row.subtitle_en || "",
    subtitleAr: row.subtitle_ar || "",
    descriptionEn: row.description_en || "",
    descriptionAr: row.description_ar || "",
    contentEn: row.content_en,
    contentAr: row.content_ar,
    contentHtmlEn: row.content_html_en || "",
    contentHtmlAr: row.content_html_ar || "",
    coverImage: img,
    image: img,
    category: row.category,
    categorySlug: row.category_slug,
    clientName: row.client_name || undefined,
    year: row.year || "2024",
    technologies: row.technologies || [],
    featured: row.featured ?? false,
    liveDemoUrl: row.live_demo_url || undefined,
    githubUrl: row.github_url || undefined,
    rating: row.rating ? Number(row.rating) : 4.8,
    reviewCount: row.review_count ?? 0,
    gradient: row.gradient || "from-zinc-900 via-neutral-900 to-zinc-950",
    metrics: Array.isArray(row.metrics) ? row.metrics : [],
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    status: (row.status as ProjectStatus) || "published",
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by || undefined,
  };
}

/**
 * Retrieves all projects from Supabase with optional status filter.
 */
export async function getProjectsAction(statusFilter?: ProjectStatus): Promise<Project[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      return (data as unknown as ProjectDbRow[]).map(mapRowToProject);
    }
    if (error) {
      console.warn("Supabase getProjectsAction notice:", error.message);
    }
  } catch (err) {
    console.error("Supabase getProjectsAction exception:", err);
  }

  return [];
}

/**
 * Retrieves a single project by permanent URL slug directly from Supabase.
 */
export async function getProjectBySlugAction(slug: string): Promise<Project | null> {
  const cleanSlug = slug.toLowerCase().trim();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (!error && data) {
      return mapRowToProject(data as unknown as ProjectDbRow);
    }
    if (error) {
      console.warn("Supabase getProjectBySlugAction notice:", error.message);
    }
  } catch (err) {
    console.error("Supabase getProjectBySlugAction exception:", err);
  }

  return null;
}

/**
 * Saves or updates a project in Supabase with Clerk admin authorization.
 */
export async function saveProjectAction(
  formData: ProjectFormData
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const user = await currentUser();
    const adminId = user?.id || (await verifyAdminAuth());
    const now = new Date().toISOString();

    const cleanSlug = (formData.slug || formData.titleEn)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const categorySlug = (formData.categorySlug || formData.category || "fintech-platform")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    const id = formData.id || crypto.randomUUID();

    const baseRow = {
      id,
      slug: cleanSlug,
      title_en: formData.titleEn,
      title_ar: formData.titleAr,
      subtitle_en: formData.subtitleEn || null,
      subtitle_ar: formData.subtitleAr || null,
      description_en: formData.descriptionEn || null,
      description_ar: formData.descriptionAr || null,
      content_en: formData.contentEn || null,
      content_ar: formData.contentAr || null,
      content_html_en: formData.contentHtmlEn || null,
      content_html_ar: formData.contentHtmlAr || null,
      cover_image: formData.coverImage || null,
      category: formData.category || "Fintech Platform",
      category_slug: categorySlug,
      year: formData.year || "2024",
      technologies: formData.technologies || [],
      featured: formData.featured ?? false,
      live_demo_url: formData.liveDemoUrl || null,
      github_url: formData.githubUrl || null,
      rating: formData.rating ?? 4.8,
      review_count: formData.reviewCount ?? 0,
      gradient: formData.gradient || "from-zinc-900 via-neutral-900 to-zinc-950",
      metrics: formData.metrics || [],
      gallery: formData.gallery || [],
      status: formData.status || "published",
      display_order: formData.displayOrder ?? 0,
      updated_at: now,
      created_by: adminId,
    };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .upsert(baseRow)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to save project.");
    }

    const savedProject = mapRowToProject(data as unknown as ProjectDbRow);

    // Revalidate paths
    revalidatePath("/admin/projects");
    revalidatePath("/[locale]/projects", "page");
    revalidatePath(`/[locale]/projects/${cleanSlug}`, "page");
    revalidatePath("/[locale]", "page");

    return { success: true, project: savedProject };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to save project." };
  }
}

/**
 * Toggles a project's published/draft status.
 */
export async function toggleProjectStatusAction(
  id: string,
  status: ProjectStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const now = new Date().toISOString();

    const supabase = await createClient();
    const { error } = await supabase
      .from("projects")
      .update({ status, updated_at: now })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/projects");
    revalidatePath("/[locale]/projects", "page");
    revalidatePath("/[locale]", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update project status." };
  }
}

/**
 * Toggles whether a project is featured on the Home page.
 */
export async function toggleProjectFeaturedAction(
  id: string,
  featured: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const now = new Date().toISOString();

    const supabase = await createClient();
    const { error } = await supabase
      .from("projects")
      .update({ featured, updated_at: now })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/projects");
    revalidatePath("/[locale]/projects", "page");
    revalidatePath("/[locale]", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update featured flag." };
  }
}

/**
 * Deletes a project by ID.
 */
export async function deleteProjectAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();

    const supabase = await createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/projects");
    revalidatePath("/[locale]/projects", "page");
    revalidatePath("/[locale]", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete project." };
  }
}
