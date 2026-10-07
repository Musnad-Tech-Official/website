import type { Project } from "../projects-types";
import type { ArticleComment } from "@/lib/comments/types";

export interface ProjectDetailBadge {
  label: string;
  variant?: "default" | "secondary" | "outline" | "accent";
}

export interface ProjectDetailAction {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  isExternal?: boolean;
}

export interface ProjectDetailMetaItem {
  id: string;
  label: string;
  value: string;
  iconType: "user" | "calendar" | "layer" | "tag" | "code";
}

export interface ProjectDetailMetric {
  id: string;
  value: string;
  label: string;
  description?: string;
}

export interface ProjectDetailContextCard {
  id: string;
  title: string;
  iconType: "alert" | "target" | "check";
  description?: string;
  items?: string[];
}

export interface ProjectDetailFeature {
  id: string;
  title: string;
  description: string;
  iconType: "speed" | "shield" | "refresh" | "scale";
}

export interface ProjectDetailGalleryItem {
  id: string;
  title: string;
  caption: string;
  aspectRatio?: string;
}

export interface ProjectDetailContributor {
  id: string;
  name: string;
  role: string;
  initials: string;
  href?: string;
}

export interface ProjectDetailTool {
  id: string;
  name: string;
  category: string;
  description: string;
  iconType: "terminal" | "database" | "server" | "cloud" | "code" | "tool";
  href?: string;
}

export interface ProjectDetailComment {
  id: string;
  authorName: string;
  authorRole?: string;
  initials: string;
  timestamp: string;
  content: string;
  replies?: ProjectDetailComment[];
}

export interface ProjectDetailRatingSummary {
  average: number;
  totalCount: number;
  distribution: { stars: number; count: number; percentage: number }[];
}

export interface ProjectDetailData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  eyebrowBadges?: ProjectDetailBadge[];
  actions?: ProjectDetailAction[];
  metaBar?: ProjectDetailMetaItem[];
  overview?: {
    title: string;
    paragraphs: string[];
    metrics?: ProjectDetailMetric[];
  };
  context?: {
    title: string;
    cards: ProjectDetailContextCard[];
  };
  features?: {
    title: string;
    items: ProjectDetailFeature[];
  };
  gallery?: {
    title: string;
    items: ProjectDetailGalleryItem[];
  };
  team?: {
    title: string;
    contributors: ProjectDetailContributor[];
  };
  tools?: {
    title: string;
    items: ProjectDetailTool[];
  };
  relatedSlugs?: string[];
}

export type { Project };

export interface ProjectDetailHeaderProps {
  title: string;
  subtitle?: string;
  eyebrowBadges?: ProjectDetailBadge[];
  actions?: ProjectDetailAction[];
  metaBar?: ProjectDetailMetaItem[];
  homeLabel: string;
  projectsLabel: string;
  breadcrumbLabel?: string;
  image?: string;
  gradient?: string;
  category?: string;
  clientName?: string;
  year?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  liveDemoLabel?: string;
  repositoryLabel?: string;
  technologies?: string[];
  className?: string;
}

export interface ProjectDetailOverviewProps {
  title: string;
  paragraphs: string[];
  metrics?: ProjectDetailMetric[];
  className?: string;
}

export interface ProjectDetailContextProps {
  title: string;
  cards: ProjectDetailContextCard[];
  className?: string;
}

export interface ProjectDetailSolutionProps {
  title: string;
  description?: string;
  features?: ProjectDetailFeature[];
  highlight?: {
    title: string;
    description: string;
  };
  className?: string;
}

export interface ProjectDetailGalleryProps {
  title: string;
  items: ProjectDetailGalleryItem[];
  previewPrefix?: string;
  className?: string;
}

export interface ProjectDetailContributorsProps {
  title: string;
  members: ProjectDetailContributor[];
  className?: string;
}

export interface ProjectDetailRelatedProps {
  title: string;
  projects: Project[];
  locale?: string;
  className?: string;
}

export interface ProjectTableOfContentsItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

export interface ProjectTableOfContentsProps {
  items: ProjectTableOfContentsItem[];
  title?: string;
  onThisPageText?: string;
  sectionsCountLabel?: string;
  toggleOpenLabel?: string;
  toggleCloseLabel?: string;
  className?: string;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Frontend UX eligibility contract for project ratings and comments.
 *
 * ============================================================================
 * SECURITY BOUNDARY NOTICE:
 * Frontend gating is UX only.
 * The real security enforcement must later happen in the Backend / Supabase RLS
 * layer using:
 *   authenticated user ID + project ID + verified project experience record.
 * The frontend must never be treated as the security boundary.
 *
 * FUTURE BACKEND FLOW:
 *   Clerk authenticated user
 *   → project resolved by slug
 *   → backend obtains stable project ID
 *   → backend checks verified project experience
 *   → backend returns interaction eligibility
 *   → Project Detail UI enables/disables Rating and Comments
 * ============================================================================
 */
export interface ProjectInteractionEligibility {
  isAuthenticated: boolean;
  hasVerifiedExperience: boolean;
  canRate: boolean;
  canComment: boolean;
  reason: "signed_out" | "experience_required" | "eligible";
}

export interface ProjectDetailEligibilityMessages {
  signedOut: string;
  signIn: string;
  experienceRequired: string;
  experienceRequiredSecondary?: string;
}

export interface ProjectDetailRatingProps {
  title: string;
  subtitle?: string;
  ratePrompt?: string;
  summary?: ProjectDetailRatingSummary;
  submitLabel?: string;
  ratingsLabel?: string;
  integrationNotice?: string;
  previewNotice?: string;
  eligibility?: ProjectInteractionEligibility;
  eligibilityMessages?: ProjectDetailEligibilityMessages;
  onSubmitRating?: (rating: number) => void;
  className?: string;
}

export interface ProjectDetailCommentsProps {
  title: string;
  projectSlug?: string;
  projectId?: string;
  initialComments?: ArticleComment[];
  placeholder?: string;
  submitLabel?: string;
  replyLabel?: string;
  emptyMessage?: string;
  integrationNotice?: string;
  items?: ProjectDetailComment[];
  eligibility?: ProjectInteractionEligibility;
  eligibilityMessages?: ProjectDetailEligibilityMessages;
  onSubmitComment?: (commentText: string) => void;
  className?: string;
}

export interface ProjectDetailToolsProps {
  title: string;
  subtitle?: string;
  items: ProjectDetailTool[];
  className?: string;
}
