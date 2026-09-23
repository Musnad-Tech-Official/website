export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export const PROJECTS_EN: Project[] = [
  {
    id: "sahim-analytics",
    slug: "sahim-analytics",
    title: "Sahim Analytics",
    description: "Explore the Sahim Analytics project case study.",
  },
  {
    id: "naft-deploy",
    slug: "naft-deploy",
    title: "Naft Deploy",
    description: "Explore the Naft Deploy project case study.",
  },
  {
    id: "rakeen-portal",
    slug: "rakeen-portal",
    title: "Rakeen Portal",
    description: "Explore the Rakeen Portal project case study.",
  },
  {
    id: "musnad-cli",
    slug: "musnad-cli",
    title: "Musnad CLI",
    description: "Explore the Musnad CLI project case study.",
  },
  {
    id: "wathq-observability",
    slug: "wathq-observability",
    title: "Wathq Observability",
    description: "Explore the Wathq Observability project case study.",
  },
  {
    id: "hudhud-chat",
    slug: "hudhud-chat",
    title: "Hudhud Chat",
    description: "Explore the Hudhud Chat project case study.",
  },
];

export const PROJECTS_AR: Project[] = [
  {
    id: "sahim-analytics",
    slug: "sahim-analytics",
    title: "سهم للتحليلات",
    description: "استعرض دراسة مشروع سهم للتحليلات.",
  },
  {
    id: "naft-deploy",
    slug: "naft-deploy",
    title: "نفط ديبلوي",
    description: "استعرض دراسة مشروع نفط ديبلوي.",
  },
  {
    id: "rakeen-portal",
    slug: "rakeen-portal",
    title: "بوابة ركين",
    description: "استعرض دراسة مشروع بوابة ركين.",
  },
  {
    id: "musnad-cli",
    slug: "musnad-cli",
    title: "مسند للطرفية",
    description: "استعرض دراسة مشروع مسند للطرفية.",
  },
  {
    id: "wathq-observability",
    slug: "wathq-observability",
    title: "واثق للرصد والمتابعة",
    description: "استعرض دراسة مشروع واثق للرصد والمتابعة.",
  },
  {
    id: "hudhud-chat",
    slug: "hudhud-chat",
    title: "محادثة هدهد",
    description: "استعرض دراسة مشروع محادثة هدهد.",
  },
];

/**
 * Returns localized project fixtures based on the active locale.
 */
export function getProjects(locale?: string): Project[] {
  return locale === "ar" ? PROJECTS_AR : PROJECTS_EN;
}

/**
 * Finds a specific project fixture by slug.
 */
export function getProjectBySlug(slug: string, locale?: string): Project | undefined {
  const projects = getProjects(locale);
  return projects.find((p) => p.slug === slug);
}
