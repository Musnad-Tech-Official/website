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
    badge: "New",
    badgeVariant: "accent",
  },
  {
    id: "careers",
    label: "Careers",
    href: "/careers",
    requiresFeatureFlag: "careers",
    badge: "Hiring",
    badgeVariant: "default",
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

export const ARABIC_NAV_LABELS: Required<NavLabels> = {
  brandName: "مسند للتقنية",
  contactCta: "تواصل معنا",
  signIn: "تسجيل الدخول",
  openMenu: "فتح قائمة التنقل",
  closeMenu: "إغلاق القائمة",
  dismissAnnouncement: "إخفاء الإعلان",
  learnMore: "معرفة المزيد",
};

export const DEFAULT_NAV_CONFIG = {
  homeHref: "/",
  contactHref: "/contact",
  signInHref: "/sign-in",
} as const;

/**
 * Returns localized navigation items based on the locale ("en" or "ar").
 */
export function getLocalizedNavItems(locale?: string): NavItem[] {
  if (locale === "ar") {
    return [
      { id: "about", label: "من نحن", href: "/about" },
      { id: "services", label: "خدماتنا", href: "/services" },
      { id: "projects", label: "مشاريعنا", href: "/projects" },
      {
        id: "blog",
        label: "المدونة",
        href: "/blog",
        requiresFeatureFlag: "blog",
        badge: "جديد",
        badgeVariant: "accent",
      },
      {
        id: "careers",
        label: "الوظائف",
        href: "/careers",
        requiresFeatureFlag: "careers",
        badge: "توظيف",
        badgeVariant: "default",
      },
      { id: "team", label: "فريق العمل", href: "/team" },
    ];
  }

  return DEFAULT_NAV_ITEMS;
}

