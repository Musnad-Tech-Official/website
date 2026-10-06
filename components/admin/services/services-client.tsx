"use client";

import * as React from "react";
import {
  LuPlus,
  LuSearch,
  LuLayers,
  LuCircleCheck,
  LuEyeOff,
  LuPencil,
  LuTrash2,
  LuArrowUpRight,
  LuHouse,
  LuGlobe,
  LuSparkles,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Link } from "@/i18n/routing";
import { ServiceEditorModal } from "./service-editor-modal";
import type { ServiceItem, ServiceFormData } from "@/lib/services/types";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
  toggleServiceHomeAction,
  toggleServiceActiveAction,
} from "@/lib/services/actions";
import { getServiceIconComponent } from "@/lib/services/service-icons";
import { cn } from "@/lib/utils";

interface ServicesClientProps {
  initialServices: ServiceItem[];
  locale: string;
}

export function ServicesClient({
  initialServices,
  locale,
}: ServicesClientProps) {
  const isRtl = locale === "ar";
  const [services, setServices] = React.useState<ServiceItem[]>(initialServices);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "hidden">("all");
  const [homeFilter, setHomeFilter] = React.useState<"all" | "home" | "hub_only">("all");

  const [editingService, setEditingService] = React.useState<ServiceItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [deletingService, setDeletingService] = React.useState<ServiceItem | null>(null);
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
    return services.filter((item) => {
      const matchSearch =
        q === "" ||
        item.titleEn.toLowerCase().includes(q) ||
        item.titleAr.includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q) ||
        item.descriptionAr.includes(q) ||
        item.tagsEn.some((t) => t.toLowerCase().includes(q)) ||
        item.tagsAr.some((t) => t.includes(q));

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "hidden" && !item.isActive);

      const matchHome =
        homeFilter === "all" ||
        (homeFilter === "home" && item.enabledHome) ||
        (homeFilter === "hub_only" && !item.enabledHome);

      return matchSearch && matchStatus && matchHome;
    });
  }, [services, search, statusFilter, homeFilter]);

  const stats = React.useMemo(() => {
    return {
      total: services.length,
      active: services.filter((s) => s.isActive).length,
      home: services.filter((s) => s.enabledHome && s.isActive).length,
    };
  }, [services]);

  const handleOpenNew = () => {
    setEditingService(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (item: ServiceItem) => {
    setEditingService(item);
    setIsEditorOpen(true);
  };

  const handleSaveService = async (formData: ServiceFormData): Promise<boolean> => {
    try {
      if (editingService) {
        const res = await updateServiceAction(editingService.id, formData);
        if (res.success && res.data) {
          setServices((prev) =>
            prev.map((s) => (s.id === editingService.id ? res.data! : s)).sort(
              (a, b) => a.displayOrder - b.displayOrder
            )
          );
          showAlert(isRtl ? "تم تحديث بيانات الخدمة بنجاح." : "Service updated successfully.");
          return true;
        } else {
          showAlert(res.error || "Update failed.", "destructive");
          return false;
        }
      } else {
        const res = await createServiceAction(formData);
        if (res.success && res.data) {
          setServices((prev) =>
            [...prev, res.data!].sort((a, b) => a.displayOrder - b.displayOrder)
          );
          showAlert(isRtl ? "تمت إضافة الخدمة الجديدة بنجاح." : "Service created successfully.");
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

  const handleToggleHome = async (id: string, current: boolean) => {
    const nextVal = !current;
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabledHome: nextVal } : s))
    );

    const res = await toggleServiceHomeAction(id, nextVal);
    if (!res.success) {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabledHome: current } : s))
      );
      showAlert(res.error || "Failed to update home visibility.", "destructive");
    } else {
      showAlert(
        nextVal
          ? isRtl
            ? "تم تفعيل عرض الخدمة في الصفحة الرئيسية."
            : "Service is now featured on the Home page."
          : isRtl
          ? "تم إخفاء الخدمة من الصفحة الرئيسية."
          : "Service removed from Home page."
      );
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    const nextVal = !current;
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: nextVal } : s))
    );

    const res = await toggleServiceActiveAction(id, nextVal);
    if (!res.success) {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: current } : s))
      );
      showAlert(res.error || "Failed to update status.", "destructive");
    } else {
      showAlert(
        nextVal
          ? isRtl
            ? "تم نشر الخدمة وهي متاحة للمستخدمين الآن."
            : "Service is now published and active."
          : isRtl
          ? "تم تعطيل نشر الخدمة."
          : "Service unpublished."
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    setIsDeleting(true);

    try {
      const res = await deleteServiceAction(deletingService.id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
        showAlert(isRtl ? "تم حذف الخدمة بنجاح." : "Service deleted successfully.");
      } else {
        showAlert(res.error || "Failed to delete.", "destructive");
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "Deletion error.", "destructive");
    } finally {
      setIsDeleting(false);
      setDeletingService(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {alertNotification && (
        <Alert
          variant={alertNotification.type === "destructive" ? "destructive" : "success"}
          className={cn(
            "fixed top-4 end-4 z-50 max-w-md shadow-lg border animate-in fade-in slide-in-from-top-2",
            alertNotification.type === "success" &&
              "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          )}
        >
          <AlertDescription className="text-xs font-medium">
            {alertNotification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {isRtl ? "القدرات الهندسية والخدمات" : "Core Capabilities & Offerings"}
            </span>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              {services.length} {isRtl ? "خدمات" : "Services"}
            </Badge>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {isRtl ? "إدارة الخدمات والقدرات البرمجية" : "Engineering Services Management"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {isRtl
              ? "تحكم في الخدمات المعروضة على الموقع العام، الوسوم التقنية، وأيها يتم إبرازه في الصفحة الرئيسية."
              : "Manage public capabilities, bilingual copy, technical tags, and Home landing page showcases."}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleOpenNew}
          className="shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <LuPlus className="h-4 w-4 me-2" />
          {isRtl ? "إضافة خدمة جديدة" : "Add New Service"}
        </Button>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {isRtl ? "إجمالي الخدمات" : "Total Services"}
            </span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <LuLayers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-foreground">{stats.total}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isRtl ? "في قاعدة البيانات" : "Registered in database"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {isRtl ? "الخدمات المنشورة" : "Active on Hub"}
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <LuGlobe className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isRtl ? "معروضة في صفحة /services" : "Visible on /services"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {isRtl ? "معروضة بالرئيسية" : "Home Featured"}
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <LuHouse className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-foreground">{stats.home}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isRtl ? "في مصفوفة القدرات بالرئيسية" : "In Home capabilities grid"}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
        <div className="relative flex-1 max-w-md">
          <LuSearch className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isRtl
                ? "ابحث بالعنوان، الوصف، الوسوم، أو الرابط..."
                : "Search by title, description, tags, slug..."
            }
            className="ps-9 h-9 text-xs bg-background"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center p-0.5 rounded-lg border border-border/80 bg-background text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRtl ? "الكل" : "All"}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                statusFilter === "active"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRtl ? "المنشورة" : "Active"}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("hidden")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                statusFilter === "hidden"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRtl ? "المعطلة" : "Hidden"}
            </button>
          </div>

          {/* Home Showcase Filter */}
          <div className="flex items-center p-0.5 rounded-lg border border-border/80 bg-background text-xs">
            <button
              type="button"
              onClick={() => setHomeFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                homeFilter === "all"
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRtl ? "كل الواجهات" : "All Locations"}
            </button>
            <button
              type="button"
              onClick={() => setHomeFilter("home")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                homeFilter === "home"
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRtl ? "بالرئيسية فقط" : "Home Featured"}
            </button>
          </div>
        </div>
      </div>

      {/* Services List / Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <LuLayers className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            {isRtl ? "لم يتم العثور على أية خدمات" : "No Services Found"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {search
              ? isRtl
                ? "لا توجد نتائج تطابق معايير البحث الحالية."
                : "No items match your active search filter."
              : isRtl
              ? "ابدأ بإضافة أول خدمة هندسية لتظهر في موقع الويب."
              : "Get started by adding your first engineering capability."}
          </p>
          {!search && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenNew}
              className="mt-4"
            >
              <LuPlus className="h-3.5 w-3.5 me-1.5" />
              {isRtl ? "إضافة خدمة" : "Add Service"}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((service) => {
            const Icon = getServiceIconComponent(service.icon);
            return (
              <Card
                key={service.id}
                className={cn(
                  "flex flex-col justify-between p-5 sm:p-6 border transition-all duration-200 relative group",
                  service.isActive
                    ? "border-border/80 bg-card hover:border-primary/40 shadow-2xs"
                    : "border-border/40 bg-muted/10 opacity-70"
                )}
              >
                <div>
                  {/* Top Bar: Icon, Sort Order Badge, Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-primary group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                        #{service.displayOrder}
                      </Badge>

                      {service.enabledHome && (
                        <Badge
                          variant="secondary"
                          size="sm"
                          className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        >
                          <LuHouse className="h-3 w-3 me-1" />
                          {isRtl ? "رئيسية" : "Home"}
                        </Badge>
                      )}

                      <Badge
                        variant={service.isActive ? "default" : "secondary"}
                        size="sm"
                        className={cn(
                          "text-[10px]",
                          service.isActive
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "text-muted-foreground"
                        )}
                      >
                        {service.isActive
                          ? isRtl
                            ? "منشورة"
                            : "Published"
                          : isRtl
                          ? "معطلة"
                          : "Hidden"}
                      </Badge>
                    </div>
                  </div>

                  {/* Title & Slug */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {service.titleEn}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground" dir="rtl">
                      {service.titleAr}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground/80 truncate">
                      {service.href || `/services/${service.slug}`}
                    </p>
                  </div>

                  {/* Description Snippet */}
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {service.descriptionEn}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {(service.tagsEn || []).slice(0, 3).map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        size="sm"
                        className="font-normal text-[10px] text-muted-foreground bg-muted/60"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {(service.tagsEn?.length || 0) > 3 && (
                      <Badge
                        variant="outline"
                        size="sm"
                        className="text-[10px] text-muted-foreground"
                      >
                        +{(service.tagsEn?.length || 0) - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Bottom Controls & Actions */}
                <div className="mt-6 pt-4 border-t border-border/40 space-y-3">
                  {/* Interactive Switch Toggles */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.enabledHome}
                        onChange={() => handleToggleHome(service.id, service.enabledHome)}
                      />
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {isRtl ? "الرئيسية" : "Home Grid"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.isActive}
                        onChange={() => handleToggleActive(service.id, service.isActive)}
                      />
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {isRtl ? "نشر" : "Publish"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={service.href || `/services/${service.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                    >
                      <span>{isRtl ? "عرض الصفحة" : "View Page"}</span>
                      <LuArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
                    </Link>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(service)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                        title={isRtl ? "تعديل الخدمة" : "Edit service"}
                      >
                        <LuPencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingService(service)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                        title={isRtl ? "حذف الخدمة" : "Delete service"}
                      >
                        <LuTrash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      <ServiceEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        service={editingService}
        onSave={handleSaveService}
        locale={locale}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingService)}
        onOpenChange={(open) => !open && setDeletingService(null)}
        title={isRtl ? "حذف الخدمة التقنية؟" : "Delete Engineering Service?"}
        description={
          isRtl
            ? `هل أنت متأكد من رغبتك في حذف خدمة "${deletingService?.titleAr || deletingService?.titleEn}"؟ سيتم إزالتها من صفحة الخدمات والصفحة الرئيسية.`
            : `Are you sure you want to delete "${deletingService?.titleEn}"? It will be removed from the public website and Home capabilities grid.`
        }
        confirmLabel={
          isDeleting
            ? isRtl
              ? "جار الحذف..."
              : "Deleting..."
            : isRtl
            ? "نعم، حذف الخدمة"
            : "Yes, Delete Service"
        }
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
