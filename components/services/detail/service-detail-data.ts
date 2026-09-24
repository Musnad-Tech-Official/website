import {
  LuCode,
  LuCpu,
  LuFileText,
  LuShieldCheck,
  LuActivity,
  LuLayoutGrid,
  LuCloud,
  LuBoxes,
  LuWorkflow,
  LuLayers,
  LuTrendingDown,
  LuTerminal,
  LuDatabase,
  LuLayoutDashboard,
  LuSparkles,
  LuNetwork,
  LuBookOpen,
  LuGitBranch,
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

/**
 * Platform & Infrastructure Service Detail Configuration & Frontend Fixture Data.
 * Matches 06-service-platform-infrastructure.png specification.
 */
export const PLATFORM_INFRASTRUCTURE_DETAIL: ServiceDetailData = {
  slug: "platform-infrastructure",
  translationKey: "platformInfrastructure",
  icon: LuCloud,
  technologies: ["Kubernetes", "Terraform", "Docker", "Go"],
  capabilities: [
    {
      id: "cloud-architecture",
      translationKey: "cloudArchitecture",
      icon: LuCloud,
    },
    {
      id: "kubernetes",
      translationKey: "kubernetes",
      icon: LuBoxes,
    },
    {
      id: "cicd",
      translationKey: "cicd",
      icon: LuWorkflow,
    },
    {
      id: "iac",
      translationKey: "iac",
      icon: LuLayers,
    },
    {
      id: "finops",
      translationKey: "finops",
      icon: LuTrendingDown,
    },
  ],
  relatedProjects: [
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
      gradient: "from-zinc-900 via-neutral-900 to-zinc-950",
      href: "/projects/naft-deploy",
    },
    {
      id: "wathq",
      slug: "wathq-observability",
      itemKey: "wathq",
      year: "2023",
      technologies: ["Go", "Kubernetes", "Terraform", "Redis"],
      rating: 4.4,
      reviewCount: 9,
      gradient: "from-slate-900 via-zinc-900 to-neutral-950",
      href: "/projects/wathq-observability",
    },
  ],
  relatedByTechnology: {
    projects: [
      {
        id: "wathq",
        slug: "wathq-observability",
        itemKey: "wathq",
        year: "2023",
        categoryKey: "platformEngineering",
        technologies: ["Go", "Kubernetes", "Terraform"],
        href: "/projects/wathq-observability",
      },
      {
        id: "sahim",
        slug: "sahim-analytics",
        itemKey: "sahim",
        year: "2024",
        categoryKey: "fintechPlatform",
        technologies: ["Go", "Kubernetes"],
        href: "/projects/sahim-analytics",
      },
      {
        id: "rakeen",
        slug: "rakeen-portal",
        itemKey: "rakeen",
        year: "2023",
        categoryKey: "clientPortal",
        technologies: ["Docker"],
        href: "/projects/rakeen-portal",
      },
    ],
    services: [
      {
        id: "product-engineering",
        slug: "product-engineering",
        serviceKey: "productEngineering",
        icon: LuCode,
        technologies: ["Docker"],
        href: "/services/product-engineering",
      },
      {
        id: "developer-tools",
        slug: "developer-tools",
        serviceKey: "developerTools",
        icon: LuTerminal,
        technologies: ["Go"],
        href: "/services/developer-tools",
      },
    ],
  },
};

/**
 * Data Engineering Service Detail Configuration & Frontend Fixture Data.
 * Matches 07-service-data-engineering.png specification.
 */
export const DATA_ENGINEERING_DETAIL: ServiceDetailData = {
  slug: "data-engineering",
  translationKey: "dataEngineering",
  icon: LuDatabase,
  technologies: ["Python", "PostgreSQL", "Redis"],
  capabilities: [
    {
      id: "pipelines",
      translationKey: "pipelines",
      icon: LuWorkflow,
    },
    {
      id: "modeling",
      translationKey: "modeling",
      icon: LuLayers,
    },
    {
      id: "streaming",
      translationKey: "streaming",
      icon: LuActivity,
    },
    {
      id: "dashboards",
      translationKey: "dashboards",
      icon: LuLayoutDashboard,
    },
    {
      id: "quality",
      translationKey: "quality",
      icon: LuShieldCheck,
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
  ],
  relatedByTechnology: {
    projects: [
      {
        id: "hudhud",
        slug: "hudhud-chat",
        itemKey: "hudhud",
        year: "2024",
        technologies: ["Python", "Redis"],
        href: "/projects/hudhud-chat",
      },
      {
        id: "rakeen",
        slug: "rakeen-portal",
        itemKey: "rakeen",
        year: "2023",
        technologies: ["PostgreSQL"],
        href: "/projects/rakeen-portal",
      },
      {
        id: "wathq",
        slug: "wathq-observability",
        itemKey: "wathq",
        year: "2023",
        technologies: ["Redis"],
        href: "/projects/wathq-observability",
      },
    ],
    services: [
      {
        id: "ai-integration",
        slug: "ai-integration",
        serviceKey: "aiIntegration",
        icon: LuSparkles,
        technologies: ["Python", "Redis"],
        href: "/services/ai-integration",
      },
      {
        id: "product-engineering",
        slug: "product-engineering",
        serviceKey: "productEngineering",
        icon: LuCode,
        technologies: ["PostgreSQL"],
        href: "/services/product-engineering",
      },
    ],
  },
};

/**
 * Developer Tools Service Detail Configuration & Frontend Fixture Data.
 * Matches 08-service-developer-tools.png specification.
 */
export const DEVELOPER_TOOLS_DETAIL: ServiceDetailData = {
  slug: "developer-tools",
  translationKey: "developerTools",
  icon: LuTerminal,
  technologies: ["Go", "Rust", "TypeScript"],
  capabilities: [
    {
      id: "cli-sdk",
      translationKey: "cliSdk",
      icon: LuTerminal,
    },
    {
      id: "api-design",
      translationKey: "apiDesign",
      icon: LuNetwork,
    },
    {
      id: "documentation",
      translationKey: "documentation",
      icon: LuBookOpen,
    },
    {
      id: "internal-tooling",
      translationKey: "internalTooling",
      icon: LuBoxes,
    },
    {
      id: "open-source",
      translationKey: "openSource",
      icon: LuGitBranch,
    },
  ],
  relatedProjects: [
    {
      id: "musnad-cli",
      slug: "musnad-cli",
      itemKey: "musnadCli",
      year: "2025",
      featured: false,
      liveDemo: true,
      technologies: ["Go", "TypeScript", "Rust"],
      rating: 4.5,
      reviewCount: 17,
      status: "inDevelopment",
      gradient: "from-slate-900 via-zinc-900 to-neutral-950",
      href: "/projects/musnad-cli",
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
      status: "completed",
      gradient: "from-zinc-900 via-neutral-900 to-zinc-950",
      href: "/projects/naft-deploy",
    },
  ],
  relatedByTechnology: {
    projects: [
      {
        id: "naft",
        slug: "naft-deploy",
        itemKey: "naft",
        year: "2024",
        categoryKey: "developerTool",
        technologies: ["Go", "Rust", "TypeScript"],
        href: "/projects/naft-deploy",
      },
      {
        id: "sahim",
        slug: "sahim-analytics",
        itemKey: "sahim",
        year: "2024",
        categoryKey: "fintechPlatform",
        technologies: ["TypeScript", "Go"],
        href: "/projects/sahim-analytics",
      },
      {
        id: "rakeen",
        slug: "rakeen-portal",
        itemKey: "rakeen",
        year: "2023",
        categoryKey: "clientPortal",
        technologies: ["TypeScript"],
        href: "/projects/rakeen-portal",
      },
    ],
    services: [
      {
        id: "product-engineering",
        slug: "product-engineering",
        serviceKey: "productEngineering",
        icon: LuCode,
        technologies: ["TypeScript"],
        href: "/services/product-engineering",
      },
      {
        id: "platform-infrastructure",
        slug: "platform-infrastructure",
        serviceKey: "platformInfrastructure",
        icon: LuCloud,
        technologies: ["Go"],
        href: "/services/platform-infrastructure",
      },
    ],
  },
};

