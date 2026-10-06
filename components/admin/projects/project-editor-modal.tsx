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
  LuPlus,
  LuTrash2,
  LuLayers,
} from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import type { Project, ProjectFormData, ProjectMetric } from "@/lib/projects/types";

interface ProjectEditorModalProps {
  project: Project | null; // null if creating new
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormData) => Promise<boolean>;
  isRtl: boolean;
}

const PRESET_CATEGORIES = [
  "Fintech Platform",
  "Developer Tool",
  "Client Portal",
  "CLI & Tooling",
  "Observability",
  "AI & Realtime",
  "Cloud Architecture",
  "Design Engineering",
];

export function ProjectEditorModal({
  project,
  isOpen,
  onClose,
  onSave,
  isRtl,
}: ProjectEditorModalProps) {
  const [activeTab, setActiveTab] = React.useState<"en" | "ar">("en");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingCover, setIsUploadingCover] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);
  const coverInputRef = React.useRef<HTMLInputElement | null>(null);

  // Form Fields State
  const [titleEn, setTitleEn] = React.useState(project?.titleEn || "");
  const [titleAr, setTitleAr] = React.useState(project?.titleAr || "");
  const [slug, setSlug] = React.useState(project?.slug || "");
  const [subtitleEn, setSubtitleEn] = React.useState(project?.subtitleEn || "");
  const [subtitleAr, setSubtitleAr] = React.useState(project?.subtitleAr || "");
  const [descriptionEn, setDescriptionEn] = React.useState(project?.descriptionEn || "");
  const [descriptionAr, setDescriptionAr] = React.useState(project?.descriptionAr || "");
  const [category, setCategory] = React.useState(project?.category || "Fintech Platform");
  const [year, setYear] = React.useState(project?.year || "2024");
  const [technologiesInput, setTechnologiesInput] = React.useState(
    project?.technologies.join(", ") || "TypeScript, Next.js, PostgreSQL"
  );
  const [coverImage, setCoverImage] = React.useState(project?.coverImage || "");
  const [featured, setFeatured] = React.useState(project?.featured ?? false);
  const [liveDemoUrl, setLiveDemoUrl] = React.useState(project?.liveDemoUrl || "");
  const [githubUrl, setGithubUrl] = React.useState(project?.githubUrl || "");
  const [rating, setRating] = React.useState(project?.rating ?? 4.8);
  const [reviewCount, setReviewCount] = React.useState(project?.reviewCount ?? 12);
  const [status, setStatus] = React.useState<Project["status"]>(project?.status || "published");
  const [contentHtmlEn, setContentHtmlEn] = React.useState(project?.contentHtmlEn || "");
  const [contentHtmlAr, setContentHtmlAr] = React.useState(project?.contentHtmlAr || "");
  const [metrics, setMetrics] = React.useState<ProjectMetric[]>(
    project?.metrics && project.metrics.length > 0
      ? project.metrics
      : [
          { label: "Uptime", value: "99.99%", description: "Availability" },
          { label: "Latency", value: "<50ms", description: "Sub-second response" },
        ]
  );

  const handleTitleEnChange = (val: string) => {
    setTitleEn(val);
    if (!project) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setSlug(generated);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      setErrorAlert(null);
      const fd = new FormData();
      fd.append("file", file);

      // Upload to project-media or article-media
      const res = await uploadImageAction(fd, "project-media");
      if (res.success && res.url) {
        setCoverImage(res.url);
      } else {
        // Fallback to article-media if project-media is pending
        const fallbackRes = await uploadImageAction(fd, "article-media");
        if (fallbackRes.success && fallbackRes.url) {
          setCoverImage(fallbackRes.url);
        } else {
          setErrorAlert(res.error || "Failed to upload cover image.");
        }
      }
    } catch (err: unknown) {
      setErrorAlert((err as Error).message || "Error uploading cover image.");
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const handleAddMetric = () => {
    setMetrics((prev) => [...prev, { label: "", value: "", description: "" }]);
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMetricChange = (index: number, field: keyof ProjectMetric, value: string) => {
    setMetrics((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAlert(null);

    if (!titleEn.trim() || !titleAr.trim()) {
      setErrorAlert(isRtl ? "عنوان المشروع مطلوب باللغتين." : "Project title is required in both English and Arabic.");
      return;
    }

    if (!slug.trim()) {
      setErrorAlert(isRtl ? "مسار الرابط (Slug) مطلوب." : "Project slug is required.");
      return;
    }

    const techArray = technologiesInput
      .split(/[,،]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const formData: ProjectFormData = {
      id: project?.id,
      slug: slug.trim(),
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      subtitleEn: subtitleEn.trim(),
      subtitleAr: subtitleAr.trim(),
      descriptionEn: descriptionEn.trim(),
      descriptionAr: descriptionAr.trim(),
      contentHtmlEn,
      contentHtmlAr,
      coverImage: coverImage.trim() || undefined,
      category: category.trim(),
      categorySlug: category.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
      year: year.trim(),
      technologies: techArray,
      featured,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      rating: Number(rating) || 4.8,
      reviewCount: Number(reviewCount) || 0,
      metrics: metrics.filter((m) => m.label.trim() && m.value.trim()),
      status,
      displayOrder: project?.displayOrder ?? 0,
    };

    try {
      setIsSaving(true);
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      setErrorAlert((err as Error).message || "An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in-50 duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-card border border-border/80 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <LuLayers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {project
                  ? isRtl
                    ? "تعديل تفاصيل المشروع"
                    : "Edit Project Details"
                  : isRtl
                  ? "إضافة مشروع هندسي جديد"
                  : "Create New Engineering Project"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isRtl
                  ? "إدارة المحتوى المتقدم، المحرر المرئي، المقاييس التقنية والصور."
                  : "Manage project case study, rich text editor, technical metrics, and media."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorAlert && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{errorAlert}</AlertDescription>
            </Alert>
          )}

          {/* Bilingual Language Selector */}
          <div className="flex items-center justify-between p-1 bg-muted/40 border border-border/70 rounded-xl">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "en"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LuGlobe className="w-3.5 h-3.5" />
                <span>English (LTR)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "ar"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LuGlobe className="w-3.5 h-3.5" />
                <span>العربية (RTL)</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-muted-foreground pe-3">
              {activeTab === "en" ? "Editing English content" : "تعديل المحتوى العربي"}
            </span>
          </div>

          {/* Tab 1: English Fields */}
          {activeTab === "en" && (
            <div className="space-y-4 animate-in fade-in-50 duration-150 text-start" dir="ltr">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Project Title (EN) <span className="text-destructive">*</span>
                </label>
                <Input
                  value={titleEn}
                  onChange={(e) => handleTitleEnChange(e.target.value)}
                  placeholder="e.g. Sahim Analytics"
                  className="text-xs h-9.5 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Subtitle / Tagline (EN)
                </label>
                <Input
                  value={subtitleEn}
                  onChange={(e) => setSubtitleEn(e.target.value)}
                  placeholder="e.g. Streaming market intelligence & real-time analytics engine"
                  className="text-xs h-9.5 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Short Description (EN)
                </label>
                <Textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Concise overview rendered in cards and search summaries..."
                  rows={2}
                  className="text-xs rounded-xl"
                />
              </div>

              {/* Rich Text Editor for English Case Study */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Case Study & Architecture Narrative (EN)</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    Tiptap Rich Text Editor
                  </span>
                </label>
                <RichTextEditor
                  value={contentHtmlEn}
                  onChange={(html) => setContentHtmlEn(html)}
                  placeholder="Write comprehensive case study, challenges, architecture diagrams, and outcomes..."
                  minHeight="260px"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Arabic Fields */}
          {activeTab === "ar" && (
            <div className="space-y-4 animate-in fade-in-50 duration-150 text-start" dir="rtl">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  عنوان المشروع (بالعربية) <span className="text-destructive">*</span>
                </label>
                <Input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: سهم للتحليلات"
                  className="text-xs h-9.5 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  العنوان الفرعي / الشعار المختصر (بالعربية)
                </label>
                <Input
                  value={subtitleAr}
                  onChange={(e) => setSubtitleAr(e.target.value)}
                  placeholder="مثال: منصة تحليلات فورية متدفقة لمعالجة إشارات السوق"
                  className="text-xs h-9.5 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  الوصف الموجز (بالعربية)
                </label>
                <Textarea
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="وصف مختصر للمشروع يظهر في البطاقات وقوائم الاستعراض..."
                  rows={2}
                  className="text-xs rounded-xl"
                />
              </div>

              {/* Rich Text Editor for Arabic Case Study */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>دراسة الحالة والمعمارية البرمجية (بالعربية)</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    محرر نصوص غني ومتطور
                  </span>
                </label>
                <RichTextEditor
                  value={contentHtmlAr}
                  onChange={(html) => setContentHtmlAr(html)}
                  placeholder="اكتب دراسة الحالة المعمقة، التحديات الهندسية، معمارية الحل والنتائج..."
                  minHeight="260px"
                  dir="rtl"
                />
              </div>
            </div>
          )}

          {/* Global Meta & Technical Settings */}
          <div className="pt-4 border-t border-border/70 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isRtl ? "الإعدادات العامة والتقنية" : "Metadata & Technical Configuration"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Slug */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  URL Slug <span className="text-destructive">*</span>
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. sahim-analytics"
                  className="text-xs h-9 font-mono rounded-xl"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PRESET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Year</label>
                <Input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Technologies (comma separated)
              </label>
              <Input
                value={technologiesInput}
                onChange={(e) => setTechnologiesInput(e.target.value)}
                placeholder="TypeScript, Go, PostgreSQL, Redis, Docker"
                className="text-xs h-9 rounded-xl"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <LuGlobe className="w-3.5 h-3.5 text-primary" />
                  <span>Live Demo URL (Optional)</span>
                </label>
                <Input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://project.musnad.tech"
                  className="text-xs h-9 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FaGithub className="w-3.5 h-3.5 text-primary" />
                  <span>GitHub Repository URL (Optional)</span>
                </label>
                <Input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/Musnad-Tech-Official/..."
                  className="text-xs h-9 rounded-xl font-mono"
                />
              </div>
            </div>

            {/* Cover Image Uploader */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Featured Cover Image (Upload or URL)
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... cover image URL"
                  className="text-xs h-9 flex-1 rounded-xl"
                />

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleCoverUpload}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="text-xs h-9 px-3 gap-1.5 rounded-xl shrink-0 cursor-pointer"
                >
                  {isUploadingCover ? (
                    <LuLoader className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LuImage className="w-3.5 h-3.5" />
                  )}
                  <span>{isUploadingCover ? "Uploading..." : "Upload Image"}</span>
                </Button>
              </div>

              {coverImage && (
                <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-border/80 mt-2 bg-muted">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-1 end-1 bg-black/70 hover:bg-black text-white p-1 rounded-md"
                  >
                    <LuX className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Key Metrics Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Key Results & Architecture Metrics
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMetric}
                  className="text-xs h-7 px-2.5 gap-1 rounded-lg"
                >
                  <LuPlus className="w-3 h-3" />
                  <span>Add Metric</span>
                </Button>
              </div>

              <div className="space-y-2">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={metric.label}
                      onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                      placeholder="Label (e.g. Latency)"
                      className="text-xs h-8 rounded-lg flex-1"
                    />
                    <Input
                      value={metric.value}
                      onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                      placeholder="Value (e.g. <50ms)"
                      className="text-xs h-8 rounded-lg w-28 font-mono"
                    />
                    <Input
                      value={metric.description || ""}
                      onChange={(e) => handleMetricChange(idx, "description", e.target.value)}
                      placeholder="Note (optional)"
                      className="text-xs h-8 rounded-lg flex-1 hidden sm:block"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMetric(idx)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Featured Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/60">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Publication Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Project["status"])}
                  className="w-full h-9 px-3 text-xs rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Client Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="text-xs h-9 rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                  <LuSparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Feature on Home Page</span>
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
              className="text-xs h-9 px-4 rounded-xl cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="text-xs h-9 px-5 gap-1.5 rounded-xl font-semibold bg-primary text-primary-foreground shadow-xs cursor-pointer"
            >
              {isSaving ? (
                <LuLoader className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LuSave className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? "Saving..." : isRtl ? "حفظ المشروع" : "Save Project"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
