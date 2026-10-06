export interface TestimonialItem {
  id: string;
  authorNameEn: string;
  authorNameAr: string;
  roleEn: string;
  roleAr: string;
  quoteEn: string;
  quoteAr: string;
  initial: string;
  avatarUrl?: string;
  companyName?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface TestimonialFormData {
  id?: string;
  authorNameEn: string;
  authorNameAr: string;
  roleEn: string;
  roleAr: string;
  quoteEn: string;
  quoteAr: string;
  initial?: string;
  avatarUrl?: string;
  companyName?: string;
  displayOrder?: number;
  isActive?: boolean;
}
