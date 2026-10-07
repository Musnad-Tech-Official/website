export type ProjectStatus = "draft" | "published" | "archived";

export interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
  labelEn?: string;
  labelAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

export interface ProjectGalleryItem {
  id?: string;
  url: string;
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  descriptionEn: string;
  descriptionAr: string;
  contentEn?: unknown;
  contentAr?: unknown;
  contentHtmlEn: string;
  contentHtmlAr: string;
  coverImage?: string;
  image?: string;
  category: string;
  categorySlug: string;
  clientName?: string;
  year: string;
  technologies: string[];
  featured: boolean;
  liveDemoUrl?: string;
  githubUrl?: string;
  rating: number;
  reviewCount: number;
  gradient?: string;
  metrics: ProjectMetric[];
  gallery: ProjectGalleryItem[];
  status: ProjectStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface ProjectFormData {
  id?: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  descriptionEn: string;
  descriptionAr: string;
  contentHtmlEn: string;
  contentHtmlAr: string;
  contentEn?: unknown;
  contentAr?: unknown;
  coverImage?: string;
  category: string;
  categorySlug?: string;
  year: string;
  technologies: string[];
  featured: boolean;
  liveDemoUrl?: string;
  githubUrl?: string;
  rating?: number;
  reviewCount?: number;
  gradient?: string;
  metrics: ProjectMetric[];
  gallery?: ProjectGalleryItem[];
  status: ProjectStatus;
  displayOrder?: number;
}

export const PROJECT_CATEGORY_MAP_AR: Record<string, string> = {
  "Fintech Platform": "منصة تقنية مالية",
  "Developer Tool": "أداة مطورين",
  "Client Portal": "بوابة عملاء",
  "CLI & Tooling": "أدوات برمجية وحزم طرفية",
  "Observability": "رصد ومراقبة الأنظمة",
  "AI & Realtime": "ذكاء اصطناعي وأنظمة فورية",
  "Cloud Architecture": "معمارية سحابية",
  "Mobile Application": "تطبيقات الهواتف",
  "Enterprise Software": "برمجيات المؤسسات",
  "Case Study": "دراسة حالة",
};

export function getLocalizedProjectCategory(category: string, locale: string): string {
  if (locale === "ar") {
    return PROJECT_CATEGORY_MAP_AR[category] || category;
  }
  return category;
}
