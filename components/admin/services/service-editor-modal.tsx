"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ServiceItem, ServiceFormData } from "@/lib/services/types";
import {
  SERVICE_AVAILABLE_ICONS,
  getServiceIconComponent,
} from "@/lib/services/service-icons";
import {
  LuLayers,
  LuLoader,
  LuTriangleAlert,
  LuArrowUpRight,
  LuPlus,
  LuX,
  LuSparkles,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

interface ServiceEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  onSave: (data: ServiceFormData) => Promise<boolean>;
  locale: string;
}

export function ServiceEditorModal({
  isOpen,
  onClose,
  service,
  onSave,
  locale,
}: ServiceEditorModalProps) {
  const isRtl = locale === "ar";

  const [slug, setSlug] = React.useState("");
  const [titleEn, setTitleEn] = React.useState("");
  const [titleAr, setTitleAr] = React.useState("");
  const [descriptionEn, setDescriptionEn] = React.useState("");
  const [descriptionAr, setDescriptionAr] = React.useState("");
  const [icon, setIcon] = React.useState("LuCode");
  const [tagsEn, setTagsEn] = React.useState<string[]>([]);
  const [tagsAr, setTagsAr] = React.useState<string[]>([]);
  const [newTagEn, setNewTagEn] = React.useState("");
  const [newTagAr, setNewTagAr] = React.useState("");
  const [href, setHref] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(1);
  const [enabledHome, setEnabledHome] = React.useState(true);
  const [isActive, setIsActive] = React.useState(true);

  const [isSaving, setIsSaving] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (service) {
      setSlug(service.slug);
      setTitleEn(service.titleEn);
      setTitleAr(service.titleAr);
      setDescriptionEn(service.descriptionEn);
      setDescriptionAr(service.descriptionAr);
      setIcon(service.icon || "LuCode");
      setTagsEn(service.tagsEn || []);
      setTagsAr(service.tagsAr || []);
      setHref(service.href || `/services/${service.slug}`);
      setDisplayOrder(service.displayOrder ?? 1);
      setEnabledHome(service.enabledHome !== false);
      setIsActive(service.isActive !== false);
    } else {
      setSlug("");
      setTitleEn("");
      setTitleAr("");
      setDescriptionEn("");
      setDescriptionAr("");
      setIcon("LuCode");
      setTagsEn([]);
      setTagsAr([]);
      setHref("");
      setDisplayOrder(1);
      setEnabledHome(true);
      setIsActive(true);
    }
    setNewTagEn("");
    setNewTagAr("");
    setErrorAlert(null);
  }, [service, isOpen]);

  // Auto-generate slug and href from Title En when creating a new service
  const handleTitleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleEn(val);
    if (!service) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
      setHref(`/services/${generatedSlug}`);
    }
  };

  const handleAddTagEn = () => {
    const trimmed = newTagEn.trim();
    if (trimmed && !tagsEn.includes(trimmed)) {
      setTagsEn([...tagsEn, trimmed]);
      setNewTagEn("");
    }
  };

  const handleRemoveTagEn = (tagToRemove: string) => {
    setTagsEn(tagsEn.filter((t) => t !== tagToRemove));
  };

  const handleAddTagAr = () => {
    const trimmed = newTagAr.trim();
    if (trimmed && !tagsAr.includes(trimmed)) {
      setTagsAr([...tagsAr, trimmed]);
      setNewTagAr("");
    }
  };

  const handleRemoveTagAr = (tagToRemove: string) => {
    setTagsAr(tagsAr.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!titleEn.trim() || !titleAr.trim()) {
      setErrorAlert(
        isRtl
          ? "يرجى كتابة عنوان الخدمة باللغتين العربية والإنجليزية."
          : "Please provide the service title in both English and Arabic."
      );
      return;
    }

    if (!descriptionEn.trim() || !descriptionAr.trim()) {
      setErrorAlert(
        isRtl
          ? "يرجى كتابة وصف الخدمة باللغتين العربية والإنجليزية."
          : "Please provide the service description in both English and Arabic."
      );
      return;
    }

    const finalSlug =
      slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (!finalSlug) {
      setErrorAlert(
        isRtl
          ? "يرجى تحديد المعرف البرمجي (Slug) للخدمة."
          : "Please specify a valid slug for the service."
      );
      return;
    }

    setIsSaving(true);
    setErrorAlert(null);

    const formData: ServiceFormData = {
      id: service?.id || finalSlug,
      slug: finalSlug,
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      descriptionEn: descriptionEn.trim(),
      descriptionAr: descriptionAr.trim(),
      icon,
      tagsEn,
      tagsAr,
      href: href.trim() || `/services/${finalSlug}`,
      displayOrder: Number(displayOrder) || 1,
      enabledHome,
      isActive,
    };

    const success = await onSave(formData);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  const IconComp = getServiceIconComponent(icon);
  const previewTitle = isRtl ? titleAr || "عنوان الخدمة التقنية" : titleEn || "Engineering Service Title";
  const previewDescription = isRtl
    ? descriptionAr || "وصف موجز للمخرجات الهندسية والقدرات البرمجية التي تقدمها مسند تك..."
    : descriptionEn || "Concise overview of engineering outcomes and technical capabilities delivered by Musnad Tech...";
  const previewTags = isRtl
    ? tagsAr.length > 0
      ? tagsAr
      : ["معمارية الأنظمة", "تطوير شامل", "مسارات سحابية"]
    : tagsEn.length > 0
    ? tagsEn
    : ["System Architecture", "Full-Stack Development", "Cloud Pipelines"];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-border bg-card">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LuLayers className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {service
                  ? isRtl
                    ? `تعديل خدمة: ${service.titleAr || service.titleEn}`
                    : `Edit Service: ${service.titleEn}`
                  : isRtl
                  ? "إضافة خدمة أو قدرة هندسية جديدة"
                  : "Add New Engineering Service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isRtl
                  ? "تظهر هذه الخدمة في صفحة الخدمات العامة (/services) ومصفوفة القدرات بالصفحة الرئيسية."
                  : "Configures engineering capabilities across the Services Hub and Home page."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorAlert && (
            <Alert variant="destructive" className="py-2.5">
              <LuTriangleAlert className="h-4 w-4" />
              <AlertDescription className="text-xs">{errorAlert}</AlertDescription>
            </Alert>
          )}

          {/* Live Card Preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {isRtl ? "معاينة حية لبطاقة الخدمة" : "Live Service Card Preview"}
            </span>
            <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/40 text-primary mb-4">
                <IconComp className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                {previewTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {previewDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {previewTags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    size="sm"
                    className="font-normal text-[11px] text-muted-foreground/90 bg-muted/60"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">{href || `/services/${slug || "slug"}`}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  {isRtl ? "تفاصيل الخدمة" : "Learn More"}
                  <LuArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                </span>
              </div>
            </div>
          </div>

          {/* English Details */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">English Content (EN)</span>
              <Badge variant="outline" size="sm" className="text-[10px] font-mono">EN</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Service Title (EN) *</label>
                <Input
                  value={titleEn}
                  onChange={handleTitleEnChange}
                  placeholder="e.g. Platform & Cloud Infrastructure"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">URL Slug *</label>
                <Input
                  value={slug}
                  onChange={(e) => {
                    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "");
                    setSlug(newSlug);
                    if (!service) setHref(`/services/${newSlug}`);
                  }}
                  placeholder="platform-infrastructure"
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Description (EN) *</label>
              <Textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="From discovery to launch — full-lifecycle digital product development with strict engineering accountability."
                rows={2}
                className="text-xs leading-relaxed"
              />
            </div>

            {/* EN Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground">
                Capability Tags (EN)
              </label>
              <div className="flex gap-2">
                <Input
                  value={newTagEn}
                  onChange={(e) => setNewTagEn(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTagEn();
                    }
                  }}
                  placeholder="e.g. Architecture & system design"
                  className="h-8 text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTagEn}
                  className="h-8 text-xs shrink-0"
                >
                  <LuPlus className="h-3.5 w-3.5 me-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tagsEn.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    size="sm"
                    className="gap-1 text-[11px] font-normal"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTagEn(tag)}
                      className="hover:text-destructive transition-colors cursor-pointer"
                    >
                      <LuX className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Arabic Details */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">المحتوى العربي (AR)</span>
              <Badge variant="outline" size="sm" className="text-[10px] font-mono">AR</Badge>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">عنوان الخدمة (العربية) *</label>
              <Input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: البنية التحتية والمنصات السحابية"
                dir="rtl"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">الوصف التفصيلي (العربية) *</label>
              <Textarea
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="من مرحلة الاستكشاف حتى الإطلاق — نبني منتجات متكاملة بمسؤولية هندسية صارمة."
                dir="rtl"
                rows={2}
                className="text-xs leading-relaxed"
              />
            </div>

            {/* AR Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground">
                الوسوم والقدرات الفرعية (العربية)
              </label>
              <div className="flex gap-2">
                <Input
                  value={newTagAr}
                  onChange={(e) => setNewTagAr(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTagAr();
                    }
                  }}
                  placeholder="مثال: معمارية وتصميم الأنظمة"
                  dir="rtl"
                  className="h-8 text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTagAr}
                  className="h-8 text-xs shrink-0"
                >
                  <LuPlus className="h-3.5 w-3.5 me-1" />
                  {isRtl ? "إضافة" : "Add"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1" dir="rtl">
                {tagsAr.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    size="sm"
                    className="gap-1 text-[11px] font-normal"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTagAr(tag)}
                      className="hover:text-destructive transition-colors cursor-pointer"
                    >
                      <LuX className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Icon Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-muted-foreground">
              {isRtl ? "أيقونة الخدمة الرمزية" : "Service Visual Icon"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(SERVICE_AVAILABLE_ICONS).map(([key, data]) => {
                const CurrentIcon = data.icon;
                const isSelected = icon === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border text-start transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-2xs"
                        : "border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <CurrentIcon className="h-4 w-4 shrink-0" />
                    <span className="text-[11px] truncate">{data.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Route & Display Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                {isRtl ? "مسار الصفحة التفصيلية (Href)" : "Detail Page Route (Href)"}
              </label>
              <Input
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="/services/product-engineering"
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                {isRtl ? "ترتيب الظهور في القوائم" : "Display Sort Order"}
              </label>
              <Input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <div className="space-y-0.5 pe-3">
                <span className="text-xs font-semibold text-foreground">
                  {isRtl ? "إبراز في الصفحة الرئيسية" : "Feature on Home Page"}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {isRtl
                    ? "تظهر ضمن مصفوفة القدرات بالصفحة الأولى."
                    : "Included in Capabilities section on /."}
                </p>
              </div>
              <Switch checked={enabledHome} onChange={setEnabledHome} />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <div className="space-y-0.5 pe-3">
                <span className="text-xs font-semibold text-foreground">
                  {isRtl ? "حالة النشر العامة" : "Active & Published"}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {isRtl
                    ? "تكون متاحة للمستخدمين في موقع الويب."
                    : "Visible to public visitors across the site."}
                </p>
              </div>
              <Switch checked={isActive} onChange={setIsActive} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 sm:p-6 pt-3 border-t border-border/40 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isSaving}
            className="min-w-28"
          >
            {isSaving ? (
              <>
                <LuLoader className="h-4 w-4 animate-spin me-2" />
                {isRtl ? "جار الحفظ..." : "Saving..."}
              </>
            ) : service ? (
              isRtl ? "حفظ التعديلات" : "Save Changes"
            ) : (
              isRtl ? "إضافة الخدمة" : "Create Service"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
