import type { ComponentType } from "react";

/**
 * Valid domain categorization for suggested recovery destinations.
 */
export type SuggestedPageType = "project" | "blog" | "service";

/**
 * Key matching the NotFoundPage translation dictionary items.
 */
export type SuggestedPageKey =
  | "sahim"
  | "naft"
  | "rag"
  | "productEngineering";

/**
 * Model representing a single destination card in the 404 recovery section.
 */
export interface SuggestedPageItem {
  id: string;
  translationKey: SuggestedPageKey;
  fallbackTitle: string;
  fallbackMeta: string;
  href: string;
  type: SuggestedPageType;
  icon: ComponentType<{ className?: string }>;
  isAdapted?: boolean;
  adaptedReason?: string;
}

/**
 * Props for the 404 Hero section.
 */
export interface NotFoundHeroProps {
  className?: string;
}

/**
 * Props for the Suggested Pages section.
 */
export interface SuggestedPagesProps {
  className?: string;
  items?: SuggestedPageItem[];
}
