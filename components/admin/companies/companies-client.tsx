"use client";

import * as React from "react";
import Image from "next/image";
import {
  LuPlus,
  LuSearch,
  LuBuilding2,
  LuCircleCheck,
  LuEyeOff,
  LuPencil,
  LuTrash2,
  LuExternalLink,
  LuLayers,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CompanyEditorModal } from "./company-editor-modal";
import type { TrustedCompanyItem, CompanyFormData } from "@/lib/companies/types";
import {
  createCompanyAction,
  updateCompanyAction,
  deleteCompanyAction,
  toggleCompanyActiveAction,
} from "@/lib/companies/actions";
import { cn } from "@/lib/utils";

interface CompaniesClientProps {
  initialCompanies: TrustedCompanyItem[];
  locale: string;
}

export function CompaniesClient({
  initialCompanies,
  locale,
}: CompaniesClientProps) {
  const isRtl = locale === "ar";
  const [companies, setCompanies] =
    React.useState<TrustedCompanyItem[]>(initialCompanies);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "hidden">("all");

  const [editingCompany, setEditingCompany] =
    React.useState<TrustedCompanyItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [deletingCompany, setDeletingCompany] =
    React.useState<TrustedCompanyItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [alertNotification, setAlertNotification] = React.useState<{
    type: "success" | "destructive";
    message: string;
  } | null>(null);

  const showAlert = (message: string, type: "success" | "destructive" = "success") => {
    setAlertNotification({ type, message });
    setTimeout(() => setAlertNotification(null), 4000);
  };

  // Filtered companies
  const filteredCompanies = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return companies.filter((c) => {
      const matchSearch =
        q === "" ||
        c.nameEn.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        (c.websiteUrl && c.websiteUrl.toLowerCase().includes(q));

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.isActive) ||
        (statusFilter === "hidden" && !c.isActive);

      return matchSearch && matchStatus;
    });
  }, [companies, search, statusFilter]);

  // Statistics
  const stats = React.useMemo(() => {
    return {
      total: companies.length,
      active: companies.filter((c) => c.isActive).length,
      hidden: companies.filter((c) => !c.isActive).length,
    };
  }, [companies]);

  const handleOpenNew = () => {
    setEditingCompany(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (company: TrustedCompanyItem) => {
    setEditingCompany(company);
    setIsEditorOpen(true);
  };

  const handleSaveCompany = async (formData: CompanyFormData): Promise<boolean> => {
    try {
      if (editingCompany) {
        const res = await updateCompanyAction(editingCompany.id, formData);
        if (res.success && res.data) {
          setCompanies((prev) =>
            prev.map((c) => (c.id === editingCompany.id ? res.data! : c))
          );
          showAlert(isRtl ? "تم تحديث بيانات الشركة بنجاح." : "Company updated successfully.");
          return true;
        } else {
          showAlert(res.error || (isRtl ? "حدث خطأ أثناء التحديث." : "Update failed."), "destructive");
          return false;
        }
      } else {
        const res = await createCompanyAction(formData);
        if (res.success && res.data) {
          setCompanies((prev) => [...prev, res.data!].sort((a, b) => a.displayOrder - b.displayOrder));
          showAlert(isRtl ? "تمت إضافة الشركة بنجاح." : "Company added successfully.");
          return true;
        } else {
          showAlert(res.error || (isRtl ? "حدث خطأ أثناء الإضافة." : "Failed to add company."), "destructive");
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
    // Optimistic UI update
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: nextVal } : c))
    );

    const res = await toggleCompanyActiveAction(id, nextVal);
    if (!res.success) {
      // Revert if error
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: current } : c))
      );
      showAlert(res.error || "Failed to update visibility.", "destructive");
    } else {
      showAlert(
        nextVal
          ? isRtl
            ? "أصبحت الشركة مرئية على الصفحة الرئيسية."
            : "Company is now visible on Home page."
          : isRtl
          ? "تم إخفاء الشركة من الصفحة الرئيسية."
          : "Company is now hidden from Home page."
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCompany) return;
    setIsDeleting(true);

    try {
      const res = await deleteCompanyAction(deletingCompany.id);
      if (res.success) {
        setCompanies((prev) => prev.filter((c) => c.id !== deletingCompany.id));
        showAlert(isRtl ? "تم حذف الشركة بنجاح." : "Company deleted successfully.");
      } else {
        showAlert(res.error || "Failed to delete company.", "destructive");
      }
    } catch (err: unknown) {
      showAlert((err as Error).message || "Deletion error.", "destructive");
    } finally {
      setIsDeleting(false);
      setDeletingCompany(null);
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

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isRtl ? "الشركات الموثوقة وشركاء النجاح" : "Trusted Companies & Partners"}
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              {companies.length}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isRtl
              ? "إدارة شعارات وأسماء وروابط شركاء النجاح المعروضة في الصفحة الرئيسية للموقع."
              : "Manage partner and client logos, bilingual names, and links displayed on the Home page."}
          </p>
        </div>

        <Button onClick={handleOpenNew} className="gap-2 shadow-xs shrink-0 self-start sm:self-auto">
          <LuPlus className="h-4 w-4" />
          <span>{isRtl ? "إضافة شركة جديدة" : "Add Company"}</span>
        </Button>
      </div>

      {/* Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">
              {isRtl ? "إجمالي الشركات" : "Total Companies"}
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
              {isRtl ? "مخفية (غير نشطة)" : "Hidden (Draft)"}
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
                ? "ابحث باسم الشركة بالعربية أو الإنجليزية..."
                : "Search company by Arabic or English name..."
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

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto mb-3 text-muted-foreground">
            <LuBuilding2 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {isRtl ? "لم يتم العثور على شركات" : "No companies found"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {isRtl
              ? "لم نجد أي شركات مطابقة لبحثك الحالي. يمكنك مسح البحث أو إضافة شركة جديدة."
              : "No companies match your search criteria. Try clearing the search or add a new company."}
          </p>
          <Button onClick={handleOpenNew} size="sm" variant="outline" className="mt-4 gap-2">
            <LuPlus className="h-3.5 w-3.5" />
            <span>{isRtl ? "إضافة شركة جديدة" : "Add Company"}</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className={cn(
                "group relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 bg-card hover:shadow-xs",
                company.isActive
                  ? "border-border/60 hover:border-primary/40"
                  : "border-border/40 opacity-70 bg-muted/15"
              )}
            >
              {/* Card Top: Order Pill & Visibility Switch */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="outline" className="text-[10px] font-mono font-medium text-muted-foreground">
                  #{company.displayOrder}
                </Badge>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {company.isActive
                      ? isRtl
                        ? "معروض"
                        : "Visible"
                      : isRtl
                      ? "مخفي"
                      : "Hidden"}
                  </span>
                  <Switch
                    checked={company.isActive}
                    onChange={() => handleToggleActive(company.id, company.isActive)}
                    size="sm"
                  />
                </div>
              </div>

              {/* Logo Preview Box */}
              <div className="relative h-20 w-full flex items-center justify-center p-3 rounded-lg border border-border/40 bg-muted/20 dark:bg-muted/10 mb-3 group-hover:bg-muted/30 transition-colors overflow-hidden">
                <Image
                  src={company.logo}
                  alt={company.nameEn}
                  width={140}
                  height={50}
                  unoptimized
                  className="max-h-12 max-w-full object-contain filter grayscale dark:brightness-200 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                />
              </div>

              {/* Company Info */}
              <div className="space-y-1 mb-4 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {isRtl ? company.nameAr : company.nameEn}
                  </h4>
                  {company.websiteUrl && (
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title={company.websiteUrl}
                    >
                      <LuExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {isRtl ? company.nameEn : company.nameAr}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(company)}
                  className="h-8 text-xs gap-1.5"
                >
                  <LuPencil className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{isRtl ? "تعديل" : "Edit"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingCompany(company)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LuTrash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <CompanyEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        company={editingCompany}
        onSave={handleSaveCompany}
        locale={locale}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        open={Boolean(deletingCompany)}
        onOpenChange={(open) => !open && setDeletingCompany(null)}
        title={
          isRtl
            ? `حذف شركة "${deletingCompany?.nameAr || deletingCompany?.nameEn}"`
            : `Delete "${deletingCompany?.nameEn}"?`
        }
        description={
          isRtl
            ? "هل أنت متأكد من رغبتك في حذف هذه الشركة؟ سيتم إزالتها نهائياً ولن تعود مرئية على الصفحة الرئيسية."
            : "Are you sure you want to delete this company? It will be permanently removed from the system and no longer visible on the Home page."
        }
        confirmLabel={isRtl ? "حذف نهائي" : "Delete Permanently"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
