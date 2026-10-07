"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { ServiceItem, ServiceFormData } from "./types";

const INITIAL_SERVICES: ServiceItem[] = [];

let memoryServicesCache: ServiceItem[] = [...INITIAL_SERVICES];
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
  const now = Date.now();
  if (lastFetch > 0 && now - lastFetch < CACHE_TTL_MS && memoryServicesCache.length > 0) {
    return includeInactive
      ? memoryServicesCache
      : memoryServicesCache.filter((s) => s.isActive);
  }

  try {
    const supabase = await createClient();
    const query = supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      const mapped = (data as unknown as ServiceDbRow[]).map(mapRowToService);
      if (includeInactive) {
        memoryServicesCache = mapped;
      }
      lastFetch = now;
      return mapped;
    }
  } catch (err) {
    console.warn("Could not query services from Supabase, using cache:", err);
  }

  return includeInactive
    ? memoryServicesCache
    : memoryServicesCache.filter((s) => s.isActive);
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
  const all = await getServicesAction(true);
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
      formData.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const id = formData.id || slug || `service-${Date.now()}`;
    const href = formData.href?.trim() || `/services/${slug}`;

    const newService: ServiceItem = {
      id,
      slug,
      titleEn: formData.titleEn.trim(),
      titleAr: formData.titleAr.trim(),
      descriptionEn: formData.descriptionEn.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      icon: formData.icon.trim() || "LuCode",
      tagsEn: formData.tagsEn || [],
      tagsAr: formData.tagsAr || [],
      href,
      displayOrder: formData.displayOrder ?? memoryServicesCache.length + 1,
      enabledHome: formData.enabledHome !== false,
      isActive: formData.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("services")
        .insert({
          id: newService.id,
          slug: newService.slug,
          title_en: newService.titleEn,
          title_ar: newService.titleAr,
          description_en: newService.descriptionEn,
          description_ar: newService.descriptionAr,
          icon: newService.icon,
          tags_en: newService.tagsEn,
          tags_ar: newService.tagsAr,
          href: newService.href,
          display_order: newService.displayOrder,
          enabled_home: newService.enabledHome,
          is_active: newService.isActive,
        })
        .select()
        .single();

      if (!error && data) {
        const created = mapRowToService(data as unknown as ServiceDbRow);
        memoryServicesCache = [...memoryServicesCache, created].sort(
          (a, b) => a.displayOrder - b.displayOrder
        );
        revalidatePath("/");
        revalidatePath("/[locale]", "layout");
        revalidatePath("/[locale]/services", "page");
        revalidatePath("/[locale]/admin/services", "page");
        return { success: true, data: created };
      }
    } catch {
      // In-memory fallback
    }

    memoryServicesCache = [...memoryServicesCache, newService].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/services", "page");
    revalidatePath("/[locale]/admin/services", "page");

    return { success: true, data: newService };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to create service." };
  }
}

/**
 * Updates an existing service (Admin only)
 */
export async function updateServiceAction(
  id: string,
  formData: Partial<ServiceFormData>
): Promise<{
  success: boolean;
  data?: ServiceItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

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

      const { data, error } = await supabase
        .from("services")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated = mapRowToService(data as unknown as ServiceDbRow);
        memoryServicesCache = memoryServicesCache
          .map((s) => (s.id === id ? updated : s))
          .sort((a, b) => a.displayOrder - b.displayOrder);

        revalidatePath("/");
        revalidatePath("/[locale]", "layout");
        revalidatePath("/[locale]/services", "page");
        revalidatePath("/[locale]/admin/services", "page");
        return { success: true, data: updated };
      }
    } catch {
      // In-memory fallback
    }

    memoryServicesCache = memoryServicesCache
      .map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          slug: formData.slug !== undefined ? formData.slug.trim() : s.slug,
          titleEn: formData.titleEn !== undefined ? formData.titleEn.trim() : s.titleEn,
          titleAr: formData.titleAr !== undefined ? formData.titleAr.trim() : s.titleAr,
          descriptionEn: formData.descriptionEn !== undefined ? formData.descriptionEn.trim() : s.descriptionEn,
          descriptionAr: formData.descriptionAr !== undefined ? formData.descriptionAr.trim() : s.descriptionAr,
          icon: formData.icon !== undefined ? formData.icon.trim() : s.icon,
          tagsEn: formData.tagsEn !== undefined ? formData.tagsEn : s.tagsEn,
          tagsAr: formData.tagsAr !== undefined ? formData.tagsAr : s.tagsAr,
          href: formData.href !== undefined ? formData.href.trim() : s.href,
          displayOrder: formData.displayOrder !== undefined ? formData.displayOrder : s.displayOrder,
          enabledHome: formData.enabledHome !== undefined ? formData.enabledHome : s.enabledHome,
          isActive: formData.isActive !== undefined ? formData.isActive : s.isActive,
          updatedAt: new Date().toISOString(),
        };
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const updated = memoryServicesCache.find((s) => s.id === id);

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/services", "page");
    revalidatePath("/[locale]/admin/services", "page");

    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update service." };
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

    try {
      const supabase = await createClient();
      await supabase.from("services").delete().eq("id", id);
    } catch {
      // In-memory
    }

    memoryServicesCache = memoryServicesCache.filter((s) => s.id !== id);
    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/services", "page");
    revalidatePath("/[locale]/admin/services", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete service." };
  }
}
