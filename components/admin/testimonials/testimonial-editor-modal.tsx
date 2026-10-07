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
import { Avatar } from "@/components/ui/avatar";
import { uploadImageAction } from "@/lib/storage/actions";
import type { TestimonialItem, TestimonialFormData } from "@/lib/testimonials/types";
import {
  LuQuote,
  LuLoader,
  LuTriangleAlert,
  LuSparkles,
  LuUser,
  LuBuilding2,
  LuUpload,
  LuTrash2,
  LuImage,
} from "react-icons/lu";

interface TestimonialEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: TestimonialItem | null;
  onSave: (data: TestimonialFormData) => Promise<boolean>;
  locale: string;
}

export function TestimonialEditorModal({
  isOpen,
  onClose,
  testimonial,
  onSave,
  locale,
}: TestimonialEditorModalProps) {
  const isRtl = locale === "ar";

  const [authorNameEn, setAuthorNameEn] = React.useState("");
  const [authorNameAr, setAuthorNameAr] = React.useState("");
  const [roleEn, setRoleEn] = React.useState("");
  const [roleAr, setRoleAr] = React.useState("");
  const [quoteEn, setQuoteEn] = React.useState("");
  const [quoteAr, setQuoteAr] = React.useState("");
  const [initial, setInitial] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);

  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (testimonial) {
      setAuthorNameEn(testimonial.authorNameEn);
      setAuthorNameAr(testimonial.authorNameAr);
      setRoleEn(testimonial.roleEn);
      setRoleAr(testimonial.roleAr);
      setQuoteEn(testimonial.quoteEn);
      setQuoteAr(testimonial.quoteAr);
      setInitial(testimonial.initial);
      setAvatarUrl(testimonial.avatarUrl || "");
      setDisplayOrder(testimonial.displayOrder);
      setIsActive(testimonial.isActive);
    } else {
      setAuthorNameEn("");
      setAuthorNameAr("");
      setRoleEn("");
      setRoleAr("");
      setQuoteEn("");
      setQuoteAr("");
      setInitial("");
      setAvatarUrl("");
      setDisplayOrder(0);
      setIsActive(true);
    }
    setErrorAlert(null);
  }, [testimonial, isOpen]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorAlert(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData, "article-media");
      if (res.success && res.url) {
        setAvatarUrl(res.url);
      } else {
        setErrorAlert(
          res.error || (isRtl ? "فشل رفع صورة العميل." : "Failed to upload avatar image.")
        );
      }
    } catch (err: unknown) {
      setErrorAlert(
        (err as Error).message ||
          (isRtl ? "حدث خطأ أثناء رفع الصورة." : "Upload error occurred.")
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async () => {
    if (!authorNameEn.trim() || !authorNameAr.trim()) {
      setErrorAlert(
        isRtl
          ? "يرجى إدخال اسم العميل باللغتين العربية والإنجليزية."
          : "Please enter the client's name in both English and Arabic."
      );
      return;
    }

    if (!quoteEn.trim() || !quoteAr.trim()) {
      setErrorAlert(
        isRtl
          ? "يرجى كتابة نص التوصية / التقييم باللغتين العربية والإنجليزية."
          : "Please write the testimonial quote in both English and Arabic."
      );
      return;
    }

    setIsSaving(true);
    setErrorAlert(null);

    const computedInitial =
      initial.trim().charAt(0).toUpperCase() ||
      authorNameEn.trim().charAt(0).toUpperCase() ||
      "A";

    const formData: TestimonialFormData = {
      id: testimonial?.id,
      authorNameEn: authorNameEn.trim(),
      authorNameAr: authorNameAr.trim(),
      roleEn: roleEn.trim(),
      roleAr: roleAr.trim(),
      quoteEn: quoteEn.trim(),
      quoteAr: quoteAr.trim(),
      initial: computedInitial,
      avatarUrl: avatarUrl.trim() || undefined,
      displayOrder: Number(displayOrder) || 0,
      isActive,
    };

    const success = await onSave(formData);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  const previewQuote = isRtl ? quoteAr || "نص التوصية سيظهر هنا..." : quoteEn || "Quote will appear here...";
  const previewAuthor = isRtl ? authorNameAr || "اسم العميل" : authorNameEn || "Client Name";
  const previewRole = isRtl ? roleAr || "المسمى والشركة" : roleEn || "Role & Organization";
  const previewInitial = initial || authorNameEn.charAt(0).toUpperCase() || (isRtl ? "ع" : "A");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-border bg-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LuQuote className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {testimonial
                  ? isRtl
                    ? "تعديل رأي العميل"
                    : "Edit Testimonial"
                  : isRtl
                  ? "إضافة رأي / توصية عميل جديدة"
                  : "Add Client Testimonial"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isRtl
                  ? "تظهر هذه التوصية في شريط آراء العملاء وشركاء النجاح بالصفحة الرئيسية للموقع."
                  : "Displays in the Testimonials carousel section on the Home page."}
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

          {/* Live Card Preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {isRtl ? "معاينة البطاقة على الصفحة الرئيسية" : "Live Home Card Preview"}
            </span>
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs">
              <LuQuote className="h-8 w-8 text-primary/30 mb-2" />
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal mb-4">
                {isRtl ? `«${previewQuote}»` : `“${previewQuote}”`}
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <Avatar
                  src={avatarUrl.trim() || undefined}
                  alt={previewAuthor}
                  fallback={previewInitial}
                  size="md"
                  shape="circle"
                  className="rounded-full border border-primary/20 bg-primary/10 text-primary font-bold shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{previewAuthor}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{previewRole}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Arabic Inputs */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-3">
            <span className="text-xs font-bold text-foreground">العربية (AR)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">اسم العميل / الشريك *</label>
                <Input
                  value={authorNameAr}
                  onChange={(e) => setAuthorNameAr(e.target.value)}
                  placeholder="مثال: ريم السيد"
                  className="h-9 text-xs"
                  dir="rtl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">المسمى الوظيفي والشركة *</label>
                <Input
                  value={roleAr}
                  onChange={(e) => setRoleAr(e.target.value)}
                  placeholder="شريك مدير · شركة خدمات قانونية"
                  className="h-9 text-xs"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">نص التوصية بالعربية *</label>
              <Textarea
                value={quoteAr}
                onChange={(e) => setQuoteAr(e.target.value)}
                placeholder="اكتب التوصية أو الرأي بالعربية..."
                className="text-xs min-h-[70px]"
                dir="rtl"
              />
            </div>
          </div>

          {/* English Inputs */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-3">
            <span className="text-xs font-bold text-foreground">English (EN)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Author / Partner Name *</label>
                <Input
                  value={authorNameEn}
                  onChange={(e) => setAuthorNameEn(e.target.value)}
                  placeholder="e.g. Reem Al-Sayed"
                  className="h-9 text-xs"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Role & Company *</label>
                <Input
                  value={roleEn}
                  onChange={(e) => setRoleEn(e.target.value)}
                  placeholder="Managing Partner · Legal Services Firm"
                  className="h-9 text-xs"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Quote Statement (English) *</label>
              <Textarea
                value={quoteEn}
                onChange={(e) => setQuoteEn(e.target.value)}
                placeholder="Write the partner's testimonial quote in English..."
                className="text-xs min-h-[70px]"
                dir="ltr"
              />
            </div>
          </div>

          {/* Avatar Image Upload & Management */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <LuImage className="h-3.5 w-3.5 text-primary" />
                {isRtl ? "صورة العميل الرمزية (Avatar Photo)" : "Client Avatar Photo"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {isRtl ? "اختياري — رفع ملف أو رابط مباشر" : "Optional — Upload file or direct URL"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group shrink-0">
                <Avatar
                  src={avatarUrl.trim() || undefined}
                  alt={previewAuthor}
                  fallback={previewInitial}
                  size="lg"
                  shape="circle"
                  className="h-16 w-16 rounded-full border-2 border-primary/30 shadow-xs bg-muted font-bold text-lg"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isSaving}
                    className="h-8 text-xs gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {isUploading ? (
                      <LuLoader className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LuUpload className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {isUploading
                        ? isRtl
                          ? "جارٍ الرفع..."
                          : "Uploading..."
                        : avatarUrl
                        ? isRtl
                          ? "تغيير الصورة"
                          : "Change Avatar"
                        : isRtl
                        ? "رفع صورة العميل"
                        : "Upload Avatar"}
                    </span>
                  </Button>

                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAvatarUrl("")}
                      disabled={isUploading || isSaving}
                      className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 cursor-pointer"
                    >
                      <LuTrash2 className="h-3.5 w-3.5" />
                      <span>{isRtl ? "إزالة الصورة" : "Remove"}</span>
                    </Button>
                  )}
                </div>

                <div className="relative">
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder={
                      isRtl
                        ? "أو الصق رابط صورة خارجي (https://...)"
                        : "Or paste direct image URL (https://...)"
                    }
                    className="h-8 text-xs font-mono"
                    dir="ltr"
                    disabled={isUploading || isSaving}
                  />
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleAvatarUpload}
              disabled={isUploading || isSaving}
              className="hidden"
            />
          </div>

          {/* Meta & Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {isRtl ? "الحرف المبدئي (Initial)" : "Avatar Initial"}
              </label>
              <Input
                value={initial}
                maxLength={2}
                onChange={(e) => setInitial(e.target.value.toUpperCase())}
                placeholder="R"
                className="h-9 text-xs uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {isRtl ? "ترتيب الظهور" : "Display Order"}
              </label>
              <Input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                className="h-9 text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/15">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {isRtl ? "نشط بالرئيسية" : "Show on Home"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isRtl ? "عرض في شريط التقييمات" : "Render on website"}
                </p>
              </div>
              <Switch checked={isActive} onChange={(checked) => setIsActive(checked)} size="sm" />
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-3 border-t border-border/40 gap-2 bg-muted/10">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSaving || isUploading}>
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>
          <Button type="button" size="sm" onClick={handleSubmit} disabled={isSaving || isUploading} className="gap-2 min-w-28">
            {isSaving ? (
              <LuLoader className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LuSparkles className="h-3.5 w-3.5" />
            )}
            <span>
              {testimonial
                ? isRtl
                  ? "حفظ التعديلات"
                  : "Save Changes"
                : isRtl
                ? "إضافة التوصية"
                : "Add Testimonial"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
