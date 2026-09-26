/**
 * Musnad Tech — Contact Data Contract & Approved Company Information
 *
 * ARCHITECTURAL NOTE:
 * This file provides typed data models and approved repository facts
 * for Page 28 (Contact).
 *
 * CONTENT INTEGRITY POLICY:
 * In accordance with repository content integrity rules, only verified,
 * approved company contact information is included:
 * - Email: hello@musnad.tech (from Footer.contactEmail & messages/en.json)
 * - Location: Riyadh, Saudi Arabia (from Footer.location & messages/en.json)
 * - Response commitment: within two business days (from messages/en.json About.cta.badge)
 * - Official social profiles: X, LinkedIn, GitHub (from footer-config.ts)
 *
 * Unverified facts (e.g. phone numbers, fictitious office addresses,
 * unapproved next-step workflow claims) are strictly omitted.
 */

export interface ContactMethod {
  id: string;
  type: "email" | "address";
  label: string;
  value: string;
  href?: string;
  iconName: "mail" | "map-pin";
}

export interface ContactInfoData {
  email: string;
  emailHref: string;
  location: string;
  responseCommitment: string;
  responseDescription: string;
  methods: ContactMethod[];
}

/**
 * Future backend payload contract for when messaging/CRM integration is connected.
 */
export interface ContactFormPayload {
  inquiryType: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  currentProduct?: string;
  attachmentFileName?: string;
  message: string;
}

export const CONTACT_INFO_EN: ContactInfoData = {
  email: "hello@musnad.tech",
  emailHref: "mailto:hello@musnad.tech",
  location: "Riyadh, Saudi Arabia",
  responseCommitment: "Responses within two business days",
  responseDescription: "We respond to every inquiry personally.",
  methods: [
    {
      id: "email",
      type: "email",
      label: "EMAIL",
      value: "hello@musnad.tech",
      href: "mailto:hello@musnad.tech",
      iconName: "mail",
    },
    {
      id: "address",
      type: "address",
      label: "ADDRESS",
      value: "Riyadh, Saudi Arabia",
      iconName: "map-pin",
    },
  ],
};

export const CONTACT_INFO_AR: ContactInfoData = {
  email: "hello@musnad.tech",
  emailHref: "mailto:hello@musnad.tech",
  location: "الرياض، المملكة العربية السعودية",
  responseCommitment: "نرد خلال يومي عمل",
  responseDescription: "نقوم بالرد على كل استفسار بشكل شخصي.",
  methods: [
    {
      id: "email",
      type: "email",
      label: "البريد الإلكتروني",
      value: "hello@musnad.tech",
      href: "mailto:hello@musnad.tech",
      iconName: "mail",
    },
    {
      id: "address",
      type: "address",
      label: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      iconName: "map-pin",
    },
  ],
};

/**
 * Returns approved contact information for the specified locale.
 */
export function getContactInfo(locale: string = "en"): ContactInfoData {
  return locale === "ar" ? CONTACT_INFO_AR : CONTACT_INFO_EN;
}
