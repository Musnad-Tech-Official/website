"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ProjectsFilter } from "./projects-filter";
import { ProjectsGrid } from "./projects-grid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LuSearch, LuRotateCcw } from "react-icons/lu";
import type {
  ProjectsExplorerProps,
  ProjectFilterState,
} from "./projects-types";

const INITIAL_FILTER_STATE: ProjectFilterState = {
  search: "",
  sortBy: "default",
};

export function ProjectsExplorer({
  projects,
  locale,
  className = "",
}: ProjectsExplorerProps) {
  const t = useTranslations("Projects.filters");
  const [filterState, setFilterState] =
    useState<ProjectFilterState>(INITIAL_FILTER_STATE);

  const handleFilterChange = <K extends keyof ProjectFilterState>(
    key: K,
    value: ProjectFilterState[K]
  ) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilterState(INITIAL_FILTER_STATE);
  };

  // Apply search query and sorting
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search query filter
    const query = filterState.search.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      });
    }

    // Sorting
    if (filterState.sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [projects, filterState]);

  return (
    <div className={className}>
      {/* Search and Sort Controls */}
      <ProjectsFilter
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        totalCount={filteredProjects.length}
      />

      {/* Projects List or Empty State */}
      {filteredProjects.length > 0 ? (
        <ProjectsGrid projects={filteredProjects} locale={locale} />
      ) : (
        <EmptyState
          icon={<LuSearch className="h-6 w-6" aria-hidden="true" />}
          title={t("noResultsTitle")}
          description={t("noResultsDescription")}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 rounded-lg cursor-pointer"
            >
              <LuRotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("clearFilters")}</span>
            </Button>
          }
        />
      )}
    </div>
  );
}
