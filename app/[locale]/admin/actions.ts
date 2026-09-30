"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type Section = "projects" | "articles" | "technologies" | "inquiries";
type ContentStatus = "draft" | "published" | "archived";

function field(form: FormData, key: string, max: number): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function context(form: FormData, section: Section) {
  const locale = field(form, "locale", 2) === "ar" ? "ar" : "en";
  return { locale, base: `/${locale}/admin?section=${section}` };
}

function go(base: string, notice: string): never {
  redirect(`${base}&notice=${notice}`);
}

async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata;
  if (!userId || !metadata || typeof metadata !== "object" || !("role" in metadata) || metadata.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return createClient();
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function validSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function status(form: FormData): ContentStatus {
  const value = field(form, "status", 20);
  return value === "published" || value === "archived" ? value : "draft";
}

export async function saveProject(form: FormData) {
  const { locale, base } = context(form, "projects");
  const supabase = await requireAdmin();
  const id = field(form, "id", 36);
  const slug = field(form, "slug", 100);
  const titleEn = field(form, "title_en", 180);
  const titleAr = field(form, "title_ar", 180);
  const summaryEn = field(form, "summary_en", 2000);
  const summaryAr = field(form, "summary_ar", 2000);
  const nextStatus = status(form);

  if ((id && !validId(id)) || !validSlug(slug) || !titleEn || !titleAr) go(base, "invalid");

  const existing = id ? await supabase.from("projects").select("published_at").eq("id", id).maybeSingle() : null;
  if (id && (existing?.error || !existing?.data)) go(base, "error");
  const values = { slug, status: "draft" as const };
  let projectId = id;
  if (id) {
    const { data, error } = await supabase.from("projects").update(values).eq("id", id).select("id").single();
    if (error || !data) go(base, error?.code === "23505" ? "duplicate" : "error");
  } else {
    const { data, error } = await supabase.from("projects").insert(values).select("id").single();
    if (error || !data) go(base, error?.code === "23505" ? "duplicate" : "error");
    projectId = data.id;
  }

  const { error: translationError } = await supabase.from("project_translations").upsert([
    { project_id: projectId, locale: "en", title: titleEn, summary: summaryEn || null },
    { project_id: projectId, locale: "ar", title: titleAr, summary: summaryAr || null },
  ], { onConflict: "project_id,locale" });
  if (translationError) go(base, "error");

  if (nextStatus !== "draft") {
    const { error } = await supabase.from("projects").update({
      status: nextStatus,
      published_at: nextStatus === "published" ? existing?.data?.published_at ?? new Date().toISOString() : existing?.data?.published_at ?? null,
    }).eq("id", projectId);
    if (error) go(base, "error");
  }

  revalidatePath(`/${locale}/admin`);
  go(base, "saved");
}

export async function saveArticle(form: FormData) {
  const { locale, base } = context(form, "articles");
  const supabase = await requireAdmin();
  const id = field(form, "id", 36);
  const slug = field(form, "slug", 100);
  const titleEn = field(form, "title_en", 180);
  const titleAr = field(form, "title_ar", 180);
  const contentEn = field(form, "content_en", 50000);
  const contentAr = field(form, "content_ar", 50000);
  const excerptEn = field(form, "excerpt_en", 1000);
  const excerptAr = field(form, "excerpt_ar", 1000);
  const nextStatus = status(form);

  if ((id && !validId(id)) || !validSlug(slug) || !titleEn || !titleAr || !contentEn || !contentAr) go(base, "invalid");

  const existing = id ? await supabase.from("articles").select("published_at").eq("id", id).maybeSingle() : null;
  if (id && (existing?.error || !existing?.data)) go(base, "error");
  const values = { slug, status: "draft" as const };
  let articleId = id;
  if (id) {
    const { data, error } = await supabase.from("articles").update(values).eq("id", id).select("id").single();
    if (error || !data) go(base, error?.code === "23505" ? "duplicate" : "error");
  } else {
    const { data, error } = await supabase.from("articles").insert(values).select("id").single();
    if (error || !data) go(base, error?.code === "23505" ? "duplicate" : "error");
    articleId = data.id;
  }

  const { error: translationError } = await supabase.from("article_translations").upsert([
    { article_id: articleId, locale: "en", title: titleEn, excerpt: excerptEn || null, content: contentEn },
    { article_id: articleId, locale: "ar", title: titleAr, excerpt: excerptAr || null, content: contentAr },
  ], { onConflict: "article_id,locale" });
  if (translationError) go(base, "error");

  if (nextStatus !== "draft") {
    const { error } = await supabase.from("articles").update({
      status: nextStatus,
      published_at: nextStatus === "published" ? existing?.data?.published_at ?? new Date().toISOString() : existing?.data?.published_at ?? null,
    }).eq("id", articleId);
    if (error) go(base, "error");
  }

  revalidatePath(`/${locale}/admin`);
  go(base, "saved");
}

export async function saveTechnology(form: FormData) {
  const { locale, base } = context(form, "technologies");
  const supabase = await requireAdmin();
  const id = field(form, "id", 36);
  const slug = field(form, "slug", 100);
  const name = field(form, "name", 180);
  const iconKey = field(form, "icon_key", 100);
  if ((id && !validId(id)) || !validSlug(slug) || !name) go(base, "invalid");

  const values = { slug, name, icon_key: iconKey || null };
  const result = id
    ? await supabase.from("technologies").update(values).eq("id", id).select("id").single()
    : await supabase.from("technologies").insert(values).select("id").single();
  if (result.error || !result.data) go(base, result.error?.code === "23505" ? "duplicate" : "error");

  revalidatePath(`/${locale}/admin`);
  go(base, "saved");
}

export async function updateInquiry(form: FormData) {
  const { locale, base } = context(form, "inquiries");
  const supabase = await requireAdmin();
  const id = field(form, "id", 36);
  const nextStatus = field(form, "status", 20);
  if (!validId(id) || !["new", "in_progress", "resolved", "closed"].includes(nextStatus)) go(base, "invalid");

  const { data, error } = await supabase.from("inquiries").update({ status: nextStatus }).eq("id", id).select("id").single();
  if (error || !data) go(base, "error");

  revalidatePath(`/${locale}/admin`);
  go(base, "saved");
}
