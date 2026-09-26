import {
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaSnapchat,
  FaTelegram,
  FaGithub,
} from "react-icons/fa6";
import type { FooterSection, SocialLink } from "./footer-types";

/**
 * Verified official social media channels for Musnad Tech.
 */
export const OFFICIAL_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "x",
    label: "X (Twitter)",
    href: "https://x.com/musnadtech",
    icon: FaXTwitter,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/company/musnadtech",
    icon: FaLinkedinIn,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/techmusnad",
    icon: FaInstagram,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com/musnadtech",
    icon: FaFacebookF,
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://tiktok.com/@musnadtech",
    icon: FaTiktok,
  },
  {
    id: "snapchat",
    label: "Snapchat",
    href: "https://snapchat.com/add/musnadtech",
    icon: FaSnapchat,
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "https://t.me/musnadtech",
    icon: FaTelegram,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Musnad-Tech-Official",
    icon: FaGithub,
  },
];

/**
 * Returns structured navigation sections for the Footer populated with translated strings.
 *
 * Sections:
 * 1. Explore (Home, Projects, Services, Blog, Team)
 * 2. Company (About, Contact, FAQ)
 * 3. Legal (Privacy Policy, Terms of Service, Cookie Policy)
 */
export function getFooterSections(t: (key: string) => string): FooterSection[] {
  return [
    {
      id: "explore",
      title: t("exploreTitle"),
      links: [
        { id: "home", label: t("nav.home"), href: "/" },
        { id: "projects", label: t("nav.projects"), href: "/projects" },
        { id: "services", label: t("nav.services"), href: "/services" },
        { id: "blog", label: t("nav.blog"), href: "/blog" },
        { id: "team", label: t("nav.team"), href: "/team" },
        { id: "careers", label: t("nav.careers"), href: "/careers" },
      ],
    },
    {
      id: "company",
      title: t("companyTitle"),
      links: [
        { id: "about", label: t("nav.about"), href: "/about" },
        { id: "contact", label: t("nav.contact"), href: "/contact" },
        { id: "faq", label: t("nav.faq"), href: "/faq" },
      ],
    },
    {
      id: "legal",
      title: t("legalTitle"),
      links: [
        { id: "privacy", label: t("nav.privacy"), href: "/legal/privacy-policy" },
        { id: "terms", label: t("nav.terms"), href: "/legal/terms-of-service" },
        { id: "cookies", label: t("nav.cookies"), href: "/legal/cookie-policy" },
      ],
    },
  ];
}
