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


