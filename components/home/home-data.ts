/**
 * Frontend Mock Data & Fixtures for Home Page.
 */

import {
  LuCode,
  LuCloud,
  LuDatabase,
  LuTerminal,
  LuSparkles,
  LuLayoutGrid,
} from "react-icons/lu";
import type {
  TrustedCompany,
  CapabilityCardData,
  TestimonialData,
  InsightArticleData,
} from "./home-types";

export const TRUSTED_COMPANIES: TrustedCompany[] = [
  { id: "yemen-mobile", name: "Yemen Mobile", logo: "/companies/yemen-mobile.svg" },
  { id: "kuraimi-bank", name: "Al Kuraimi Bank", logo: "/companies/kuraimi-bank.svg" },
  { id: "tadhamon-bank", name: "Tadhamon Bank", logo: "/companies/tadhamon-bank.svg" },
  { id: "hsa-group", name: "HSA Group", logo: "/companies/hsa-group.svg" },
  { id: "cac-bank", name: "CAC Bank", logo: "/companies/cac-bank.svg" },
  { id: "ykb", name: "Yemen Kuwait Bank", logo: "/companies/ykb.svg" },
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

export const TESTIMONIALS: TestimonialData[] = [
  { id: "ahmed", itemKey: "ahmed", initial: "A" },
  { id: "reem", itemKey: "reem", initial: "R" },
  { id: "faisal", itemKey: "faisal", initial: "F" },
  { id: "tariq", itemKey: "tariq", initial: "T" },
  { id: "mona", itemKey: "mona", initial: "M" },
  { id: "khalid", itemKey: "khalid", initial: "K" },
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
    date: "Oct 2024",
    authorInitials: "SA",
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
    date: "Aug 2024",
    authorInitials: "NA",
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
    date: "Jun 2024",
    authorInitials: "OF",
    previewGradient: "from-stone-800/80 via-zinc-900/60 to-neutral-950",
    href: "/blog",
  },
];
