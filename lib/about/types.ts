export interface AboutContentData {
  id: string;
  missionTitleEn: string;
  missionTitleAr: string;
  missionDescEn: string;
  missionDescAr: string;
  visionTitleEn: string;
  visionTitleAr: string;
  visionDescEn: string;
  visionDescAr: string;
  storyTitleEn: string;
  storyTitleAr: string;
  storyP1En: string;
  storyP1Ar: string;
  storyP2En: string;
  storyP2Ar: string;
  updatedAt?: string;
}

export interface AboutValueRecord {
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

export interface AboutMilestoneRecord {
  id: string;
  year: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutApproachRecord {
  id: string;
  stepNumber: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
