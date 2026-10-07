"use client";

import * as React from "react";
import {
  LuSearch,
  LuMessageSquare,
  LuCircleCheck,
  LuTrash2,
  LuEye,
  LuMail,
  LuBuilding2,
  LuLayers,
  LuClock,
  LuSparkles,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { InquiryDetailModal } from "./inquiry-detail-modal";
import type { InquiryItem, InquiryStatus } from "@/lib/inquiries/types";
import {
  updateInquiryStatusAction,
  deleteInquiryAction,
} from "@/lib/inquiries/actions";
import { cn } from "@/lib/utils";

interface InquiriesClientProps {
  initialInquiries: InquiryItem[];
  locale: string;
}

export function InquiriesClient({
  initialInquiries,
  locale,
}: InquiriesClientProps) {
  const isRtl = locale === "ar";
  const [inquiries, setInquiries] =
    React.useState<InquiryItem[]>(initialInquiries);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [selectedInquiry, setSelectedInquiry] =
    React.useState<InquiryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const [deletingInquiry, setDeletingInquiry] =
    React.useState<InquiryItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [alertNotification, setAlertNotification] = React.useState<{
    type: "success" | "destructive";
    message: string;
  } | null>(null);

  const showAlert = (message: string, type: "success" | "destructive" = "success") => {
    setAlertNotification({ type, message });
    setTimeout(() => setAlertNotification(null), 4000);
  };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((item) => {
      const matchSearch =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        item.message.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [inquiries, search, statusFilter]);

  const stats = React.useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === "new").length,
      inReview: inquiries.filter((i) => i.status === "in_review").length,
      responded: inquiries.filter((i) => i.status === "responded" || i.status === "closed").length,
    };
  }, [inquiries]);

  const handleOpenDetail = (inquiry: InquiryItem) => {
    setSelectedInquiry(inquiry);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (
    id: string,
    status: InquiryStatus,
    adminNotes?: string
  ): Promise<boolean> => {
    try {
      const res = await updateInquiryStatusAction(id, status, adminNotes);
      if (res.success && res.data) {
        setInquiries((prev) => prev.map((i) => (i.id === id ? res.data! : i)));
        showAlert(isRtl ? "تم تحديث حالة الطلب بنجاح." : "Inquiry status updated successfully.");
        return true;
      } else {
        showAlert(res.error || "Failed to update inquiry.", "destructive");
        return false;
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "An unexpected error occurred.", "destructive");
      return false;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInquiry) return;
    setIsDeleting(true);

    try {
      const res = await deleteInquiryAction(deletingInquiry.id);
      if (res.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== deletingInquiry.id));
        showAlert(isRtl ? "تم حذف الطلب بنجاح." : "Inquiry deleted successfully.");
      } else {
        showAlert(res.error || "Failed to delete.", "destructive");
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "Deletion error.", "destructive");
    } finally {
      setIsDeleting(false);
      setDeletingInquiry(null);
    }
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="text-[10px] bg-primary text-white font-bold">New</Badge>;
      case "in_review":
        return <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">In Review</Badge>;
      case "responded":
        return <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Responded</Badge>;
      case "closed":
        return <Badge variant="outline" className="text-[10px] text-muted-foreground">Closed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alertNotification && (
        <Alert
          variant={alertNotification.type === "destructive" ? "destructive" : "success"}
          className="animate-in fade-in slide-in-from-top-2 border-primary/20 bg-primary/5 text-primary"
        >
          <AlertDescription className="text-xs font-semibold">
            {alertNotification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuMessageSquare className="w-6 h-6 text-primary" />
            {isRtl ? "استفسارات وطلبات العملاء" : "Client Inquiries & Lead Pipeline"}
          </h1>
          <Badge variant="outline" className="text-xs font-semibold">
            {inquiries.length}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {isRtl
            ? "متابعة وإدارة رسائل التواصل الواردة، طلبات المشاريع الهندسية، وطلبات التوظيف."
            : "Review and manage incoming project briefs, client consultations, and business inquiries."}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">Total Inquiries</span>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <LuLayers className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">New / Unread</span>
            <p className="text-2xl font-bold text-primary">{stats.new}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <LuSparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">In Review</span>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.inReview}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <LuClock className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">Responded / Closed</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.responded}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <LuCircleCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-card">
        <div className="relative flex-1">
          <LuSearch
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRtl ? "right-3" : "left-3"
            )}
          />
          <Input
            placeholder="Search by client name, email, company, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn("h-9 text-xs", isRtl ? "pr-9" : "pl-9")}
          />
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border/40">
          {(
            [
              { id: "all", label: "All" },
              { id: "new", label: `New (${stats.new})` },
              { id: "in_review", label: "In Review" },
              { id: "responded", label: "Responded" },
              { id: "closed", label: "Closed" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                statusFilter === tab.id
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto mb-3 text-muted-foreground">
            <LuMessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Inbox is clear</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            No inquiries match your current search or status filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 bg-card hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4",
                item.status === "new" ? "border-primary/40 shadow-2xs" : "border-border/60"
              )}
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(item.status)}
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold text-muted-foreground">
                    {item.inquiryType}
                  </Badge>
                  {item.projectType && (
                    <span className="text-[11px] font-semibold text-foreground/80">• {item.projectType}</span>
                  )}
                  {item.budget && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">({item.budget})</span>
                  )}
                  <span className="ms-auto text-[10px] text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground truncate">{item.name}</h4>
                  {item.company && (
                    <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <LuBuilding2 className="h-3 w-3" />
                      <span>{item.company}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal">
                  {item.message}
                </p>

                {item.adminNotes && (
                  <div className="p-2 rounded-lg bg-primary/5 border border-primary/15 text-[11px] text-foreground">
                    <span className="font-semibold text-primary">Note: </span>
                    <span>{item.adminNotes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDetail(item)}
                  className="h-8 text-xs gap-1.5"
                >
                  <LuEye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{isRtl ? "عرض التفاصيل" : "View Details"}</span>
                </Button>

                <a
                  href={`mailto:${item.email}?subject=RE: Inquiry with Musnad Tech (${item.id})`}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title={`Reply to ${item.email}`}
                >
                  <LuMail className="h-3.5 w-3.5" />
                </a>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingInquiry(item)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LuTrash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <InquiryDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        inquiry={selectedInquiry}
        onUpdateStatus={handleUpdateStatus}
        locale={locale}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={Boolean(deletingInquiry)}
        onOpenChange={(open) => !open && setDeletingInquiry(null)}
        title={isRtl ? "حذف طلب الاستفسار" : "Delete Client Inquiry"}
        description={
          isRtl
            ? `هل أنت متأكد من رغبتك في حذف استفسار "${deletingInquiry?.name}"؟ سيتم إزالته من قائمة الطلبات.`
            : `Are you sure you want to delete the inquiry from "${deletingInquiry?.name}"?`
        }
        confirmLabel={isRtl ? "حذف نهائي" : "Delete"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
