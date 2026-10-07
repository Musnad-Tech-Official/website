"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { AnnouncementBannerProps } from "@/components/navbar/nav-types";
import type { AnnouncementBannerItem, AnnouncementFormData } from "./types";

const INITIAL_ANNOUNCEMENTS: AnnouncementBannerItem[] = [];

let memoryAnnouncementsCache: AnnouncementBannerItem[] = [...INITIAL_ANNOUNCEMENTS];
let lastFetch = 0;
const CACHE_TTL_MS = 60 * 1000;

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

/**
 * Retrieves all announcements for dashboard management.
 */
export async function getAllAnnouncementsAction(): Promise<AnnouncementBannerItem[]> {
  const now = Date.now();
  if (lastFetch > 0 && now - lastFetch < CACHE_TTL_MS && memoryAnnouncementsCache.length > 0) {
    return memoryAnnouncementsCache;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      memoryAnnouncementsCache = (data as unknown as AnnouncementDbRow[]).map(
        mapRowToAnnouncement
      );
      lastFetch = now;
      return memoryAnnouncementsCache;
    }
  } catch (err) {
    console.warn("Could not query announcements from Supabase, using cache:", err);
  }

  return memoryAnnouncementsCache;
}

/**
 * Creates and optionally activates a new announcement banner.
 */
export async function createAnnouncementAction(
  formData: AnnouncementFormData
): Promise<{
  success: boolean;
  data?: AnnouncementBannerItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    const id =
      formData.id ||
      `banner-${Date.now()}`;

    const newBanner: AnnouncementBannerItem = {
      id,
      category: formData.category,
      textEn: formData.textEn.trim(),
      textAr: formData.textAr.trim(),
      tagEn: formData.tagEn?.trim() || "New",
      tagAr: formData.tagAr?.trim() || "جديد",
      linkTextEn: formData.linkTextEn?.trim() || "Explore Now",
      linkTextAr: formData.linkTextAr?.trim() || "استكشف الآن",
      href: formData.href.trim(),
      isActive: formData.isActive ?? false,
      isDismissible: formData.isDismissible ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const supabase = await createClient();

      // If active, deactivate others first
      if (newBanner.isActive) {
        await supabase
          .from("announcements")
          .update({ is_active: false })
          .neq("id", id);
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert({
          id: newBanner.id,
          category: newBanner.category,
          text_en: newBanner.textEn,
          text_ar: newBanner.textAr,
          tag_en: newBanner.tagEn,
          tag_ar: newBanner.tagAr,
          link_text_en: newBanner.linkTextEn,
          link_text_ar: newBanner.linkTextAr,
          href: newBanner.href,
          is_active: newBanner.isActive,
          is_dismissible: newBanner.isDismissible,
        })
        .select()
        .single();

      if (!error && data) {
        const created = mapRowToAnnouncement(data as unknown as AnnouncementDbRow);
        if (created.isActive) {
          memoryAnnouncementsCache = memoryAnnouncementsCache.map((b) => ({
            ...b,
            isActive: false,
          }));
        }
        memoryAnnouncementsCache = [created, ...memoryAnnouncementsCache];
        revalidatePath("/", "layout");
        revalidatePath("/[locale]", "layout");
        revalidatePath("/[locale]/admin/announcements", "page");
        return { success: true, data: created };
      }
    } catch {
      // In-memory fallback
    }

    if (newBanner.isActive) {
      memoryAnnouncementsCache = memoryAnnouncementsCache.map((b) => ({
        ...b,
        isActive: false,
      }));
    }
    memoryAnnouncementsCache = [newBanner, ...memoryAnnouncementsCache];

    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/announcements", "page");

    return { success: true, data: newBanner };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to create announcement." };
  }
}

/**
 * Updates an announcement banner.
 */
export async function updateAnnouncementAction(
  id: string,
  formData: Partial<AnnouncementFormData>
): Promise<{
  success: boolean;
  data?: AnnouncementBannerItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();

      if (formData.isActive) {
        await supabase
          .from("announcements")
          .update({ is_active: false })
          .neq("id", id);
      }

      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (formData.category !== undefined) updatePayload.category = formData.category;
      if (formData.textEn !== undefined) updatePayload.text_en = formData.textEn.trim();
      if (formData.textAr !== undefined) updatePayload.text_ar = formData.textAr.trim();
      if (formData.tagEn !== undefined) updatePayload.tag_en = formData.tagEn.trim();
      if (formData.tagAr !== undefined) updatePayload.tag_ar = formData.tagAr.trim();
      if (formData.linkTextEn !== undefined) updatePayload.link_text_en = formData.linkTextEn.trim();
      if (formData.linkTextAr !== undefined) updatePayload.link_text_ar = formData.linkTextAr.trim();
      if (formData.href !== undefined) updatePayload.href = formData.href.trim();
      if (formData.isActive !== undefined) updatePayload.is_active = formData.isActive;
      if (formData.isDismissible !== undefined) updatePayload.is_dismissible = formData.isDismissible;

      const { data, error } = await supabase
        .from("announcements")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated = mapRowToAnnouncement(data as unknown as AnnouncementDbRow);
        if (updated.isActive) {
          memoryAnnouncementsCache = memoryAnnouncementsCache.map((b) => ({
            ...b,
            isActive: b.id === id,
          }));
        }
        memoryAnnouncementsCache = memoryAnnouncementsCache.map((b) =>
          b.id === id ? updated : b
        );
        revalidatePath("/", "layout");
        revalidatePath("/[locale]", "layout");
        revalidatePath("/[locale]/admin/announcements", "page");
        return { success: true, data: updated };
      }
    } catch {
      // In-memory fallback
    }

    if (formData.isActive) {
      memoryAnnouncementsCache = memoryAnnouncementsCache.map((b) => ({
        ...b,
        isActive: b.id === id,
      }));
    }

    memoryAnnouncementsCache = memoryAnnouncementsCache.map((b) => {
      if (b.id !== id) return b;
      return {
        ...b,
        category: formData.category ?? b.category,
        textEn: formData.textEn !== undefined ? formData.textEn.trim() : b.textEn,
        textAr: formData.textAr !== undefined ? formData.textAr.trim() : b.textAr,
        tagEn: formData.tagEn !== undefined ? formData.tagEn.trim() : b.tagEn,
        tagAr: formData.tagAr !== undefined ? formData.tagAr.trim() : b.tagAr,
        linkTextEn: formData.linkTextEn !== undefined ? formData.linkTextEn.trim() : b.linkTextEn,
        linkTextAr: formData.linkTextAr !== undefined ? formData.linkTextAr.trim() : b.linkTextAr,
        href: formData.href !== undefined ? formData.href.trim() : b.href,
        isActive: formData.isActive !== undefined ? formData.isActive : b.isActive,
        isDismissible: formData.isDismissible !== undefined ? formData.isDismissible : b.isDismissible,
        updatedAt: new Date().toISOString(),
      };
    });

    const updated = memoryAnnouncementsCache.find((b) => b.id === id);
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/announcements", "page");

    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update announcement." };
  }
}

/**
 * Toggles an announcement's active broadcast status.
 */
export async function toggleAnnouncementActiveAction(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  return updateAnnouncementAction(id, { isActive });
}

/**
 * Deletes an announcement banner.
 */
export async function deleteAnnouncementAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();
      await supabase.from("announcements").delete().eq("id", id);
    } catch {
      // In-memory
    }

    memoryAnnouncementsCache = memoryAnnouncementsCache.filter((b) => b.id !== id);
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/announcements", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete announcement." };
  }
}
