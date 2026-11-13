"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { ServiceItem, ServiceFormData } from "./types";

function revalidateServicePages(): void {
  revalidatePath("/");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/services", "page");
  revalidatePath("/[locale]/admin/services", "page");
}

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

interface ServiceDbRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  tags_en: string[];
  tags_ar: string[];
  href: string;
  display_order: number;
  enabled_home: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

function mapRowToService(row: ServiceDbRow): ServiceItem {
  return {
    id: row.id,
    slug: row.slug,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    icon: row.icon,
    tagsEn: row.tags_en || [],
    tagsAr: row.tags_ar || [],
    href: row.href || `/services/${row.slug}`,
    displayOrder: row.display_order ?? 0,
    enabledHome: Boolean(row.enabled_home),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Retrieves all services (for Services Hub or Admin Dashboard)
 */
export async function getServicesAction(includeInactive = false): Promise<ServiceItem[]> {
  if (includeInactive) await verifyAdminAuth();

  const supabase = await createClient();
  let query = supabase.from("services").select("*").order("display_order", { ascending: true });
  if (!includeInactive) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) {
    console.error("Failed to load services:", error.code);
    throw new Error("Unable to load services from the database.");
  }
  return ((data ?? []) as ServiceDbRow[]).map(mapRowToService);
}

/**
 * Retrieves active services configured for display on the Home page capabilities section
 */
export async function getHomeServicesAction(): Promise<ServiceItem[]> {
  const all = await getServicesAction(false);
  return all.filter((s) => s.enabledHome);
}

/**
 * Retrieves a single service by its slug
 */
export async function getServiceBySlugAction(slug: string): Promise<ServiceItem | null> {
  const all = await getServicesAction(false);
  return all.find((s) => s.slug === slug || s.id === slug) || null;
}

/**
 * Creates a new engineering service (Admin only)
 */
export async function createServiceAction(formData: ServiceFormData): Promise<{
  success: boolean;
  data?: ServiceItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();
    const slug =
      formData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      formData.titleEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) return { success: false, error: "A valid service slug is required." };

    const supabase = await createClient();
    const { data, error } = await supabase.from("services").insert({
      id: formData.id || slug,
      slug,
      title_en: formData.titleEn.trim(),
      title_ar: formData.titleAr.trim(),
      description_en: formData.descriptionEn.trim(),
      description_ar: formData.descriptionAr.trim(),
      icon: formData.icon.trim() || "LuCode",
      tags_en: formData.tagsEn ?? [],
      tags_ar: formData.tagsAr ?? [],
      href: formData.href?.trim() || `/services/${slug}`,
      display_order: formData.displayOrder ?? (await getServicesAction(true)).length + 1,
      enabled_home: formData.enabledHome !== false,
      is_active: formData.isActive !== false,
    }).select().single();

    if (error || !data) {
      console.error("Failed to create service:", error?.code || "no-data");
      return { success: false, error: "Service was not saved. Please try again." };
    }
    revalidateServicePages();
    return { success: true, data: mapRowToService(data as ServiceDbRow) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create service." };
  }
}

/**
 * Updates an existing service (Admin only)
 */
export async function updateServiceAction(id: string, formData: Partial<ServiceFormData>): Promise<{
  success: boolean;
  data?: ServiceItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();
    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (formData.slug !== undefined) updatePayload.slug = formData.slug.trim();
    if (formData.titleEn !== undefined) updatePayload.title_en = formData.titleEn.trim();
    if (formData.titleAr !== undefined) updatePayload.title_ar = formData.titleAr.trim();
    if (formData.descriptionEn !== undefined) updatePayload.description_en = formData.descriptionEn.trim();
    if (formData.descriptionAr !== undefined) updatePayload.description_ar = formData.descriptionAr.trim();
    if (formData.icon !== undefined) updatePayload.icon = formData.icon.trim();
    if (formData.tagsEn !== undefined) updatePayload.tags_en = formData.tagsEn;
    if (formData.tagsAr !== undefined) updatePayload.tags_ar = formData.tagsAr;
    if (formData.href !== undefined) updatePayload.href = formData.href.trim();
    if (formData.displayOrder !== undefined) updatePayload.display_order = formData.displayOrder;
    if (formData.enabledHome !== undefined) updatePayload.enabled_home = formData.enabledHome;
    if (formData.isActive !== undefined) updatePayload.is_active = formData.isActive;

    const supabase = await createClient();
    const { data, error } = await supabase.from("services")
      .update(updatePayload).eq("id", id).select().single();
    if (error || !data) {
      console.error("Failed to update service:", error?.code || "no-data");
      return { success: false, error: "Service changes were not saved. Please try again." };
    }
    revalidateServicePages();
    return { success: true, data: mapRowToService(data as ServiceDbRow) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update service." };
  }
}

/**
 * Toggles whether a service is featured on the Home page capabilities grid
 */
export async function toggleServiceHomeAction(
  id: string,
  enabledHome: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  return updateServiceAction(id, { enabledHome });
}

/**
 * Toggles service active / published state
 */
export async function toggleServiceActiveAction(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  return updateServiceAction(id, { isActive });
}

/**
 * Deletes a service (Admin only)
 */
export async function deleteServiceAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await verifyAdminAuth();
    const supabase = await createClient();
    const { data, error } = await supabase.from("services").delete()
      .eq("id", id).select("id").single();
    if (error || !data) {
      console.error("Failed to delete service:", error?.code || "no-data");
      return { success: false, error: "Service was not deleted. Please try again." };
    }
    revalidateServicePages();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete service." };
  }
}
