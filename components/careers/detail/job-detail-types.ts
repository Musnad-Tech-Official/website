import type { JobWorkMode } from "@/data/careers";

export interface JobDetailConfig {
  slug: string;
  translationKey: "seniorBackendEngineer" | "machineLearningEngineer" | "designEngineer";
  department: "engineering" | "ai" | "design";
  workTypeKey: "fullTime";
  locationKey: "riyadhRemote" | "remote" | "riyadh";
  mode: JobWorkMode;
  deadlineEn: string;
  deadlineAr: string;
  cvRequired: boolean;
  otherPositionsSlugs: string[];
}

export interface JobDetailIntroProps {
  homeLabel: string;
  careersLabel: string;
  breadcrumbLabel?: string;
  jobTitle: string;
  eyebrow: string;
  subtitle: string;
  departmentLabel: string;
  workTypeLabel: string;
  locationLabel: string;
  modeLabel: string;
  deadlineFormatted: string;
  deadlinePrefix: string;
  className?: string;
}

export interface JobMetaBadgesProps {
  departmentLabel: string;
  workTypeLabel: string;
  locationLabel: string;
  modeLabel: string;
  deadlineFormatted: string;
  deadlinePrefix: string;
  className?: string;
}

export interface JobResponsibilitiesProps {
  heading: string;
  items: string[];
  className?: string;
}

export interface JobRequirementsProps {
  heading: string;
  items: string[];
  className?: string;
}

export interface JobNiceToHaveProps {
  heading: string;
  items: string[];
  className?: string;
}

export interface JobApplicationFormProps {
  cvRequired: boolean;
  className?: string;
}

export interface OtherOpenPositionsProps {
  otherPositionsSlugs: string[];
  locale?: string;
  className?: string;
}

export interface JobDetailTemplateProps {
  slug: string;
  locale: string;
}
