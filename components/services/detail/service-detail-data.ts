import {
  LuCode,
  LuCpu,
  LuFileText,
  LuShieldCheck,
  LuActivity,
  LuLayoutGrid,
  LuCloud,
} from "react-icons/lu";
import type { ServiceDetailData } from "./service-detail-types";

/**
 * Product Engineering Service Detail Configuration & Frontend Fixture Data.
 * Matches 05-service-product-engineering.png specification.
 */
export const PRODUCT_ENGINEERING_DETAIL: ServiceDetailData = {
  slug: "product-engineering",
  translationKey: "productEngineering",
  icon: LuCode,
  technologies: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
  capabilities: [
    {
      id: "architecture",
      translationKey: "architecture",
      icon: LuCpu,
    },
    {
      id: "fullstack",
      translationKey: "fullstack",
      icon: LuCode,
    },
    {
      id: "discovery",
      translationKey: "discovery",
      icon: LuFileText,
    },
    {
      id: "review",
      translationKey: "review",
      icon: LuShieldCheck,
    },
    {
      id: "observability",
      translationKey: "observability",
      icon: LuActivity,
    },
  ],
  relatedProjects: [
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
      id: "rakeen",
      slug: "rakeen-portal",
      itemKey: "rakeen",
      year: "2023",
      featured: true,
      liveDemo: true,
      technologies: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
      rating: 4.6,
      reviewCount: 22,
      gradient: "from-slate-900 via-zinc-900 to-neutral-950",
      href: "/projects/rakeen-portal",
    },
  ],
  relatedByTechnology: {
    projects: [
      {
        id: "rakeen",
        slug: "rakeen-portal",
        itemKey: "rakeen",
        year: "2023",
        categoryKey: "clientPortal",
        technologies: ["TypeScript", "Next.js", "PostgreSQL"],
        href: "/projects/rakeen-portal",
      },
      {
        id: "naft",
        slug: "naft-deploy",
        itemKey: "naft",
        year: "2024",
        categoryKey: "developerTool",
        technologies: ["Docker", "TypeScript"],
        href: "/projects/naft-deploy",
      },
      {
        id: "musnad-cli",
        slug: "musnad-cli",
        itemKey: "musnadCli",
        year: "2025",
        categoryKey: "developerTool",
        technologies: ["TypeScript"],
        href: "/projects/musnad-cli",
      },
    ],
    services: [
      {
        id: "design-engineering",
        slug: "design-engineering",
        serviceKey: "designEngineering",
        icon: LuLayoutGrid,
        technologies: ["Next.js", "TypeScript"],
        href: "/services/design-engineering",
      },
      {
        id: "platform-infrastructure",
        slug: "platform-infrastructure",
        serviceKey: "platformInfrastructure",
        icon: LuCloud,
        technologies: ["Docker"],
        href: "/services/platform-infrastructure",
      },
    ],
  },
};
