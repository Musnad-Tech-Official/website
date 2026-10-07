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

export function TestimonialEditorModal(props: TestimonialEditorModalProps) {
  if (!props.isOpen) return null;
  return <TestimonialEditorModalContent key={props.testimonial?.id ?? "new"} {...props} />;
}

function TestimonialEditorModalContent({
  onClose,
  testimonial,
  onSave,
  locale,
}: TestimonialEditorModalProps) {
  const isRtl = locale === "ar";

  const [authorNameEn, setAuthorNameEn] = React.useState(testimonial?.authorNameEn || "");
  const [authorNameAr, setAuthorNameAr] = React.useState(testimonial?.authorNameAr || "");
  const [roleEn, setRoleEn] = React.useState(testimonial?.roleEn || "");
  const [roleAr, setRoleAr] = React.useState(testimonial?.roleAr || "");
  const [quoteEn, setQuoteEn] = React.useState(testimonial?.quoteEn || "");
  const [quoteAr, setQuoteAr] = React.useState(testimonial?.quoteAr || "");
  const [initial, setInitial] = React.useState(testimonial?.initial || "");
  const [avatarUrl, setAvatarUrl] = React.useState(testimonial?.avatarUrl || "");
  const [displayOrder, setDisplayOrder] = React.useState(testimonial?.displayOrder ?? 0);
  const [isActive, setIsActive] = React.useState(testimonial?.isActive !== false);

  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
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

          {/* Live Quote Preview */}
          <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              <span>{isRtl ? "معاينة حية للبطاقة" : "Live Preview"}</span>
              <span className="flex items-center gap-1 text-primary">
                <LuSparkles className="h-3 w-3" />
                <span>Featured</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed">
              &ldquo;{previewQuote}&rdquo;
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <Avatar
                fallback={previewInitial}
                src={avatarUrl}
                size="sm"
                className="bg-primary/10 text-primary border border-border/40"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{previewAuthor}</p>
                <p className="text-[11px] text-muted-foreground truncate">{previewRole}</p>
              </div>
            </div>
          </div>

          {/* English Fields */}
          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>English Information (EN)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Author Name (EN) *</label>
                <Input
                  value={authorNameEn}
                  onChange={(e) => setAuthorNameEn(e.target.value)}
                  placeholder="e.g. Rashid Al-Dosari"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Role & Company (EN)</label>
                <Input
                  value={roleEn}
                  onChange={(e) => setRoleEn(e.target.value)}
                  placeholder="e.g. VP of Product, FinTech Saudi"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Testimonial Quote (EN) *</label>
              <Textarea
                value={quoteEn}
                onChange={(e) => setQuoteEn(e.target.value)}
                placeholder="Write the quote in English..."
                className="text-xs min-h-[70px]"
              />
            </div>
          </div>

          {/* Arabic Fields */}
          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>المعلومات بالعربية (AR)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">اسم العميل (عربي) *</label>
                <Input
                  value={authorNameAr}
                  onChange={(e) => setAuthorNameAr(e.target.value)}
                  placeholder="مثال: راشد الدوسري"
                  dir="rtl"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">المسمى والجهة (عربي)</label>
                <Input
                  value={roleAr}
                  onChange={(e) => setRoleAr(e.target.value)}
                  placeholder="مثال: نائب رئيس المنتجات، فنتك السعودية"
                  dir="rtl"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">نص التوصية والتقييم (عربي) *</label>
              <Textarea
                value={quoteAr}
                onChange={(e) => setQuoteAr(e.target.value)}
                placeholder="اكتب التوصية باللغة العربية..."
                dir="rtl"
                className="text-xs min-h-[70px]"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>{isRtl ? "صورة العميل الرمزية (Avatar)" : "Author Avatar Image"}</span>
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group">
                <Avatar
                  fallback={previewInitial}
                  src={avatarUrl}
                  size="lg"
                  className="h-16 w-16 text-lg bg-primary/10 text-primary border border-border/60 shadow-xs"
                />
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-start">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isSaving}
                    className="h-8 text-xs gap-1.5"
                  >
                    {isUploading ? (
                      <LuLoader className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LuUpload className="h-3.5 w-3.5" />
                    )}
                    <span>{isRtl ? "رفع صورة من الجهاز" : "Upload Photo"}</span>
                  </Button>

                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAvatarUrl("")}
                      disabled={isUploading || isSaving}
                      className="h-8 text-xs text-destructive hover:bg-destructive/10 gap-1.5"
                    >
                      <LuTrash2 className="h-3.5 w-3.5" />
                      <span>{isRtl ? "حذف الصورة" : "Remove"}</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground justify-center sm:justify-start">
                  <LuImage className="h-3 w-3" />
                  <span>
                    {isRtl
                      ? "صورة مربعة PNG, JPG أو WebP بحجم أقصاه 3 ميجابايت."
                      : "Square PNG, JPG, or WebP up to 3MB recommended."}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-semibold text-muted-foreground">
                {isRtl ? "أو أدخل رابط الصورة المباشر (URL)" : "Or Direct Image URL"}
              </label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatars/client.jpg"
                className="h-8 text-xs font-mono"
              />
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
