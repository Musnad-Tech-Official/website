"use client";

import * as React from "react";
import type { PageControlItem, PageStatus } from "@/lib/page-control/types";
import {
  usePageControlsQuery,
  useUpdatePageControlMutation,
  useBatchUpdatePageStatusMutation,
  useResetPageControlsMutation,
} from "@/lib/page-control/hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
  const [editingPage, setEditingPage] = React.useState<PageControlItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const [alertNotification, setAlertNotification] = React.useState<{
    type: "success" | "destructive" | "warning" | "info";
    message: string;
  } | null>(null);

  // Show Alert notification
  const showAlert = (
    message: string,
    type: "success" | "destructive" | "warning" | "info" = "success"
  ) => {
    setAlertNotification({ type, message });
    setTimeout(() => setAlertNotification(null), 4000);
  };

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


  // Filter handlers
  const handleSearchChange = (val: string) => setFilters((prev) => ({ ...prev, search: val }));
  const handleStatusFilter = (val: string) => setFilters((prev) => ({ ...prev, status: val }));
  const handleFamilyFilter = (val: string) => setFilters((prev) => ({ ...prev, family: val }));
  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);

  // Status Change via mutation
  const handleStatusChange = (id: string, newStatus: PageStatus) => {
    const page = pages.find((p) => p.id === id);
    if (page?.isProtected && newStatus !== "live") {
      showAlert(
        isRtl
          ? "هذه الصفحة أساسية ومحمية للنظام ولا يمكن حجبها أو وضعها في وضع الصيانة."
          : "This is a core system page and cannot be set to maintenance or hidden.",
        "warning"
      );
      return;
    }

    updateMutation.mutate(
      { id, updates: { status: newStatus } },
      {
        onSuccess: (updated) => {
          showAlert(
            isRtl
              ? `تم تحديث حالة "${updated.titleAr}" إلى ${newStatus}`
              : `Updated "${updated.titleEn}" status to ${newStatus}`,
            "success"
          );
        },
        onError: (err: Error) => {
          showAlert(err.message || "Failed to update page status", "destructive");
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
          showAlert(
            isRtl
              ? `تم ${updatedVal ? "إظهار" : "إخفاء"} الصفحة في شريط التنقل العلوي`
              : `${updatedVal ? "Enabled" : "Disabled"} in public Navbar`,
            "success"
          );
        },
        onError: (err: Error) => {
          showAlert(err.message || "Failed to update navbar setting", "destructive");
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
          showAlert(
            isRtl
              ? `تم ${updatedVal ? "إظهار" : "إخفاء"} الصفحة في تذييل الموقع`
              : `${updatedVal ? "Enabled" : "Disabled"} in public Footer`,
            "success"
          );
        },
        onError: (err: Error) => {
          showAlert(err.message || "Failed to update footer setting", "destructive");
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
      showAlert(isRtl ? "تم حفظ إشعار الصيانة بنجاح" : "Maintenance notices updated", "success");
      return true;
    } catch (err: unknown) {
      showAlert((err as Error).message || "Failed to save notice", "destructive");
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
          showAlert(
            isRtl
              ? `تم تحديث ${ids.length} صفحة إلى ${newStatus}`
              : `Updated ${ids.length} pages to ${newStatus}`,
            "success"
          );
        },
        onError: (err: Error) => {
          showAlert(err.message || "Failed to batch update pages", "destructive");
        },
      }
    );
  };

  // Reset to default
  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setIsResetConfirmOpen(false);
    resetMutation.mutate(undefined, {
      onSuccess: () => {
        showAlert(
          isRtl ? "تمت إعادة تعيين الصفحات إلى الإعدادات الافتراضية" : "Pages reset to default",
          "success"
        );
      },
      onError: (err: Error) => {
        showAlert(err.message || "Failed to reset page controls", "destructive");
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
      {/* Alert Notification */}
      {alertNotification && (
        <div className="fixed bottom-6 end-6 z-50 max-w-md w-full shadow-2xl animate-in fade-in-50 slide-in-from-bottom-5">
          <Alert
            variant={alertNotification.type}
            onClose={() => setAlertNotification(null)}
            className="bg-card/95 backdrop-blur-md shadow-xl border"
          >
            <AlertDescription className="text-xs sm:text-sm font-medium">
              {alertNotification.message}
            </AlertDescription>
          </Alert>
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

      {/* Reset Confirmation Modal */}
      <ConfirmDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title={isRtl ? "إعادة تعيين الصفحات" : "Reset Pages to Default"}
        description={
          isRtl
            ? "هل أنت متأكد من رغبتك في إعادة تعيين كافة إعدادات الصفحات إلى الوضع الافتراضي؟"
            : "Are you sure you want to reset all pages to original defaults?"
        }
        confirmLabel={isRtl ? "إعادة تعيين" : "Reset to Defaults"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="warning"
        isLoading={resetMutation.isPending}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
