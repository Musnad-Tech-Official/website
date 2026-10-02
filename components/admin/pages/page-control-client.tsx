"use client";

import * as React from "react";
import { LuCircleCheck } from "react-icons/lu";
import type { PageControlItem, PageStatus } from "@/lib/page-control/types";
import {
  updatePageControlAction,
  batchUpdatePageStatusAction,
  resetPageControlsAction,
} from "@/lib/page-control/actions";
import { PageControlStats } from "./page-control-stats";
import { PageControlFilters } from "./page-control-filters";
import { PageControlTable } from "./page-control-table";
import { PageMaintenanceModal } from "./page-maintenance-modal";

interface PageControlClientProps {
  initialPages: PageControlItem[];
  locale: string;
}

interface FilterState {
  search: string;
  family: string;
  status: string;
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  family: "all",
  status: "all",
};

export function PageControlClient({ initialPages, locale }: PageControlClientProps) {
  const isRtl = locale === "ar";

  // Core Data & Selection States (Consolidated from 11 separate states down to 6)
  const [pages, setPages] = React.useState<PageControlItem[]>(initialPages);
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [editingPage, setEditingPage] = React.useState<PageControlItem | null>(null);

  // Computed stats
  const stats = React.useMemo(() => {
    return {
      total: pages.length,
      live: pages.filter((p) => p.status === "live").length,
      maintenance: pages.filter((p) => p.status === "maintenance").length,
      hidden: pages.filter((p) => p.status === "hidden").length,
      inNavbar: pages.filter((p) => p.showInNavbar).length,
      inFooter: pages.filter((p) => p.showInFooter).length,
    };
  }, [pages]);

  // Filtered pages
  const filteredPages = React.useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return pages.filter((item) => {
      const matchesSearch =
        query === "" ||
        item.titleEn.toLowerCase().includes(query) ||
        item.titleAr.includes(query) ||
        item.path.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      const matchesFamily = filters.family === "all" || item.family === filters.family;
      const matchesStatus = filters.status === "all" || item.status === filters.status;

      return matchesSearch && matchesFamily && matchesStatus;
    });
  }, [pages, filters]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filter helpers
  const handleSearchChange = (search: string) => setFilters((prev) => ({ ...prev, search }));
  const handleStatusFilter = (status: string) => setFilters((prev) => ({ ...prev, status }));
  const handleFamilyFilter = (family: string) => setFilters((prev) => ({ ...prev, family }));
  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);

  // Update status handler
  const handleStatusChange = async (id: string, newStatus: PageStatus) => {
    setIsUpdating(id);
    const prev = [...pages];

    setPages((curr) =>
      curr.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    const res = await updatePageControlAction(id, { status: newStatus });
    setIsUpdating(null);

    if (res.success && res.item) {
      showToast(
        isRtl
          ? `تم تحديث حالة "${res.item.titleAr}" إلى ${newStatus}`
          : `Updated "${res.item.titleEn}" status to ${newStatus}`
      );
    } else {
      setPages(prev);
      alert(res.error || "Failed to update page status");
    }
  };

  // Toggle Navbar
  const handleToggleNavbar = async (page: PageControlItem) => {
    const updatedVal = !page.showInNavbar;
    setIsUpdating(page.id);

    setPages((curr) =>
      curr.map((p) => (p.id === page.id ? { ...p, showInNavbar: updatedVal } : p))
    );

    const res = await updatePageControlAction(page.id, { showInNavbar: updatedVal });
    setIsUpdating(null);

    if (res.success) {
      showToast(
        isRtl
          ? `تم ${updatedVal ? "إظهار" : "إخفاء"} الصفحة في شريط التنقل العلوي`
          : `${updatedVal ? "Enabled" : "Disabled"} in public Navbar`
      );
    }
  };

  // Toggle Footer
  const handleToggleFooter = async (page: PageControlItem) => {
    const updatedVal = !page.showInFooter;
    setIsUpdating(page.id);

    setPages((curr) =>
      curr.map((p) => (p.id === page.id ? { ...p, showInFooter: updatedVal } : p))
    );

    const res = await updatePageControlAction(page.id, { showInFooter: updatedVal });
    setIsUpdating(null);

    if (res.success) {
      showToast(
        isRtl
          ? `تم ${updatedVal ? "إظهار" : "إخفاء"} الصفحة في تذييل الموقع`
          : `${updatedVal ? "Enabled" : "Disabled"} in public Footer`
      );
    }
  };

  // Save Modal Notice
  const handleSaveNotice = async (pageId: string, noticeEn: string, noticeAr: string) => {
    const res = await updatePageControlAction(pageId, {
      maintenanceNoticeEn: noticeEn,
      maintenanceNoticeAr: noticeAr,
    });

    if (res.success && res.item) {
      setPages((curr) =>
        curr.map((p) => (p.id === pageId ? res.item! : p))
      );
      showToast(isRtl ? "تم حفظ إشعار الصيانة بنجاح" : "Maintenance notices updated");
      return true;
    } else {
      alert(res.error || "Failed to save notice");
      return false;
    }
  };

  // Batch status change
  const handleBatchStatus = async (status: PageStatus) => {
    if (selectedIds.length === 0) return;

    const res = await batchUpdatePageStatusAction(selectedIds, status);
    if (res.success) {
      setPages((curr) =>
        curr.map((p) => (selectedIds.includes(p.id) ? { ...p, status } : p))
      );
      setSelectedIds([]);
      showToast(
        isRtl
          ? `تم تحديث ${res.count} صفحة إلى ${status}`
          : `Updated ${res.count} pages to ${status}`
      );
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (
      !confirm(
        isRtl
          ? "هل أنت متأكد من رغبتك في إعادة تعيين كافة إعدادات الصفحات إلى الوضع الافتراضي؟"
          : "Are you sure you want to reset all pages to original defaults?"
      )
    )
      return;

    const res = await resetPageControlsAction();
    if (res.success) {
      window.location.reload();
    }
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredPages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPages.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 end-6 z-50 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in-50 slide-in-from-bottom-5">
          <LuCircleCheck className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <PageControlStats
        stats={stats}
        selectedStatus={filters.status}
        selectedFamily={filters.family}
        onSelectStatus={handleStatusFilter}
        onSelectFamily={handleFamilyFilter}
        isRtl={isRtl}
      />

      {/* Filter and Search Bar */}
      <PageControlFilters
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        selectedStatus={filters.status}
        onSelectStatus={handleStatusFilter}
        selectedFamily={filters.family}
        onSelectFamily={handleFamilyFilter}
        stats={stats}
        selectedCount={selectedIds.length}
        onBatchStatus={handleBatchStatus}
        onDeselectAll={() => setSelectedIds([])}
        onReset={handleReset}
        isRtl={isRtl}
      />

      {/* Pages Data Table & Empty State */}
      <PageControlTable
        pages={filteredPages}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        isUpdating={isUpdating}
        onStatusChange={handleStatusChange}
        onToggleNavbar={handleToggleNavbar}
        onToggleFooter={handleToggleFooter}
        onOpenEdit={setEditingPage}
        onClearFilters={handleClearFilters}
        selectedStatus={filters.status}
        isRtl={isRtl}
      />

      {/* Edit Maintenance Notice Modal */}
      {editingPage && (
        <PageMaintenanceModal
          key={editingPage.id}
          page={editingPage}
          onSave={handleSaveNotice}
          onClose={() => setEditingPage(null)}
          isRtl={isRtl}
        />
      )}
    </div>
  );
}
