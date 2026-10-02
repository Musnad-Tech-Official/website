"use client";

import {
  LuSearch,
  LuX,
  LuFilter,
  LuChevronDown,
  LuRotateCcw,
} from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PageStatus } from "@/lib/page-control/types";

interface PageControlFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  selectedFamily: string;
  onSelectFamily: (family: string) => void;
  stats: {
    total: number;
    live: number;
    maintenance: number;
    hidden: number;
  };
  selectedCount: number;
  onBatchStatus: (status: PageStatus) => void;
  onDeselectAll: () => void;
  onReset: () => void;
  isRtl: boolean;
}

export function PageControlFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onSelectStatus,
  selectedFamily,
  onSelectFamily,
  stats,
  selectedCount,
  onBatchStatus,
  onDeselectAll,
  onReset,
  isRtl,
}: PageControlFiltersProps) {
  return (
    <Card className="border border-border/70 shadow-xs bg-card p-3 sm:px-4 sm:py-3 space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <LuSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isRtl
                  ? "ابحث باسم الصفحة، المسار، أو المعرف..."
                  : "Search page by title, route path, or slug..."
              }
              className="w-full h-9 ps-8 pe-8 bg-muted/20 border border-border/70 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-md cursor-pointer"
              >
                <LuX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Group: Segmented Status Tabs + Family Dropdown + Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Segmented Status Tabs */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-muted/20 border border-border/70 text-xs h-9">
              <button
                type="button"
                onClick={() => onSelectStatus("all")}
                className={`h-8 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                  selectedStatus === "all"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isRtl ? "الكل" : "All"} ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => onSelectStatus("live")}
                className={`h-8 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                  selectedStatus === "live"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isRtl ? "نشط" : "Live"} ({stats.live})
              </button>
              <button
                type="button"
                onClick={() => onSelectStatus("maintenance")}
                className={`h-8 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                  selectedStatus === "maintenance"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isRtl ? "صيانة" : "Maint"} ({stats.maintenance})
              </button>
              <button
                type="button"
                onClick={() => onSelectStatus("hidden")}
                className={`h-8 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                  selectedStatus === "hidden"
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isRtl ? "مخفي" : "Hidden"} ({stats.hidden})
              </button>
            </div>

            {/* Styled Family Select Dropdown */}
            <div className="relative">
              <LuFilter className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={selectedFamily}
                onChange={(e) => onSelectFamily(e.target.value)}
                className="h-9 ps-7 pe-7 bg-muted/20 border border-border/70 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="all">{isRtl ? "كافة الأقسام" : "All Families"}</option>
                <option value="marketing">{isRtl ? "التسويق والرئيسية" : "Marketing"}</option>
                <option value="services">{isRtl ? "الخدمات" : "Services"}</option>
                <option value="projects">{isRtl ? "المشاريع" : "Projects"}</option>
                <option value="blog">{isRtl ? "المدونة" : "Blog"}</option>
                <option value="careers">{isRtl ? "الوظائف" : "Careers"}</option>
                <option value="support">{isRtl ? "الدعم والتواصل" : "Support & FAQ"}</option>
                <option value="legal">{isRtl ? "الصفحات القانونية" : "Legal"}</option>
                <option value="account">{isRtl ? "بوابة الحساب" : "Account"}</option>
              </select>
              <LuChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Reset to defaults button */}
            <button
              type="button"
              onClick={onReset}
              className="h-9 px-3 text-xs gap-1.5 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground font-medium cursor-pointer transition-colors flex items-center"
              title={isRtl ? "إعادة تعيين كافة الإعدادات إلى الوضع الافتراضي" : "Reset all pages to defaults"}
            >
              <LuRotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? "إعادة ضبط" : "Reset"}</span>
            </button>
          </div>
        </div>

        {/* Batch Action Bar (if any rows selected) */}
        {selectedCount > 0 && (
          <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 bg-primary/5 border-primary/20 p-2.5 rounded-xl text-xs animate-in fade-in-50">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {isRtl
                ? `تم تحديد ${selectedCount} صفحة:`
                : `${selectedCount} pages selected:`}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBatchStatus("live")}
                className="h-7 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer rounded-lg"
              >
                {isRtl ? "تحويل إلى نشط (Live)" : "Set to Live"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBatchStatus("maintenance")}
                className="h-7 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer rounded-lg"
              >
                {isRtl ? "تحويل إلى صيانة" : "Set to Maintenance"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBatchStatus("hidden")}
                className="h-7 text-xs border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer rounded-lg"
              >
                {isRtl ? "إخفاء (404)" : "Set to Hidden"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDeselectAll}
                className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
              >
                {isRtl ? "إلغاء التحديد" : "Deselect"}
              </Button>
            </div>
          </div>
        )}
    </Card>
  );
}
