export type AnnouncementCategory = "projects" | "services" | "tools" | "general";

export interface AnnouncementBannerItem {
  id: string;
  category: AnnouncementCategory;
  textEn: string;
  textAr: string;
  tagEn: string;
  tagAr: string;
  linkTextEn: string;
  linkTextAr: string;
  href: string;
  isActive: boolean;
  isDismissible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnouncementFormData {
  id?: string;
  category: AnnouncementCategory;
  textEn: string;
  textAr: string;
  tagEn?: string;
  tagAr?: string;
  linkTextEn?: string;
  linkTextAr?: string;
  href: string;
  isActive?: boolean;
  isDismissible?: boolean;
}
