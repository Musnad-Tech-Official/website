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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type {
  AnnouncementBannerItem,
  AnnouncementFormData,
  AnnouncementCategory,
} from "@/lib/announcements/types";
import {
  LuMegaphone,
  LuLoader,
  LuTriangleAlert,
  LuSparkles,
  LuFolderGit2,
  LuServer,
  LuWrench,
  LuExternalLink,
} from "react-icons/lu";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: AnnouncementBannerItem | null;
  onSave: (data: AnnouncementFormData) => Promise<boolean>;
  locale: string;
}

export function AnnouncementModal(props: AnnouncementModalProps) {
  if (!props.isOpen) return null;
  return (
    <AnnouncementModalContent
      key={props.announcement?.id || (props.announcement?.category ? `preset-${props.announcement.category}` : "new")}
      {...props}
    />
  );
}

function AnnouncementModalContent({
  isOpen,
  onClose,
  announcement,
  onSave,
  locale,
}: AnnouncementModalProps) {
  const isRtl = locale === "ar";

  const [category, setCategory] = React.useState<AnnouncementCategory>(
    announcement?.category || "tools"
  );
  const [textEn, setTextEn] = React.useState(
    announcement?.textEn ?? (announcement ? "" : "Musnad UI Design System & Component Library is officially live!")
  );
  const [textAr, setTextAr] = React.useState(
    announcement?.textAr ?? (announcement ? "" : "تم إطلاق مكتبة مكونات ونظام تصميم مسند للتقنية للجيل القادم!")
  );
  const [tagEn, setTagEn] = React.useState(announcement?.tagEn || "New");
  const [tagAr, setTagAr] = React.useState(announcement?.tagAr || "جديد");
  const [linkTextEn, setLinkTextEn] = React.useState(
    announcement?.linkTextEn || (announcement ? "Explore Now" : "Explore components")
  );
  const [linkTextAr, setLinkTextAr] = React.useState(
    announcement?.linkTextAr || "استكشف الآن"
  );
  const [href, setHref] = React.useState(
    announcement?.href || "/services/developer-tools"
  );
  const [isActive, setIsActive] = React.useState(
    announcement ? announcement.isActive : true
  );
  const [isDismissible, setIsDismissible] = React.useState(
    announcement ? announcement.isDismissible !== false : true
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);

  // Quick preset templates
  const applyPreset = (presetType: "tools" | "projects" | "services") => {
    if (presetType === "tools") {
      setCategory("tools");
      setTextAr("تم إطلاق مكتبة مكونات ونظام تصميم مسند للتقنية للجيل القادم!");
      setTextEn("Musnad UI Design System & Component Library is officially live!");
      setTagAr("جديد");
      setTagEn("New");
      setLinkTextAr("استكشف الآن");
      setLinkTextEn("Explore components");
      setHref("/services/developer-tools");
    } else if (presetType === "projects") {
      setCategory("projects");
      setTextAr("اكتشف أحدث دراسات الحالة الهندسية لمشاريعنا الرقمية!");
      setTextEn("Explore our latest engineering case study and digital architectures!");
      setTagAr("مشروع جديد");
      setTagEn("Featured");
      setLinkTextAr("عرض المشاريع");
      setLinkTextEn("View Projects");
      setHref("/projects");
    } else if (presetType === "services") {
      setCategory("services");
      setTextAr("نعلن عن توسيع باقة خدماتنا: هندسة الذكاء الاصطناعي والأنظمة الوكيلة!");
      setTextEn("Announcing Enterprise AI Integration & Autonomous Agent Architectures!");
      setTagAr("خدمة جديدة");
      setTagEn("Solutions");
      setLinkTextAr("تعرف على الخدمة");
      setLinkTextEn("Learn More");
      setHref("/services/ai-integration");
    }
  };

  const handleSubmit = async () => {
    if (!textEn.trim() || !textAr.trim()) {
      setErrorAlert(
        isRtl
          ? "يرجى إدخال نص الإعلان باللغتين العربية والإنجليزية."
          : "Please provide the banner message in both English and Arabic."
      );
      return;
    }

    if (!href.trim()) {
      setErrorAlert(
        isRtl
          ? "يرجى تحديد رابط الوجهة للإعلان."
          : "Please specify the destination URL or path."
      );
      return;
    }

    setIsSaving(true);
    setErrorAlert(null);

    const formData: AnnouncementFormData = {
      id: announcement?.id,
      category,
      textEn: textEn.trim(),
      textAr: textAr.trim(),
      tagEn: tagEn.trim() || "New",
      tagAr: tagAr.trim() || "جديد",
      linkTextEn: linkTextEn.trim() || "Explore Now",
      linkTextAr: linkTextAr.trim() || "استكشف الآن",
      href: href.trim(),
      isActive,
      isDismissible,
    };

    const success = await onSave(formData);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-border bg-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LuMegaphone className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {announcement
                  ? isRtl
                    ? "تعديل شريط الإعلانات"
                    : "Edit Announcement Banner"
                  : isRtl
                  ? "إطلاق شريط إعلاني جديد للموقع"
                  : "Push New Announcement Banner"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isRtl
                  ? "يظهر هذا الشريط الإعلاني في أعلى صفحات الموقع لتوجيه الزوار نحو المشاريع، الخدمات، أو الأدوات البرمجية."
                  : "Displays at the very top of all website pages to direct visitors to new projects, services, or developer tools."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorAlert && (
            <Alert variant="destructive" className="py-2.5">
              <LuTriangleAlert className="h-4 w-4" />
              <AlertDescription className="text-xs">{errorAlert}</AlertDescription>
            </Alert>
          )}

          {/* Quick Presets Strip */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {isRtl ? "قوالب تعبئة سريعة" : "Quick Presets"}
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => applyPreset("tools")}
              >
                <LuWrench className="h-3.5 w-3.5 text-primary" />
                <span>{isRtl ? "مكتبة المكونات والأدوات" : "Tools & UI Library"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => applyPreset("projects")}
              >
                <LuFolderGit2 className="h-3.5 w-3.5 text-primary" />
                <span>{isRtl ? "إطلاق مشروع جديد" : "New Project Launch"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => applyPreset("services")}
              >
                <LuServer className="h-3.5 w-3.5 text-primary" />
                <span>{isRtl ? "خدمة جديدة (ذكاء اصطناعي)" : "New AI Service"}</span>
              </Button>
            </div>
          </div>

          {/* Real-time Visual Preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {isRtl ? "معاينة حية للشريط على الموقع" : "Live Banner Preview"}
            </span>
            <div className="rounded-xl border border-primary/20 bg-accent/60 p-3 text-xs text-foreground transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Badge variant="default" size="sm" className="shrink-0 text-[10px] py-0 px-2 font-bold">
                    {isRtl ? tagAr || "جديد" : tagEn || "New"}
                  </Badge>
                  <span className="truncate font-medium text-foreground">
                    {isRtl ? textAr || "نص الإعلان سيظهر هنا..." : textEn || "Announcement text will appear here..."}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 shrink-0">
                    <span>{isRtl ? linkTextAr || "استكشف الآن" : linkTextEn || "Explore"}</span>
                    <span>{isRtl ? "←" : "→"}</span>
                  </span>
                </div>
                {isDismissible && (
                  <span className="text-muted-foreground hover:text-foreground text-sm font-bold">&times;</span>
                )}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {isRtl ? "نوع الإعلان" : "Announcement Target"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: "tools", labelEn: "Tools & Kit", labelAr: "أدوات ونظام" },
                  { id: "projects", labelEn: "Project", labelAr: "مشروع" },
                  { id: "services", labelEn: "Service", labelAr: "خدمة" },
                  { id: "general", labelEn: "General", labelAr: "عام" },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                    category === cat.id
                      ? "border-primary bg-primary/10 text-primary shadow-2xs"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {isRtl ? cat.labelAr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Arabic Content */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>العربية (AR)</span>
            </span>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                نص الإعلان الرئيسي *
              </label>
              <Input
                value={textAr}
                onChange={(e) => setTextAr(e.target.value)}
                placeholder="مثال: تم إطلاق مكتبة مكونات ونظام تصميم مسند للتقنية للجيل القادم!"
                className="h-9 text-xs"
                dir="rtl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">شارة التمييز (Tag)</label>
                <Input
                  value={tagAr}
                  onChange={(e) => setTagAr(e.target.value)}
                  placeholder="جديد / إطلاق / مميز"
                  className="h-8 text-xs"
                  dir="rtl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">نص الرابط</label>
                <Input
                  value={linkTextAr}
                  onChange={(e) => setLinkTextAr(e.target.value)}
                  placeholder="استكشف الآن"
                  className="h-8 text-xs"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* English Content */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>English (EN)</span>
            </span>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Announcement Message *
              </label>
              <Input
                value={textEn}
                onChange={(e) => setTextEn(e.target.value)}
                placeholder="e.g. Musnad UI Design System & Component Library is officially live!"
                className="h-9 text-xs"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Badge Tag</label>
                <Input
                  value={tagEn}
                  onChange={(e) => setTagEn(e.target.value)}
                  placeholder="New / Featured / Update"
                  className="h-8 text-xs"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Link Text</label>
                <Input
                  value={linkTextEn}
                  onChange={(e) => setLinkTextEn(e.target.value)}
                  placeholder="Explore Now"
                  className="h-8 text-xs"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Target URL Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <LuExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{isRtl ? "رابط الوجهة (المسار أو الرابط الخارجي) *" : "Destination Path / URL *"}</span>
            </label>
            <Input
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="/services/developer-tools or /projects/sahim"
              className="h-9 text-xs font-mono"
              dir="ltr"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/15">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {isRtl ? "نشر وتفعيل فوري" : "Push Live Immediately"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isRtl ? "سيظهر فوراً أعلى صفحات الموقع" : "Will replace currently live banner"}
                </p>
              </div>
              <Switch checked={isActive} onChange={(checked) => setIsActive(checked)} size="md" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/15">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {isRtl ? "قابل للإغلاق (✕)" : "Allow Dismiss (✕)"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isRtl ? "تمكين الزائر من إخفاء الشريط" : "Allows users to close the banner"}
                </p>
              </div>
              <Switch checked={isDismissible} onChange={(checked) => setIsDismissible(checked)} size="md" />
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-3 border-t border-border/40 gap-2 bg-muted/10">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>
          <Button type="button" size="sm" onClick={handleSubmit} disabled={isSaving} className="gap-2 min-w-28">
            {isSaving ? (
              <LuLoader className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LuSparkles className="h-3.5 w-3.5" />
            )}
            <span>
              {announcement
                ? isRtl
                  ? "حفظ التعديلات"
                  : "Save Banner"
                : isRtl
                ? "نشر الإعلان"
                : "Push Banner"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
