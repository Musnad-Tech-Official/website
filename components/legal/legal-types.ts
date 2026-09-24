export interface LegalSection {
  id: string;
  number: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalContactCardConfig {
  title: string;
  supportingLinePrefix: string;
  email: string;
  buttonText: string;
}

export interface LegalPageConfig {
  slug: string;
  breadcrumbHome: string;
  breadcrumbLegal: string;
  breadcrumbCurrent: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  introNote: string;
  onThisPageLabel: string;
  sections: LegalSection[];
  contactCard: LegalContactCardConfig;
}

export interface LegalPageTemplateProps {
  config: LegalPageConfig;
  className?: string;
}

export interface LegalPageIntroProps {
  breadcrumbHome: string;
  breadcrumbLegal: string;
  breadcrumbCurrent: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  introNote: string;
  className?: string;
}

export interface LegalTocProps {
  sections: LegalSection[];
  onThisPageLabel: string;
  className?: string;
}

export interface LegalSectionContentProps {
  section: LegalSection;
  className?: string;
}

export interface LegalContactCardProps {
  config: LegalContactCardConfig;
  className?: string;
}
