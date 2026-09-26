import type { JobDetailConfig } from "./job-detail-types";

export const SENIOR_BACKEND_ENGINEER_JOB: JobDetailConfig = {
  slug: "senior-backend-engineer",
  translationKey: "seniorBackendEngineer",
  department: "engineering",
  workTypeKey: "fullTime",
  locationKey: "riyadhRemote",
  mode: "hybrid",
  deadlineEn: "Apr 30, 2025",
  deadlineAr: "30 أبريل 2025",
  cvRequired: true,
  otherPositionsSlugs: ["machine-learning-engineer", "design-engineer"],
};

export const MACHINE_LEARNING_ENGINEER_JOB: JobDetailConfig = {
  slug: "machine-learning-engineer",
  translationKey: "machineLearningEngineer",
  department: "ai",
  workTypeKey: "fullTime",
  locationKey: "remote",
  mode: "remote",
  deadlineEn: "May 15, 2025",
  deadlineAr: "15 مايو 2025",
  cvRequired: true,
  otherPositionsSlugs: ["senior-backend-engineer", "design-engineer"],
};

export const DESIGN_ENGINEER_JOB: JobDetailConfig = {
  slug: "design-engineer",
  translationKey: "designEngineer",
  department: "design",
  workTypeKey: "fullTime",
  locationKey: "riyadh",
  mode: "onSite",
  deadlineEn: "May 30, 2025",
  deadlineAr: "30 مايو 2025",
  cvRequired: false,
  otherPositionsSlugs: ["senior-backend-engineer", "machine-learning-engineer"],
};

export const JOB_DETAILS_MAP: Record<string, JobDetailConfig> = {
  "senior-backend-engineer": SENIOR_BACKEND_ENGINEER_JOB,
  "machine-learning-engineer": MACHINE_LEARNING_ENGINEER_JOB,
  "design-engineer": DESIGN_ENGINEER_JOB,
};

export function getJobDetailConfig(slug: string): JobDetailConfig | undefined {
  return JOB_DETAILS_MAP[slug];
}
