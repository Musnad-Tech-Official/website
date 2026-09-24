import type { ComponentType } from "react";

export interface TrustedCompany {
  id: string;
  name: string;
  logo: string;
}

export interface CapabilityCardData {
  id: string;
  serviceKey: string;
  icon: ComponentType<{ className?: string }>;
  tags: string[];
  href: string;
}

export interface TestimonialData {
  id: string;
  itemKey: string;
  initial: string;
}

export interface InsightArticleData {
  id: string;
  slug: string;
  articleKey: string;
  readTime: number;
  isTrending: boolean;
  tags: string[];
  timeAgo?: string;
  date?: string;
  authorInitials?: string;
  previewGradient: string;
  href: string;
}
