"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { FaqTopicRecord, FaqQuestionRecord } from "./types";

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
  if (includeInactive) await verifyAdminAuth();
  const supabase = await createClient();
  let query = supabase.from("faq_topics").select("*")
    .order("display_order", { ascending: true });
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await withTimeout(query);
  if (error) {
    console.error("FAQ topics query failed:", error.code);
    throw new Error("FAQ topics are unavailable.");
  }
  return (data ?? []).map((row) => ({
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
  if (includeInactive) await verifyAdminAuth();
  const supabase = await createClient();
  let query = supabase.from("faq_questions").select("*")
    .order("display_order", { ascending: true });
  if (topicId) query = query.eq("topic_id", topicId);
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await withTimeout(query);
  if (error) {
    console.error("FAQ questions query failed:", error.code);
    throw new Error("FAQ questions are unavailable.");
  }
  return (data ?? []).map((row) => ({
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
