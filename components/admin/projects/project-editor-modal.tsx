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
  LuPlus,
  LuLayers,
  LuCheck,
  LuSearch,
} from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import type { Project, ProjectFormData } from "@/lib/projects/types";
import { ALL_TECH_ITEMS } from "@/components/hero/tech-data";
import { TechIcon } from "@/components/hero/tech-icon";
import { cn } from "@/lib/utils";

interface ProjectEditorModalProps {
  project: Project | null;
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
  "Mobile Application",
  "Enterprise Software",
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

  // Exact Fields Requested:
  // 1. Title (EN & AR)
  // 2. Short description (EN & AR)
  // 3. Category / Type
  // 4. Technologies
  // 5. Cover Image
  // 6. Rich Text Editor (EN & AR)
  // 7. Essential system fields (slug, status, optional URLs)
  const [titleEn, setTitleEn] = React.useState(project?.titleEn || "");
  const [titleAr, setTitleAr] = React.useState(project?.titleAr || "");
  const [slug, setSlug] = React.useState(project?.slug || "");
  const [descriptionEn, setDescriptionEn] = React.useState(project?.descriptionEn || "");
  const [descriptionAr, setDescriptionAr] = React.useState(project?.descriptionAr || "");
  const [category, setCategory] = React.useState(project?.category || "Fintech Platform");
  const [selectedTechs, setSelectedTechs] = React.useState<string[]>(
    project?.technologies && project.technologies.length > 0
      ? project.technologies
      : ["TypeScript", "Next.js", "PostgreSQL"]
  );
  const [techSearch, setTechSearch] = React.useState("");
  const [customTechInput, setCustomTechInput] = React.useState("");
  const [coverImage, setCoverImage] = React.useState(project?.coverImage || "");
  const [liveDemoUrl, setLiveDemoUrl] = React.useState(project?.liveDemoUrl || "");
  const [githubUrl, setGithubUrl] = React.useState(project?.githubUrl || "");
  const [status, setStatus] = React.useState<Project["status"]>(project?.status || "published");
  const [contentHtmlEn, setContentHtmlEn] = React.useState(project?.contentHtmlEn || "");
  const [contentHtmlAr, setContentHtmlAr] = React.useState(project?.contentHtmlAr || "");

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

      const res = await uploadImageAction(fd, "project-media");
      if (res.success && res.url) {
        setCoverImage(res.url);
      } else {
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

    const formData: ProjectFormData = {
      id: project?.id,
      slug: slug.trim(),
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      subtitleEn: descriptionEn.trim(),
      subtitleAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      descriptionAr: descriptionAr.trim(),
      contentHtmlEn,
      contentHtmlAr,
      coverImage: coverImage.trim() || undefined,
      category: category.trim(),
      categorySlug: category.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
      year: project?.year || new Date().getFullYear().toString(),
      technologies: selectedTechs,
      featured: false,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      rating: 5.0,
      reviewCount: 0,
      metrics: [],
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
      setErrorAlert((err as Error).message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card w-full max-w-4xl rounded-2xl border border-border/80 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <LuLayers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {project
                  ? isRtl
                    ? "تعديل المشروع"
                    : "Edit Project"
                  : isRtl
                  ? "إضافة مشروع جديد"
                  : "Create New Project"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isRtl
                  ? "أدخل بيانات المشروع، الصورة، التقنيات، واكتب دراسة الحالة بالمحرر"
                  : "Set cover image, title, short description, technologies, and rich case study."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorAlert && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{errorAlert}</AlertDescription>
            </Alert>
          )}

          {/* Language Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  activeTab === "en"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted"
                )}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ar")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  activeTab === "ar"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted"
                )}
              >
                العربية (AR)
              </button>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {activeTab === "en" ? "Editing English content" : "تعديل المحتوى العربي"}
            </span>
          </div>

          {/* Tab 1: English Content */}
          {activeTab === "en" && (
            <div className="space-y-4 animate-in fade-in-50 duration-150 text-start">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Project Title (EN) <span className="text-destructive">*</span>
                </label>
                <Input
                  value={titleEn}
                  onChange={(e) => handleTitleEnChange(e.target.value)}
                  placeholder="e.g. Sahim Analytics Platform"
                  className="text-xs h-9.5 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Short Description (EN)
                </label>
                <Textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="A concise summary of the project shown on project cards and previews..."
                  rows={2}
                  className="text-xs rounded-xl"
                />
              </div>

              {/* Rich Text Editor for English */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Project Case Study & Content (EN)</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    Rich Text Editor
                  </span>
                </label>
                <RichTextEditor
                  value={contentHtmlEn}
                  onChange={(html) => setContentHtmlEn(html)}
                  placeholder="Write full case study, system architecture, engineering challenges, screenshots, and solutions..."
                  minHeight="260px"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Arabic Content */}
          {activeTab === "ar" && (
            <div className="space-y-4 animate-in fade-in-50 duration-150 text-start" dir="rtl">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  عنوان المشروع (بالعربية) <span className="text-destructive">*</span>
                </label>
                <Input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: منصة سهم للتحليلات"
                  className="text-xs h-9.5 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  الوصف الموجز (بالعربية)
                </label>
                <Textarea
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="نبذة موجزة عن المشروع تظهر في البطاقات والمعاينات..."
                  rows={2}
                  className="text-xs rounded-xl"
                />
              </div>

              {/* Rich Text Editor for Arabic */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>دراسة الحالة وتفاصيل المشروع (بالعربية)</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    محرر نصوص غني
                  </span>
                </label>
                <RichTextEditor
                  value={contentHtmlAr}
                  onChange={(html) => setContentHtmlAr(html)}
                  placeholder="اكتب دراسة الحالة المفصلة، المعمارية الهندسية، التحديات والحلول..."
                  minHeight="260px"
                  dir="rtl"
                />
              </div>
            </div>
          )}

          {/* Project Configuration: Category, Cover, Techs, Links */}
          <div className="pt-4 border-t border-border/70 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isRtl ? "المواصفات والتقنيات والصورة" : "Specifications, Technologies & Media"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category / Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {isRtl ? "تصنيف / نوع المشروع" : "Project Category / Type"}
                </label>
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
            </div>

            {/* Cover Image Uploader */}
            <div className="space-y-1.5 p-3.5 rounded-xl border border-border/70 bg-muted/20">
              <label className="text-xs font-semibold text-foreground block">
                {isRtl ? "صورة غلاف المشروع (رفع أو رابط)" : "Featured Cover Image (Upload or URL)"}
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... cover image URL"
                  className="text-xs h-9 flex-1 rounded-xl bg-background"
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
                  <span>{isUploadingCover ? (isRtl ? "جارٍ الرفع..." : "Uploading...") : (isRtl ? "رفع صورة" : "Upload Image")}</span>
                </Button>
              </div>

              {coverImage && (
                <div className="relative w-44 h-24 rounded-xl overflow-hidden border border-border/80 mt-2 bg-muted">
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

            {/* Technologies Selector from Official Tech Catalog */}
            <div className="space-y-2.5 p-3.5 rounded-xl border border-border/70 bg-muted/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <LuLayers className="w-3.5 h-3.5 text-primary" />
                  <span>{isRtl ? "التقنيات البرمجية المستخدمة" : "Technologies Stack"}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    {selectedTechs.length}
                  </span>
                </label>
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  {isRtl ? "اختر من التقنيات الرسمية أو أضف جديدة" : "Click to select from catalog or type custom"}
                </span>
              </div>

              {/* Selected Techs Chips */}
              {selectedTechs.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-background border border-border/50 max-h-24 overflow-y-auto">
                  {selectedTechs.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedTechs(selectedTechs.filter((t) => t !== tech))}
                        className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                        title={isRtl ? "إزالة" : "Remove"}
                      >
                        <LuX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-2 text-center text-xs text-muted-foreground italic rounded-lg bg-background/50 border border-border/40">
                  {isRtl ? "لم يتم تحديد أي تقنيات بعد" : "No technologies selected yet"}
                </div>
              )}

              {/* Search & Custom Add Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LuSearch className="absolute start-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    placeholder={isRtl ? "ابحث في التقنيات (e.g. Next.js, Go, Redis)..." : "Filter catalog (e.g. Next.js, Go, Redis)..."}
                    className="text-xs h-8 ps-8 rounded-lg bg-background"
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Input
                    value={customTechInput}
                    onChange={(e) => setCustomTechInput(e.target.value)}
                    placeholder={isRtl ? "تقنية مخصصة..." : "Custom tech..."}
                    className="text-xs h-8 w-28 sm:w-36 rounded-lg bg-background"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (customTechInput.trim() && !selectedTechs.includes(customTechInput.trim())) {
                          setSelectedTechs([...selectedTechs, customTechInput.trim()]);
                          setCustomTechInput("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs rounded-lg cursor-pointer"
                    onClick={() => {
                      if (customTechInput.trim() && !selectedTechs.includes(customTechInput.trim())) {
                        setSelectedTechs([...selectedTechs, customTechInput.trim()]);
                        setCustomTechInput("");
                      }
                    }}
                  >
                    <LuPlus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline ms-1">{isRtl ? "إضافة" : "Add"}</span>
                  </Button>
                </div>
              </div>

              {/* Catalog Badges Grid to Click & Toggle */}
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg border border-border/40 bg-card/60">
                {ALL_TECH_ITEMS.filter((t) =>
                  !techSearch || t.name.toLowerCase().includes(techSearch.toLowerCase()) || t.id.toLowerCase().includes(techSearch.toLowerCase())
                ).map((tech) => {
                  const isSelected = selectedTechs.some((st) => st.toLowerCase() === tech.name.toLowerCase() || st.toLowerCase() === tech.id.toLowerCase());
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTechs(selectedTechs.filter((st) => st.toLowerCase() !== tech.name.toLowerCase() && st.toLowerCase() !== tech.id.toLowerCase()));
                        } else {
                          setSelectedTechs([...selectedTechs, tech.name]);
                        }
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border select-none",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                          : "bg-background text-foreground/80 hover:bg-muted hover:text-foreground border-border/60"
                      )}
                    >
                      <TechIcon id={tech.id} className="w-3.5 h-3.5 shrink-0" />
                      <span>{tech.name}</span>
                      {isSelected && <LuCheck className="w-3 h-3 ms-0.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Links & Publication Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <LuGlobe className="w-3.5 h-3.5 text-primary" />
                  <span>{isRtl ? "رابط المعاينة الحية (اختياري)" : "Live Demo URL (Optional)"}</span>
                </label>
                <Input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://..."
                  className="text-xs h-9 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FaGithub className="w-3.5 h-3.5 text-foreground" />
                  <span>{isRtl ? "رابط GitHub (اختياري)" : "GitHub URL (Optional)"}</span>
                </label>
                <Input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="text-xs h-9 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {isRtl ? "حالة النشر" : "Publication Status"}
                </label>
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-9 px-4 rounded-xl cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving}
              className="text-xs h-9 px-5 gap-1.5 rounded-xl cursor-pointer shadow-md shadow-primary/20"
            >
              {isSaving ? <LuLoader className="w-3.5 h-3.5 animate-spin" /> : <LuSave className="w-3.5 h-3.5" />}
              <span>{isSaving ? (isRtl ? "جارٍ الحفظ..." : "Saving...") : (isRtl ? "حفظ المشروع" : "Save Project")}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectEditorModal;
