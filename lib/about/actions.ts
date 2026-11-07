"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type {
  AboutContentData,
  AboutValueRecord,
  AboutMilestoneRecord,
  AboutApproachRecord,
} from "./types";

const FALLBACK_ABOUT_CONTENT: AboutContentData = {
  id: "main",
  missionTitleEn: "Our mission",
  missionTitleAr: "مهمتنا",
  missionDescEn:
    "Help teams ship software that is reliable, maintainable, and worth trusting — and show our work so others can verify it.",
  missionDescAr:
    "مساعدة الفِرق على بناء برمجيات موثوقة وقابلة للصيانة وجديرة بالثقة — وتوثيق عملنا بشفافية لتمكين الجميع من التحقق منه.",
  visionTitleEn: "Our vision",
  visionTitleAr: "رؤيتنا",
  visionDescEn:
    "A regional engineering culture where quality is the default, not a premium.",
  visionDescAr:
    "ترسيخ ثقافة هندسية إقليمية تكون فيها الجودة هي المعيار الأساسي وليست ميزة استثنائية.",
  storyTitleEn: "How we got here",
  storyTitleAr: "كيف بدأنا مسيرتنا",
  storyP1En:
    "Musnad Tech was founded in Riyadh in 2021 by a small group of senior engineers who had spent a decade building software at scale.",
  storyP1Ar:
    "تأسست مسند للتقنية في الرياض عام 2021 على يد نخبة من كبار المهندسين أصحاب الخبرة الطويلة في بناء الأنظمة المعقدة.",
  storyP2En:
    "From the first commit, we made a deliberate choice: bilingual-first, by default. Arabic and English are first-class.",
  storyP2Ar:
    "منذ السطر الأول البرمجي، اخترنا أن تكون أنظمتنا ثنائية اللغة أصالةً وبشكل افتراضي.",
};

const FALLBACK_ABOUT_VALUES: AboutValueRecord[] = [
  {
    id: "proof",
    titleEn: "Proof over claims",
    titleAr: "البرهان قبل الادعاء",
    descriptionEn: "We show our work. Case studies, evals, open source — verify us.",
    descriptionAr: "نوثق نتائج أعمالنا فعلياً عبر دراسات الحالة والتقييم والبرمجيات المفتوحة.",
    icon: "LuTarget",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "flexibility",
    titleEn: "Structured flexibility",
    titleAr: "مرونة مهيكلة ومدروسة",
    descriptionEn: "Deliberate structure with room for the right exceptions — not a rigid template.",
    descriptionAr: "هيكلة منظمة تستوعب المتغيرات دون قوالب جامدة تعيق الإنتاجية.",
    icon: "LuSlidersHorizontal",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "security",
    titleEn: "Security by design",
    titleAr: "الأمان بالتصميم المعماري",
    descriptionEn: "Threat modeling and least privilege are defaults, not add-ons.",
    descriptionAr: "نمذجة التهديدات ومبدأ الامتيازات الأقل هي معاييرنا الافتراضية دائماً.",
    icon: "LuShieldCheck",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "bilingual",
    titleEn: "Bilingual first",
    titleAr: "ثنائية اللغة بالأصالة",
    descriptionEn: "Arabic and English are first-class. RTL and LTR, end to end.",
    descriptionAr: "العربية والإنجليزية من الدرجة الأولى دعماً وتجربة وتصميماً متكاملاً.",
    icon: "LuLanguages",
    displayOrder: 4,
    isActive: true,
  },
];

const FALLBACK_ABOUT_MILESTONES: AboutMilestoneRecord[] = [
  {
    id: "2021",
    year: "2021",
    titleEn: "Musnad Tech founded",
    titleAr: "تأسيس مسند للتقنية",
    descriptionEn: "Started as a two-person studio in Riyadh.",
    descriptionAr: "انطلقت كاستوديو هندسي من مهندسَين اثنين في الرياض.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "2022",
    year: "2022",
    titleEn: "First regulated client portal",
    titleAr: "أول بوابة عملاء متوافقة تنظيمياً",
    descriptionEn: "Shipped Rakeen — our first bilingual, compliant product.",
    descriptionAr: "إطلاق بوابة ركين — أول منتج ثنائي اللغة ومعتمد ومطابق للمعايير التنظيمية.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "2023",
    year: "2023",
    titleEn: "Open-source Naft",
    titleAr: "إطلاق أداة نفط مفتوحة المصدر",
    descriptionEn: "Released Naft Deploy, our deployment tool for small teams.",
    descriptionAr: "إطلاق أداة Naft Deploy لتسهيل النشر السحابي للفِرق البرمجية الصغيرة.",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "2024",
    year: "2024",
    titleEn: "Streaming analytics at scale",
    titleAr: "تحليلات التدفق اللحظي على نطاق واسع",
    descriptionEn: "Delivered Sahim — 48k events/min with sub-200ms queries.",
    descriptionAr: "تسليم منصة سهم — معالجة 48 ألف حدث في الدقيقة باستعلامات أقل من 200 مللي ثانية.",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "2025",
    year: "2025",
    titleEn: "AI practice & eval-first RAG",
    titleAr: "تطوير ممارسة الذكاء الاصطناعي وRAG",
    descriptionEn: "Formalized our AI integration practice around evals and honesty.",
    descriptionAr: "تأسيس ممارسة تكامل الذكاء الاصطناعي القائمة على التقييم الصارم والشفافية.",
    displayOrder: 5,
    isActive: true,
  },
];

const FALLBACK_ABOUT_APPROACH: AboutApproachRecord[] = [
  {
    id: "discovery",
    stepNumber: "01",
    titleEn: "Discovery",
    titleAr: "الاستكشاف والتحليل",
    descriptionEn:
      "A paid engagement to align on the problem, constraints, and success metrics before committing to build.",
    descriptionAr:
      "مرحلة استكشافية دقيقة لمواءمة التحديات والمحددات ومؤشرات النجاح قبل البدء في التنفيذ.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "architecture",
    stepNumber: "02",
    titleEn: "Architecture & RFCs",
    titleAr: "المعمارية ووثائق RFCs",
    descriptionEn:
      "We write down the hard decisions — architecture, trade-offs, risks — and review them openly.",
    descriptionAr:
      "توثيق القرارات الهندسية المفصلية والمفاضلات الفنية وتحليل المخاطر بشفافية تامة.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "cadence",
    stepNumber: "03",
    titleEn: "Build with cadence",
    titleAr: "البناء بإيقاع منتظم",
    descriptionEn:
      "Weekly demos, continuous review, and honest progress. No black boxes, no surprises at the end.",
    descriptionAr:
      "استعراض أسبوعي ومراجعة مستمرة وتقدم واقعي، بلا صناديق مغلقة أو مفاجآت.",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "operate",
    stepNumber: "04",
    titleEn: "Ship & operate",
    titleAr: "الإطلاق والتشغيل",
    descriptionEn:
      "We deploy to production with observability and own the first weeks of operation. Then we hand over, or stay on.",
    descriptionAr:
      "النشر السحابي بأعلى معايير المراقبة وإدارة أسابيع التشغيل الأولى حتى التسليم الكامل أو الشراكة المستمرة.",
    displayOrder: 4,
    isActive: true,
  },
];

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

const DB_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: PromiseLike<T>, timeoutMs = DB_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase request timeout")), timeoutMs)
    ),
  ]);
}

/**
 * Retrieves About main content (Mission, Vision, Story)
 */
export async function getAboutContentAction(): Promise<AboutContentData> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("about_content")
      .select("*")
      .eq("id", "main")
      .single();

    const { data, error } = await withTimeout(query);

    if (!error && data) {
      return {
        id: data.id,
        missionTitleEn: data.mission_title_en,
        missionTitleAr: data.mission_title_ar,
        missionDescEn: data.mission_desc_en,
        missionDescAr: data.mission_desc_ar,
        visionTitleEn: data.vision_title_en,
        visionTitleAr: data.vision_title_ar,
        visionDescEn: data.vision_desc_en,
        visionDescAr: data.vision_desc_ar,
        storyTitleEn: data.story_title_en,
        storyTitleAr: data.story_title_ar,
        storyP1En: data.story_p1_en,
        storyP1Ar: data.story_p1_ar,
        storyP2En: data.story_p2_en,
        storyP2Ar: data.story_p2_ar,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {
    console.warn("Could not query about_content from Supabase, using fallback:", err instanceof Error ? err.message : String(err));
  }

  return FALLBACK_ABOUT_CONTENT;
}

/**
 * Updates About main content
 */
export async function updateAboutContentAction(
  data: Partial<AboutContentData>
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: "main",
      mission_title_en: data.missionTitleEn,
      mission_title_ar: data.missionTitleAr,
      mission_desc_en: data.missionDescEn,
      mission_desc_ar: data.missionDescAr,
      vision_title_en: data.visionTitleEn,
      vision_title_ar: data.visionTitleAr,
      vision_desc_en: data.visionDescEn,
      vision_desc_ar: data.visionDescAr,
      story_title_en: data.storyTitleEn,
      story_title_ar: data.storyTitleAr,
      story_p1_en: data.storyP1En,
      story_p1_ar: data.storyP1Ar,
      story_p2_en: data.storyP2En,
      story_p2_ar: data.storyP2Ar,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("about_content").upsert(payload);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "About content updated successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update about content.";
    throw new Error(msg);
  }
}

/**
 * Retrieves About Values
 */
export async function getAboutValuesAction(includeInactive = false): Promise<AboutValueRecord[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("about_values")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await withTimeout(query);
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        titleEn: row.title_en,
        titleAr: row.title_ar,
        descriptionEn: row.description_en,
        descriptionAr: row.description_ar,
        icon: row.icon || "LuTarget",
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Could not query about_values from Supabase, using fallback:", err instanceof Error ? err.message : String(err));
  }

  return includeInactive
    ? FALLBACK_ABOUT_VALUES
    : FALLBACK_ABOUT_VALUES.filter((v) => v.isActive);
}

/**
 * Creates/Updates About Value
 */
export async function upsertAboutValueAction(
  val: Partial<AboutValueRecord> & { id: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: val.id,
      title_en: val.titleEn,
      title_ar: val.titleAr,
      description_en: val.descriptionEn,
      description_ar: val.descriptionAr,
      icon: val.icon || "LuTarget",
      display_order: val.displayOrder ?? 0,
      is_active: val.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("about_values").upsert(payload);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Value saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save value.";
    throw new Error(msg);
  }
}

/**
 * Deletes an About Value
 */
export async function deleteAboutValueAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("about_values").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Value deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete value.";
    throw new Error(msg);
  }
}

/**
 * Retrieves About Milestones
 */
export async function getAboutMilestonesAction(includeInactive = false): Promise<AboutMilestoneRecord[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("about_milestones")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await withTimeout(query);
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        year: row.year,
        titleEn: row.title_en,
        titleAr: row.title_ar,
        descriptionEn: row.description_en,
        descriptionAr: row.description_ar,
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Could not query about_milestones from Supabase, using fallback:", err instanceof Error ? err.message : String(err));
  }

  return includeInactive
    ? FALLBACK_ABOUT_MILESTONES
    : FALLBACK_ABOUT_MILESTONES.filter((m) => m.isActive);
}

/**
 * Upserts a Milestone
 */
export async function upsertAboutMilestoneAction(
  item: Partial<AboutMilestoneRecord> & { id: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: item.id,
      year: item.year,
      title_en: item.titleEn,
      title_ar: item.titleAr,
      description_en: item.descriptionEn,
      description_ar: item.descriptionAr,
      display_order: item.displayOrder ?? 0,
      is_active: item.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("about_milestones").upsert(payload);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Milestone saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save milestone.";
    throw new Error(msg);
  }
}

/**
 * Deletes a Milestone
 */
export async function deleteAboutMilestoneAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("about_milestones").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Milestone deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete milestone.";
    throw new Error(msg);
  }
}

/**
 * Retrieves About Approach Steps
 */
export async function getAboutApproachAction(includeInactive = false): Promise<AboutApproachRecord[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("about_approach_steps")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await withTimeout(query);
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        stepNumber: row.step_number,
        titleEn: row.title_en,
        titleAr: row.title_ar,
        descriptionEn: row.description_en,
        descriptionAr: row.description_ar,
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Could not query about_approach_steps from Supabase, using fallback:", err instanceof Error ? err.message : String(err));
  }

  return includeInactive
    ? FALLBACK_ABOUT_APPROACH
    : FALLBACK_ABOUT_APPROACH.filter((a) => a.isActive);
}

/**
 * Upserts an Approach Step
 */
export async function upsertAboutApproachAction(
  step: Partial<AboutApproachRecord> & { id: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: step.id,
      step_number: step.stepNumber,
      title_en: step.titleEn,
      title_ar: step.titleAr,
      description_en: step.descriptionEn,
      description_ar: step.descriptionAr,
      display_order: step.displayOrder ?? 0,
      is_active: step.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("about_approach_steps").upsert(payload);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Approach step saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save approach step.";
    throw new Error(msg);
  }
}

/**
 * Deletes an Approach Step
 */
export async function deleteAboutApproachAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("about_approach_steps").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Approach step deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete approach step.";
    throw new Error(msg);
  }
}
