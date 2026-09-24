import { PROJECTS_EN, PROJECTS_AR } from "@/data/projects";

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
  solution?: {
    title: string;
    description?: string;
    features?: ProjectDetailFeature[];
    highlight?: {
      title: string;
      description: string;
    };
  };
  gallery?: {
    title: string;
    items: ProjectDetailGalleryItem[];
  };
  contributors?: {
    title: string;
    members: ProjectDetailContributor[];
  };
  relatedProjectsHeading?: string;
  ratingConfig?: {
    title: string;
    subtitle: string;
    ratePrompt: string;
    summary?: ProjectDetailRatingSummary;
  };
  commentsConfig?: {
    title: string;
    placeholder: string;
    submitLabel: string;
    replyLabel: string;
    emptyMessage: string;
    items?: ProjectDetailComment[];
  };
  tools?: {
    title: string;
    subtitle?: string;
    items: ProjectDetailTool[];
  };
  cta?: {
    title: string;
    subtitle: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}

// ---------------------------------------------------------------------------
// 1. Sahim Analytics (Case Study Structural Presentation)
// ---------------------------------------------------------------------------

export const SAHIM_DETAIL_EN: ProjectDetailData = {
  id: "proj-sahim-analytics-001",
  slug: "sahim-analytics",
  title: "Sahim Analytics",
  subtitle: "Explore the Sahim Analytics project case study.",
  eyebrowBadges: [
    { label: "Case Study", variant: "secondary" },
    { label: "Project Detail", variant: "outline" },
  ],
  actions: [
    { label: "Discuss Project", href: "/contact", variant: "primary" },
    { label: "View All Projects", href: "/projects", variant: "outline" },
  ],
  metaBar: [
    { id: "format", label: "Format", value: "Case Study Overview", iconType: "tag" },
    { id: "nature", label: "Case Study", value: "Technical Overview", iconType: "calendar" },
  ],
  overview: {
    title: "Overview",
    paragraphs: [
      "Explore the Sahim Analytics project case study.",
      "This section will present approved project details when verified content is connected.",
    ],
  },
  context: {
    title: "Context",
    cards: [
      {
        id: "problem",
        title: "Challenge",
        iconType: "alert",
        description: "This section will present approved project context when verified content is connected.",
      },
      {
        id: "goals",
        title: "Objectives",
        iconType: "target",
        description: "This section will present approved project objectives when verified content is connected.",
      },
      {
        id: "scope",
        title: "Scope",
        iconType: "check",
        description: "This section will present approved project scope when verified content is connected.",
      },
    ],
  },
  solution: {
    title: "Solution",
    description: "This section will present approved solution details when verified content is connected.",
  },
  gallery: {
    title: "Gallery",
    items: [
      {
        id: "slide-1",
        title: "Interface Preview",
        caption: "Structural media placeholder for verified project visual assets.",
      },
      {
        id: "slide-2",
        title: "Layout Structure",
        caption: "Structural media placeholder for verified project visual assets.",
      },
      {
        id: "slide-3",
        title: "Component Organization",
        caption: "Structural media placeholder for verified project visual assets.",
      },
    ],
  },
  ratingConfig: {
    title: "Rate this project",
    subtitle: "Share your rating for this project case study.",
    ratePrompt: "Select your rating:",
  },
  commentsConfig: {
    title: "Comments",
    placeholder: "Write a thoughtful comment or question about this project...",
    submitLabel: "Post comment",
    replyLabel: "Reply",
    emptyMessage: "No comments yet.",
    items: [],
  },
  cta: {
    title: "Have a project in mind?",
    subtitle: "Tell us about what you want to build.",
    primaryLabel: "Start a project inquiry",
    secondaryLabel: "Explore all projects",
  },
};

export const SAHIM_DETAIL_AR: ProjectDetailData = {
  id: "proj-sahim-analytics-001",
  slug: "sahim-analytics",
  title: "سهم للتحليلات",
  subtitle: "استعرض دراسة مشروع سهم للتحليلات.",
  eyebrowBadges: [
    { label: "دراسة حالة", variant: "secondary" },
    { label: "تفاصيل المشروع", variant: "outline" },
  ],
  actions: [
    { label: "ناقش المشروع", href: "/contact", variant: "primary" },
    { label: "عرض كل المشاريع", href: "/projects", variant: "outline" },
  ],
  metaBar: [
    { id: "format", label: "التصنيف", value: "نظرة عامة على دراسة الحالة", iconType: "tag" },
    { id: "nature", label: "نوع التوثيق", value: "توثيق تقني", iconType: "calendar" },
  ],
  overview: {
    title: "نظرة عامة",
    paragraphs: [
      "استعرض دراسة مشروع سهم للتحليلات.",
      "سيعرض هذا القسم تفاصيل المشروع المعتمدة عند ربط المحتوى الموثق.",
    ],
  },
  context: {
    title: "سياق المشروع",
    cards: [
      {
        id: "problem",
        title: "التحدي",
        iconType: "alert",
        description: "سيعرض هذا القسم سياق المشروع وتحدياته المعتمدة عند ربط المحتوى الموثق.",
      },
      {
        id: "goals",
        title: "الأهداف",
        iconType: "target",
        description: "سيعرض هذا القسم أهداف المشروع المعتمدة عند ربط المحتوى الموثق.",
      },
      {
        id: "scope",
        title: "النطاق",
        iconType: "check",
        description: "سيعرض هذا القسم نطاق المشروع المعتمد عند ربط المحتوى الموثق.",
      },
    ],
  },
  solution: {
    title: "الحل والمعمارية",
    description: "سيعرض هذا القسم تفاصيل الحل المعتمدة عند ربط المحتوى الموثق.",
  },
  gallery: {
    title: "معرض الصور والشاشات",
    items: [
      {
        id: "slide-1",
        title: "معاينة الواجهة",
        caption: "مساحة عرض مرئية تمهيداً لربط الأصول البصرية المعتمدة.",
      },
      {
        id: "slide-2",
        title: "هيكل التخطيط",
        caption: "مساحة عرض مرئية تمهيداً لربط الأصول البصرية المعتمدة.",
      },
      {
        id: "slide-3",
        title: "تنظيم العناصر",
        caption: "مساحة عرض مرئية تمهيداً لربط الأصول البصرية المعتمدة.",
      },
    ],
  },
  ratingConfig: {
    title: "تقييم هذا المشروع",
    subtitle: "شاركنا تقييمك لدراسة هذه الحالة.",
    ratePrompt: "اختر تقييمك للمشروع:",
  },
  commentsConfig: {
    title: "التعليقات والمناقشات",
    placeholder: "اكتب تعليقاً أو استفساراً حول دراسة هذا المشروع...",
    submitLabel: "نشر التعليق",
    replyLabel: "رد",
    emptyMessage: "لا توجد تعليقات حتى الآن.",
    items: [],
  },
  cta: {
    title: "هل لديك مشروع في بالك؟",
    subtitle: "شاركنا ما ترغب في بنائه.",
    primaryLabel: "ابدأ استفساراً عن مشروع",
    secondaryLabel: "استكشف كل المشاريع",
  },
};

// ---------------------------------------------------------------------------
// 2. Minimal Safe Fixtures for Other Approved Projects
// ---------------------------------------------------------------------------

function createMinimalFixture(slug: string, locale: "en" | "ar"): ProjectDetailData | undefined {
  const listing = locale === "ar" ? PROJECTS_AR : PROJECTS_EN;
  const match = listing.find((p) => p.slug === slug);
  if (!match) return undefined;

  const isAr = locale === "ar";

  return {
    id: `proj-${match.slug}-001`,
    slug: match.slug,
    title: match.title,
    subtitle: match.description,
    eyebrowBadges: [
      { label: isAr ? "دراسة حالة" : "Case Study", variant: "secondary" },
      { label: isAr ? "قيد التوثيق" : "Case Study Overview", variant: "outline" },
    ],
    actions: [
      { label: isAr ? "ناقش المشروع" : "Discuss Project", href: "/contact", variant: "primary" },
      { label: isAr ? "عرض كل المشاريع" : "View All Projects", href: "/projects", variant: "outline" },
    ],
    overview: {
      title: isAr ? "نظرة عامة" : "Overview",
      paragraphs: [
        match.description,
        isAr
          ? "سيعرض هذا القسم تفاصيل المشروع المعتمدة عند ربط المحتوى الموثق."
          : "This section will present approved project details when verified content is connected.",
      ],
    },
    cta: {
      title: isAr ? "هل لديك مشروع في بالك؟" : "Have a project in mind?",
      subtitle: isAr
        ? "شاركنا ما ترغب في بنائه."
        : "Tell us about what you want to build.",
      primaryLabel: isAr ? "ابدأ استفساراً عن مشروع" : "Start a project inquiry",
      secondaryLabel: isAr ? "استكشف كل المشاريع" : "Explore all projects",
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Project Detail Registry & Getter
// ---------------------------------------------------------------------------

const APPROVED_SLUGS = [
  "sahim-analytics",
  "naft-deploy",
  "rakeen-portal",
  "musnad-cli",
  "wathq-observability",
  "hudhud-chat",
] as const;

/**
 * Resolves project detail data by slug and locale.
 * Returns undefined if slug does not correspond to an approved project.
 */
export function getProjectDetail(slug: string, locale?: string): ProjectDetailData | undefined {
  const isAr = locale === "ar";

  if (!APPROVED_SLUGS.includes(slug as (typeof APPROVED_SLUGS)[number])) {
    return undefined;
  }

  if (slug === "sahim-analytics") {
    return isAr ? SAHIM_DETAIL_AR : SAHIM_DETAIL_EN;
  }

  return createMinimalFixture(slug, isAr ? "ar" : "en");
}
