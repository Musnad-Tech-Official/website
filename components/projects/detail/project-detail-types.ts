import type {
  ProjectDetailAction,
  ProjectDetailBadge,
  ProjectDetailComment,
  ProjectDetailContextCard,
  ProjectDetailContributor,
  ProjectDetailFeature,
  ProjectDetailGalleryItem,
  ProjectDetailMetaItem,
  ProjectDetailMetric,
  ProjectDetailRatingSummary,
  ProjectDetailTool,
  ProjectDetailData,
} from "@/data/project-details";
import type { Project } from "@/data/projects";

export type {
  ProjectDetailAction,
  ProjectDetailBadge,
  ProjectDetailComment,
  ProjectDetailContextCard,
  ProjectDetailContributor,
  ProjectDetailFeature,
  ProjectDetailGalleryItem,
  ProjectDetailMetaItem,
  ProjectDetailMetric,
  ProjectDetailRatingSummary,
  ProjectDetailTool,
  ProjectDetailData,
  Project,
};

export interface ProjectDetailHeaderProps {
  title: string;
  subtitle: string;
  eyebrowBadges?: ProjectDetailBadge[];
  actions?: ProjectDetailAction[];
  metaBar?: ProjectDetailMetaItem[];
  homeLabel: string;
  projectsLabel: string;
  breadcrumbLabel?: string;
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
