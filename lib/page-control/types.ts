export type PageStatus = "live" | "maintenance" | "hidden";

export type PageFamily =
  | "marketing"
  | "services"
  | "projects"
  | "blog"
  | "careers"
  | "support"
  | "legal"
  | "account";

export interface PageControlItem {
  id: string; // Unique slug identifier (e.g. "home", "about", "blog")
  path: string; // Route path (e.g. "/", "/about", "/blog")
  titleEn: string;
  titleAr: string;
  family: PageFamily;
  status: PageStatus;
  showInNavbar: boolean;
  showInFooter: boolean;
  maintenanceNoticeEn?: string;
  maintenanceNoticeAr?: string;
  isProtected?: boolean; // If true, page cannot be completely hidden/deleted (e.g. Home)
  updatedAt?: string;
  updatedBy?: string;
}

export interface PageControlStats {
  total: number;
  live: number;
  maintenance: number;
  hidden: number;
  inNavbar: number;
  inFooter: number;
}
