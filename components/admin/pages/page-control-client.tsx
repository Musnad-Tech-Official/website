"use client";

import * as React from "react";
import { LuCircleCheck } from "react-icons/lu";
import type { PageControlItem, PageStatus } from "@/lib/page-control/types";
import {
  usePageControlsQuery,
  useUpdatePageControlMutation,
  useBatchUpdatePageStatusMutation,
  useResetPageControlsMutation,
} from "@/lib/page-control/hooks";
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

  // 1. TanStack Query for Page Controls state and cache
  const { data: pages = initialPages } = usePageControlsQuery(initialPages);

  // 2. Mutations
  const updateMutation = useUpdatePageControlMutation();
  const batchMutation = useBatchUpdatePageStatusMutation();
  const resetMutation = useResetPageControlsMutation();

  // Local selection and UI states
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
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
        item.path.toLowerCase().includes(query);

      const matchesFamily = filters.family === "all" || item.family === filters.family;
      const matchesStatus = filters.status === "all" || item.status === filters.status;

      return matchesSearch && matchesFamily && matchesStatus;
    });
  }, [pages, filters]);

  // Toast feedback
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter handlers
  const handleSearchChange = (val: string) => setFilters((prev) => ({ ...prev, search: val }));
  const handleStatusFilter = (val: string) => setFilters((prev) => ({ ...prev, status: val }));
  const handleFamilyFilter = (val: string) => setFilters((prev) => ({ ...prev, family: val }));
  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);

  // Status Change via mutation
  const handleStatusChange = (id: string, newStatus: PageStatus) => {
    const page = pages.find((p) => p.id === id);
    if (page?.isProtected && newStatus !== "live") {
      alert(
        isRtl
          ? "هذه الصفحة أساسية ومحمية للنظام ولا يمكن حجبها أو وضعها في وضع الصيانة."
          : "This is a core system page and cannot be set to maintenance or hidden."
      );
      return;
    }

    updateMutation.mutate(
      { id, updates: { status: newStatus } },
      {
        onSuccess: (updated) => {
          showToast(
            isRtl
              ? `تم تحديث حالة "${updated.titleAr}" إلى ${newStatus}`
              : `Updated "${updated.titleEn}" status to ${newStatus}`
          );
        },
        onError: (err: Error) => {
          alert(err.message || "Failed to update page status");
        },
      }
    );
  };

  // Toggle Navbar
  const handleToggleNavbar = (page: PageControlItem) => {
    const updatedVal = !page.showInNavbar;

    updateMutation.mutate(
      { id: page.id, updates: { showInNavbar: updatedVal } },
      {
        onSuccess: () => {
          showToast(
            isRtl
              ? `تم ${updatedVal ? "إظهار" : "إخفاء"} الصفحة في شريط التنقل العلوي`
              : `${updatedVal ? "Enabled" : "Disabled"} in public Navbar`
          );
        },
        onError: (err: Error) => {
          alert(err.message || "Failed to update navbar setting");
        },
      }
    );
  };

  // Toggle Footer
  const handleToggleFooter = (page: PageControlItem) => {
    const updatedVal = !page.showInFooter;

    updateMutation.mutate(
      { id: page.id, updates: { showInFooter: updatedVal } },
      {
        onSuccess: () => {
          showToast(
            isRtl
              ? `تم ${updatedVal ? "إظهار" : "إخفاء"} الصفحة في تذييل الموقع`
              : `${updatedVal ? "Enabled" : "Disabled"} in public Footer`
          );
        },
        onError: (err: Error) => {
          alert(err.message || "Failed to update footer setting");
        },
      }
    );
  };

  // Save Modal Notice
  const handleSaveNotice = async (pageId: string, noticeEn: string, noticeAr: string) => {
    try {
      await updateMutation.mutateAsync({
        id: pageId,
        updates: {
          maintenanceNoticeEn: noticeEn,
          maintenanceNoticeAr: noticeAr,
        },
      });
      showToast(isRtl ? "تم حفظ إشعار الصيانة بنجاح" : "Maintenance notices updated");
      return true;
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to save notice");
      return false;
    }
  };

  // Batch status change
  const handleBatchStatus = (status: PageStatus) => {
    if (selectedIds.length === 0) return;

    batchMutation.mutate(
      { ids: selectedIds, status },
      {
        onSuccess: ({ ids, status: newStatus }) => {
          setSelectedIds([]);
          showToast(
            isRtl
              ? `تم تحديث ${ids.length} صفحة إلى ${newStatus}`
              : `Updated ${ids.length} pages to ${newStatus}`
          );
        },
        onError: (err: Error) => {
          alert(err.message || "Failed to batch update pages");
        },
      }
    );
  };

  // Reset to default
  const handleReset = () => {
    if (
      !confirm(
        isRtl
          ? "هل أنت متأكد من رغبتك في إعادة تعيين كافة إعدادات الصفحات إلى الوضع الافتراضي؟"
          : "Are you sure you want to reset all pages to original defaults?"
      )
    ) {
      return;
    }

    resetMutation.mutate(undefined, {
      onSuccess: () => {
        showToast(isRtl ? "تمت إعادة تعيين الصفحات إلى الإعدادات الافتراضية" : "Pages reset to default");
      },
      onError: (err: Error) => {
        alert(err.message || "Failed to reset page controls");
      },
    });
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
        isUpdating={updateMutation.isPending ? "loading" : null}
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
