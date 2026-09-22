import type { ReactNode } from "react";
import type { BadgeVariant } from "@/components/ui/badge";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  requiresFeatureFlag?: "blog" | "careers";
  external?: boolean;
  badge?: string;
  badgeVariant?: BadgeVariant;
}

export interface NavLabels {
  brandName?: string;
  contactCta?: string;
  signIn?: string;
  signUp?: string;
  openMenu?: string;
  closeMenu?: string;
  dismissAnnouncement?: string;
  learnMore?: string;
}

export interface AnnouncementBannerProps {
  text: string;
  tag?: string;
  href?: string;
  linkText?: string;
  direction?: "ltr" | "rtl";
  dismissible?: boolean;
  onClose?: () => void;
  dismissLabel?: string;
  className?: string;
}

export interface NavLogoProps {
  homeHref?: string;
  wordmark?: string;
  showWordmark?: boolean;
  onClick?: () => void;
  className?: string;
}


export interface NavLinksProps {
  items: NavItem[];
  currentPath?: string;
  showBlog?: boolean;
  showCareers?: boolean;
  onItemClick?: (item: NavItem) => void;
  variant?: "desktop" | "mobile";
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}

export interface MobileNavProps {
  items: NavItem[];
  currentPath?: string;
  showBlog?: boolean;
  showCareers?: boolean;
  homeHref?: string;
  contactHref?: string;
  signInHref?: string;
  direction?: "ltr" | "rtl";
  labels?: NavLabels;
  utilities?: ReactNode;
  showUtilities?: boolean;
  className?: string;
}

export interface NavbarProps {
  currentPath?: string;
  showBlog?: boolean;
  showCareers?: boolean;
  isSticky?: boolean;
  homeHref?: string;
  contactHref?: string;
  signInHref?: string;
  announcement?: AnnouncementBannerProps | null;
  locale?: string;
  direction?: "ltr" | "rtl";
  customItems?: NavItem[];
  labels?: NavLabels;
  utilities?: ReactNode;
  showUtilities?: boolean;
  className?: string;
}

