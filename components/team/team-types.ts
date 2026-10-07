export interface TeamMember {
  id: string;
  slug?: string;
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
    website?: string;
  };
}

export interface TeamStat {
  id: string;
  eyebrow: string;
  value: string;
  label: string;
  iconType: "capabilities" | "bilingual" | "architecture";
}

export function getTeamCultureStats(locale?: string): TeamStat[] {
  if (locale === "ar") {
    return [
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
  }
  return [
    {
      id: "capabilities",
      eyebrow: "Structured Engineering",
      value: "Built to scale & endure",
      label: "Resilient systems architecture built for high performance, reliability, and continuous evolution.",
      iconType: "capabilities",
    },
    {
      id: "bilingual",
      eyebrow: "Native Bilingual",
      value: "Arabic & Global first",
      label: "Authentic bilingual experiences with seamless direction, typography, and responsive UX.",
      iconType: "bilingual",
    },
    {
      id: "architecture",
      eyebrow: "Product Strategy",
      value: "Clarity at every milestone",
      label: "Software delivery rooted in actual business requirements, total transparency, and modern standards.",
      iconType: "architecture",
    },
  ];
}

export interface TeamHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  homeLabel: string;
  teamLabel: string;
  breadcrumbLabel?: string;
  className?: string;
}

export interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

export interface TeamGridProps {
  members: TeamMember[];
  className?: string;
}

export interface TeamCultureProps {
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
  stats: TeamStat[];
  className?: string;
}

export interface TeamCtaProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  discussProjectLabel?: string;
  exploreProjectsLabel?: string;
  careersLabel?: string;
  startProjectLabel?: string;
  contactHref?: string;
  projectsHref?: string;
  careersHref?: string;
  className?: string;
}

