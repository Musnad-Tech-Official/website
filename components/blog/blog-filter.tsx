"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuSearch, LuX, LuRotateCcw } from "react-icons/lu";
import type { BlogFilterProps } from "./blog-types";
import { cn } from "@/lib/utils";

export function BlogFilter({
  filterState,
  onFilterChange,
  onReset,
  className = "",
}: BlogFilterProps) {
  const t = useTranslations("Blog.filters");

  const hasActiveFilters = Boolean(filterState.search.trim());

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs p-4 sm:p-5 mb-8 sm:mb-10 shadow-xs transition-colors",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Search input */}
        <div className="flex-1">
          <Input
            type="search"
            value={filterState.search}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            leftIcon={<LuSearch className="h-4 w-4" aria-hidden="true" />}
            rightIcon={
              filterState.search ? (
                <button
                  type="button"
                  onClick={() => onFilterChange("")}
                  className="cursor-pointer text-muted-foreground hover:text-foreground p-0.5"
                  aria-label={t("clearSearch")}
                >
                  <LuX className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
            aria-label={t("searchPlaceholder")}
            className="h-10 bg-background text-sm rounded-lg"
          />
        </div>

        {/* Clear Filters Button if search active */}
        {hasActiveFilters && onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5 self-center shrink-0 cursor-pointer"
          >
            <LuRotateCcw className="h-3.5 w-3.5" />
            <span>{t("clearFilters")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
