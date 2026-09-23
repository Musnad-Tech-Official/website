import type React from "react";

/**
 * Frontend contract for a service item listing fixture.
 */
export interface ServiceItemData {
  id: string;
  slug: string;
  translationKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  tagKeys: string[];
}

/**
 * Step definition for the "How We Work" deliberate process section.
 */
export interface HowWeWorkStep {
  id: string;
  stepKey: string;
}

/**
 * Props for ServicesIntro component.
 */
export interface ServicesIntroProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  homeLabel: string;
  servicesLabel: string;
  breadcrumbLabel?: string;
  className?: string;
}

/**
 * Props for reusable ServiceCard component.
 */
export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  learnMoreLabel: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Props for ServicesGrid section.
 */
export interface ServicesGridProps {
  className?: string;
}

/**
 * Props for ServicesProcess ("How We Work") section.
 */
export interface ServicesProcessProps {
  className?: string;
}
