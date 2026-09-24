import type React from "react";

/**
 * Frontend contract for an individual capability pill/row item.
 */
export interface CapabilityItem {
  id: string;
  translationKey: string;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

/**
 * Frontend contract for previewing a related project in the primary preview grid.
 */
export interface ProjectPreviewData {
  id: string;
  slug: string;
  itemKey: string;
  year: string;
  featured?: boolean;
  liveDemo?: boolean;
  technologies: string[];
  rating: number;
  reviewCount: number;
  gradient?: string;
  href: string;
  status?: "completed" | "inDevelopment" | string;
}

/**
 * Frontend contract for a project related by common technology.
 */
export interface RelatedTechProject {
  id: string;
  slug: string;
  itemKey: string;
  year: string;
  categoryKey?: string;
  technologies: string[];
  href: string;
}

/**
 * Frontend contract for another service related by common technology.
 */
export interface RelatedTechService {
  id: string;
  slug: string;
  serviceKey: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  technologies: string[];
  href: string;
}

/**
 * Complete typed data schema for a Service Detail page configuration.
 */
export interface ServiceDetailData {
  slug: string;
  translationKey: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  technologies: string[];
  capabilities: CapabilityItem[];
  relatedProjects: ProjectPreviewData[];
  relatedByTechnology: {
    projects: RelatedTechProject[];
    services: RelatedTechService[];
  };
}

/**
 * Props for ServiceDetailIntro.
 */
export interface ServiceDetailIntroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  homeLabel: string;
  servicesLabel: string;
  breadcrumbLabel?: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  className?: string;
}

/**
 * Props for ServiceOverview.
 */
export interface ServiceOverviewProps {
  statement: string;
  className?: string;
}

/**
 * Props for ServiceCapabilities.
 */
export interface ServiceCapabilitiesProps {
  eyebrow: string;
  heading: string;
  capabilities: Array<{
    id: string;
    title: string;
    icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  }>;
  className?: string;
}

/**
 * Props for ServiceDetailSidebar.
 */
export interface ServiceDetailSidebarProps {
  onThisPageLabel: string;
  overviewLabel: string;
  capabilitiesLabel: string;
  relatedProjectsLabel: string;
  serviceTitle: string;
  serviceDescription: string;
  ctaLabel: string;
  relatedTechnologiesLabel: string;
  technologies: string[];
  className?: string;
}

/**
 * Props for ServiceProjectCard.
 */
export interface ServiceProjectCardProps {
  project: ProjectPreviewData;
  title: string;
  category: string;
  description: string;
  featuredLabel: string;
  liveDemoLabel: string;
  completedLabel: string;
  statusLabel?: string;
  className?: string;
}

/**
 * Props for RelatedProjects.
 */
export interface RelatedProjectsProps {
  eyebrow: string;
  heading: string;
  projects: ProjectPreviewData[];
  featuredLabel: string;
  liveDemoLabel: string;
  completedLabel: string;
  inDevelopmentLabel?: string;
  getProjectTranslations: (itemKey: string) => {
    title: string;
    category: string;
    description: string;
  };
  className?: string;
}

/**
 * Props for RelatedByTechnology.
 */
export interface RelatedByTechnologyProps {
  eyebrow: string;
  heading: string;
  projectsEyebrow: string;
  servicesEyebrow: string;
  projects: RelatedTechProject[];
  services: RelatedTechService[];
  getProjectTranslations: (itemKey: string) => {
    title: string;
    category: string;
  };
  getServiceTranslations: (serviceKey: string) => {
    title: string;
    description: string;
  };
  className?: string;
}

/**
 * Props for the root ServiceDetailTemplate orchestrator.
 */
export interface ServiceDetailTemplateProps {
  serviceData: ServiceDetailData;
  locale: string;
}
