"use client";

import { LuSearch, LuX, LuPlus, LuFilter, LuChevronDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import type { ArticleStatus } from "@/lib/articles/types";

export interface ArticleFiltersState {
  search: string;
  status: "all" | ArticleStatus;
  category: string;
}

interface ArticlesFiltersProps {
  filters: ArticleFiltersState;
  onFiltersChange: (filters: ArticleFiltersState) => void;
  onNewArticle: () => void;
  categories: string[];
  counts: {
    total: number;
    published: number;
    draft: number;
  };
  isRtl: boolean;
}

export function ArticlesFilters({
  filters,
  onFiltersChange,
  onNewArticle,
  categories,
  counts,
  isRtl,
}: ArticlesFiltersProps) {
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
                ? "ابحث بعنوان المقال، المسار، أو الوسم..."
                : "Search articles by title, slug, or tag..."
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

        {/* Filters Group: Status Tabs + Category Select + New Article Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-muted/20 border border-border/70 text-xs h-9">
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, status: "all" })}
              className={`h-8 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                filters.status === "all"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isRtl ? "الكل" : "All"} ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, status: "published" })}
              className={`h-8 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                filters.status === "published"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isRtl ? "منشور" : "Published"} ({counts.published})
            </button>
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, status: "draft" })}
              className={`h-8 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                filters.status === "draft"
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isRtl ? "مسودة" : "Draft"} ({counts.draft})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <LuFilter className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={filters.category}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
              className="h-9 ps-7 pe-7 bg-muted/20 border border-border/70 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary appearance-none cursor-pointer"
            >
              <option value="all">{isRtl ? "كافة التصنيفات" : "All Categories"}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <LuChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Create Article Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={onNewArticle}
            className="h-9 px-3.5 text-xs gap-1.5 rounded-lg cursor-pointer font-semibold shadow-xs"
          >
            <LuPlus className="w-4 h-4" />
            <span>{isRtl ? "مقال جديد" : "New Article"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
