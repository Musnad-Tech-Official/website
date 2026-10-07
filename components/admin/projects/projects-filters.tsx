"use client";

import { LuSearch, LuX, LuPlus, LuChevronDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import type { ProjectStatus } from "@/lib/projects/types";

export interface ProjectFiltersState {
  search: string;
  status: "all" | ProjectStatus;
  category: string;
}

interface ProjectsFiltersProps {
  filters: ProjectFiltersState;
  onFiltersChange: (filters: ProjectFiltersState) => void;
  onNewProject: () => void;
  categories: string[];
  counts: {
    total: number;
    published: number;
    draft: number;
  };
  isRtl: boolean;
}

export function ProjectsFilters({
  filters,
  onFiltersChange,
  onNewProject,
  categories,
  counts,
  isRtl,
}: ProjectsFiltersProps) {
  return (
    <div className="rounded-xl border border-border/70 shadow-xs bg-card p-3 sm:px-4 sm:py-3 space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <LuSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder={
              isRtl
                ? "ابحث باسم المشروع، المسار، أو التقنية..."
                : "Search projects by title, slug, or tech..."
            }
            className="w-full h-9 ps-8 pe-8 bg-muted/20 border border-border/70 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, search: "" })}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-md cursor-pointer"
            >
              <LuX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="inline-flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/30">
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, status: "all" })}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                filters.status === "all"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isRtl ? "الكل" : "All"} ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, status: "published" })}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                filters.status === "published"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isRtl ? "منشور" : "Published"} ({counts.published})
            </button>
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, status: "draft" })}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                filters.status === "draft"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isRtl ? "مسودة" : "Draft"} ({counts.draft})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
              className="h-8.5 appearance-none ps-2.5 pe-7 text-xs rounded-lg border border-border/70 bg-card text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              <option value="all">{isRtl ? "جميع التصنيفات" : "All Categories"}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <LuChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          {/* Create Button */}
          <Button
            onClick={onNewProject}
            size="sm"
            className="gap-1.5 text-xs h-8.5 px-3 rounded-lg font-semibold shadow-xs cursor-pointer"
          >
            <LuPlus className="w-3.5 h-3.5" />
            <span>{isRtl ? "مشروع جديد" : "New Project"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
