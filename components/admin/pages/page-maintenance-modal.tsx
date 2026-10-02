"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LuWrench, LuX, LuSave } from "react-icons/lu";
import type { PageControlItem } from "@/lib/page-control/types";

interface PageMaintenanceModalProps {
  page: PageControlItem;
  onSave: (pageId: string, noticeEn: string, noticeAr: string) => Promise<boolean>;
  onClose: () => void;
  isRtl: boolean;
}

export function PageMaintenanceModal({
  page,
  onSave,
  onClose,
  isRtl,
}: PageMaintenanceModalProps) {
  const [noticeEn, setNoticeEn] = React.useState(page.maintenanceNoticeEn || "");
  const [noticeAr, setNoticeAr] = React.useState(page.maintenanceNoticeAr || "");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave(page.id, noticeEn, noticeAr);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50">
      <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <LuWrench className="w-5 h-5 text-amber-500" />
              <span>
                {isRtl ? "إعدادات إشعار الصيانة" : "Maintenance Notice Settings"}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {page.titleEn} ({page.path})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg cursor-pointer"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <Textarea
            label={isRtl ? "رسالة الصيانة (باللغة الإنجليزية)" : "English Maintenance Notice"}
            rows={3}
            value={noticeEn}
            onChange={(e) => setNoticeEn(e.target.value)}
            placeholder="e.g. This service page is undergoing routine updates. Please check back soon."
          />

          <Textarea
            label={isRtl ? "رسالة الصيانة (باللغة العربية)" : "Arabic Maintenance Notice"}
            rows={3}
            dir="rtl"
            value={noticeAr}
            onChange={(e) => setNoticeAr(e.target.value)}
            placeholder="مثال: هذه الصفحة تخضع لعمليات صيانة وتحديث مجدولة. يرجى المتابعة قريباً."
            className="text-end"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer rounded-xl"
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={isSaving}
            onClick={handleSave}
            className="gap-1.5 cursor-pointer rounded-xl"
          >
            <LuSave className="w-3.5 h-3.5" />
            <span>
              {isSaving
                ? isRtl
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isRtl
                ? "حفظ التغييرات"
                : "Save Notice"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
