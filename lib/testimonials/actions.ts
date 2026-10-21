"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { TestimonialItem, TestimonialFormData } from "./types";

const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "ahmed",
    authorNameEn: "Ahmed Al-Dossari",
    authorNameAr: "أحمد الدوسري",
    roleEn: "Head of Product · Regional Investment Firm",
    roleAr: "رئيس قطاع المنتجات · شركة استثمارية إقليمية",
    quoteEn: "Musnad Tech didn't just build software — they raised our standard for what reliable looks like. The Sahim platform became the tool our analysts actually trust.",
    quoteAr: "لم تبنِ مسند للتقنية مجرد برمجيات — بل رفعت معاييرنا لما يجب أن تكون عليه الموثوقية. أصبحت منصة سهم الأداة التي يثق بها محللونا فعلياً.",
    initial: "A",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "reem",
    authorNameEn: "Reem Al-Sayed",
    authorNameAr: "ريم السيد",
    roleEn: "Managing Partner · Legal Services Firm",
    roleAr: "شريك مدير · شركة خدمات قانونية",
    quoteEn: "The Rakeen portal transformed how our clients interact with us. Bilingual, accessible, and genuinely secure — delivered on time.",
    quoteAr: "غيّرت بوابة ركين أسلوب تفاعل عملائنا معنا بالكامل. ثنائية اللغة، وسهلة الوصول، وآمنة تماماً — وتم تسليمها بدقة في الموعد المحدد.",
    initial: "R",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "faisal",
    authorNameEn: "Faisal Al-Nasser",
    authorNameAr: "فيصل الناصر",
    roleEn: "CTO · Logistics Operator",
    roleAr: "الرئيس التنفيذي للتقنية · شركة حلول لوجستية",
    quoteEn: "They replaced a costly vendor SaaS with a self-hosted observability stack and cut our incident response time by more than half. Calm, competent engineering.",
    quoteAr: "استبدلوا خدمة SaaS تجارية باهظة الثمن بمنظومة مراقبة مستضافة ذاتياً، وخفّضوا وقت استجابتنا للحوادث بأكثر من النصف. هندسة هادئة ومتقنة.",
    initial: "F",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "tariq",
    authorNameEn: "Tariq Al-Hamdani",
    authorNameAr: "طارق الحمداني",
    roleEn: "VP of Engineering · FinTech Solutions",
    roleAr: "نائب الرئيس للهندسة · حلول التقنية المالية",
    quoteEn: "The architectural clarity Musnad Tech brought to our financial infrastructure gave us complete confidence during our highest-volume transaction periods.",
    quoteAr: "الدقة التقنية والوضوح المعماري الذي أضافته مسند لبنيتنا التحتية للمدفوعات منحنا ثقة تامة واستقراراً غير مسبوق في مواسم الذروة التشغيلية.",
    initial: "T",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "mona",
    authorNameEn: "Mona Al-Khatib",
    authorNameAr: "منى الخطيب",
    roleEn: "Head of Digital Transformation · Healthcare Network",
    roleAr: "رئيسة التحول الرقمي · شبكة الرعاية الصحية",
    quoteEn: "Delivering a bilingual enterprise portal with zero accessibility compromises was critical for our institution. Musnad's engineering discipline was exemplary.",
    quoteAr: "كان بناء بوابة مؤسسية ثنائية اللغة بمعايير إتاحة عالمية وأمان تام أمراً حاسماً لمنظمتنا. انضباط مسند الهندسي استثنائي ونموذجي.",
    initial: "M",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "khalid",
    authorNameEn: "Khalid Al-Ariqi",
    authorNameAr: "خالد العريقي",
    roleEn: "Founder & CEO · Cloud Logistics",
    roleAr: "المؤسس والرئيس التنفيذي · الخدمات اللوجستية السحابية",
    quoteEn: "From day one, Musnad operated like an elite in-house team. The resilient distributed systems they designed scaled effortlessly as our operations expanded.",
    quoteAr: "منذ اليوم الأول، عمل فريق مسند كجزء أصيل من فريقنا التقني. الأنظمة الموزعة التي صمموها توسعت بكل سلاسة مع تضاعف مستخدمينا وعملياتنا.",
    initial: "K",
    displayOrder: 6,
    isActive: true,
  },
];

let memoryTestimonialsCache: TestimonialItem[] = [...INITIAL_TESTIMONIALS];
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

/**
 * Retrieves testimonials (for Home page or Admin Dashboard)
 */
export async function getTestimonialsAction(
  includeInactive = false
): Promise<TestimonialItem[]> {
  const now = Date.now();
  if (lastFetch > 0 && now - lastFetch < CACHE_TTL_MS && memoryTestimonialsCache.length > 0) {
    return includeInactive
      ? memoryTestimonialsCache
      : memoryTestimonialsCache.filter((t) => t.isActive);
  }

  try {
    const supabase = await createClient();
    const query = supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const mapped = (data as unknown as TestimonialDbRow[]).map(mapRowToTestimonial);
      if (includeInactive) {
        memoryTestimonialsCache = mapped;
      }
      lastFetch = now;
      return mapped;
    }
  } catch (err) {
    console.warn("Could not query testimonials from Supabase, using cache:", err);
  }

  return includeInactive
    ? memoryTestimonialsCache
    : memoryTestimonialsCache.filter((t) => t.isActive);
}

/**
 * Creates a new testimonial (Admin only)
 */
export async function createTestimonialAction(formData: TestimonialFormData): Promise<{
  success: boolean;
  data?: TestimonialItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    const id =
      formData.id ||
      formData.authorNameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `testi-${Date.now()}`;

    const newTestimonial: TestimonialItem = {
      id,
      authorNameEn: formData.authorNameEn.trim(),
      authorNameAr: formData.authorNameAr.trim(),
      roleEn: formData.roleEn.trim(),
      roleAr: formData.roleAr.trim(),
      quoteEn: formData.quoteEn.trim(),
      quoteAr: formData.quoteAr.trim(),
      initial:
        formData.initial?.trim() ||
        formData.authorNameEn.trim().charAt(0).toUpperCase() ||
        "A",
      avatarUrl: formData.avatarUrl?.trim() || undefined,
      companyName: formData.companyName?.trim() || undefined,
      displayOrder: formData.displayOrder ?? memoryTestimonialsCache.length + 1,
      isActive: formData.isActive !== false,
      createdAt: new Date().toISOString(),
    };

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("testimonials")
        .insert({
          id: newTestimonial.id,
          author_name_en: newTestimonial.authorNameEn,
          author_name_ar: newTestimonial.authorNameAr,
          role_en: newTestimonial.roleEn,
          role_ar: newTestimonial.roleAr,
          quote_en: newTestimonial.quoteEn,
          quote_ar: newTestimonial.quoteAr,
          initial: newTestimonial.initial,
          avatar_url: newTestimonial.avatarUrl || null,
          company_name: newTestimonial.companyName || null,
          display_order: newTestimonial.displayOrder,
          is_active: newTestimonial.isActive,
        })
        .select()
        .single();

      if (!error && data) {
        const created = mapRowToTestimonial(data as unknown as TestimonialDbRow);
        memoryTestimonialsCache = [...memoryTestimonialsCache, created].sort(
          (a, b) => a.displayOrder - b.displayOrder
        );
        revalidatePath("/");
        revalidatePath("/[locale]", "layout");
        revalidatePath("/[locale]/admin/testimonials", "page");
        return { success: true, data: created };
      }
    } catch {
      // In-memory fallback
    }

    memoryTestimonialsCache = [...memoryTestimonialsCache, newTestimonial].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/testimonials", "page");

    return { success: true, data: newTestimonial };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to create testimonial." };
  }
}

/**
 * Updates an existing testimonial (Admin only)
 */
export async function updateTestimonialAction(
  id: string,
  formData: Partial<TestimonialFormData>
): Promise<{
  success: boolean;
  data?: TestimonialItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (formData.authorNameEn !== undefined) updatePayload.author_name_en = formData.authorNameEn.trim();
      if (formData.authorNameAr !== undefined) updatePayload.author_name_ar = formData.authorNameAr.trim();
      if (formData.roleEn !== undefined) updatePayload.role_en = formData.roleEn.trim();
      if (formData.roleAr !== undefined) updatePayload.role_ar = formData.roleAr.trim();
      if (formData.quoteEn !== undefined) updatePayload.quote_en = formData.quoteEn.trim();
      if (formData.quoteAr !== undefined) updatePayload.quote_ar = formData.quoteAr.trim();
      if (formData.initial !== undefined) updatePayload.initial = formData.initial.trim();
      if (formData.avatarUrl !== undefined) updatePayload.avatar_url = formData.avatarUrl?.trim() || null;
      if (formData.companyName !== undefined) updatePayload.company_name = formData.companyName?.trim() || null;
      if (formData.displayOrder !== undefined) updatePayload.display_order = formData.displayOrder;
      if (formData.isActive !== undefined) updatePayload.is_active = formData.isActive;

      const { data, error } = await supabase
        .from("testimonials")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated = mapRowToTestimonial(data as unknown as TestimonialDbRow);
        memoryTestimonialsCache = memoryTestimonialsCache
          .map((t) => (t.id === id ? updated : t))
          .sort((a, b) => a.displayOrder - b.displayOrder);

        revalidatePath("/");
        revalidatePath("/[locale]", "layout");
        revalidatePath("/[locale]/admin/testimonials", "page");
        return { success: true, data: updated };
      }
    } catch {
      // In-memory fallback
    }

    memoryTestimonialsCache = memoryTestimonialsCache
      .map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          authorNameEn: formData.authorNameEn !== undefined ? formData.authorNameEn.trim() : t.authorNameEn,
          authorNameAr: formData.authorNameAr !== undefined ? formData.authorNameAr.trim() : t.authorNameAr,
          roleEn: formData.roleEn !== undefined ? formData.roleEn.trim() : t.roleEn,
          roleAr: formData.roleAr !== undefined ? formData.roleAr.trim() : t.roleAr,
          quoteEn: formData.quoteEn !== undefined ? formData.quoteEn.trim() : t.quoteEn,
          quoteAr: formData.quoteAr !== undefined ? formData.quoteAr.trim() : t.quoteAr,
          initial: formData.initial !== undefined ? formData.initial.trim() : t.initial,
          avatarUrl: formData.avatarUrl !== undefined ? formData.avatarUrl?.trim() : t.avatarUrl,
          companyName: formData.companyName !== undefined ? formData.companyName?.trim() : t.companyName,
          displayOrder: formData.displayOrder !== undefined ? formData.displayOrder : t.displayOrder,
          isActive: formData.isActive !== undefined ? formData.isActive : t.isActive,
        };
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const updated = memoryTestimonialsCache.find((t) => t.id === id);

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/testimonials", "page");

    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update testimonial." };
  }
}

/**
 * Toggles testimonial visibility on the Home page (Admin only)
 */
export async function toggleTestimonialActiveAction(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  return updateTestimonialAction(id, { isActive });
}

/**
 * Deletes a testimonial (Admin only)
 */
export async function deleteTestimonialAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();
      await supabase.from("testimonials").delete().eq("id", id);
    } catch {
      // In-memory
    }

    memoryTestimonialsCache = memoryTestimonialsCache.filter((t) => t.id !== id);

    revalidatePath("/");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/admin/testimonials", "page");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete testimonial." };
  }
}
