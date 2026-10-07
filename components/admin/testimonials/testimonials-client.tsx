"use client";

import * as React from "react";
import {
  LuPlus,
  LuSearch,
  LuQuote,
  LuCircleCheck,
  LuEyeOff,
  LuPencil,
  LuTrash2,
  LuLayers,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TestimonialEditorModal } from "./testimonial-editor-modal";
import type { TestimonialItem, TestimonialFormData } from "@/lib/testimonials/types";
import {
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
} from "@/lib/testimonials/actions";
import { cn } from "@/lib/utils";

interface TestimonialsClientProps {
  initialTestimonials: TestimonialItem[];
  locale: string;
}

export function TestimonialsClient({
  initialTestimonials,
  locale,
}: TestimonialsClientProps) {
  const isRtl = locale === "ar";
  const [testimonials, setTestimonials] =
    React.useState<TestimonialItem[]>(initialTestimonials);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "hidden">("all");

  const [editingTestimonial, setEditingTestimonial] =
    React.useState<TestimonialItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [deletingTestimonial, setDeletingTestimonial] =
    React.useState<TestimonialItem | null>(null);
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
    return testimonials.filter((item) => {
      const matchSearch =
        q === "" ||
        item.authorNameEn.toLowerCase().includes(q) ||
        item.authorNameAr.includes(q) ||
        item.quoteEn.toLowerCase().includes(q) ||
        item.quoteAr.includes(q) ||
        item.roleEn.toLowerCase().includes(q) ||
        item.roleAr.includes(q);

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "hidden" && !item.isActive);

      return matchSearch && matchStatus;
    });
  }, [testimonials, search, statusFilter]);

  const stats = React.useMemo(() => {
    return {
      total: testimonials.length,
      active: testimonials.filter((t) => t.isActive).length,
      hidden: testimonials.filter((t) => !t.isActive).length,
    };
  }, [testimonials]);

  const handleOpenNew = () => {
    setEditingTestimonial(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingTestimonial(item);
    setIsEditorOpen(true);
  };

  const handleSaveTestimonial = async (formData: TestimonialFormData): Promise<boolean> => {
    try {
      if (editingTestimonial) {
        const res = await updateTestimonialAction(editingTestimonial.id, formData);
        if (res.success && res.data) {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === editingTestimonial.id ? res.data! : t))
          );
          showAlert(isRtl ? "تم تحديث التوصية بنجاح." : "Testimonial updated successfully.");
          return true;
        } else {
          showAlert(res.error || "Update failed.", "destructive");
          return false;
        }
      } else {
        const res = await createTestimonialAction(formData);
        if (res.success && res.data) {
          setTestimonials((prev) =>
            [...prev, res.data!].sort((a, b) => a.displayOrder - b.displayOrder)
          );
          showAlert(isRtl ? "تمت إضافة التوصية بنجاح." : "Testimonial created successfully.");
          return true;
        } else {
          showAlert(res.error || "Failed to create.", "destructive");
          return false;
        }
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "An unexpected error occurred.", "destructive");
      return false;
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    const nextVal = !current;
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: nextVal } : t))
    );

    const res = await toggleTestimonialActiveAction(id, nextVal);
    if (!res.success) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive: current } : t))
      );
      showAlert(res.error || "Failed to update.", "destructive");
    } else {
      showAlert(
        nextVal
          ? isRtl
            ? "أصبحت التوصية معروضة على الصفحة الرئيسية."
            : "Testimonial is now live on Home page."
          : isRtl
          ? "تم إخفاء التوصية من الصفحة الرئيسية."
          : "Testimonial hidden from Home page."
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTestimonial) return;
    setIsDeleting(true);

    try {
      const res = await deleteTestimonialAction(deletingTestimonial.id);
      if (res.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== deletingTestimonial.id));
        showAlert(isRtl ? "تم حذف التوصية بنجاح." : "Testimonial deleted successfully.");
      } else {
        showAlert(res.error || "Failed to delete.", "destructive");
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "Deletion error.", "destructive");
    } finally {
      setIsDeleting(false);
      setDeletingTestimonial(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isRtl ? "آراء العملاء وتوصيات الشركاء" : "Client Testimonials & Partner Quotes"}
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              {testimonials.length}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isRtl
              ? "إدارة آراء وتقييمات قادة التقنية والشركاء المعروضة في شريط التوصيات بالصفحة الرئيسية."
              : "Manage client reviews, leadership testimonials, and partner quotes displayed on the Home page."}
          </p>
        </div>

        <Button onClick={handleOpenNew} className="gap-2 shadow-xs shrink-0 self-start sm:self-auto">
          <LuPlus className="h-4 w-4" />
          <span>{isRtl ? "إضافة توصية جديدة" : "Add Testimonial"}</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">
              {isRtl ? "إجمالي التوصيات" : "Total Testimonials"}
            </span>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <LuLayers className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">
              {isRtl ? "معروضة في الرئيسية" : "Visible on Home"}
            </span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.active}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <LuCircleCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">
              {isRtl ? "مخفية (مسودة)" : "Hidden (Draft)"}
            </span>
            <p className="text-2xl font-bold text-muted-foreground">{stats.hidden}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
            <LuEyeOff className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-card">
        <div className="relative flex-1">
          <LuSearch
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRtl ? "right-3" : "left-3"
            )}
          />
          <Input
            placeholder={
              isRtl
                ? "ابحث باسم العميل أو الشركة أو نص التوصية..."
                : "Search testimonials by partner, company, or quote..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn("h-9 text-xs", isRtl ? "pr-9" : "pl-9")}
          />
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border/40">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-all",
              statusFilter === "all"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isRtl ? "الكل" : "All"} ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-all",
              statusFilter === "active"
                ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isRtl ? "المعروضة" : "Visible"} ({stats.active})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("hidden")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-all",
              statusFilter === "hidden"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isRtl ? "المخفية" : "Hidden"} ({stats.hidden})
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-5 rounded-2xl border transition-all duration-200 bg-card hover:shadow-xs flex flex-col justify-between",
              item.isActive ? "border-border/70 hover:border-primary/40" : "border-border/40 opacity-70 bg-muted/15"
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                  #{item.displayOrder}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {item.isActive ? (isRtl ? "معروض" : "Visible") : (isRtl ? "مخفي" : "Hidden")}
                  </span>
                  <Switch
                    checked={item.isActive}
                    onChange={() => handleToggleActive(item.id, item.isActive)}
                    size="sm"
                  />
                </div>
              </div>

              <LuQuote className="h-6 w-6 text-primary/30 mb-2" />
              <blockquote className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal mb-4 line-clamp-4">
                {isRtl ? `«${item.quoteAr}»` : `“${item.quoteEn}”`}
              </blockquote>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar
                  src={item.avatarUrl}
                  alt={isRtl ? item.authorNameAr : item.authorNameEn}
                  fallback={item.initial}
                  size="sm"
                  shape="circle"
                  className="rounded-full border border-primary/20 bg-primary/10 text-primary font-bold shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    {isRtl ? item.authorNameAr : item.authorNameEn}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {isRtl ? item.roleAr : item.roleEn}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(item)}
                  className="h-8 text-xs gap-1"
                >
                  <LuPencil className="h-3 w-3 text-muted-foreground" />
                  <span>{isRtl ? "تعديل" : "Edit"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingTestimonial(item)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LuTrash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      <TestimonialEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        testimonial={editingTestimonial}
        onSave={handleSaveTestimonial}
        locale={locale}
      />

      {/* Confirm Deletion */}
      <ConfirmDialog
        open={Boolean(deletingTestimonial)}
        onOpenChange={(open) => !open && setDeletingTestimonial(null)}
        title={isRtl ? "حذف التوصية" : "Delete Testimonial"}
        description={
          isRtl
            ? `هل أنت متأكد من رغبتك في حذف توصية "${deletingTestimonial?.authorNameAr || deletingTestimonial?.authorNameEn}"؟`
            : `Are you sure you want to delete the testimonial from "${deletingTestimonial?.authorNameEn}"?`
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
