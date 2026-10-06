export interface TrustedCompanyItem {
  id: string;
  nameEn: string;
  nameAr: string;
  logo: string;
  websiteUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface CompanyFormData {
  id?: string;
  nameEn: string;
  nameAr: string;
  logo: string;
  websiteUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}
