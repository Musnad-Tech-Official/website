"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { TrustedCompanyItem, CompanyFormData } from "./types";

/**
 * Pre-seeded Trusted Companies (matches existing Home page partners)
 */
const INITIAL_COMPANIES: TrustedCompanyItem[] = [
  {
    id: "yemen-mobile",
    nameEn: "Yemen Mobile",
    nameAr: "يمن موبايل",
    logo: "/companies/yemen-mobile.svg",
    websiteUrl: "https://www.yemenmobile.com.ye",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "kuraimi-bank",
    nameEn: "Al Kuraimi Bank",
    nameAr: "بنك الكريمي",
    logo: "/companies/kuraimi-bank.svg",
    websiteUrl: "https://kuraimibank.com",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "tadhamon-bank",
    nameEn: "Tadhamon Bank",
    nameAr: "بنك التضامن",
    logo: "/companies/tadhamon-bank.svg",
    websiteUrl: "https://www.tadhamonbank.com",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "hsa-group",
    nameEn: "HSA Group",
    nameAr: "مجموعة هائل سعيد أنعم",
    logo: "/companies/hsa-group.svg",
    websiteUrl: "https://www.hsagroup.com",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "cac-bank",
    nameEn: "CAC Bank",
    nameAr: "بنك التسليف التعاوني الزراعي",
    logo: "/companies/cac-bank.svg",
    websiteUrl: "https://cacbank.com.ye",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "ykb",
    nameEn: "Yemen Kuwait Bank",
    nameAr: "بنك اليمن والكويت",
    logo: "/companies/ykb.svg",
    websiteUrl: "https://yk-bank.com",
    displayOrder: 6,
    isActive: true,
  },
];

// In-memory fallback cache
let memoryCompaniesCache: TrustedCompanyItem[] = [...INITIAL_COMPANIES];
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

interface CompanyDbRow {
  id: string;
  name_en: string;
  name_ar: string;
  logo_url: string;
  website_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

function mapRowToCompany(row: CompanyDbRow): TrustedCompanyItem {
  return {
    id: row.id,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    logo: row.logo_url,
    websiteUrl: row.website_url || undefined,
    displayOrder: row.display_order ?? 0,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  };
}

/**
 * Retrieves trusted companies (for Home page or Admin Dashboard)
 */
export async function getTrustedCompaniesAction(
  includeInactive = false
): Promise<TrustedCompanyItem[]> {
  const now = Date.now();
  if (lastFetch > 0 && now - lastFetch < CACHE_TTL_MS && memoryCompaniesCache.length > 0) {
    return includeInactive
      ? memoryCompaniesCache
      : memoryCompaniesCache.filter((c) => c.isActive);
  }

  try {
    const supabase = await createClient();
    const query = supabase
      .from("trusted_companies")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const mapped = (data as unknown as CompanyDbRow[]).map(mapRowToCompany);
      if (includeInactive) {
        memoryCompaniesCache = mapped;
      }
      lastFetch = now;
      return mapped;
    }
  } catch (err) {
    console.warn("Could not query trusted_companies table from Supabase, using memory cache:", err);
  }

  return includeInactive
    ? memoryCompaniesCache
    : memoryCompaniesCache.filter((c) => c.isActive);
}

/**
 * Creates a new trusted company (Admin only)
 */
export async function createCompanyAction(formData: CompanyFormData): Promise<{
  success: boolean;
  data?: TrustedCompanyItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    const id =
      formData.id ||
      formData.nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `company-${Date.now()}`;

    const newCompany: TrustedCompanyItem = {
      id,
      nameEn: formData.nameEn.trim(),
      nameAr: formData.nameAr.trim(),
      logo: formData.logo.trim(),
      websiteUrl: formData.websiteUrl?.trim() || undefined,
      displayOrder: formData.displayOrder ?? memoryCompaniesCache.length + 1,
      isActive: formData.isActive !== false,
      createdAt: new Date().toISOString(),
    };

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("trusted_companies")
        .insert({
          id: newCompany.id,
          name_en: newCompany.nameEn,
          name_ar: newCompany.nameAr,
          logo_url: newCompany.logo,
          website_url: newCompany.websiteUrl || null,
          display_order: newCompany.displayOrder,
          is_active: newCompany.isActive,
        })
        .select()
        .single();

      if (!error && data) {
        const created = mapRowToCompany(data as unknown as CompanyDbRow);
        memoryCompaniesCache = [...memoryCompaniesCache, created].sort(
          (a, b) => a.displayOrder - b.displayOrder
        );
        revalidatePath("/");
        revalidatePath("/[locale]", "layout");
        revalidatePath("/[locale]/admin/companies", "page");
        return { success: true, data: created };
      }
    } catch {
      // Fallback in-memory
    }

    // In-memory fallback
    memoryCompaniesCache = [...memoryCompaniesCache, newCompany].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/companies", "page");

    return { success: true, data: newCompany };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to create company" };
  }
}

/**
 * Updates an existing trusted company (Admin only)
 */
export async function updateCompanyAction(
  id: string,
  formData: Partial<CompanyFormData>
): Promise<{
  success: boolean;
  data?: TrustedCompanyItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (formData.nameEn !== undefined) updatePayload.name_en = formData.nameEn.trim();
      if (formData.nameAr !== undefined) updatePayload.name_ar = formData.nameAr.trim();
      if (formData.logo !== undefined) updatePayload.logo_url = formData.logo.trim();
      if (formData.websiteUrl !== undefined)
        updatePayload.website_url = formData.websiteUrl.trim() || null;
      if (formData.displayOrder !== undefined)
        updatePayload.display_order = formData.displayOrder;
      if (formData.isActive !== undefined) updatePayload.is_active = formData.isActive;

      const { data, error } = await supabase
        .from("trusted_companies")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated = mapRowToCompany(data as unknown as CompanyDbRow);
        memoryCompaniesCache = memoryCompaniesCache
          .map((c) => (c.id === id ? updated : c))
          .sort((a, b) => a.displayOrder - b.displayOrder);

        revalidatePath("/");
        revalidatePath("/[locale]", "layout");
        revalidatePath("/[locale]/admin/companies", "page");
        return { success: true, data: updated };
      }
    } catch {
      // In-memory fallback
    }

    // Update in-memory fallback
    memoryCompaniesCache = memoryCompaniesCache
      .map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          nameEn: formData.nameEn !== undefined ? formData.nameEn.trim() : c.nameEn,
          nameAr: formData.nameAr !== undefined ? formData.nameAr.trim() : c.nameAr,
          logo: formData.logo !== undefined ? formData.logo.trim() : c.logo,
          websiteUrl:
            formData.websiteUrl !== undefined
              ? formData.websiteUrl.trim() || undefined
              : c.websiteUrl,
          displayOrder:
            formData.displayOrder !== undefined ? formData.displayOrder : c.displayOrder,
          isActive: formData.isActive !== undefined ? formData.isActive : c.isActive,
        };
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const updated = memoryCompaniesCache.find((c) => c.id === id);

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/companies", "page");

    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update company" };
  }
}

/**
 * Deletes a trusted company (Admin only)
 */
export async function deleteCompanyAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();
      await supabase.from("trusted_companies").delete().eq("id", id);
    } catch {
      // Ignore
    }

    memoryCompaniesCache = memoryCompaniesCache.filter((c) => c.id !== id);

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/companies", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete company" };
  }
}

/**
 * Toggles company visibility on the Home page (Admin only)
 */
export async function toggleCompanyActiveAction(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  return updateCompanyAction(id, { isActive });
}

/**
 * Reorders companies (Admin only)
 */
export async function reorderCompaniesAction(
  orderedIds: string[]
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    const orderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));

    try {
      const supabase = await createClient();
      for (const [id, order] of orderMap.entries()) {
        await supabase
          .from("trusted_companies")
          .update({ display_order: order, updated_at: new Date().toISOString() })
          .eq("id", id);
      }
    } catch {
      // In-memory fallback
    }

    memoryCompaniesCache = memoryCompaniesCache
      .map((c) => {
        const newOrder = orderMap.get(c.id);
        return newOrder !== undefined ? { ...c, displayOrder: newOrder } : c;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/companies", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to reorder companies" };
  }
}
