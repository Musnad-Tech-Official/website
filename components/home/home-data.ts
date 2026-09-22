/**
 * Frontend Mock Data & Fixtures for Home Page.
 *
 * NOTE: These items are structured UI mock fixtures derived from the design reference (01-home.png)
 * for frontend composition, layout, and visual QA. They represent frontend contracts only
 * and do not represent verified production databases, verified partner relationships, or real ratings.
 */

import {
  LuCode,
  LuCloud,
  LuDatabase,
  LuTerminal,
  LuSparkles,
  LuLayoutGrid,
  LuTarget,
  LuSlidersHorizontal,
  LuShieldCheck,
  LuLanguages,
} from "react-icons/lu";
import type {
  TrustedCompany,
  CapabilityCardData,
  ProjectCardData,
  TeamMemberData,
  TechnologyItem,
  TestimonialData,
  TrustMetricData,
  InsightArticleData,
} from "./home-types";

export const TRUSTED_COMPANIES: TrustedCompany[] = [
  { id: "sahim", name: "Sahim Capital", letter: "S" },
  { id: "rakeen", name: "Rakeen Legal", letter: "R" },
  { id: "naql", name: "Naql Logistics", letter: "N" },
  { id: "wadi", name: "Wadi Health", letter: "W" },
  { id: "markaz", name: "Markaz Edu", letter: "M" },
  { id: "bayt", name: "Bayt Retail", letter: "B" },
];

export const CAPABILITY_CARDS: CapabilityCardData[] = [
  {
    id: "product-engineering",
    serviceKey: "productEngineering",
    icon: LuCode,
    tags: [
      "Architecture & system design",
      "Full-stack implementation",
      "Technical discovery & RFCs",
    ],
    href: "/services",
  },
  {
    id: "platform-infrastructure",
    serviceKey: "platformInfrastructure",
    icon: LuCloud,
    tags: [
      "Cloud architecture (AWS / GCP)",
      "Kubernetes & container orchestration",
      "CI/CD pipeline design",
    ],
    href: "/services",
  },
  {
    id: "data-engineering",
    serviceKey: "dataEngineering",
    icon: LuDatabase,
    tags: [
      "ETL / ELT pipelines",
      "Warehouse modeling (dbt)",
      "Real-time streaming",
    ],
    href: "/services",
  },
  {
    id: "developer-tools",
    serviceKey: "developerTools",
    icon: LuTerminal,
    tags: [
      "CLI & SDK design",
      "API design (REST & gRPC)",
      "Developer documentation",
    ],
    href: "/services",
  },
  {
    id: "ai-integration",
    serviceKey: "aiIntegration",
    icon: LuSparkles,
    tags: [
      "RAG pipelines & evaluation",
      "LLM application architecture",
      "Prompt engineering & evals",
    ],
    href: "/services",
  },
  {
    id: "design-engineering",
    serviceKey: "designEngineering",
    icon: LuLayoutGrid,
    tags: [
      "Design systems & tokens",
      "Component libraries",
      "Accessibility (WCAG 2.2 AA)",
    ],
    href: "/services",
  },
];

export const FEATURED_PROJECTS: ProjectCardData[] = [
  {
    id: "sahim",
    slug: "sahim-analytics",
    itemKey: "sahim",
    year: "2024",
    featured: true,
    liveDemo: true,
    technologies: ["TypeScript", "Go", "PostgreSQL", "Redis", "+1"],
    rating: 4.7,
    reviewCount: 38,
    gradient: "from-zinc-900 via-neutral-900 to-zinc-950",
    href: "/projects/sahim-analytics",
  },
  {
    id: "naft",
    slug: "naft-deploy",
    itemKey: "naft",
    year: "2024",
    featured: true,
    liveDemo: true,
    technologies: ["Go", "Rust", "Docker", "TypeScript"],
    rating: 4.9,
    reviewCount: 124,
    gradient: "from-stone-900 via-zinc-900 to-neutral-950",
    href: "/projects/naft-deploy",
  },
  {
    id: "rakeen",
    slug: "rakeen-portal",
    itemKey: "rakeen",
    year: "2023",
    featured: true,
    liveDemo: true,
    technologies: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
    rating: 4.6,
    reviewCount: 22,
    gradient: "from-neutral-900 via-zinc-900 to-stone-950",
    href: "/projects/rakeen-portal",
  },
];

export const TEAM_MEMBERS: TeamMemberData[] = [
  {
    id: "layla",
    memberKey: "layla",
    initials: "LA",
    skills: ["Distributed systems", "Go", "PostgreSQL"],
    bannerGradient: "from-zinc-800 via-zinc-900 to-black",
  },
  {
    id: "omar",
    memberKey: "omar",
    initials: "OF",
    skills: ["Kubernetes", "Go", "Rust"],
    bannerGradient: "from-slate-800 via-zinc-900 to-neutral-950",
  },
  {
    id: "sara",
    memberKey: "sara",
    initials: "SA",
    skills: ["Python", "RAG", "Evaluation"],
    bannerGradient: "from-primary/90 via-primary to-zinc-950",
  },
  {
    id: "yousef",
    memberKey: "yousef",
    initials: "YK",
    skills: ["TypeScript", "React", "Next.js"],
    bannerGradient: "from-zinc-800 via-neutral-900 to-stone-950",
  },
];

export const TECHNOLOGIES_LIST: TechnologyItem[] = [
  { id: "ts", name: "TypeScript", category: "language", dotColor: "bg-sky-500" },
  { id: "go", name: "Go", category: "language", dotColor: "bg-sky-500" },
  { id: "py", name: "Python", category: "language", dotColor: "bg-sky-500" },
  { id: "rust", name: "Rust", category: "language", dotColor: "bg-sky-500" },
  { id: "react", name: "React", category: "framework", dotColor: "bg-indigo-500" },
  { id: "next", name: "Next.js", category: "framework", dotColor: "bg-indigo-500" },
  { id: "node", name: "Node.js", category: "framework", dotColor: "bg-indigo-500" },
  { id: "bun", name: "Bun", category: "framework", dotColor: "bg-indigo-500" },
  { id: "pg", name: "PostgreSQL", category: "database", dotColor: "bg-emerald-500" },
  { id: "redis", name: "Redis", category: "database", dotColor: "bg-emerald-500" },
  { id: "sqlite", name: "SQLite", category: "database", dotColor: "bg-emerald-500" },
  { id: "docker", name: "Docker", category: "infrastructure", dotColor: "bg-amber-500" },
  { id: "k8s", name: "Kubernetes", category: "infrastructure", dotColor: "bg-amber-500" },
  { id: "terraform", name: "Terraform", category: "infrastructure", dotColor: "bg-amber-500" },
  { id: "prisma", name: "Prisma", category: "tooling", dotColor: "bg-rose-500" },
  { id: "playwright", name: "Playwright", category: "tooling", dotColor: "bg-rose-500" },
];

export const TESTIMONIALS: TestimonialData[] = [
  { id: "ahmed", itemKey: "ahmed", initial: "A" },
  { id: "reem", itemKey: "reem", initial: "R" },
  { id: "faisal", itemKey: "faisal", initial: "F" },
];

export const TRUST_METRICS: TrustMetricData[] = [
  { id: "proof", metricKey: "m1", icon: LuTarget },
  { id: "flexibility", metricKey: "m2", icon: LuSlidersHorizontal },
  { id: "security", metricKey: "m3", icon: LuShieldCheck },
  { id: "bilingual", metricKey: "m4", icon: LuLanguages },
];

export const LATEST_ARTICLES: InsightArticleData[] = [
  {
    id: "rag",
    slug: "eval-first-ship-second-building-rag-you-can-trust",
    articleKey: "rag",
    readTime: 9,
    isTrending: true,
    tags: ["#rag", "#evaluation", "#llm"],
    timeAgo: "1y ago",
    previewGradient: "from-zinc-800/80 via-zinc-900/60 to-zinc-950",
    href: "/blog",
  },
  {
    id: "bilingual",
    slug: "bilingual-rtl-done-right-lessons-from-rakeen-portal",
    articleKey: "bilingual",
    readTime: 11,
    isTrending: true,
    tags: ["#i18n", "#rtl", "#accessibility"],
    previewGradient: "from-neutral-800/80 via-zinc-900/60 to-stone-950",
    href: "/blog",
  },
  {
    id: "naft",
    slug: "why-we-built-naft-small-teams-shouldnt-need-kubernetes",
    articleKey: "naft",
    readTime: 7,
    isTrending: true,
    tags: ["#deploy", "#open-source", "#go"],
    previewGradient: "from-stone-800/80 via-zinc-900/60 to-neutral-950",
    href: "/blog",
  },
];
