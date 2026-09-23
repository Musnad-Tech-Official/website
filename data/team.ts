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
  eyebrow: string;
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
    eyebrow: "Thoughtful Engineering",
    value: "Built to Scale",
    label: "Maintainable architecture designed for high performance, reliability, and continuous evolution.",
    iconType: "capabilities",
  },
  {
    id: "bilingual",
    eyebrow: "Native Bilingual",
    value: "Bilingual by Default",
    label: "First-class Arabic and English digital experiences with meticulous RTL and LTR ergonomics.",
    iconType: "bilingual",
  },
  {
    id: "architecture",
    eyebrow: "Product Strategy",
    value: "Clarity at Every Step",
    label: "Engineering guided by real user needs, clean code standards, and transparent partnership.",
    iconType: "architecture",
  },
];

export const TEAM_STATS_AR: TeamStat[] = [
  {
    id: "capabilities",
    eyebrow: "هندسة برمجية متقنة",
    value: "مبني ليتوسع ويدوم",
    label: "معمارية برمجية متينة مصممة لأعلى مستويات الأداء والموثوقية والتطور المستمر.",
    iconType: "capabilities",
  },
  {
    id: "bilingual",
    eyebrow: "ثنائي اللغة بأصالة",
    value: "تجربة عربية وعالمية",
    label: "تجارب رقمية أصيلة باللغتين العربية والإنجليزية مع إتقان فائق لتفاصيل الاتجاه والتصميم.",
    iconType: "bilingual",
  },
  {
    id: "architecture",
    eyebrow: "رؤية واستراتيجية المنتج",
    value: "وضوح في كل مرحلة",
    label: "تطوير برمجيات ينطلق من الاحتياج الفعلي مع شفافية كاملة ومعايير شيفرة عالمية.",
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
