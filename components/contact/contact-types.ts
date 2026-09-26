import type { ContactInfoData, ContactFormPayload } from "@/data/contact";

export type { ContactInfoData, ContactFormPayload };

export interface ContactHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  homeLabel: string;
  contactLabel: string;
  breadcrumbLabel?: string;
  className?: string;
}

export interface ContactFormProps {
  className?: string;
}

export interface ContactInfoCardsProps {
  contactInfo: ContactInfoData;
  className?: string;
}
