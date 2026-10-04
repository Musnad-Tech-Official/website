"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { MASTER_PAGE_INVENTORY } from "./inventory";
import type { PageControlItem, PageStatus } from "./types";
import { createClient } from "@/utils/supabase/server";

// Fallback in-memory storage for active development / offline resilience
let memoryCache: PageControlItem[] = [...MASTER_PAGE_INVENTORY];
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds in-memory TTL across requests

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

interface PageSettingRow {
  id: string;
  path: string;
  title_en: string;
  title_ar: string;
  family: PageControlItem["family"];
  status: string;
  show_in_navbar: boolean;
  show_in_footer: boolean;
  maintenance_notice_en: string | null;
  maintenance_notice_ar: string | null;
  is_protected?: boolean;
  updated_at?: string;
  updated_by?: string;
}

/**
 * Retrieves all page controls, merging DB settings on top of the master inventory.
 * Uses in-memory TTL caching and a fast timeout fallback so that slow DB handshakes
 * never block SSR page renders for 15+ seconds.
 */
export async function getPageControlsAction(): Promise<PageControlItem[]> {
  const now = Date.now();
  if (lastFetchTime > 0 && now - lastFetchTime < CACHE_TTL_MS && memoryCache.length > 0) {
    return memoryCache;
  }

  try {
    const fetchPromise = (async () => {
      const supabase = await createClient();
      return supabase
        .from("page_settings")
        .select("*")
        .order("family", { ascending: true });
    })();

    // 2.5s maximum wait for DB roundtrip to avoid high-latency connection stalls
    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase request timeout")), 2500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (!error && data && data.length > 0) {
      const dbMap = new Map((data as unknown as PageSettingRow[]).map((r) => [r.id, r]));

      // Merge DB overrides with Master Inventory so new code routes are never omitted
      const merged: PageControlItem[] = MASTER_PAGE_INVENTORY.map((inv) => {
        const row = dbMap.get(inv.id);
        if (!row) return inv;
        return {
          ...inv,
          status: (row.status as PageStatus) || inv.status,
          showInNavbar: row.show_in_navbar ?? inv.showInNavbar,
          showInFooter: row.show_in_footer ?? inv.showInFooter,
          maintenanceNoticeEn: row.maintenance_notice_en || inv.maintenanceNoticeEn,
          maintenanceNoticeAr: row.maintenance_notice_ar || inv.maintenanceNoticeAr,
          isProtected: row.is_protected ?? inv.isProtected ?? false,
          updatedAt: row.updated_at,
          updatedBy: row.updated_by,
        };
      });

      memoryCache = merged;
      lastFetchTime = Date.now();
      return merged;
    }
  } catch {
    // If Supabase table isn't migrated yet or connection times out, use memory cache
  }

  // Update lastFetchTime on fallback so repeated calls in the same render don't re-trigger timeouts
  lastFetchTime = Date.now();
  return memoryCache;
}

/**
 * Updates a single page setting.
 */
export async function updatePageControlAction(
  id: string,
  updates: Partial<Pick<PageControlItem, "status" | "showInNavbar" | "showInFooter" | "maintenanceNoticeEn" | "maintenanceNoticeAr">>
): Promise<{ success: boolean; item?: PageControlItem; error?: string }> {
  try {
    const adminId = await verifyAdminAuth();

    // 1. Update in-memory cache first for instant feedback
    const index = memoryCache.findIndex((p) => p.id === id);
    if (index === -1) {
      return { success: false, error: "Page route not found in inventory." };
    }

    const current = memoryCache[index];
    const updated: PageControlItem = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: adminId,
    };
    memoryCache[index] = updated;
    lastFetchTime = Date.now();

    // 2. Persist to Supabase via atomic upsert
    try {
      const supabase = await createClient();
      await supabase
        .from("page_settings")
        .upsert({
          id: updated.id,
          path: updated.path,
          title_en: updated.titleEn,
          title_ar: updated.titleAr,
          family: updated.family,
          status: updated.status,
          show_in_navbar: updated.showInNavbar,
          show_in_footer: updated.showInFooter,
          maintenance_notice_en: updated.maintenanceNoticeEn || null,
          maintenance_notice_ar: updated.maintenanceNoticeAr || null,
          is_protected: updated.isProtected ?? false,
          updated_by: adminId,
        });
    } catch {
      // Non-fatal if DB is offline during dev
    }

    // 3. Revalidate affected routes
    revalidatePath("/admin/pages");
    revalidatePath("/[locale]", "layout");

    return { success: true, item: updated };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update page settings." };
  }
}

/**
 * Bulk updates the status for multiple pages at once.
 */
export async function batchUpdatePageStatusAction(
  ids: string[],
  status: PageStatus
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const adminId = await verifyAdminAuth();

    let updatedCount = 0;
    const now = new Date().toISOString();

    memoryCache = memoryCache.map((item) => {
      if (ids.includes(item.id)) {
        updatedCount++;
        return {
          ...item,
          status,
          updatedAt: now,
          updatedBy: adminId,
        };
      }
      return item;
    });
    lastFetchTime = Date.now();

    try {
      const supabase = await createClient();
      await supabase
        .from("page_settings")
        .update({
          status,
          updated_by: adminId,
        })
        .in("id", ids);
    } catch {
      // Non-fatal if DB is offline
    }

    revalidatePath("/admin/pages");
    revalidatePath("/[locale]", "layout");

    return { success: true, count: updatedCount };
  } catch (err: unknown) {
    return { success: false, count: 0, error: (err as Error).message || "Failed batch update." };
  }
}

/**
 * Resets all page controls back to original inventory defaults.
 */
export async function resetPageControlsAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const adminId = await verifyAdminAuth();
    const now = new Date().toISOString();

    memoryCache = MASTER_PAGE_INVENTORY.map((item) => ({
      ...item,
      updatedAt: now,
      updatedBy: adminId,
    }));
    lastFetchTime = Date.now();

    try {
      const supabase = await createClient();
      const rows = memoryCache.map((item) => ({
        id: item.id,
        path: item.path,
        title_en: item.titleEn,
        title_ar: item.titleAr,
        family: item.family,
        status: item.status,
        show_in_navbar: item.showInNavbar,
        show_in_footer: item.showInFooter,
        maintenance_notice_en: item.maintenanceNoticeEn || null,
        maintenance_notice_ar: item.maintenanceNoticeAr || null,
        is_protected: item.isProtected ?? false,
        updated_at: now,
        updated_by: adminId,
      }));

      // Single atomic bulk upsert instead of 25 sequential roundtrips
      await supabase.from("page_settings").upsert(rows);
    } catch {
      // Non-fatal
    }

    revalidatePath("/admin/pages");
    revalidatePath("/[locale]", "layout");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed reset." };
  }
}
