import type { ComponentType } from "react";

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export interface FooterBrandProps {
  homeHref?: string;
  brandName?: string;
  description?: string;
  email?: string;
  location?: string;
  socialLinks?: SocialLink[];
  className?: string;
}

export interface FooterLinksProps {
  section: FooterSection;
  className?: string;
}

export interface FooterBottomProps {
  brandName?: string;
  allRightsReserved?: string;
  builtInRiyadh?: string;
  locale?: string;
  className?: string;
}

export interface FooterProps {
  locale?: string;
  direction?: "ltr" | "rtl";
  className?: string;
}
