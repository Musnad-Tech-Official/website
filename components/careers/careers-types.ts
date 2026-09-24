import type { JobPositionSummary, CareerValueItem } from "@/data/careers";

export interface CareersIntroProps {
  homeLabel: string;
  careersLabel: string;
  breadcrumbLabel?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  className?: string;
}

export interface CareersValuesProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: CareerValueItem[];
  className?: string;
}

export interface CareerPositionCardProps {
  position: JobPositionSummary;
  locale: string;
  className?: string;
}

export interface CareersOpenPositionsProps {
  positions: JobPositionSummary[];
  locale: string;
  className?: string;
}

export interface CareersFinalCtaProps {
  badge: string;
  title: string;
  subtitle: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  className?: string;
}
