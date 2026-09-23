"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LuSearch, LuX } from "react-icons/lu";
import type { ProjectsFilterProps } from "./projects-types";
import { cn } from "@/lib/utils";


export function ProjectsFilter({
  filterState,
  onFilterChange,
  onReset,
  totalCount,
  className = "",
}: ProjectsFilterProps) {
  const t = useTranslations("Projects.filters");

  const hasActiveFilters =
    Boolean(filterState.search.trim()) || filterState.sortBy !== "default";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs p-4 sm:p-5 mb-8 sm:mb-10 shadow-xs transition-colors",
        className
      )}
    >
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Search input */}
        <div className="flex-1">
          <Input
            type="search"
            value={filterState.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder={t("searchPlaceholder")}
            leftIcon={<LuSearch className="h-4 w-4" aria-hidden="true" />}
            rightIcon={
              filterState.search ? (
                <button
                  type="button"
                  onClick={() => onFilterChange("search", "")}
                  className="cursor-pointer text-muted-foreground hover:text-foreground p-0.5"
                  aria-label="Clear search"
                >
                  <LuX className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
            aria-label={t("searchPlaceholder")}
            className="h-10 bg-background text-sm rounded-lg"
          />
        </div>

        {/* Sort by Select */}
        <div className="w-full sm:w-48 shrink-0">
          <Select
            value={filterState.sortBy}
            onChange={(e) =>
              onFilterChange(
                "sortBy",
                e.target.value as ProjectsFilterProps["filterState"]["sortBy"]
              )
            }
            aria-label={t("sortBy")}
            className="h-10 bg-background text-xs sm:text-sm rounded-lg"
          >
            <option value="default">{t("sortDefault")}</option>
            <option value="title">{t("sortAlphabetical")}</option>
          </Select>
        </div>
      </div>

      {/* Bottom Summary & Clear Row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40 text-xs sm:text-sm text-muted-foreground">
        <span className="font-medium text-foreground/80">
          {t("projectsCount", { count: totalCount })}
        </span>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
          >
            <LuX className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t("clearFilters")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
