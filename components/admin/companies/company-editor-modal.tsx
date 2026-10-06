"use client";

import * as React from "react";
import Image from "next/image";
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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadImageAction } from "@/lib/storage/actions";
import type { TrustedCompanyItem, CompanyFormData } from "@/lib/companies/types";
import {
  LuUpload,
  LuLoader,
  LuTrash2,
  LuBuilding2,
  LuGlobe,
  LuImage,
  LuTriangleAlert,
} from "react-icons/lu";

interface CompanyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: TrustedCompanyItem | null;
  onSave: (data: CompanyFormData) => Promise<boolean>;
  locale: string;
}

export function CompanyEditorModal({
  isOpen,
  onClose,
  company,
  onSave,
  locale,
}: CompanyEditorModalProps) {
  const isRtl = locale === "ar";
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [nameEn, setNameEn] = React.useState("");
  const [nameAr, setNameAr] = React.useState("");
  const [logo, setLogo] = React.useState("");
  const [websiteUrl, setWebsiteUrl] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | null>(null);

  // Sync form when modal opens or company changes
  React.useEffect(() => {
    if (company) {
      setNameEn(company.nameEn);
      setNameAr(company.nameAr);
      setLogo(company.logo);
      setWebsiteUrl(company.websiteUrl || "");
      setDisplayOrder(company.displayOrder);
      setIsActive(company.isActive);
    } else {
      setNameEn("");
      setNameAr("");
      setLogo("");
      setWebsiteUrl("");
      setDisplayOrder(0);
      setIsActive(true);
    }
    setErrorAlert(null);
  }, [company, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorAlert(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData, "company-logos");
      if (res.success && res.url) {
        setLogo(res.url);
      } else {
        setErrorAlert(res.error || "Failed to upload logo.");
      }
    } catch (err: unknown) {
      setErrorAlert((err as Error).message || "Upload error occurred.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!nameEn.trim() || !nameAr.trim()) {
      setErrorAlert(
        isRtl
          ? "يرجى كتابة اسم الشركة باللغتين العربية والإنجليزية."
          : "Please enter the company name in both English and Arabic."
      );
      return;
    }

    if (!logo.trim()) {
      setErrorAlert(
        isRtl
          ? "يرجى تحميل شعار الشركة أو إدخال رابط الشعار."
          : "Please upload a company logo or provide a valid logo URL."
      );
      return;
    }

    setIsSaving(true);
    setErrorAlert(null);

    const data: CompanyFormData = {
      id: company?.id,
      nameEn: nameEn.trim(),
      nameAr: nameAr.trim(),
      logo: logo.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      displayOrder: Number(displayOrder) || 0,
      isActive,
    };

    const success = await onSave(data);
    setIsSaving(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-border bg-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LuBuilding2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {company
                  ? isRtl
                    ? "تعديل بيانات الشركة"
                    : "Edit Trusted Company"
                  : isRtl
                  ? "إضافة شركة شريكة جديدة"
                  : "Add New Trusted Company"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isRtl
                  ? "ستظهر هذه الشركة في قسم شركاء النجاح والشركات الموثوقة على الصفحة الرئيسية."
                  : "This company will be displayed in the Trusted Companies section on the Home page."}
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

          {/* Logo Upload & Preview Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>{isRtl ? "شعار الشركة (SVG أو PNG)" : "Company Logo (SVG or PNG)"}</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {isRtl ? "يفضل صيغة SVG بخلفية شفافة" : "Transparent SVG recommended"}
              </span>
            </label>

            {logo ? (
              <div className="flex items-center gap-4 p-3.5 rounded-xl border border-border/60 bg-muted/20">
                <div className="relative h-14 w-28 shrink-0 flex items-center justify-center rounded-lg border border-border/40 bg-card p-2 shadow-2xs overflow-hidden">
                  <Image
                    src={logo}
                    alt="Logo preview"
                    width={100}
                    height={40}
                    unoptimized
                    className="max-h-10 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{logo}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {isRtl ? "تم تعيين الشعار بنجاح" : "Logo configured"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <LuUpload className="h-3.5 w-3.5" />
                    <span>{isRtl ? "تغيير" : "Change"}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setLogo("")}
                    disabled={isUploading}
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-border/70 hover:border-primary/50 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-all duration-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform mb-2">
                  {isUploading ? (
                    <LuLoader className="h-5 w-5 animate-spin" />
                  ) : (
                    <LuImage className="h-5 w-5" />
                  )}
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {isUploading
                    ? isRtl
                      ? "جاري الرفع..."
                      : "Uploading..."
                    : isRtl
                    ? "انقر لتحميل الشعار أو اسحبه إلى هنا"
                    : "Click to upload logo or drag & drop"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  SVG, PNG, WebP (Max 10MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/svg+xml,image/png,image/webp,image/jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Direct URL input fallback */}
            <div className="pt-1">
              <Input
                placeholder={isRtl ? "أو أدخل مسار / رابط الشعار مباشرة (/companies/name.svg)" : "Or enter logo path/URL directly (/companies/name.svg)"}
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Bilingual Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {isRtl ? "اسم الشركة (الإنجليزية) *" : "Company Name (English) *"}
              </label>
              <Input
                placeholder="e.g. Yemen Mobile"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="h-9 text-xs"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {isRtl ? "اسم الشركة (العربية) *" : "Company Name (Arabic) *"}
              </label>
              <Input
                placeholder="مثال: يمن موبايل"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="h-9 text-xs"
                dir="rtl"
              />
            </div>
          </div>

          {/* Website Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <LuGlobe className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{isRtl ? "رابط الموقع الرسمي (اختياري)" : "Official Website URL (Optional)"}</span>
            </label>
            <Input
              placeholder="https://company.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="h-9 text-xs font-mono"
              dir="ltr"
            />
          </div>

          {/* Display Order & Active Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {isRtl ? "ترتيب الظهور (رقم)" : "Display Order (Number)"}
              </label>
              <Input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                className="h-9 text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                {isRtl ? "الأرقام الأصغر تظهر أولاً" : "Lower numbers display first"}
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-2 p-3 rounded-xl border border-border/50 bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {isRtl ? "ظهور في الموقع" : "Show on Home Page"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {isRtl ? "تفعيل أو إخفاء الشعار للزوار" : "Toggle visibility on live site"}
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onChange={(checked) => setIsActive(checked)}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-3 border-t border-border/40 gap-2 bg-muted/10">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSaving || isUploading}
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSaving || isUploading}
            className="gap-2 min-w-24"
          >
            {isSaving && <LuLoader className="h-3.5 w-3.5 animate-spin" />}
            <span>
              {company
                ? isRtl
                  ? "حفظ التعديلات"
                  : "Save Changes"
                : isRtl
                ? "إضافة الشركة"
                : "Add Company"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
