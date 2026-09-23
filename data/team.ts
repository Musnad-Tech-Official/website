export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  image?: string;
  skills: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    x?: string;
  };
}

export interface TeamStat {
  id: string;
  value: string;
  label: string;
  iconType: "capabilities" | "bilingual" | "architecture";
}

export const TEAM_MEMBERS_EN: TeamMember[] = [
  {
    id: "shaher-alward",
    name: "Shaher Alward",
    role: "Team Lead / Product Lead",
    bio: "Team Lead and Product Lead at Musnad Tech.",
    initials: "SA",
    skills: ["Product Leadership"],
  },
  {
    id: "sabri-alshaibani",
    name: "Sabri Alshaibani",
    role: "Engineering / Technical Lead",
    bio: "Engineering and Technical Lead at Musnad Tech.",
    initials: "SS",
    skills: ["Technical Leadership"],
  },
  {
    id: "islam-adel",
    name: "Islam Adel",
    role: "Software Engineer / Frontend Lead",
    bio: "Software Engineer and Frontend Lead at Musnad Tech.",
    initials: "IA",
    skills: ["Software Engineering", "Frontend"],
  },
];

export const TEAM_MEMBERS_AR: TeamMember[] = [
  {
    id: "shaher-alward",
    name: "شاهر الورد",
    role: "قائد الفريق / قائد المنتجات",
    bio: "قائد الفريق وقائد المنتجات في مسند للتقنية.",
    initials: "SA",
    skills: ["قيادة المنتجات"],
  },
  {
    id: "sabri-alshaibani",
    name: "صبري الشيباني",
    role: "القائد الهندسي / التقني",
    bio: "القائد الهندسي والتقني في مسند للتقنية.",
    initials: "SS",
    skills: ["القيادة التقنية"],
  },
  {
    id: "islam-adel",
    name: "إسلام عادل",
    role: "مهندس برمجيات / قائد الواجهات",
    bio: "مهندس برمجيات وقائد الواجهات في مسند للتقنية.",
    initials: "IA",
    skills: ["هندسة البرمجيات", "الواجهات"],
  },
];

export const TEAM_STATS_EN: TeamStat[] = [
  {
    id: "capabilities",
    value: "Full-Stack",
    label: "Modern web, mobile & cloud systems",
    iconType: "capabilities",
  },
  {
    id: "bilingual",
    value: "Bilingual",
    label: "First-class Arabic & English experiences",
    iconType: "bilingual",
  },
  {
    id: "architecture",
    value: "Scalable Architecture",
    label: "Engineered for high performance, reliability, and scale",
    iconType: "architecture",
  },
];

export const TEAM_STATS_AR: TeamStat[] = [
  {
    id: "capabilities",
    value: "تطوير شامل",
    label: "أنظمة الويب والجوال والمنصات السحابية",
    iconType: "capabilities",
  },
  {
    id: "bilingual",
    value: "ثنائي اللغة",
    label: "تجارب عربية وإنجليزية أصلية ومتقنة",
    iconType: "bilingual",
  },
  {
    id: "architecture",
    value: "معمارية قابلة للتوسع",
    label: "مصممة بأعلى معايير الأداء والموثوقية والاستقرار",
    iconType: "architecture",
  },
];

/**
 * Returns localized team members based on locale ("en" | "ar").
 */
export function getTeamMembers(locale?: string): TeamMember[] {
  return locale === "ar" ? TEAM_MEMBERS_AR : TEAM_MEMBERS_EN;
}

/**
 * Returns localized team stats based on locale ("en" | "ar").
 */
export function getTeamStats(locale?: string): TeamStat[] {
  return locale === "ar" ? TEAM_STATS_AR : TEAM_STATS_EN;
}
