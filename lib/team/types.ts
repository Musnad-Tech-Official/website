export interface TeamMemberSocialLinks {
  github?: string;
  linkedin?: string;
  x?: string;
  website?: string;
  email?: string;
}

export interface TeamMember {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  bioEn: string;
  bioAr: string;
  image?: string;
  initials: string;
  department: string;
  skills: string[];
  socialLinks: TeamMemberSocialLinks;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberFormData {
  id?: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  bioEn: string;
  bioAr: string;
  image?: string;
  initials?: string;
  department: string;
  skills: string[];
  socialLinks?: TeamMemberSocialLinks;
  displayOrder?: number;
  isActive?: boolean;
}
