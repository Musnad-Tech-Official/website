"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { TestimonialItem, TestimonialFormData } from "./types";

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

interface TestimonialDbRow {
  id: string;
  author_name_en: string;
  author_name_ar: string;
  role_en: string;
  role_ar: string;
  quote_en: string;
  quote_ar: string;
  initial: string;
  avatar_url?: string | null;
  company_name?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

function mapRowToTestimonial(row: TestimonialDbRow): TestimonialItem {
  return {
    id: row.id,
    authorNameEn: row.author_name_en,
    authorNameAr: row.author_name_ar,
    roleEn: row.role_en,
    roleAr: row.role_ar,
    quoteEn: row.quote_en,
    quoteAr: row.quote_ar,
    initial: row.initial,
    avatarUrl: row.avatar_url || undefined,
    companyName: row.company_name || undefined,
    displayOrder: row.display_order ?? 0,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  };
}

function revalidateTestimonials() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/testimonials", "page");
}

export async function getTestimonialsAction(
  includeInactive = false
): Promise<TestimonialItem[]> {
  if (includeInactive) await verifyAdminAuth();
  const supabase = await createClient();
  let query = supabase.from("testimonials").select("*").order("display_order", { ascending: true });
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) {
    console.error("Failed to read testimonials:", error.code);
    throw new Error("Testimonials are unavailable.");
  }
  return ((data ?? []) as TestimonialDbRow[]).map(mapRowToTestimonial);
}

/** Never publish an endorsement unless it was saved successfully. */
export async function createTestimonialAction(
  formData: TestimonialFormData
): Promise<{ success: boolean; data?: TestimonialItem; error?: string }> {
  try {
    await verifyAdminAuth();
    const nameEn = formData.authorNameEn.trim();
    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = formData.id || slug || `testimonial-${crypto.randomUUID()}`;
    if (!nameEn || !formData.quoteEn.trim() || !formData.quoteAr.trim()) {
      return { success: false, error: "Author and quote are required in both languages." };
    }
    const displayOrder = formData.displayOrder ??
      (await getTestimonialsAction(true)).reduce((max, item) => Math.max(max, item.displayOrder), 0) + 1;

    const supabase = await createClient();
    const { data, error } = await supabase.from("testimonials").insert({
      id,
      author_name_en: nameEn,
      author_name_ar: formData.authorNameAr.trim(),
      role_en: formData.roleEn.trim(),
      role_ar: formData.roleAr.trim(),
      quote_en: formData.quoteEn.trim(),
      quote_ar: formData.quoteAr.trim(),
      initial: formData.initial?.trim() || nameEn.charAt(0).toUpperCase() || "A",
      avatar_url: formData.avatarUrl?.trim() || null,
      company_name: formData.companyName?.trim() || null,
      display_order: displayOrder,
      is_active: formData.isActive !== false,
    }).select().single();

    if (error || !data) {
      console.error("Failed to save testimonial:", error?.code || "no-data");
      return { success: false, error: "Testimonial was not saved." };
    }
    revalidateTestimonials();
    return { success: true, data: mapRowToTestimonial(data as TestimonialDbRow) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create testimonial." };
  }
}

export async function updateTestimonialAction(
  id: string, formData: Partial<TestimonialFormData>
): Promise<{ success: boolean; data?: TestimonialItem; error?: string }> {
  try {
    await verifyAdminAuth();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (formData.authorNameEn !== undefined) payload.author_name_en = formData.authorNameEn.trim();
    if (formData.authorNameAr !== undefined) payload.author_name_ar = formData.authorNameAr.trim();
    if (formData.roleEn !== undefined) payload.role_en = formData.roleEn.trim();
    if (formData.roleAr !== undefined) payload.role_ar = formData.roleAr.trim();
    if (formData.quoteEn !== undefined) payload.quote_en = formData.quoteEn.trim();
    if (formData.quoteAr !== undefined) payload.quote_ar = formData.quoteAr.trim();
    if (formData.initial !== undefined) payload.initial = formData.initial.trim();
    if (formData.avatarUrl !== undefined) payload.avatar_url = formData.avatarUrl.trim() || null;
    if (formData.companyName !== undefined) payload.company_name = formData.companyName.trim() || null;
    if (formData.displayOrder !== undefined) payload.display_order = formData.displayOrder;
    if (formData.isActive !== undefined) payload.is_active = formData.isActive;

    const supabase = await createClient();
    const { data, error } = await supabase.from("testimonials")
      .update(payload).eq("id", id).select().single();
    if (error || !data) {
      console.error("Failed to update testimonial:", error?.code || "no-data");
      return { success: false, error: "Testimonial changes were not saved." };
    }
    revalidateTestimonials();
    return { success: true, data: mapRowToTestimonial(data as TestimonialDbRow) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update testimonial." };
  }
}

export async function toggleTestimonialActiveAction(
  id: string, isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateTestimonialAction(id, { isActive });
}

export async function deleteTestimonialAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const supabase = await createClient();
    const { data, error } = await supabase.from("testimonials")
      .delete().eq("id", id).select("id").single();
    if (error || !data) {
      console.error("Failed to delete testimonial:", error?.code || "no-data");
      return { success: false, error: "Testimonial was not deleted." };
    }
    revalidateTestimonials();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete testimonial." };
  }
}
