import {
  LuChartBar,
  LuTerminal,
  LuBookOpen,
  LuCode,
} from "react-icons/lu";
import type { SuggestedPageItem } from "./not-found-types";

/**
 * Suggested destination items mirroring the 404 reference design layout.
 *
 * CONTENT INTEGRITY & ROUTE SAFETY:
 * - Sahim Analytics routes to verified dynamic case study (/projects/sahim-analytics).
 * - Naft Deploy routes to verified dynamic case study (/projects/naft-deploy).
 * - Eval first, ship second is adapted to /blog because the exact article slug
 *   is not present on current main; this prevents broken links.
 * - Product Engineering routes to the verified service page (/services/product-engineering).
 */
export const SUGGESTED_PAGES: SuggestedPageItem[] = [
  {
    id: "sahim-analytics",
    translationKey: "sahim",
    fallbackTitle: "Sahim Analytics",
    fallbackMeta: "Projects · Fintech Platform",
    href: "/projects/sahim-analytics",
    type: "project",
    icon: LuChartBar,
    isAdapted: false,
  },
  {
    id: "naft-deploy",
    translationKey: "naft",
    fallbackTitle: "Naft Deploy",
    fallbackMeta: "Projects · Developer Tool",
    href: "/projects/naft-deploy",
    type: "project",
    icon: LuTerminal,
    isAdapted: false,
  },
  {
    id: "eval-first-ship-second",
    translationKey: "rag",
    fallbackTitle: "Eval first, ship second: building...",
    fallbackMeta: "Blog · AI Engineering",
    href: "/blog",
    type: "blog",
    icon: LuBookOpen,
    isAdapted: true,
    adaptedReason:
      "Specific blog post slug does not exist on main branch; safely routes to the Blog discovery hub.",
  },
  {
    id: "product-engineering",
    translationKey: "productEngineering",
    fallbackTitle: "Product Engineering",
    fallbackMeta: "Services · From discovery to launch — we ...",
    href: "/services/product-engineering",
    type: "service",
    icon: LuCode,
    isAdapted: false,
  },
];
