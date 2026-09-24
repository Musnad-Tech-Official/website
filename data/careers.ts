export type JobDepartment = "all" | "engineering" | "ai" | "design";

export type JobWorkMode = "hybrid" | "remote" | "onSite";

export interface CareerValueItem {
  id: string;
  iconType: "senior" | "bilingual" | "openSource" | "remote";
  translationKey: "seniorByDefault" | "bilingualFirst" | "openSourceFriendly" | "remoteFriendly";
}

export interface JobPositionSummary {
  id: string;
  slug: string;
  translationKey: "seniorBackendEngineer" | "machineLearningEngineer" | "designEngineer";
  department: "engineering" | "ai" | "design";
  workTypeKey: "fullTime";
  locationKey: "riyadhRemote" | "remote" | "riyadh";
  mode: JobWorkMode;
  dateEn: string;
  dateAr: string;
  href: string;
}

export const CAREER_VALUES: CareerValueItem[] = [
  {
    id: "senior-by-default",
    iconType: "senior",
    translationKey: "seniorByDefault",
  },
  {
    id: "bilingual-first",
    iconType: "bilingual",
    translationKey: "bilingualFirst",
  },
  {
    id: "open-source-friendly",
    iconType: "openSource",
    translationKey: "openSourceFriendly",
  },
  {
    id: "remote-friendly",
    iconType: "remote",
    translationKey: "remoteFriendly",
  },
];

export const JOB_POSITIONS: JobPositionSummary[] = [
  {
    id: "senior-backend-engineer",
    slug: "senior-backend-engineer",
    translationKey: "seniorBackendEngineer",
    department: "engineering",
    workTypeKey: "fullTime",
    locationKey: "riyadhRemote",
    mode: "hybrid",
    dateEn: "Apr 30, 2025",
    dateAr: "30 أبريل 2025",
    href: "/careers/senior-backend-engineer",
  },
  {
    id: "machine-learning-engineer",
    slug: "machine-learning-engineer",
    translationKey: "machineLearningEngineer",
    department: "ai",
    workTypeKey: "fullTime",
    locationKey: "remote",
    mode: "remote",
    dateEn: "May 15, 2025",
    dateAr: "15 مايو 2025",
    href: "/careers/machine-learning-engineer",
  },
  {
    id: "design-engineer",
    slug: "design-engineer",
    translationKey: "designEngineer",
    department: "design",
    workTypeKey: "fullTime",
    locationKey: "riyadh",
    mode: "onSite",
    dateEn: "May 30, 2025",
    dateAr: "30 مايو 2025",
    href: "/careers/design-engineer",
  },
];

export function getJobPositionBySlug(slug: string): JobPositionSummary | undefined {
  return JOB_POSITIONS.find((job) => job.slug === slug);
}

export function getAllJobPositions(): JobPositionSummary[] {
  return JOB_POSITIONS;
}

export function getOtherJobPositions(currentSlug: string): JobPositionSummary[] {
  return JOB_POSITIONS.filter((job) => job.slug !== currentSlug);
}
