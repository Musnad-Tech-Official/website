"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { CareerJobRecord, CareerValueRecord } from "./types";

const FALLBACK_CAREER_JOBS: CareerJobRecord[] = [
  {
    id: "senior-backend-engineer",
    slug: "senior-backend-engineer",
    titleEn: "Senior Backend Engineer",
    titleAr: "مهندس نظم وخلفيات أول",
    department: "engineering",
    workMode: "hybrid",
    workTypeEn: "Full-time",
    workTypeAr: "دوام كامل",
    locationEn: "Riyadh / Remote",
    locationAr: "الرياض / عن بُعد",
    descriptionEn:
      "Lead high-throughput distributed backend architectures with strong guarantees on data consistency and zero-downtime deployments.",
    descriptionAr:
      "قيادة معمارية الأنظمة الخلفية الموزعة عالية الأداء، وضمان استقرار البيانات والنشر المستمر دون توقف.",
    requirementsEn: [
      "5+ years in distributed systems (Go/Node/Postgres)",
      "Deep SQL & database performance tuning",
      "Strong understanding of event-driven architectures",
    ],
    requirementsAr: [
      "خبرة 5+ سنوات في الأنظمة الموزعة (Go / Node / Postgres)",
      "معرفة متقدمة بتحسين استعلامات وقواعد البيانات",
      "فهم متين للأنظمة المعتمدة على الأحداث Event-Driven",
    ],
    responsibilitiesEn: [
      "Design resilient database schemas and caching layers",
      "Mentor junior engineers and lead technical RFCs",
      "Collaborate on bilingual API contracts",
    ],
    responsibilitiesAr: [
      "تصميم قواعد بيانات متينة وطبقات التخزين المؤقت",
      "توجيه المهندسين وقيادة وثائق الـ RFCs الفنية",
      "تطوير واجهات برمجية ثنائية اللغة بمعايير صارمة",
    ],
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "machine-learning-engineer",
    slug: "machine-learning-engineer",
    titleEn: "Machine Learning Engineer",
    titleAr: "مهندس تعلم الآلة والذكاء الاصطناعي",
    department: "ai",
    workMode: "remote",
    workTypeEn: "Full-time",
    workTypeAr: "دوام كامل",
    locationEn: "Remote",
    locationAr: "عن بُعد",
    descriptionEn:
      "Build reliable RAG architectures, custom domain evaluations, and production AI pipelines with strict truthfulness guarantees.",
    descriptionAr:
      "بناء معمارية RAG متطورة وتقييمات مخصصة ونظم ذكاء اصطناعي إنتاجية بضمانات دقة وشفافية صارمة.",
    requirementsEn: [
      "Experience building production RAG & Vector DB pipelines",
      "Proficiency in Python, PyTorch, and LLM evaluation frameworks",
      "Knowledge of prompt engineering & semantic retrieval",
    ],
    requirementsAr: [
      "خبرة في بناء مسارات RAG وقواعد البيانات المتجهية",
      "إتقان بايثون وأطر تقييم النماذج اللغوية الكبيرة",
      "معرفة عميقة بالاسترجاع الدلالي وهندسة الأوامر",
    ],
    responsibilitiesEn: [
      "Design evaluation-first AI benchmarks",
      "Integrate streaming LLM responses into production apps",
      "Monitor and prevent model hallucinations",
    ],
    responsibilitiesAr: [
      "تصميم مقاييس واختبارات لتقييم النماذج بدقة",
      "دمج الردود المتدفقة للنماذج في بيئات الإنتاج",
      "مراقبة وتقليل هلوسة النماذج والتحقق من المخرجات",
    ],
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "design-engineer",
    slug: "design-engineer",
    titleEn: "Design Engineer",
    titleAr: "مهندس تصميم وواجهات",
    department: "design",
    workMode: "onSite",
    workTypeEn: "Full-time",
    workTypeAr: "دوام كامل",
    locationEn: "Riyadh",
    locationAr: "الرياض",
    descriptionEn:
      "Bridge the gap between product design and engineering with high-craft UI components, accessibility, and fluid animations.",
    descriptionAr:
      "الربط بين تصميم المنتجات وهندسة الواجهات عبر مكونات برمجية فائقة الإتقان تدعم الوصولية والحركات الانسيابية.",
    requirementsEn: [
      "Mastery of React, Tailwind CSS, TypeScript, and micro-interactions",
      "Deep respect for bilingual typography and RTL nuances",
      "Experience building and maintaining accessible design systems",
    ],
    requirementsAr: [
      "إتقان تام لـ React و Tailwind و TypeScript والتفاعلات الدقيقة",
      "فهم عميق للخطوط العربية وخصوصية الاتجاه من اليمين لليسار (RTL)",
      "خبرة في بناء وتطوير أنظمة التصميم الشاملة والوصولية",
    ],
    responsibilitiesEn: [
      "Build accessible UI components matching rigorous tokens",
      "Optimize layout shifts and interaction metrics (INP, CLS)",
      "Partner with product designers on component specs",
    ],
    responsibilitiesAr: [
      "برمجة مكونات واجهات تفاعلية متوافقة مع معايير الوصولية",
      "تحسين مؤشرات تجربة المستخدم واستقرار التخطيط (INP, CLS)",
      "التعاون مع المصممين في تحديد وتوثيق خصائص المكونات",
    ],
    displayOrder: 3,
    isActive: true,
  },
];

const FALLBACK_CAREER_VALUES: CareerValueRecord[] = [
  {
    id: "senior",
    titleEn: "Senior by default",
    titleAr: "كبار المهندسين بالأصالة",
    descriptionEn: "Small, high-agency teams of senior practitioners who own problems end-to-end.",
    descriptionAr: "فِرق صغيرة ذات كفاءة واستقلالية عالية تتولى مسؤولية الحلول من البداية للنهاية.",
    icon: "LuAward",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "bilingual",
    titleEn: "Bilingual first",
    titleAr: "ثنائية اللغة بالأصالة",
    descriptionEn: "We treat Arabic as a first-class citizen across documentation, code, and interfaces.",
    descriptionAr: "العربية لغة أصيلة من الدرجة الأولى في توثيقنا، أكوادنا، وواجهاتنا.",
    icon: "LuLanguages",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "openSource",
    titleEn: "Open-source friendly",
    titleAr: "دعم البرمجيات مفتوحة المصدر",
    descriptionEn: "We give back to the tools we depend on and open-source our non-proprietary tooling.",
    descriptionAr: "نساهم في تطوير الأدوات التي نعتمد عليها ونشارك برمجياتنا غير الاحتكارية مع المجتمع.",
    icon: "LuCode",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "remote",
    titleEn: "Remote & asynchronous",
    titleAr: "العمل المرن وغير المتزامن",
    descriptionEn: "Autonomous workflows that respect deep focus and clear, documented expectations.",
    descriptionAr: "سير عمل مرن ومستقل يحترم التركيز العميق والتوقعات الموثقة بدقة.",
    icon: "LuLaptop",
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

interface CareerJobDbRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  department: "engineering" | "ai" | "design";
  work_mode: "hybrid" | "remote" | "onSite";
  work_type_en: string;
  work_type_ar: string;
  location_en: string;
  location_ar: string;
  description_en: string;
  description_ar: string;
  requirements_en: string[];
  requirements_ar: string[];
  responsibilities_en: string[];
  responsibilities_ar: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

function mapRowToJob(row: CareerJobDbRow): CareerJobRecord {
  return {
    id: row.id,
    slug: row.slug,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    department: row.department,
    workMode: row.work_mode,
    workTypeEn: row.work_type_en,
    workTypeAr: row.work_type_ar,
    locationEn: row.location_en,
    locationAr: row.location_ar,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    requirementsEn: row.requirements_en || [],
    requirementsAr: row.requirements_ar || [],
    responsibilitiesEn: row.responsibilities_en || [],
    responsibilitiesAr: row.responsibilities_ar || [],
    displayOrder: row.display_order ?? 0,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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
 * Retrieves all jobs
 */
export async function getCareerJobsAction(includeInactive = false): Promise<CareerJobRecord[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("career_jobs")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await withTimeout(query);
    if (!error && data && data.length > 0) {
      return (data as unknown as CareerJobDbRow[]).map(mapRowToJob);
    }
  } catch (err) {
    console.warn("Could not query career_jobs from Supabase, using fallback:", err instanceof Error ? err.message : String(err));
  }

  return includeInactive
    ? FALLBACK_CAREER_JOBS
    : FALLBACK_CAREER_JOBS.filter((j) => j.isActive);
}

/**
 * Retrieves a single job by slug
 */
export async function getCareerJobBySlugAction(slug: string): Promise<CareerJobRecord | null> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("career_jobs")
      .select("*")
      .eq("slug", slug)
      .single();

    const { data, error } = await withTimeout(query);

    if (!error && data) {
      return mapRowToJob(data as unknown as CareerJobDbRow);
    }
  } catch (err) {
    console.warn(`Could not query career job ${slug} from Supabase:`, err instanceof Error ? err.message : String(err));
  }

  const fallback = FALLBACK_CAREER_JOBS.find((j) => j.slug === slug);
  return fallback || null;
}

/**
 * Upserts a career job
 */
export async function upsertCareerJobAction(
  job: Partial<CareerJobRecord> & { id: string; slug: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: job.id,
      slug: job.slug,
      title_en: job.titleEn,
      title_ar: job.titleAr,
      department: job.department || "engineering",
      work_mode: job.workMode || "remote",
      work_type_en: job.workTypeEn || "Full-time",
      work_type_ar: job.workTypeAr || "دوام كامل",
      location_en: job.locationEn || "Riyadh / Remote",
      location_ar: job.locationAr || "الرياض / عن بُعد",
      description_en: job.descriptionEn || "",
      description_ar: job.descriptionAr || "",
      requirements_en: job.requirementsEn || [],
      requirements_ar: job.requirementsAr || [],
      responsibilities_en: job.responsibilitiesEn || [],
      responsibilities_ar: job.responsibilitiesAr || [],
      display_order: job.displayOrder ?? 0,
      is_active: job.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("career_jobs").upsert(payload);
    if (error) throw error;

    revalidatePath("/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ar/careers");
    revalidatePath(`/careers/${job.slug}`);
    revalidatePath(`/en/careers/${job.slug}`);
    revalidatePath(`/ar/careers/${job.slug}`);
    revalidatePath("/admin/careers");
    return { success: true, message: "Job saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save job.";
    throw new Error(msg);
  }
}

/**
 * Deletes a career job
 */
export async function deleteCareerJobAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("career_jobs").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ar/careers");
    revalidatePath("/admin/careers");
    return { success: true, message: "Job deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete job.";
    throw new Error(msg);
  }
}

/**
 * Retrieves career values
 */
export async function getCareerValuesAction(includeInactive = false): Promise<CareerValueRecord[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("career_values")
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
        icon: row.icon || "LuAward",
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Could not query career_values from Supabase, using fallback:", err instanceof Error ? err.message : String(err));
  }

  return includeInactive
    ? FALLBACK_CAREER_VALUES
    : FALLBACK_CAREER_VALUES.filter((v) => v.isActive);
}

/**
 * Upserts a career value
 */
export async function upsertCareerValueAction(
  val: Partial<CareerValueRecord> & { id: string }
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
      icon: val.icon || "LuAward",
      display_order: val.displayOrder ?? 0,
      is_active: val.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("career_values").upsert(payload);
    if (error) throw error;

    revalidatePath("/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ar/careers");
    revalidatePath("/admin/careers");
    return { success: true, message: "Career value saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save career value.";
    throw new Error(msg);
  }
}

/**
 * Deletes a career value
 */
export async function deleteCareerValueAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("career_values").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ar/careers");
    revalidatePath("/admin/careers");
    return { success: true, message: "Career value deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete career value.";
    throw new Error(msg);
  }
}
