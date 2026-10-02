"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  LuGlobe,
  LuEyeOff,
  LuEye,
  LuWrench,
  LuRotateCcw,
  LuExternalLink,
  LuCopy,
  LuCheck,
  LuSettings2,
  LuLayers,
  LuBriefcase,
  LuFileText,
  LuFolderGit2,
  LuShield,
  LuLifeBuoy,
  LuUser,
  LuSparkles,
} from "react-icons/lu";
import type { PageControlItem, PageFamily, PageStatus } from "@/lib/page-control/types";

interface PageControlTableProps {
  pages: PageControlItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  isUpdating: string | null;
  onStatusChange: (id: string, status: PageStatus) => void;
  onToggleNavbar: (page: PageControlItem) => void;
  onToggleFooter: (page: PageControlItem) => void;
  onOpenEdit: (page: PageControlItem) => void;
  onClearFilters: () => void;
  selectedStatus: string;
  isRtl: boolean;
}

const getFamilyIcon = (family: PageFamily) => {
  switch (family) {
    case "marketing":
      return LuSparkles;
    case "services":
      return LuBriefcase;
    case "projects":
      return LuFolderGit2;
    case "blog":
      return LuFileText;
    case "careers":
      return LuLayers;
    case "support":
      return LuLifeBuoy;
    case "legal":
      return LuShield;
    case "account":
      return LuUser;
    default:
      return LuGlobe;
  }
};

export function PageControlTable({
  pages,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isUpdating,
  onStatusChange,
  onToggleNavbar,
  onToggleFooter,
  onOpenEdit,
  onClearFilters,
  selectedStatus,
  isRtl,
}: PageControlTableProps) {
  const [copiedPath, setCopiedPath] = React.useState<string | null>(null);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  if (pages.length === 0) {
    return (
      <EmptyState
        icon={
          selectedStatus === "hidden" ? (
            <LuEyeOff className="w-6 h-6 text-rose-500" />
          ) : selectedStatus === "maintenance" ? (
            <LuWrench className="w-6 h-6 text-amber-500" />
          ) : (
            <LuGlobe className="w-6 h-6 text-primary" />
          )
        }
        title={
          selectedStatus === "hidden"
            ? isRtl
              ? "لا توجد صفحات مخفية حالياً"
              : "No Hidden Pages Found"
            : selectedStatus === "maintenance"
            ? isRtl
              ? "لا توجد صفحات قيد الصيانة حالياً"
              : "No Pages Currently Under Maintenance"
            : isRtl
            ? "لم يتم العثور على صفحات مطابقة"
            : "No Matching Pages Found"
        }
        description={
          selectedStatus === "hidden"
            ? isRtl
              ? "كافة الصفحات في الموقع حالياً تعمل ومتاحة للزوار بدون أخطاء 404."
              : "All website pages are currently live online or undergoing maintenance. None are set to 404 Hidden."
            : isRtl
            ? "جرب إزالة فلاتر البحث أو تغيير القسم المحدد."
            : "Try adjusting your search criteria or resetting active filters."
        }
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-1.5 rounded-xl cursor-pointer"
          >
            <LuRotateCcw className="w-3.5 h-3.5" />
            <span>{isRtl ? "عرض كافة الصفحات" : "Show All Pages"}</span>
          </Button>
        }
      />
    );
  }

  return (
    <Card className="border border-border/80 overflow-hidden rounded-2xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
              <th className="py-3 px-4 text-start w-10">
                <input
                  type="checkbox"
                  checked={pages.length > 0 && selectedIds.length === pages.length}
                  onChange={onToggleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 text-start">{isRtl ? "الصفحة والمسار" : "Page & Route"}</th>
              <th className="py-3 px-4 text-start hidden sm:table-cell">{isRtl ? "القسم" : "Family"}</th>
              <th className="py-3 px-4 text-start">{isRtl ? "حالة الظهور" : "Live Status"}</th>
              <th className="py-3 px-4 text-center">{isRtl ? "القائمة العلوية" : "Navbar"}</th>
              <th className="py-3 px-4 text-center">{isRtl ? "تذييل الموقع" : "Footer"}</th>
              <th className="py-3 px-4 text-end">{isRtl ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pages.map((page) => {
              const FamilyIcon = getFamilyIcon(page.family);
              const isSelected = selectedIds.includes(page.id);
              const title = isRtl ? page.titleAr : page.titleEn;
              const isBusy = isUpdating === page.id;

              return (
                <tr
                  key={page.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    isSelected ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3.5 px-4 text-start">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(page.id)}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Page & Route */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center shrink-0 text-muted-foreground">
                        <FamilyIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">
                            {title}
                          </span>
                          {page.isProtected && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border">
                              {isRtl ? "أساسي" : "Core"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <code className="text-[11px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                            {page.path}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(page.path)}
                            title="Copy path"
                            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
                          >
                            {copiedPath === page.path ? (
                              <LuCheck className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <LuCopy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Family */}
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <Badge variant="outline" className="text-[11px] capitalize border-border">
                      {page.family}
                    </Badge>
                  </td>

                  {/* Status Selector */}
                  <td className="py-3.5 px-4">
                    <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onStatusChange(page.id, "live")}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                          page.status === "live"
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${page.status === "live" ? "bg-white" : "bg-emerald-500"}`} />
                        <span>{isRtl ? "نشط" : "Live"}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onStatusChange(page.id, "maintenance")}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                          page.status === "maintenance"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${page.status === "maintenance" ? "bg-white" : "bg-amber-500"}`} />
                        <span>{isRtl ? "صيانة" : "Maint"}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onStatusChange(page.id, "hidden")}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                          page.status === "hidden"
                            ? "bg-rose-500 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${page.status === "hidden" ? "bg-white" : "bg-rose-500"}`} />
                        <span>{isRtl ? "مخفي" : "Hidden"}</span>
                      </button>
                    </div>
                  </td>

                  {/* Navbar Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onToggleNavbar(page)}
                      className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center cursor-pointer ${
                        page.showInNavbar
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                      title={page.showInNavbar ? "Visible in Navbar" : "Hidden in Navbar"}
                    >
                      {page.showInNavbar ? (
                        <LuEye className="w-4 h-4" />
                      ) : (
                        <LuEyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Footer Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onToggleFooter(page)}
                      className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center cursor-pointer ${
                        page.showInFooter
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                      title={page.showInFooter ? "Visible in Footer" : "Hidden in Footer"}
                    >
                      {page.showInFooter ? (
                        <LuEye className="w-4 h-4" />
                      ) : (
                        <LuEyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit Notice */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenEdit(page)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
                        title={isRtl ? "تعديل إشعار الصيانة" : "Edit maintenance notice"}
                      >
                        <LuSettings2 className="w-3.5 h-3.5" />
                      </Button>

                      {/* Open Live Preview */}
                      <Link
                        href={page.path}
                        target="_blank"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        title={isRtl ? "معاينة الصفحة" : "Preview page"}
                      >
                        <LuExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
