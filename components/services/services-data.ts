import {
  LuCode,
  LuCloud,
  LuDatabase,
  LuTerminal,
  LuSparkles,
  LuLayoutGrid,
} from "react-icons/lu";
import type { ServiceItemData, HowWeWorkStep } from "./services-types";

/**
 * 6 Core Capabilities / Services defined in structural reference and project taxonomy.
 * All internal links point to future Service Detail routes.
 */
export const SERVICES_LIST: ServiceItemData[] = [
  {
    id: "product-engineering",
    slug: "product-engineering",
    translationKey: "productEngineering",
    href: "/services/product-engineering",
    icon: LuCode,
    tagKeys: ["tag1", "tag2", "tag3"],
  },
  {
    id: "platform-infrastructure",
    slug: "platform-infrastructure",
    translationKey: "platformInfrastructure",
    href: "/services/platform-infrastructure",
    icon: LuCloud,
    tagKeys: ["tag1", "tag2", "tag3"],
  },
  {
    id: "data-engineering",
    slug: "data-engineering",
    translationKey: "dataEngineering",
    href: "/services/data-engineering",
    icon: LuDatabase,
    tagKeys: ["tag1", "tag2", "tag3"],
  },
  {
    id: "developer-tools",
    slug: "developer-tools",
    translationKey: "developerTools",
    href: "/services/developer-tools",
    icon: LuTerminal,
    tagKeys: ["tag1", "tag2", "tag3"],
  },
  {
    id: "ai-integration",
    slug: "ai-integration",
    translationKey: "aiIntegration",
    href: "/services/ai-integration",
    icon: LuSparkles,
    tagKeys: ["tag1", "tag2", "tag3"],
  },
  {
    id: "design-engineering",
    slug: "design-engineering",
    translationKey: "designEngineering",
    href: "/services/design-engineering",
    icon: LuLayoutGrid,
    tagKeys: ["tag1", "tag2", "tag3"],
  },
];

/**
 * 4 Process steps for "How We Work" section.
 */
export const HOW_WE_WORK_STEPS: HowWeWorkStep[] = [
  {
    id: "discovery",
    stepKey: "step1",
  },
  {
    id: "architecture-rfcs",
    stepKey: "step2",
  },
  {
    id: "build-with-cadence",
    stepKey: "step3",
  },
  {
    id: "ship-operate",
    stepKey: "step4",
  },
];
