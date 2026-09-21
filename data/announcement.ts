import type { AnnouncementBannerProps } from "@/components/navbar/nav-types";

export interface AnnouncementItem {
  text: string;
  tag: string;
  href: string;
  linkText: string;
}

export const ANNOUNCEMENT_DATA: Record<string, AnnouncementItem> = {
  ar: {
    text: "تم إطلاق مكتبة مكونات ونظام تصميم مسند للتقنية للجيل القادم!",
    tag: "جديد",
    href: "/services",
    linkText: "استكشف الآن",
  },
  en: {
    text: "Musnad UI Design System & Component Library is officially live!",
    tag: "New",
    href: "/services",
    linkText: "Explore components",
  },
};

/**
 * Returns localized announcement banner props for the Navbar based on the provided locale.
 *
 * @param locale - Supported locale string ("en" | "ar")
 * @returns AnnouncementBannerProps configured for the given locale and text direction
 */
export function getAnnouncement(locale: string = "en"): AnnouncementBannerProps {
  const isRtl = locale === "ar";
  const item = ANNOUNCEMENT_DATA[locale] ?? ANNOUNCEMENT_DATA.en;

  return {
    text: item.text,
    tag: item.tag,
    href: item.href,
    linkText: item.linkText,
    direction: isRtl ? "rtl" : "ltr",
  };
}