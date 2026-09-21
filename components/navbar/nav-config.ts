import type { NavItem, NavLabels } from "./nav-types";

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: "about",
    label: "About",
    href: "/about",
  },
  {
    id: "services",
    label: "Services",
    href: "/services",
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    requiresFeatureFlag: "blog",
  },
  {
    id: "careers",
    label: "Careers",
    href: "/careers",
    requiresFeatureFlag: "careers",
  },
  {
    id: "team",
    label: "Team",
    href: "/team",
  },
];

export const DEFAULT_NAV_LABELS: Required<NavLabels> = {
  brandName: "Musnad Tech",
  contactCta: "Contact",
  signIn: "Sign in",
  openMenu: "Open navigation menu",
  closeMenu: "Close menu",
  dismissAnnouncement: "Dismiss announcement",
  learnMore: "Learn more",
};

export const DEFAULT_NAV_CONFIG = {
  homeHref: "/",
  contactHref: "/contact",
  signInHref: "/sign-in",
} as const;
