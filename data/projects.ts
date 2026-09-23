export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category?: string;
  year?: string;
  featured?: boolean;
  liveDemo?: boolean;
  technologies?: string[];
  rating?: number;
  reviewCount?: number;
  gradient?: string;
  completed?: boolean;
}

export const PROJECTS_EN: Project[] = [
  {
    id: "sahim-analytics",
    slug: "sahim-analytics",
    title: "Sahim Analytics",
    description: "A streaming analytics platform that aggregates market signals and turns them into actionable insight with sub-second latency.",
    category: "Fintech Platform",
    year: "2024",
    featured: true,
    liveDemo: true,
    technologies: ["TypeScript", "Go", "PostgreSQL", "Redis"],
    rating: 4.7,
    reviewCount: 38,
    gradient: "from-zinc-900 via-neutral-900 to-zinc-950",
    completed: true,
  },
  {
    id: "naft-deploy",
    slug: "naft-deploy",
    title: "Naft Deploy",
    description: "An open-source deployment tool that gives small teams push-to-deploy without operating a full Kubernetes cluster.",
    category: "Developer Tool",
    year: "2024",
    featured: true,
    liveDemo: true,
    technologies: ["Go", "Rust", "Docker", "TypeScript"],
    rating: 4.9,
    reviewCount: 124,
    gradient: "from-stone-900 via-zinc-900 to-neutral-950",
    completed: true,
  },
  {
    id: "rakeen-portal",
    slug: "rakeen-portal",
    title: "Rakeen Portal",
    description: "A secure, bilingual client portal for document exchange, case tracking, and confidential communication.",
    category: "Client Portal",
    year: "2023",
    featured: true,
    liveDemo: true,
    technologies: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
    rating: 4.6,
    reviewCount: 22,
    gradient: "from-neutral-900 via-zinc-900 to-stone-950",
    completed: true,
  },
  {
    id: "musnad-cli",
    slug: "musnad-cli",
    title: "Musnad CLI",
    description: "High-performance developer command-line interface for project scaffolding, linting, and cloud deployments.",
    category: "CLI & Tooling",
    year: "2024",
    featured: false,
    liveDemo: false,
    technologies: ["Go", "Cobra", "gRPC", "Docker"],
    rating: 4.8,
    reviewCount: 45,
    gradient: "from-zinc-900 via-slate-900 to-neutral-950",
    completed: true,
  },
  {
    id: "wathq-observability",
    slug: "wathq-observability",
    title: "Wathq Observability",
    description: "Distributed telemetry and observability stack replacing costly vendor SaaS with self-hosted telemetry.",
    category: "Observability",
    year: "2023",
    featured: false,
    liveDemo: true,
    technologies: ["OpenTelemetry", "ClickHouse", "Go", "Grafana"],
    rating: 4.9,
    reviewCount: 67,
    gradient: "from-slate-900 via-zinc-900 to-black",
    completed: true,
  },
  {
    id: "hudhud-chat",
    slug: "hudhud-chat",
    title: "Hudhud Chat",
    description: "Enterprise real-time conversational agent with bidirectional audio, RAG search, and bilingual support.",
    category: "AI & Realtime",
    year: "2024",
    featured: false,
    liveDemo: true,
    technologies: ["Python", "FastAPI", "WebSockets", "React"],
    rating: 4.8,
    reviewCount: 53,
    gradient: "from-neutral-900 via-stone-900 to-zinc-950",
    completed: true,
  },
];

export const PROJECTS_AR: Project[] = [
  {
    id: "sahim-analytics",
    slug: "sahim-analytics",
    title: "سهم للتحليلات",
    description: "منصة تحليلات فورية متدفقة لمعالجة إشارات السوق وتحويلها إلى رؤى استثمارية بزمن استجابة أقل من الثانية.",
    category: "منصة تقنية مالية",
    year: "2024",
    featured: true,
    liveDemo: true,
    technologies: ["TypeScript", "Go", "PostgreSQL", "Redis"],
    rating: 4.7,
    reviewCount: 38,
    gradient: "from-zinc-900 via-neutral-900 to-zinc-950",
    completed: true,
  },
  {
    id: "naft-deploy",
    slug: "naft-deploy",
    title: "نفط ديبلوي",
    description: "أداة نشر وتشغيل مفتوحة المصدر تتيح للفرق الصغيرة نشر تطبيقاتها تلقائياً دون تعقيد تشغيل عنقود كوبرنيتس كامل.",
    category: "أداة تطوير ونشر",
    year: "2024",
    featured: true,
    liveDemo: true,
    technologies: ["Go", "Rust", "Docker", "TypeScript"],
    rating: 4.9,
    reviewCount: 124,
    gradient: "from-stone-900 via-zinc-900 to-neutral-950",
    completed: true,
  },
  {
    id: "rakeen-portal",
    slug: "rakeen-portal",
    title: "بوابة ركين",
    description: "بوابة عملاء ثنائية اللغة فائقة الأمان لتبادل الوثائق الحساسة ومتابعة القضايا والتواصل المؤسسي المشفر.",
    category: "بوابة عملاء آمنة",
    year: "2023",
    featured: true,
    liveDemo: true,
    technologies: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
    rating: 4.6,
    reviewCount: 22,
    gradient: "from-neutral-900 via-zinc-900 to-stone-950",
    completed: true,
  },
  {
    id: "musnad-cli",
    slug: "musnad-cli",
    title: "مسند للطرفية",
    description: "واجهة سطر أوامر عالية الأداء للمطورين لإعداد وهيكلة المشاريع والتدقيق البرمجي والنشر السحابي.",
    category: "أدوات الطرفية والهندسة",
    year: "2024",
    featured: false,
    liveDemo: false,
    technologies: ["Go", "Cobra", "gRPC", "Docker"],
    rating: 4.8,
    reviewCount: 45,
    gradient: "from-zinc-900 via-slate-900 to-neutral-950",
    completed: true,
  },
  {
    id: "wathq-observability",
    slug: "wathq-observability",
    title: "واثق للرصد والمتابعة",
    description: "منظومة قياس عن بعد ورصد موزع مستضافة ذاتياً تستبدل الحلول التجارية وتقلل زمن الاستجابة للحوادث.",
    category: "الرصد والمراقبة السحابية",
    year: "2023",
    featured: false,
    liveDemo: true,
    technologies: ["OpenTelemetry", "ClickHouse", "Go", "Grafana"],
    rating: 4.9,
    reviewCount: 67,
    gradient: "from-slate-900 via-zinc-900 to-black",
    completed: true,
  },
  {
    id: "hudhud-chat",
    slug: "hudhud-chat",
    title: "محادثة هدهد",
    description: "منظومة محادثة ذكية للمؤسسات تدعم الصوت ثنائي الاتجاه والبحث الموثق RAG مع دعم أصيل للغتين.",
    category: "الذكاء الاصطناعي والمحادثة",
    year: "2024",
    featured: false,
    liveDemo: true,
    technologies: ["Python", "FastAPI", "WebSockets", "React"],
    rating: 4.8,
    reviewCount: 53,
    gradient: "from-neutral-900 via-stone-900 to-zinc-950",
    completed: true,
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
