"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { AnnouncementBannerProps } from "@/components/navbar/nav-types";
import type { AnnouncementBannerItem, AnnouncementFormData } from "./types";

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

interface AnnouncementDbRow {
  id: string;
  category: string;
  text_en: string;
  text_ar: string;
  tag_en: string;
  tag_ar: string;
  link_text_en: string;
  link_text_ar: string;
  href: string;
  is_active: boolean;
  is_dismissible: boolean;
  created_at?: string;
  updated_at?: string;
}

function mapRowToAnnouncement(row: AnnouncementDbRow): AnnouncementBannerItem {
  return {
    id: row.id,
    category: (row.category as AnnouncementBannerItem["category"]) || "general",
    textEn: row.text_en,
    textAr: row.text_ar,
    tagEn: row.tag_en,
    tagAr: row.tag_ar,
    linkTextEn: row.link_text_en,
    linkTextAr: row.link_text_ar,
    href: row.href,
    isActive: Boolean(row.is_active),
    isDismissible: Boolean(row.is_dismissible),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Returns the currently active announcement for the top banner.
 */
export async function getActiveAnnouncementAction(
  locale: string = "en"
): Promise<AnnouncementBannerProps | null> {
  const isRtl = locale === "ar";
  const all = await getAllAnnouncementsAction();
  const active = all.find((a) => a.isActive);

  if (!active) return null;

  return {
    text: isRtl ? active.textAr : active.textEn,
    tag: isRtl ? active.tagAr : active.tagEn,
    href: active.href,
    linkText: isRtl ? active.linkTextAr : active.linkTextEn,
    direction: isRtl ? "rtl" : "ltr",
    dismissible: active.isDismissible,
  };
}

function revalidateAnnouncements(): void {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/announcements", "page");
}

/** Return only persisted announcements. RLS filters anonymous readers. */
export async function getAllAnnouncementsAction(): Promise<AnnouncementBannerItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("announcements")
    .select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to load announcements:", error.code);
    throw new Error("Announcements are unavailable.");
  }
  return ((data ?? []) as AnnouncementDbRow[]).map(mapRowToAnnouncement);
}

/**
 * Deactivate previously active announcements before activating another.
 * Both writes are checked; this is not a transaction and requires an atomic
 * database RPC for fully race-safe switching (documented release blocker).
 */
async function deactivateOtherAnnouncements(id: string): Promise<string[]> {
  const supabase = await createClient();
  const { data: active, error: lookupError } = await supabase.from("announcements")
    .select("id").eq("is_active", true).neq("id", id);
  if (lookupError) throw new Error("Could not inspect existing announcements.");
  const previous = (active ?? []).map((record) => record.id as string);
  if (!previous.length) return [];

  const { data, error } = await supabase.from("announcements")
    .update({ is_active: false }).in("id", previous).select("id");
  if (error || !data || data.length !== previous.length) {
    throw new Error("Could not deactivate previous announcements.");
  }
  return previous;
}

/** A best-effort recovery when the second step of activation fails. */
async function restorePreviousAnnouncements(ids: string[]): Promise<void> {
  if (!ids.length) return;
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("announcements")
      .update({ is_active: true }).in("id", ids);
    if (error) console.error("Announcement rollback failed:", error.code);
  } catch {
    console.error("Announcement rollback failed after activation error.");
  }
}

export async function createAnnouncementAction(
  formData: AnnouncementFormData
): Promise<{ success: boolean; data?: AnnouncementBannerItem; error?: string }> {
  let previousIds: string[] = [];
  try {
    await verifyAdminAuth();
    const id = formData.id || `banner-${crypto.randomUUID()}`;
    const activate = formData.isActive ?? false;
    if (activate) previousIds = await deactivateOtherAnnouncements(id);

    const supabase = await createClient();
    const { data, error } = await supabase.from("announcements").insert({
      id,
      category: formData.category,
      text_en: formData.textEn.trim(),
      text_ar: formData.textAr.trim(),
      tag_en: formData.tagEn?.trim() || "New",
      tag_ar: formData.tagAr?.trim() || "جديد",
      link_text_en: formData.linkTextEn?.trim() || "Explore Now",
      link_text_ar: formData.linkTextAr?.trim() || "استكشف الآن",
      href: formData.href.trim(),
      is_active: activate,
      is_dismissible: formData.isDismissible ?? true,
    }).select().single();

    if (error || !data) {
      console.error("Failed to create announcement:", error?.code || "no-data");
      await restorePreviousAnnouncements(previousIds);
      return { success: false, error: "Announcement was not saved." };
    }
    revalidateAnnouncements();
    return { success: true, data: mapRowToAnnouncement(data as AnnouncementDbRow) };
  } catch (err: unknown) {
    await restorePreviousAnnouncements(previousIds);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create announcement." };
  }
}

export async function updateAnnouncementAction(
  id: string, formData: Partial<AnnouncementFormData>
): Promise<{ success: boolean; data?: AnnouncementBannerItem; error?: string }> {
  let previousIds: string[] = [];
  try {
    await verifyAdminAuth();
    if (formData.isActive) previousIds = await deactivateOtherAnnouncements(id);

    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (formData.category !== undefined) payload.category = formData.category;
    if (formData.textEn !== undefined) payload.text_en = formData.textEn.trim();
    if (formData.textAr !== undefined) payload.text_ar = formData.textAr.trim();
    if (formData.tagEn !== undefined) payload.tag_en = formData.tagEn.trim();
    if (formData.tagAr !== undefined) payload.tag_ar = formData.tagAr.trim();
    if (formData.linkTextEn !== undefined) payload.link_text_en = formData.linkTextEn.trim();
    if (formData.linkTextAr !== undefined) payload.link_text_ar = formData.linkTextAr.trim();
    if (formData.href !== undefined) payload.href = formData.href.trim();
    if (formData.isActive !== undefined) payload.is_active = formData.isActive;
    if (formData.isDismissible !== undefined) payload.is_dismissible = formData.isDismissible;

    const supabase = await createClient();
    const { data, error } = await supabase.from("announcements")
      .update(payload).eq("id", id).select().single();
    if (error || !data) {
      console.error("Failed to update announcement:", error?.code || "no-data");
      await restorePreviousAnnouncements(previousIds);
      return { success: false, error: "Announcement changes were not saved." };
    }
    revalidateAnnouncements();
    return { success: true, data: mapRowToAnnouncement(data as AnnouncementDbRow) };
  } catch (err: unknown) {
    await restorePreviousAnnouncements(previousIds);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update announcement." };
  }
}

export async function toggleAnnouncementActiveAction(
  id: string, isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateAnnouncementAction(id, { isActive });
}

export async function deleteAnnouncementAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const supabase = await createClient();
    const { data, error } = await supabase.from("announcements")
      .delete().eq("id", id).select("id").single();
    if (error || !data) {
      console.error("Failed to delete announcement:", error?.code || "no-data");
      return { success: false, error: "Announcement was not deleted." };
    }
    revalidateAnnouncements();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete announcement." };
  }
}
