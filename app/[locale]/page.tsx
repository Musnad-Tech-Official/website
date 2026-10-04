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

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: HomePageProps) {
  const { locale } = await params;
  const articles = await getArticlesAction("published");

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
        <TeamPreview />

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
