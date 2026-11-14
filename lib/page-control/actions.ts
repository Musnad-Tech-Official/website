"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { MASTER_PAGE_INVENTORY } from "./inventory";
import type { PageControlItem, PageStatus } from "./types";
import { createClient } from "@/utils/supabase/server";

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

function toDatabaseRow(item: PageControlItem, adminId: string, now: string) {
  return {
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
  };
}

function revalidatePageControls() {
  revalidatePath("/admin/pages");
  revalidatePath("/[locale]", "layout");
}

/** Read persisted visibility rules. Never silently use defaults on database failure. */
export async function getPageControlsAction(): Promise<PageControlItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("page_settings").select("*");
  if (error || !data || data.length === 0) {
    console.error("Unable to read page settings:", error?.code || "empty-or-missing-table");
    throw new Error("Page visibility settings are unavailable.");
  }
  const dbMap = new Map((data as PageSettingRow[]).map((row) => [row.id, row]));
  return MASTER_PAGE_INVENTORY.map((inv) => {
    const row = dbMap.get(inv.id);
    if (!row) return inv; // A newly added route has not yet been configured.
    return {
      ...inv,
      // Protected pages cannot be switched off from the dashboard.
      status: inv.isProtected ? "live" : ((row.status as PageStatus) || inv.status),
      showInNavbar: row.show_in_navbar ?? inv.showInNavbar,
      showInFooter: row.show_in_footer ?? inv.showInFooter,
      maintenanceNoticeEn: row.maintenance_notice_en || inv.maintenanceNoticeEn,
      maintenanceNoticeAr: row.maintenance_notice_ar || inv.maintenanceNoticeAr,
      isProtected: inv.isProtected || (row.is_protected ?? false),
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
    };
  });
}

/** Update one page only if Supabase confirms the write. */
export async function updatePageControlAction(
  id: string,
  updates: Partial<Pick<PageControlItem, "status" | "showInNavbar" | "showInFooter" | "maintenanceNoticeEn" | "maintenanceNoticeAr">>
): Promise<{ success: boolean; item?: PageControlItem; error?: string }> {
  try {
    const adminId = await verifyAdminAuth();
    const current = (await getPageControlsAction()).find((item) => item.id === id);
    if (!current) return { success: false, error: "Page route not found in inventory." };
    if (current.isProtected && updates.status && updates.status !== "live") {
      return { success: false, error: "This protected page must remain live." };
    }

    const now = new Date().toISOString();
    const candidate: PageControlItem = { ...current, ...updates, updatedAt: now, updatedBy: adminId };
    const supabase = await createClient();
    const { data, error } = await supabase.from("page_settings")
      .upsert(toDatabaseRow(candidate, adminId, now))
      .select("id").single();
    if (error || !data || data.id !== id) {
      console.error("Could not persist page setting:", error?.code || "no-data");
      return { success: false, error: "Page setting was not saved." };
    }

    revalidatePageControls();
    return { success: true, item: candidate };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update page settings." };
  }
}

/** An atomic upsert of known IDs; count only rows confirmed by the database. */
export async function batchUpdatePageStatusAction(
  ids: string[],
  status: PageStatus
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const adminId = await verifyAdminAuth();
    const uniqueIds = [...new Set(ids)];
    if (!uniqueIds.length) return { success: true, count: 0 };
    if (!["live", "maintenance", "hidden"].includes(status)) {
      return { success: false, count: 0, error: "Invalid page status." };
    }
    const all = await getPageControlsAction();
    const selected = all.filter((item) => uniqueIds.includes(item.id));
    if (selected.length !== uniqueIds.length || selected.some((item) => item.isProtected && status !== "live")) {
      return { success: false, count: 0, error: "Batch contains unknown or protected pages." };
    }
    const now = new Date().toISOString();
    const supabase = await createClient();
    const { data, error } = await supabase.from("page_settings")
      .upsert(selected.map((item) => toDatabaseRow({ ...item, status }, adminId, now)))
      .select("id");
    if (error || !data || data.length !== selected.length) {
      console.error("Could not persist batch page settings:", error?.code || "incomplete");
      return { success: false, count: 0, error: "Page statuses were not saved." };
    }

    revalidatePageControls();
    return { success: true, count: data.length };
  } catch (err: unknown) {
    return { success: false, count: 0, error: err instanceof Error ? err.message : "Failed batch update." };
  }
}

/** Reset only after the complete database write succeeds. */
export async function resetPageControlsAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const adminId = await verifyAdminAuth();
    const now = new Date().toISOString();
    const rows = MASTER_PAGE_INVENTORY.map((item) => toDatabaseRow(item, adminId, now));
    const supabase = await createClient();
    const { data, error } = await supabase.from("page_settings").upsert(rows).select("id");
    if (error || !data || data.length !== rows.length) {
      console.error("Could not persist default page settings:", error?.code || "incomplete");
      return { success: false, error: "Page settings could not be reset." };
    }
    revalidatePageControls();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed reset." };
  }
}
