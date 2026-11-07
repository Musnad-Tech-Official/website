export type JobDepartment = "engineering" | "ai" | "design";
export type JobWorkMode = "hybrid" | "remote" | "onSite";

export interface CareerJobRecord {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  department: JobDepartment;
  workMode: JobWorkMode;
  workTypeEn: string;
  workTypeAr: string;
  locationEn: string;
  locationAr: string;
  descriptionEn: string;
  descriptionAr: string;
  requirementsEn: string[];
  requirementsAr: string[];
  responsibilitiesEn: string[];
  responsibilitiesAr: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerValueRecord {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
