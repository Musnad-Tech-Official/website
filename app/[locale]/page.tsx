import { HeroSection } from "@/components/hero";
import {
  TrustedCompanies,
  CapabilitiesSection,
  SelectedProjects,
  TeamPreview,
  TechnologiesSection,
  TestimonialsSection,
  TrustMetrics,
  LatestInsights,
  FinalCta,
} from "@/components/home";

export default function Page() {
  return (
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

      {/* 7. Trust Metrics Row */}
      <TrustMetrics />

      {/* 8. Latest Insights */}
      <LatestInsights />

      {/* 9. Final CTA */}
      <FinalCta />
    </div>
  );
}
