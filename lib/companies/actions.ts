"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { TrustedCompanyItem, CompanyFormData } from "./types";

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

function revalidateCompanies() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/companies", "page");
}

/** Only publish confirmed Supabase records. */
export async function getTrustedCompaniesAction(
  includeInactive = false
): Promise<TrustedCompanyItem[]> {
  if (includeInactive) await verifyAdminAuth();
  const supabase = await createClient();
  let query = supabase.from("trusted_companies").select("*").order("display_order", { ascending: true });
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) {
    console.error("Failed to read trusted companies:", error.code);
    throw new Error("Companies are unavailable.");
  }
  return ((data ?? []) as CompanyDbRow[]).map(mapRowToCompany);
}

/** Writes must be confirmed by the database before displaying success. */
export async function createCompanyAction(formData: CompanyFormData): Promise<{
  success: boolean;
  data?: TrustedCompanyItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();
    const nameEn = formData.nameEn.trim();
    const slug = formData.id || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = slug || `company-${crypto.randomUUID()}`;
    if (!nameEn || !formData.nameAr.trim()) return { success: false, error: "Company names are required." };

    const displayOrder = formData.displayOrder ??
      (await getTrustedCompaniesAction(true)).reduce((max, c) => Math.max(max, c.displayOrder), 0) + 1;
    const supabase = await createClient();
    const { data, error } = await supabase.from("trusted_companies").insert({
      id,
      name_en: nameEn,
      name_ar: formData.nameAr.trim(),
      logo_url: formData.logo.trim(),
      website_url: formData.websiteUrl?.trim() || null,
      display_order: displayOrder,
      is_active: formData.isActive !== false,
    }).select().single();

    if (error || !data) {
      console.error("Failed to create company:", error?.code || "no-data");
      return { success: false, error: "Company was not saved." };
    }
    revalidateCompanies();
    return { success: true, data: mapRowToCompany(data as CompanyDbRow) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create company." };
  }
}

export async function updateCompanyAction(
  id: string, formData: Partial<CompanyFormData>
): Promise<{ success: boolean; data?: TrustedCompanyItem; error?: string }> {
  try {
    await verifyAdminAuth();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (formData.nameEn !== undefined) payload.name_en = formData.nameEn.trim();
    if (formData.nameAr !== undefined) payload.name_ar = formData.nameAr.trim();
    if (formData.logo !== undefined) payload.logo_url = formData.logo.trim();
    if (formData.websiteUrl !== undefined) payload.website_url = formData.websiteUrl.trim() || null;
    if (formData.displayOrder !== undefined) payload.display_order = formData.displayOrder;
    if (formData.isActive !== undefined) payload.is_active = formData.isActive;

    const supabase = await createClient();
    const { data, error } = await supabase.from("trusted_companies").update(payload)
      .eq("id", id).select().single();
    if (error || !data) {
      console.error("Failed to update company:", error?.code || "no-data");
      return { success: false, error: "Company changes were not saved." };
    }
    revalidateCompanies();
    return { success: true, data: mapRowToCompany(data as CompanyDbRow) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update company." };
  }
}

export async function deleteCompanyAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const supabase = await createClient();
    const { data, error } = await supabase.from("trusted_companies").delete()
      .eq("id", id).select("id").single();
    if (error || !data) {
      console.error("Failed to delete company:", error?.code || "no-data");
      return { success: false, error: "Company was not deleted." };
    }
    revalidateCompanies();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete company." };
  }
}

export async function toggleCompanyActiveAction(
  id: string, isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateCompanyAction(id, { isActive });
}

/** A single bulk upsert prevents partial success of the reorder operation. */
export async function reorderCompaniesAction(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const uniqueIds = [...new Set(orderedIds)];
    if (uniqueIds.length !== orderedIds.length) return { success: false, error: "Duplicate company IDs." };
    if (!orderedIds.length) return { success: true };

    const companies = await getTrustedCompaniesAction(true);
    const byId = new Map(companies.map((company) => [company.id, company]));
    if (uniqueIds.some((id) => !byId.has(id))) return { success: false, error: "Unknown company ID." };
    const now = new Date().toISOString();
    const updates = uniqueIds.map((id, index) => {
      const company = byId.get(id)!;
      return {
        id: company.id,
        name_en: company.nameEn,
        name_ar: company.nameAr,
        logo_url: company.logo,
        website_url: company.websiteUrl || null,
        display_order: index + 1,
        is_active: company.isActive,
        updated_at: now,
      };
    });
    const supabase = await createClient();
    const { data, error } = await supabase.from("trusted_companies")
      .upsert(updates).select("id");
    if (error || !data || data.length !== updates.length) {
      console.error("Failed to reorder companies:", error?.code || "incomplete");
      return { success: false, error: "Company order was not saved." };
    }
    revalidateCompanies();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to reorder companies." };
  }
}
