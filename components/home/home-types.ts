import type { ComponentType } from "react";

export interface TrustedCompany {
  id: string;
  name: string;
  letter: string;
}

export interface CapabilityCardData {
  id: string;
  serviceKey: string;
  icon: ComponentType<{ className?: string }>;
  tags: string[];
  href: string;
}

export interface ProjectCardData {
  id: string;
  slug: string;
  itemKey: string;
  year: string;
  featured: boolean;
  liveDemo: boolean;
  technologies: string[];
  rating: number;
  reviewCount: number;
  gradient: string;
  href: string;
}

export interface TeamMemberData {
  id: string;
  memberKey: string;
  initials: string;
  skills: string[];
  bannerGradient: string;
}

export type TechCategory =
  | "language"
  | "framework"
  | "database"
  | "infrastructure"
  | "tooling";

export interface TechnologyItem {
  id: string;
  name: string;
  category: TechCategory;
  dotColor: string;
}

export interface TestimonialData {
  id: string;
  itemKey: string;
  initial: string;
}

export interface TrustMetricData {
  id: string;
  metricKey: string;
  icon: ComponentType<{ className?: string }>;
}

export interface InsightArticleData {
  id: string;
  slug: string;
  articleKey: string;
  readTime: number;
  isTrending: boolean;
  tags: string[];
  timeAgo?: string;
  previewGradient: string;
  href: string;
}
