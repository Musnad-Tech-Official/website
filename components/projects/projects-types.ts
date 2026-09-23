import type { Project } from "@/data/projects";

export interface ProjectsHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  homeLabel: string;
  projectsLabel: string;
  breadcrumbLabel?: string;
  className?: string;
}

export interface ProjectCardProps {
  project: Project;
  locale?: string;
  className?: string;
}

export interface ProjectsGridProps {
  projects: Project[];
  locale?: string;
  className?: string;
}

export interface ProjectFilterState {
  search: string;
  sortBy: "default" | "title";
}

export interface ProjectsFilterProps {
  filterState: ProjectFilterState;
  onFilterChange: <K extends keyof ProjectFilterState>(
    key: K,
    value: ProjectFilterState[K]
  ) => void;
  onReset: () => void;
  totalCount: number;
  className?: string;
}

export interface ProjectsExplorerProps {
  projects: Project[];
  locale?: string;
  className?: string;
}

export interface ProjectsCtaProps {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  contactHref?: string;
  className?: string;
}
