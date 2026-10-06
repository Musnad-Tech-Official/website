import { HeroSection } from "@/components/hero";
import {
  TrustedCompanies,
  CapabilitiesSection,
  SelectedProjects,
  TeamPreview,
  TechnologiesSection,
  TestimonialsSection,
  LatestInsights,
  FinalCta,
} from "@/components/home";

import { PageGuard } from "@/lib/page-control/guard";
import { getArticlesAction } from "@/lib/articles/actions";
import { getTeamMembersAction } from "@/lib/team/actions";
import { getProjectsAction } from "@/lib/projects/actions";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: HomePageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [articles, dbTeamMembers, dbProjects] = await Promise.all([
    getArticlesAction("published"),
    getTeamMembersAction(true),
    getProjectsAction("published"),
  ]);

  const teamMembers = dbTeamMembers.map((m) => ({
    id: m.slug || m.id,
    slug: m.slug,
    name: isAr ? m.nameAr : m.nameEn,
    role: isAr ? m.roleAr : m.roleEn,
    bio: isAr ? m.bioAr : m.bioEn,
    initials: m.initials,
    image: m.image,
    skills: m.skills,
    socialLinks: m.socialLinks,
  }));

  const projects = dbProjects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: isAr ? p.titleAr || p.titleEn : p.titleEn || p.titleAr,
    description: isAr ? p.descriptionAr || p.descriptionEn : p.descriptionEn || p.descriptionAr,
    category: p.category,
    year: p.year,
    featured: p.featured,
    liveDemo: Boolean(p.liveDemoUrl),
    technologies: p.technologies,
    rating: p.rating,
    reviewCount: p.reviewCount,
    gradient: p.gradient,
    completed: true,
    image: p.image || p.coverImage || undefined,
    clientName: p.clientName || undefined,
    keyMetric: p.metrics && p.metrics.length > 0 ? {
      label: isAr ? p.metrics[0].labelAr || p.metrics[0].labelEn || p.metrics[0].label : p.metrics[0].labelEn || p.metrics[0].labelAr || p.metrics[0].label,
      value: p.metrics[0].value,
    } : undefined,
    metrics: p.metrics?.map((m) => ({
      label: isAr ? m.labelAr || m.labelEn || m.label : m.labelEn || m.labelAr || m.label,
      value: m.value,
      description: isAr ? m.descriptionAr || m.descriptionEn || m.description : m.descriptionEn || m.descriptionAr || m.description,
    })),
  }));

  return (
    <PageGuard slug="home" locale={locale}>
      <div className="w-full bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        {/* Hero (Pre-existing, untouched) */}
        <HeroSection />

        {/* 1. Trusted Companies strip */}
        <TrustedCompanies />

        {/* 2. Capabilities / Services */}
        <CapabilitiesSection />

        {/* 3. Selected Projects */}
        <SelectedProjects projects={projects} />

        {/* 4. Team Preview */}
        <TeamPreview members={teamMembers} />

        {/* 5. Technologies */}
        <TechnologiesSection />

        {/* 6. Testimonials */}
        <TestimonialsSection />

        {/* 7. Latest Insights */}
        <LatestInsights articles={articles} />

        {/* 8. Final CTA */}
        <FinalCta />
      </div>
    </PageGuard>
  );
}
