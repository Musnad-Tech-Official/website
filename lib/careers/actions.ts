"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { CareerJobRecord, CareerValueRecord } from "./types";

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

interface CareerJobDbRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  department: "engineering" | "ai" | "design";
  work_mode: "hybrid" | "remote" | "onSite";
  work_type_en: string;
  work_type_ar: string;
  location_en: string;
  location_ar: string;
  description_en: string;
  description_ar: string;
  requirements_en: string[];
  requirements_ar: string[];
  responsibilities_en: string[];
  responsibilities_ar: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

function mapRowToJob(row: CareerJobDbRow): CareerJobRecord {
  return {
    id: row.id,
    slug: row.slug,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    department: row.department,
    workMode: row.work_mode,
    workTypeEn: row.work_type_en,
    workTypeAr: row.work_type_ar,
    locationEn: row.location_en,
    locationAr: row.location_ar,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    requirementsEn: row.requirements_en || [],
    requirementsAr: row.requirements_ar || [],
    responsibilitiesEn: row.responsibilities_en || [],
    responsibilitiesAr: row.responsibilities_ar || [],
    displayOrder: row.display_order ?? 0,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const DB_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: PromiseLike<T>, timeoutMs = DB_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase request timeout")), timeoutMs)
    ),
  ]);
}

/**
 * Retrieves all jobs
 */
export async function getCareerJobsAction(includeInactive = false): Promise<CareerJobRecord[]> {
  if (includeInactive) await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const query = supabase
      .from("career_jobs")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await withTimeout(query);
    if (error) throw error;
    if (data) {
      return (data as unknown as CareerJobDbRow[]).map(mapRowToJob);
    }
  } catch (err) {
    console.error("getCareerJobsAction failed:", err instanceof Error ? err.message : String(err));
    throw new Error("Unable to load published content from the database.");
  }
  throw new Error("The requested content is unavailable.");
}

/**
 * Retrieves a single job by slug
 */
export async function getCareerJobBySlugAction(slug: string): Promise<CareerJobRecord | null> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("career_jobs")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    const { data, error } = await withTimeout(query);

    if (error) throw error;
    if (data) {
      return mapRowToJob(data as unknown as CareerJobDbRow);
    }
  } catch (err) {
    console.error("getCareerJobBySlugAction failed:", err instanceof Error ? err.message : String(err));
    throw new Error("Unable to load the requested job.");
  }
  return null;
}

/**
 * Upserts a career job
 */
export async function upsertCareerJobAction(
  job: Partial<CareerJobRecord> & { id: string; slug: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: job.id,
      slug: job.slug,
      title_en: job.titleEn,
      title_ar: job.titleAr,
      department: job.department || "engineering",
      work_mode: job.workMode || "remote",
      work_type_en: job.workTypeEn || "Full-time",
      work_type_ar: job.workTypeAr || "دوام كامل",
      location_en: job.locationEn || "Riyadh / Remote",
      location_ar: job.locationAr || "الرياض / عن بُعد",
      description_en: job.descriptionEn || "",
      description_ar: job.descriptionAr || "",
      requirements_en: job.requirementsEn || [],
      requirements_ar: job.requirementsAr || [],
      responsibilities_en: job.responsibilitiesEn || [],
      responsibilities_ar: job.responsibilitiesAr || [],
      display_order: job.displayOrder ?? 0,
      is_active: job.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("career_jobs").upsert(payload);
    if (error) throw error;

    revalidatePath("/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ar/careers");
    revalidatePath(`/careers/${job.slug}`);
    revalidatePath(`/en/careers/${job.slug}`);
    revalidatePath(`/ar/careers/${job.slug}`);
    revalidatePath("/admin/careers");
    return { success: true, message: "Job saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save job.";
    throw new Error(msg);
  }
}

/**
 * Deletes a career job
 */
export async function deleteCareerJobAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("career_jobs").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ar/careers");
    revalidatePath("/admin/careers");
    return { success: true, message: "Job deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete job.";
    throw new Error(msg);
  }
}

/**
 * Retrieves career values
 */
export async function getCareerValuesAction(includeInactive = false): Promise<CareerValueRecord[]> {
  if (includeInactive) await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const query = supabase
      .from("career_values")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await withTimeout(query);
    if (error) throw error;
    if (data) {
      return data.map((row) => ({
        id: row.id,
        titleEn: row.title_en,
        titleAr: row.title_ar,
        descriptionEn: row.description_en,
        descriptionAr: row.description_ar,
        icon: row.icon || "LuAward",
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.error("getCareerValuesAction failed:", err instanceof Error ? err.message : String(err));
    throw new Error("Unable to load published content from the database.");
  }
  throw new Error("The requested content is unavailable.");
}

/**
 * Upserts a career value
 */
export async function upsertCareerValueAction(
  val: Partial<CareerValueRecord> & { id: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: val.id,
      title_en: val.titleEn,
      title_ar: val.titleAr,
      description_en: val.descriptionEn,
      description_ar: val.descriptionAr,
      icon: val.icon || "LuAward",
      display_order: val.displayOrder ?? 0,
      is_active: val.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("career_values").upsert(payload);
    if (error) throw error;

    revalidatePath("/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ar/careers");
    revalidatePath("/admin/careers");
    return { success: true, message: "Career value saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save career value.";
    throw new Error(msg);
  }
}

/**
 * Deletes a career value
 */
export async function deleteCareerValueAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("career_values").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ar/careers");
    revalidatePath("/admin/careers");
    return { success: true, message: "Career value deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete career value.";
    throw new Error(msg);
  }
}
