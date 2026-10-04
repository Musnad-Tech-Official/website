/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { uploadImageAction } from "@/lib/storage/actions";
import {
  LuX,
  LuSave,
  LuImage,
  LuGlobe,
  LuLoader,
  LuSparkles,
} from "react-icons/lu";
import type { Article, ArticleFormData } from "@/lib/articles/types";

interface ArticleEditorModalProps {
  article: Article | null; // null if creating new
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ArticleFormData) => Promise<boolean>;
  isRtl: boolean;
}

export function ArticleEditorModal({
  article,
  isOpen,
  onClose,
  onSave,
  isRtl,
}: ArticleEditorModalProps) {
  const [activeTab, setActiveTab] = React.useState<"en" | "ar">("en");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingCover, setIsUploadingCover] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);
  const coverInputRef = React.useRef<HTMLInputElement | null>(null);

  // Form Fields State
  const [titleEn, setTitleEn] = React.useState(article?.titleEn || "");
  const [titleAr, setTitleAr] = React.useState(article?.titleAr || "");
  const [slug, setSlug] = React.useState(article?.slug || "");
  const [excerptEn, setExcerptEn] = React.useState(article?.excerptEn || "");
  const [excerptAr, setExcerptAr] = React.useState(article?.excerptAr || "");
  const [category, setCategory] = React.useState(article?.category || "Engineering");
  const [tagsInput, setTagsInput] = React.useState(article?.tags.join(", ") || "");
  const [coverImage, setCoverImage] = React.useState(article?.coverImage || "");
  const [status, setStatus] = React.useState<Article["status"]>(article?.status || "draft");
  const [layoutVariant, setLayoutVariant] = React.useState<Article["layoutVariant"]>(
    article?.layoutVariant || "default"
  );
  const [contentHtmlEn, setContentHtmlEn] = React.useState(article?.contentHtmlEn || "");
  const [contentHtmlAr, setContentHtmlAr] = React.useState(article?.contentHtmlAr || "");

  const handleTitleEnChange = (val: string) => {
    setTitleEn(val);
    if (!article) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  if (!isOpen) return null;

  // Handle Cover Image Upload directly to Supabase Storage
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setErrorAlert(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData, "article-media");
      if (res.success && res.url) {
        setCoverImage(res.url);
      } else {
        setErrorAlert(res.error || "Failed to upload cover image.");
      }
    } catch (err: unknown) {
      setErrorAlert((err as Error).message || "Upload error.");
    } finally {
      setIsUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (submitStatus?: Article["status"]) => {
    if (!titleEn && !titleAr) {
      setErrorAlert(isRtl ? "يرجى كتابة عنوان المقال على الأقل." : "Please enter an article title.");
      return;
    }

    setIsSaving(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const data: ArticleFormData = {
      id: article?.id,
      slug: slug || titleEn.toLowerCase().replace(/\s+/g, "-"),
      titleEn: titleEn || titleAr,
      titleAr: titleAr || titleEn,
      excerptEn,
      excerptAr,
      contentHtmlEn,
      contentHtmlAr,
      category,
      tags,
      coverImage: coverImage || undefined,
      status: submitStatus || status,
      layoutVariant,
    };

    const success = await onSave(data);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-5xl my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <LuGlobe className="w-5 h-5 text-primary" />
              <span>
                {article
                  ? isRtl
                    ? "تعديل المقال"
                    : "Edit Article"
                  : isRtl
                  ? "إنشاء مقال جديد"
                  : "Create New Article"}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isRtl
                ? "اكتب المقال بحرية والصق الصور والأكواد بدون أي قيود"
                : "Free-form rich text publishing: paste images, code blocks, and rich media without restrictions"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorAlert && (
          <div className="px-6 pt-4">
            <Alert variant="destructive" onClose={() => setErrorAlert(null)}>
              <AlertDescription className="text-xs font-medium">
                {errorAlert}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Titles & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                {isRtl ? "عنوان المقال (الإنجليزية)" : "Article Title (English)"} *
              </label>
              <Input
                value={titleEn}
                onChange={(e) => handleTitleEnChange(e.target.value)}
                placeholder="e.g. Architecting Scalable Next.js Platforms"
                className="h-9"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                {isRtl ? "عنوان المقال (العربية)" : "Article Title (Arabic)"} *
              </label>
              <Input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: بناء منصات Next.js بمعمارية برمجية قابلة للتوسع"
                dir="rtl"
                className="h-9 text-end"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-foreground mb-1">
                {isRtl ? "الرابط الدائم (Slug)" : "Permanent URL Slug"} *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs">/blog/</span>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-slug-example"
                  className="h-9 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Excerpts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Textarea
                label={isRtl ? "ملخص المقال (الإنجليزية)" : "Excerpt (English)"}
                value={excerptEn}
                onChange={(e) => setExcerptEn(e.target.value)}
                placeholder="Brief summary of the article..."
                rows={2}
              />
            </div>
            <div>
              <Textarea
                label={isRtl ? "ملخص المقال (العربية)" : "Excerpt (Arabic)"}
                value={excerptAr}
                onChange={(e) => setExcerptAr(e.target.value)}
                placeholder="نبذة موجزة عن محتوى المقال..."
                rows={2}
                dir="rtl"
                className="text-end"
              />
            </div>
          </div>

          {/* Section 3: Metadata (Category, Tags, Layout, Cover Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border/70">
            <div>
              <label className="block font-medium text-foreground mb-1">
                {isRtl ? "التصنيف" : "Category"}
              </label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Engineering, Security, Design..."
                className="h-9"
              />
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                {isRtl ? "الوسوم (مفصولة بفاصلة)" : "Tags (comma-separated)"}
              </label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Next.js, TypeScript, Cloud"
                className="h-9"
              />
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                {isRtl ? "نوع العرض" : "Layout Style"}
              </label>
              <select
                value={layoutVariant}
                onChange={(e) => setLayoutVariant(e.target.value as Article["layoutVariant"])}
                className="w-full h-9 px-3 bg-muted/40 border border-border/80 rounded-lg text-xs text-foreground cursor-pointer focus:outline-none"
              >
                <option value="default">{isRtl ? "عادي (Default)" : "Default"}</option>
                <option value="featured">{isRtl ? "مميز (Featured)" : "Featured"}</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                {isRtl ? "حالة النشر" : "Publish Status"}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Article["status"])}
                className="w-full h-9 px-3 bg-muted/40 border border-border/80 rounded-lg text-xs text-foreground cursor-pointer focus:outline-none"
              >
                <option value="draft">{isRtl ? "مسودة (Draft)" : "Draft"}</option>
                <option value="published">{isRtl ? "منشور (Published)" : "Published"}</option>
                <option value="archived">{isRtl ? "مؤرشف (Archived)" : "Archived"}</option>
              </select>
            </div>

            {/* Cover Image Uploader */}
            <div className="sm:col-span-2 lg:col-span-4 space-y-2 pt-2 border-t border-border/40">
              <label className="block font-medium text-foreground text-xs">
                {isRtl ? "صورة الغلاف (Cover Image)" : "Cover Image"}
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <div className="flex-1">
                  <Input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://... or upload directly to Supabase Storage"
                    className="h-9 text-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingCover}
                  onClick={() => coverInputRef.current?.click()}
                  className="h-9 gap-1.5 cursor-pointer rounded-lg shrink-0"
                >
                  {isUploadingCover ? (
                    <LuLoader className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <LuImage className="w-4 h-4 text-primary" />
                  )}
                  <span>{isRtl ? "رفع غلاف إلى Supabase" : "Upload to Supabase Storage"}</span>
                </Button>
              </div>

              {/* Cover Image Visual Preview */}
              {coverImage && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-border/80 bg-muted/30 group">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3">
                    <span className="text-white text-xs font-mono truncate max-w-xs bg-black/60 px-2 py-1 rounded">
                      {coverImage.substring(0, 50)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors cursor-pointer"
                      title={isRtl ? "حذف الغلاف" : "Remove cover image"}
                    >
                      <LuX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Bilingual Rich Text Editors (Tiptap) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-sm text-foreground flex items-center gap-2">
                <LuSparkles className="w-4 h-4 text-primary" />
                <span>{isRtl ? "محتوى المقال (محرر Tiptap الحر)" : "Article Body Content (Tiptap Editor)"}</span>
              </span>

              {/* Language Switch Tabs for Editor */}
              <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30">
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === "en"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  English Content (LTR)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ar")}
                  className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === "ar"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  المحتوى العربي (RTL)
                </button>
              </div>
            </div>

            {/* English Tiptap Editor */}
            <div className={activeTab === "en" ? "block" : "hidden"}>
              <RichTextEditor
                value={contentHtmlEn}
                onChange={(html) => setContentHtmlEn(html)}
                dir="ltr"
                placeholder="Write English article content, paste images or code blocks freely..."
                minHeight="340px"
              />
            </div>

            {/* Arabic Tiptap Editor */}
            <div className={activeTab === "ar" ? "block" : "hidden"}>
              <RichTextEditor
                value={contentHtmlAr}
                onChange={(html) => setContentHtmlAr(html)}
                dir="rtl"
                placeholder="اكتب المحتوى باللغة العربية، يمكنك لصق الصور والأكواد مباشرة..."
                minHeight="340px"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() => handleSubmit("draft")}
              className="rounded-xl cursor-pointer"
            >
              {isRtl ? "حفظ كمسودة" : "Save as Draft"}
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={isSaving}
              onClick={() => handleSubmit("published")}
              className="gap-1.5 rounded-xl cursor-pointer"
            >
              {isSaving ? (
                <LuLoader className="w-4 h-4 animate-spin" />
              ) : (
                <LuSave className="w-4 h-4" />
              )}
              <span>{isRtl ? "نشر المقال الآن" : "Publish Article"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
