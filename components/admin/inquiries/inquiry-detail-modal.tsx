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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { InquiryItem, InquiryStatus } from "@/lib/inquiries/types";
import {
  LuMail,
  LuPhone,
  LuBuilding2,
  LuFileCheck,
  LuExternalLink,
  LuCheck,
  LuLoader,
  LuMessageSquare,
} from "react-icons/lu";

interface InquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryItem | null;
  onUpdateStatus: (id: string, status: InquiryStatus, adminNotes?: string) => Promise<boolean>;
  locale: string;
}

export function InquiryDetailModal(props: InquiryDetailModalProps) {
  if (!props.isOpen || !props.inquiry) return null;
  return <InquiryDetailModalContent key={props.inquiry.id} {...props} inquiry={props.inquiry} />;
}

interface InquiryDetailModalContentProps extends InquiryDetailModalProps {
  inquiry: InquiryItem;
}

function InquiryDetailModalContent({
  isOpen,
  onClose,
  inquiry,
  onUpdateStatus,
  locale,
}: InquiryDetailModalContentProps) {
  const isRtl = locale === "ar";
  const [status, setStatus] = React.useState<InquiryStatus>(inquiry.status);
  const [adminNotes, setAdminNotes] = React.useState(inquiry.adminNotes || "");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onUpdateStatus(inquiry.id, status, adminNotes);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  const getStatusBadge = (st: InquiryStatus) => {
    switch (st) {
      case "new":
        return <Badge variant="default" className="bg-primary text-primary-foreground font-bold">New</Badge>;
      case "in_review":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">In Review</Badge>;
      case "responded":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Responded</Badge>;
      case "closed":
        return <Badge variant="outline" className="text-muted-foreground">Closed</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-border bg-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/40">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LuMessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg font-bold">
                    {inquiry.name}
                  </DialogTitle>
                  {getStatusBadge(inquiry.status)}
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {isRtl ? "تاريخ الإرسال: " : "Submitted: "}
                  {new Date(inquiry.createdAt).toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DialogDescription>
              </div>
            </div>

            <a
              href={`mailto:${inquiry.email}?subject=RE: Project Inquiry with Musnad Tech (${inquiry.id})`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-semibold text-foreground transition-colors shrink-0"
            >
              <LuMail className="h-3.5 w-3.5 text-primary" />
              <span>{isRtl ? "رد عبر البريد" : "Reply Email"}</span>
            </a>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Client Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl border border-border/50 bg-muted/15">
            <div className="flex items-center gap-2 text-xs">
              <LuMail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Email:</span>
              <a href={`mailto:${inquiry.email}`} className="font-semibold text-primary underline truncate">
                {inquiry.email}
              </a>
            </div>

            {inquiry.phone && (
              <div className="flex items-center gap-2 text-xs">
                <LuPhone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-semibold text-foreground font-mono">{inquiry.phone}</span>
              </div>
            )}

            {inquiry.company && (
              <div className="flex items-center gap-2 text-xs">
                <LuBuilding2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Company:</span>
                <span className="font-semibold text-foreground truncate">{inquiry.company}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Inquiry Type:</span>
              <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                {inquiry.inquiryType}
              </Badge>
            </div>
          </div>

          {/* Project Details (if applicable) */}
          {(inquiry.projectType || inquiry.budget || inquiry.timeline) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-border/40 bg-card">
              {inquiry.projectType && (
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Scope</span>
                  <p className="text-xs font-bold text-foreground">{inquiry.projectType}</p>
                </div>
              )}
              {inquiry.budget && (
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Budget</span>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{inquiry.budget}</p>
                </div>
              )}
              {inquiry.timeline && (
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Timeline</span>
                  <p className="text-xs font-bold text-foreground">{inquiry.timeline}</p>
                </div>
              )}
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              {isRtl ? "نص الرسالة / تفاصيل الاستفسار" : "Inquiry Message & Requirements"}
            </span>
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap font-normal">
              {inquiry.message}
            </div>
          </div>

          {/* Current Product Info */}
          {inquiry.currentProduct && (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-foreground">
                {isRtl ? "المنتج الحالي أو البنية الحالية" : "Current Product Architecture"}
              </span>
              <p className="text-xs text-muted-foreground p-3 rounded-lg border border-border/40 bg-muted/10">
                {inquiry.currentProduct}
              </p>
            </div>
          )}

          {/* Attachment */}
          {inquiry.attachmentName && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card">
              <div className="flex items-center gap-2.5 truncate">
                <LuFileCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-foreground truncate">{inquiry.attachmentName}</span>
              </div>
              {inquiry.attachmentUrl && (
                <a
                  href={inquiry.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline"
                >
                  <span>Download</span>
                  <LuExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Admin Management Section */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>{isRtl ? "إدارة حالة الطلب وملاحظات الفريق" : "Lead Status & Admin Notes"}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {isRtl ? "حالة المتابعة" : "Inquiry Status"}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="new">New / Unread</option>
                  <option value="in_review">In Review / Contacted</option>
                  <option value="responded">Proposal Responded</option>
                  <option value="closed">Closed / Converted</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {isRtl ? "ملاحظات الإدارة الداخلية" : "Internal Engineering Notes"}
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes on discovery call, assigned engineer, or proposal..."
                  className="text-xs min-h-[70px] bg-card"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-3 border-t border-border/40 gap-2 bg-muted/10">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
            {isRtl ? "إغلاق" : "Close"}
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <LuLoader className="h-3.5 w-3.5 animate-spin" /> : <LuCheck className="h-3.5 w-3.5" />}
            <span>{isRtl ? "حفظ التحديثات" : "Save Changes"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
