"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { FaqTopicRecord, FaqQuestionRecord } from "./types";

const FALLBACK_FAQ_TOPICS: FaqTopicRecord[] = [
  {
    id: "working-with-us",
    slug: "working-with-us",
    titleEn: "Working with Musnad Tech",
    titleAr: "التعاون مع مسند للتقنية",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "company",
    slug: "company",
    titleEn: "Company & Engineering Model",
    titleAr: "الشركة والنموذج الهندسي",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "accounts",
    slug: "accounts",
    titleEn: "Accounts & Verification",
    titleAr: "الحسابات والتحقق",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "contact",
    slug: "contact",
    titleEn: "Inquiries & Communication",
    titleAr: "الاستفسارات والتواصل",
    displayOrder: 4,
    isActive: true,
  },
];

const FALLBACK_FAQ_QUESTIONS: FaqQuestionRecord[] = [
  {
    id: "q-working-1",
    topicId: "working-with-us",
    questionEn: "How does Musnad Tech approach new client engagements?",
    questionAr: "كيف تبدأ مسند للتقنية المشاريع الجديدة مع العملاء؟",
    answerEn:
      "We begin with a structured Discovery Sprint to define the architecture, risks, and technical milestones before writing code. This ensures zero surprises and strict timeline accountability.",
    answerAr:
      "نبدأ بمرحلة استكشاف فني وتحليلي دقيقة لتحديد المعمارية البرمجية والمخاطر والمراحل الزمنية قبل البدء في كتابة الأكواد، مما يضمن الشفافية التامة والالتزام الدقيق.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "q-working-2",
    topicId: "working-with-us",
    questionEn: "What delivery models do you support for enterprise teams?",
    questionAr: "ما هي نماذج التسليم والتعاقد المتاحة للشركات؟",
    answerEn:
      "We offer dedicated engineering pods, architecture advisory engagements, and end-to-end product development with full operational handover.",
    answerAr:
      "نوفر فِرقاً برمجية متخصصة ومستقلة، واستشارات معمارية استراتيجية، وتطويراً شاملاً للمنتجات من الفكرة حتى التشغيل والتسليم المعرفي.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "q-company-1",
    topicId: "company",
    questionEn: "Where is Musnad Tech headquartered?",
    questionAr: "أين يقع المقر الرئيسي لمسند للتقنية؟",
    answerEn:
      "We are headquartered in Riyadh, Saudi Arabia, serving high-growth startups and established enterprises across the GCC and internationally.",
    answerAr:
      "يقع مقرنا الرئيسي في الرياض بالمملكة العربية السعودية، ونقدم خدماتنا للشركات الناشئة الواعدة والمؤسسات الكبرى في الخليج ودولياً.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "q-company-2",
    topicId: "company",
    questionEn: "How do you guarantee data security and compliance?",
    questionAr: "كيف تضمنون أمان البيانات والامتثال للمعايير التنظيمية؟",
    answerEn:
      "Security is architected by design. All systems implement strict least-privilege policies, Row Level Security, end-to-end encryption, and full compliance with local Saudi data residency regulations.",
    answerAr:
      "الأمان مدمج في أصل المعمارية. نطبق مبدأ الامتيازات الأقل وسياسات حماية البيانات على مستوى السجل RLS والتشفير الشامل والامتثال التام للوائح استضافة البيانات في السعودية.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "q-accounts-1",
    topicId: "accounts",
    questionEn: "Do clients require an account to submit inquiries or collaborate?",
    questionAr: "هل يتطلب إرسال الاستفسارات أو التعاون إنشاء حساب؟",
    answerEn:
      "Initial project inquiries can be submitted directly via our public contact form. For active engineering engagements, dedicated client portal access with multi-factor authentication is provisioned.",
    answerAr:
      "يمكن إرسال الاستفسارات الأولية مباشرة عبر نموذج التواصل. أما للمشاريع القائمة فيتم تزويد العملاء ببوابة مخصصة ومحمية بمصادقة متعددة العوامل.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "q-contact-1",
    topicId: "contact",
    questionEn: "What is your expected response time for new inquiries?",
    questionAr: "ما هو زمن الاستجابة المتوقع للاستفسارات الجديدة؟",
    answerEn:
      "Our engineering leadership reviews and responds to every verified project inquiry within two business days — with genuine technical insights, not sales theatre.",
    answerAr:
      "تقوم قيادتنا الهندسية بمراجعة والرد على كافة استفسارات المشاريع خلال يومي عمل — بتقديم تحليلات فنية واقعية بعيداً عن العروض التسويقية غير الدقيقة.",
    displayOrder: 1,
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
 * Retrieves all FAQ topics
 */
export async function getFaqTopicsAction(includeInactive = false): Promise<FaqTopicRecord[]> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("faq_topics")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query.eq("is_active", true);
    }

    const { data, error } = await withTimeout(query);
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        slug: row.slug,
        titleEn: row.title_en,
        titleAr: row.title_ar,
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Could not query faq_topics from Supabase, using fallback:", err instanceof Error ? err.message : String(err));
  }

  return includeInactive
    ? FALLBACK_FAQ_TOPICS
    : FALLBACK_FAQ_TOPICS.filter((t) => t.isActive);
}

/**
 * Upserts an FAQ topic
 */
export async function upsertFaqTopicAction(
  topic: Partial<FaqTopicRecord> & { id: string; slug: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: topic.id,
      slug: topic.slug,
      title_en: topic.titleEn,
      title_ar: topic.titleAr,
      display_order: topic.displayOrder ?? 0,
      is_active: topic.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("faq_topics").upsert(payload);
    if (error) throw error;

    revalidatePath("/faq");
    revalidatePath("/en/faq");
    revalidatePath("/ar/faq");
    revalidatePath("/admin/faqs");
    return { success: true, message: "FAQ topic saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save FAQ topic.";
    throw new Error(msg);
  }
}

/**
 * Deletes an FAQ topic
 */
export async function deleteFaqTopicAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("faq_topics").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/faq");
    revalidatePath("/en/faq");
    revalidatePath("/ar/faq");
    revalidatePath("/admin/faqs");
    return { success: true, message: "FAQ topic deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete FAQ topic.";
    throw new Error(msg);
  }
}

/**
 * Retrieves all FAQ questions
 */
export async function getFaqQuestionsAction(
  topicId?: string,
  includeInactive = false
): Promise<FaqQuestionRecord[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("faq_questions")
      .select("*")
      .order("display_order", { ascending: true });

    if (topicId) {
      query = query.eq("topic_id", topicId);
    }

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await withTimeout(query);
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        topicId: row.topic_id,
        questionEn: row.question_en,
        questionAr: row.question_ar,
        answerEn: row.answer_en,
        answerAr: row.answer_ar,
        displayOrder: row.display_order ?? 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Could not query faq_questions from Supabase, using fallback:", err instanceof Error ? err.message : String(err));
  }

  let result = FALLBACK_FAQ_QUESTIONS;
  if (topicId) {
    result = result.filter((q) => q.topicId === topicId);
  }
  if (!includeInactive) {
    result = result.filter((q) => q.isActive);
  }
  return result;
}

/**
 * Upserts an FAQ question
 */
export async function upsertFaqQuestionAction(
  q: Partial<FaqQuestionRecord> & { id: string; topicId: string }
): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const payload = {
      id: q.id,
      topic_id: q.topicId,
      question_en: q.questionEn,
      question_ar: q.questionAr,
      answer_en: q.answerEn,
      answer_ar: q.answerAr,
      display_order: q.displayOrder ?? 0,
      is_active: q.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("faq_questions").upsert(payload);
    if (error) throw error;

    revalidatePath("/faq");
    revalidatePath("/en/faq");
    revalidatePath("/ar/faq");
    revalidatePath("/admin/faqs");
    return { success: true, message: "FAQ item saved successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save FAQ item.";
    throw new Error(msg);
  }
}

/**
 * Deletes an FAQ question
 */
export async function deleteFaqQuestionAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifyAdminAuth();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("faq_questions").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/faq");
    revalidatePath("/en/faq");
    revalidatePath("/ar/faq");
    revalidatePath("/admin/faqs");
    return { success: true, message: "FAQ item deleted successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete FAQ item.";
    throw new Error(msg);
  }
}
