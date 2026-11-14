"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type {
  AboutContentData,
  AboutValueRecord,
  AboutMilestoneRecord,
  AboutApproachRecord,
} from "./types";

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
 * Retrieves About main content (Mission, Vision, Story)
 */
export async function getAboutContentAction(): Promise<AboutContentData> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("about_content")
      .select("*")
      .eq("id", "main")
      .single();

    const { data, error } = await withTimeout(query);

    if (error) throw error;
    if (data) {
      return {
        id: data.id,
        missionTitleEn: data.mission_title_en,
        missionTitleAr: data.mission_title_ar,
        missionDescEn: data.mission_desc_en,
        missionDescAr: data.mission_desc_ar,
        visionTitleEn: data.vision_title_en,
        visionTitleAr: data.vision_title_ar,
        visionDescEn: data.vision_desc_en,
        visionDescAr: data.vision_desc_ar,
        storyTitleEn: data.story_title_en,
        storyTitleAr: data.story_title_ar,
        storyP1En: data.story_p1_en,
        storyP1Ar: data.story_p1_ar,
        storyP2En: data.story_p2_en,
        storyP2Ar: data.story_p2_ar,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    console.error("getAboutContentAction failed:", err instanceof Error ? err.message : String(err));
    throw new Error("Unable to load company profile content.");
  }
  throw new Error("The requested content is unavailable.");
}

/**
 * Updates About main content
 */
export async function updateAboutContentAction(
  data: Partial<AboutContentData>
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: "main",
      mission_title_en: data.missionTitleEn,
      mission_title_ar: data.missionTitleAr,
      mission_desc_en: data.missionDescEn,
      mission_desc_ar: data.missionDescAr,
      vision_title_en: data.visionTitleEn,
      vision_title_ar: data.visionTitleAr,
      vision_desc_en: data.visionDescEn,
      vision_desc_ar: data.visionDescAr,
      story_title_en: data.storyTitleEn,
      story_title_ar: data.storyTitleAr,
      story_p1_en: data.storyP1En,
      story_p1_ar: data.storyP1Ar,
      story_p2_en: data.storyP2En,
      story_p2_ar: data.storyP2Ar,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("about_content").upsert(payload);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "About content updated successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update about content.";
    throw new Error(msg);
  }
}

/**
 * Retrieves About Values
 */
export async function getAboutValuesAction(includeInactive = false): Promise<AboutValueRecord[]> {
  if (includeInactive) await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const query = supabase
      .from("about_values")
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
        icon: row.icon || "LuTarget",
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.error("getAboutValuesAction failed:", err instanceof Error ? err.message : String(err));
    throw new Error("Unable to load published content from the database.");
  }
  throw new Error("The requested content is unavailable.");
}

/**
 * Creates/Updates About Value
 */
export async function upsertAboutValueAction(
  val: Partial<AboutValueRecord> & { id: string }
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
      icon: val.icon || "LuTarget",
      display_order: val.displayOrder ?? 0,
      is_active: val.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("about_values").upsert(payload);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Value saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save value.";
    throw new Error(msg);
  }
}

/**
 * Deletes an About Value
 */
export async function deleteAboutValueAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("about_values").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Value deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete value.";
    throw new Error(msg);
  }
}

/**
 * Retrieves About Milestones
 */
export async function getAboutMilestonesAction(includeInactive = false): Promise<AboutMilestoneRecord[]> {
  if (includeInactive) await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const query = supabase
      .from("about_milestones")
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
        year: row.year,
        titleEn: row.title_en,
        titleAr: row.title_ar,
        descriptionEn: row.description_en,
        descriptionAr: row.description_ar,
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.error("getAboutMilestonesAction failed:", err instanceof Error ? err.message : String(err));
    throw new Error("Unable to load published content from the database.");
  }
  throw new Error("The requested content is unavailable.");
}

/**
 * Upserts a Milestone
 */
export async function upsertAboutMilestoneAction(
  item: Partial<AboutMilestoneRecord> & { id: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: item.id,
      year: item.year,
      title_en: item.titleEn,
      title_ar: item.titleAr,
      description_en: item.descriptionEn,
      description_ar: item.descriptionAr,
      display_order: item.displayOrder ?? 0,
      is_active: item.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("about_milestones").upsert(payload);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Milestone saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save milestone.";
    throw new Error(msg);
  }
}

/**
 * Deletes a Milestone
 */
export async function deleteAboutMilestoneAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("about_milestones").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Milestone deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete milestone.";
    throw new Error(msg);
  }
}

/**
 * Retrieves About Approach Steps
 */
export async function getAboutApproachAction(includeInactive = false): Promise<AboutApproachRecord[]> {
  if (includeInactive) await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const query = supabase
      .from("about_approach_steps")
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
        stepNumber: row.step_number,
        titleEn: row.title_en,
        titleAr: row.title_ar,
        descriptionEn: row.description_en,
        descriptionAr: row.description_ar,
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.error("getAboutApproachAction failed:", err instanceof Error ? err.message : String(err));
    throw new Error("Unable to load published content from the database.");
  }
  throw new Error("The requested content is unavailable.");
}

/**
 * Upserts an Approach Step
 */
export async function upsertAboutApproachAction(
  step: Partial<AboutApproachRecord> & { id: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: step.id,
      step_number: step.stepNumber,
      title_en: step.titleEn,
      title_ar: step.titleAr,
      description_en: step.descriptionEn,
      description_ar: step.descriptionAr,
      display_order: step.displayOrder ?? 0,
      is_active: step.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("about_approach_steps").upsert(payload);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Approach step saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save approach step.";
    throw new Error(msg);
  }
}

/**
 * Deletes an Approach Step
 */
export async function deleteAboutApproachAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("about_approach_steps").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Approach step deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete approach step.";
    throw new Error(msg);
  }
}
