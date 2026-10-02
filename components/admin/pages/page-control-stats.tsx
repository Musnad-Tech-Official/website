"use client";

import {
  LuGlobe,
  LuCircleCheck,
  LuEyeOff,
  LuWrench,
  LuLayers,
  LuLayoutGrid,
} from "react-icons/lu";

interface PageControlStatsProps {
  stats: {
    total: number;
    live: number;
    maintenance: number;
    hidden: number;
    inNavbar: number;
    inFooter: number;
  };
  selectedStatus: string;
  selectedFamily: string;
  onSelectStatus: (status: string) => void;
  onSelectFamily: (family: string) => void;
  isRtl: boolean;
}

export function PageControlStats({
  stats,
  selectedStatus,
  selectedFamily,
  onSelectStatus,
  onSelectFamily,
  isRtl,
}: PageControlStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Pages */}
      <button
        type="button"
        onClick={() => {
          onSelectStatus("all");
          onSelectFamily("all");
        }}
        className={`text-start rounded-xl p-3 border transition-all duration-200 cursor-pointer ${
          selectedStatus === "all" && selectedFamily === "all"
            ? "bg-primary/10 border-primary/50 text-foreground ring-1 ring-primary/30 shadow-xs"
            : "bg-card border-border/70 hover:border-border hover:bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <LuGlobe className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-muted-foreground font-medium truncate">
            {isRtl ? "إجمالي الصفحات" : "Total Pages"}
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">
          {stats.total}
        </div>
      </button>

      {/* Live Online */}
      <button
        type="button"
        onClick={() => onSelectStatus(selectedStatus === "live" ? "all" : "live")}
        className={`text-start rounded-xl p-3 border transition-all duration-200 cursor-pointer ${
          selectedStatus === "live"
            ? "bg-emerald-500/10 border-emerald-500/50 text-foreground ring-1 ring-emerald-500/30 shadow-xs"
            : "bg-card border-border/70 hover:border-emerald-500/30 hover:bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <LuCircleCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs text-muted-foreground font-medium truncate">
            {isRtl ? "صفحات نشطة" : "Live Online"}
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">
          {stats.live}
        </div>
      </button>

      {/* Maintenance */}
      <button
        type="button"
        onClick={() =>
          onSelectStatus(selectedStatus === "maintenance" ? "all" : "maintenance")
        }
        className={`text-start rounded-xl p-3 border transition-all duration-200 cursor-pointer ${
          selectedStatus === "maintenance"
            ? "bg-amber-500/10 border-amber-500/50 text-foreground ring-1 ring-amber-500/30 shadow-xs"
            : "bg-card border-border/70 hover:border-amber-500/30 hover:bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <LuWrench className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs text-muted-foreground font-medium truncate">
            {isRtl ? "قيد الصيانة" : "Maintenance"}
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">
          {stats.maintenance}
        </div>
      </button>

      {/* Hidden (404) */}
      <button
        type="button"
        onClick={() =>
          onSelectStatus(selectedStatus === "hidden" ? "all" : "hidden")
        }
        className={`text-start rounded-xl p-3 border transition-all duration-200 cursor-pointer ${
          selectedStatus === "hidden"
            ? "bg-rose-500/10 border-rose-500/50 text-foreground ring-1 ring-rose-500/30 shadow-xs"
            : "bg-card border-border/70 hover:border-rose-500/30 hover:bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <LuEyeOff className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="text-xs text-muted-foreground font-medium truncate">
            {isRtl ? "مخفية (404)" : "Hidden (404)"}
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">
          {stats.hidden}
        </div>
      </button>

      {/* In Navbar */}
      <div className="rounded-xl p-3 border border-border/70 bg-card">
        <div className="flex items-center gap-2">
          <LuLayers className="w-4 h-4 text-sky-500 shrink-0" />
          <span className="text-xs text-muted-foreground font-medium truncate">
            {isRtl ? "في القائمة العلوية" : "In Navbar"}
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">
          {stats.inNavbar}
        </div>
      </div>

      {/* In Footer */}
      <div className="rounded-xl p-3 border border-border/70 bg-card">
        <div className="flex items-center gap-2">
          <LuLayoutGrid className="w-4 h-4 text-purple-500 shrink-0" />
          <span className="text-xs text-muted-foreground font-medium truncate">
            {isRtl ? "في تذييل الموقع" : "In Footer"}
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">
          {stats.inFooter}
        </div>
      </div>
    </div>
  );
}
