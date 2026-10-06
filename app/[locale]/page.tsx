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

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: HomePageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [articles, dbTeamMembers] = await Promise.all([
    getArticlesAction("published"),
    getTeamMembersAction(true),
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
        <SelectedProjects />

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
