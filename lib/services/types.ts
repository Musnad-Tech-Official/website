export interface ServiceItem {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  tagsEn: string[];
  tagsAr: string[];
  href: string;
  displayOrder: number;
  enabledHome: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceFormData {
  id?: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  tagsEn: string[];
  tagsAr: string[];
  href?: string;
  displayOrder?: number;
  enabledHome?: boolean;
  isActive?: boolean;
}
