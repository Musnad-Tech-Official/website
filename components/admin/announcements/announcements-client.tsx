"use client";

import * as React from "react";
import {
  LuPlus,
  LuSearch,
  LuPencil,
  LuTrash2,
  LuExternalLink,
  LuFolderGit2,
  LuServer,
  LuWrench,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AnnouncementModal } from "./announcement-modal";
import type {
  AnnouncementBannerItem,
  AnnouncementFormData,
  AnnouncementCategory,
} from "@/lib/announcements/types";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
  deleteAnnouncementAction,
  toggleAnnouncementActiveAction,
} from "@/lib/announcements/actions";
import { cn } from "@/lib/utils";

interface AnnouncementsClientProps {
  initialAnnouncements: AnnouncementBannerItem[];
  locale: string;
}

export function AnnouncementsClient({
  initialAnnouncements,
  locale,
}: AnnouncementsClientProps) {
  const isRtl = locale === "ar";
  const [announcements, setAnnouncements] =
    React.useState<AnnouncementBannerItem[]>(initialAnnouncements);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const [editingAnnouncement, setEditingAnnouncement] =
    React.useState<AnnouncementBannerItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [deletingAnnouncement, setDeletingAnnouncement] =
    React.useState<AnnouncementBannerItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [alertNotification, setAlertNotification] = React.useState<{
    type: "success" | "destructive";
    message: string;
  } | null>(null);

  const showAlert = (message: string, type: "success" | "destructive" = "success") => {
    setAlertNotification({ type, message });
    setTimeout(() => setAlertNotification(null), 4000);
  };

  const activeBanner = announcements.find((a) => a.isActive);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return announcements.filter((item) => {
      const matchSearch =
        q === "" ||
        item.textEn.toLowerCase().includes(q) ||
        item.textAr.includes(q) ||
        item.href.toLowerCase().includes(q);

      const matchCat = categoryFilter === "all" || item.category === categoryFilter;

      return matchSearch && matchCat;
    });
  }, [announcements, search, categoryFilter]);

  const handleOpenNew = (categoryPreset?: AnnouncementCategory) => {
    setEditingAnnouncement(
      categoryPreset
        ? {
            id: "",
            category: categoryPreset,
            textEn: "",
            textAr: "",
            tagEn: "New",
            tagAr: "جديد",
            href:
              categoryPreset === "projects"
                ? "/projects"
                : categoryPreset === "services"
                ? "/services"
                : "/services/developer-tools",
            linkTextEn: "Explore Now",
            linkTextAr: "استكشف الآن",
            isDismissible: true,
            isActive: false,
          }
        : null
    );
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AnnouncementBannerItem) => {
    setEditingAnnouncement(item);
    setIsModalOpen(true);
  };

  const handleSaveAnnouncement = async (formData: AnnouncementFormData): Promise<boolean> => {
    try {
      if (editingAnnouncement) {
        const res = await updateAnnouncementAction(editingAnnouncement.id, formData);
        if (res.success && res.data) {
          setAnnouncements((prev) =>
            prev.map((a) => {
              if (res.data!.isActive) {
                return a.id === editingAnnouncement.id ? res.data! : { ...a, isActive: false };
              }
              return a.id === editingAnnouncement.id ? res.data! : a;
            })
          );
          showAlert(isRtl ? "تم تحديث شريط الإعلانات بنجاح." : "Announcement updated successfully.");
          return true;
        } else {
          showAlert(res.error || "Failed to update announcement.", "destructive");
          return false;
        }
      } else {
        const res = await createAnnouncementAction(formData);
        if (res.success && res.data) {
          setAnnouncements((prev) => {
            const next = res.data!.isActive
              ? prev.map((a) => ({ ...a, isActive: false }))
              : [...prev];
            return [res.data!, ...next];
          });
          showAlert(
            res.data?.isActive
              ? isRtl
                ? "تم نشر وتفعيل الإعلان على الموقع بنجاح!"
                : "Announcement pushed live to the website!"
              : isRtl
              ? "تم حفظ الإعلان بنجاح."
              : "Announcement saved successfully."
          );
          return true;
        } else {
          showAlert(res.error || "Failed to create announcement.", "destructive");
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
    // Optimistically update
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (nextVal) {
          return a.id === id ? { ...a, isActive: true } : { ...a, isActive: false };
        }
        return a.id === id ? { ...a, isActive: false } : a;
      })
    );

    const res = await toggleAnnouncementActiveAction(id, nextVal);
    if (!res.success) {
      // Revert if error
      setAnnouncements(initialAnnouncements);
      showAlert(res.error || "Failed to toggle status.", "destructive");
    } else {
      showAlert(
        nextVal
          ? isRtl
            ? "تم بث هذا الإعلان مباشرة على الموقع."
            : "Banner is now broadcasting live on website."
          : isRtl
          ? "تم إيقاف بث الإعلان من الموقع."
          : "Banner broadcast turned off."
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAnnouncement) return;
    setIsDeleting(true);

    try {
      const res = await deleteAnnouncementAction(deletingAnnouncement.id);
      if (res.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== deletingAnnouncement.id));
        showAlert(isRtl ? "تم حذف الإعلان بنجاح." : "Announcement deleted successfully.");
      } else {
        showAlert(res.error || "Failed to delete.", "destructive");
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "Deletion error.", "destructive");
    } finally {
      setIsDeleting(false);
      setDeletingAnnouncement(null);
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
              {isRtl ? "شريط الإعلانات والتنبيهات العامة" : "Announcement Banners & Broadcasts"}
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              {announcements.length}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isRtl
              ? "نشر وبث التنبيهات في أعلى صفحات الموقع للمشاريع الجديدة، الخدمات المبتكرة، والأدوات البرمجية."
              : "Push top-bar announcements across all pages for new projects, services, and developer tools."}
          </p>
        </div>

        <Button onClick={() => handleOpenNew()} className="gap-2 shadow-xs shrink-0 self-start sm:self-auto">
          <LuPlus className="h-4 w-4" />
          <span>{isRtl ? "إطلاق شريط إعلاني" : "Push New Banner"}</span>
        </Button>
      </div>

      {/* Live Broadcast Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                activeBanner ? "animate-ping bg-emerald-500" : "bg-muted-foreground"
              )} />
              <span className={cn(
                "relative inline-flex rounded-full h-2.5 w-2.5",
                activeBanner ? "bg-emerald-500" : "bg-muted-foreground"
              )} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              {activeBanner
                ? isRtl
                  ? "البث المباشر النشط حالياً على الموقع"
                  : "Currently Live on Website"
                : isRtl
                ? "لا يوجد شريط إعلاني معروض حالياً"
                : "No Active Banner Broadcast"}
            </span>
          </div>

          {activeBanner && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                {isRtl ? "مباشر" : "LIVE"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleToggleActive(activeBanner.id, true)}
              >
                {isRtl ? "إيقاف البث" : "Turn Off"}
              </Button>
            </div>
          )}
        </div>

        {activeBanner ? (
          <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Badge variant="default" size="sm" className="shrink-0 text-[10px] py-0 px-2 font-bold">
                {isRtl ? activeBanner.tagAr : activeBanner.tagEn}
              </Badge>
              <p className="text-xs font-semibold text-foreground truncate">
                {isRtl ? activeBanner.textAr : activeBanner.textEn}
              </p>
              <a
                href={activeBanner.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 text-xs shrink-0"
              >
                <span>{isRtl ? activeBanner.linkTextAr : activeBanner.linkTextEn}</span>
                <span>{isRtl ? "←" : "→"}</span>
              </a>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => handleOpenEdit(activeBanner)}
              >
                <LuPencil className="h-3.5 w-3.5" />
                <span>{isRtl ? "تعديل" : "Edit"}</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border/60 rounded-xl bg-card/40">
            <p className="text-xs text-muted-foreground">
              {isRtl
                ? "يمكنك تفعيل أحد الإعلانات أدناه أو النقر على 'إطلاق شريط إعلاني' لعرض إعلان لزوار الموقع."
                : "Select and activate one of the announcement campaigns below or create a new one to display at the top of the site."}
            </p>
          </div>
        )}
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div
          onClick={() => handleOpenNew("tools")}
          className="group p-4 rounded-xl border border-border/60 bg-card hover:border-primary/50 cursor-pointer transition-all hover:shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">
              {isRtl ? "أدوات ومكتبة المكونات" : "Tools & UI Kit"}
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <LuWrench className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {isRtl
              ? "إعلان عن إطلاق نظام التصميم والمكتبات البرمجية."
              : "Push announcement for UI design system & tooling."}
          </p>
        </div>

        <div
          onClick={() => handleOpenNew("projects")}
          className="group p-4 rounded-xl border border-border/60 bg-card hover:border-primary/50 cursor-pointer transition-all hover:shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">
              {isRtl ? "المشاريع ودراسات الحالة" : "Projects & Launches"}
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <LuFolderGit2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {isRtl
              ? "تسليط الضوء على إنجاز مشروع جديد أو دراسة حالة."
              : "Highlight a newly delivered system or case study."}
          </p>
        </div>

        <div
          onClick={() => handleOpenNew("services")}
          className="group p-4 rounded-xl border border-border/60 bg-card hover:border-primary/50 cursor-pointer transition-all hover:shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">
              {isRtl ? "الخدمات والحلول الرقمية" : "Engineering Services"}
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <LuServer className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {isRtl
              ? "إعلان حلول الذكاء الاصطناعي والبنية التحتية السحابية."
              : "Promote new AI architecture and engineering capabilities."}
          </p>
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
                ? "ابحث في الإعلانات بالعربية أو الإنجليزية أو الرابط..."
                : "Search announcements by text or destination..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn("h-9 text-xs", isRtl ? "pr-9" : "pl-9")}
          />
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border/40">
          {(
            [
              { id: "all", labelEn: "All", labelAr: "الكل" },
              { id: "tools", labelEn: "Tools", labelAr: "أدوات" },
              { id: "projects", labelEn: "Projects", labelAr: "مشاريع" },
              { id: "services", labelEn: "Services", labelAr: "خدمات" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                categoryFilter === cat.id
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRtl ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-4 rounded-xl border transition-all duration-200 bg-card hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4",
              item.isActive ? "border-primary/50 shadow-2xs" : "border-border/60"
            )}
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={item.isActive ? "default" : "outline"}
                  size="sm"
                  className="text-[10px] font-bold py-0 px-2"
                >
                  {isRtl ? item.tagAr : item.tagEn}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground uppercase">
                  {item.category}
                </Badge>
                {item.isActive && (
                  <Badge variant="default" className="text-[10px] bg-emerald-600 text-white font-semibold">
                    {isRtl ? "بث مباشر" : "Active Broadcast"}
                  </Badge>
                )}
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">
                  {isRtl ? item.textAr : item.textEn}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {isRtl ? item.textEn : item.textAr}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                <span className="font-mono text-primary flex items-center gap-1">
                  <LuExternalLink className="h-3 w-3" />
                  <span>{item.href}</span>
                </span>
                <span>•</span>
                <span>
                  {isRtl ? item.linkTextAr : item.linkTextEn}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {item.isActive ? (isRtl ? "مفعل" : "Active") : (isRtl ? "معطل" : "Off")}
                </span>
                <Switch
                  checked={item.isActive}
                  onChange={() => handleToggleActive(item.id, item.isActive)}
                  size="sm"
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(item)}
                  className="h-8 text-xs gap-1.5"
                >
                  <LuPencil className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{isRtl ? "تعديل" : "Edit"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingAnnouncement(item)}
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
      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        announcement={editingAnnouncement}
        onSave={handleSaveAnnouncement}
        locale={locale}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingAnnouncement)}
        onOpenChange={(open) => !open && setDeletingAnnouncement(null)}
        title={isRtl ? "حذف شريط الإعلانات" : "Delete Announcement Banner"}
        description={
          isRtl
            ? "هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ سيتم إزالته من السجل."
            : "Are you sure you want to delete this announcement? It will be permanently removed."
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
