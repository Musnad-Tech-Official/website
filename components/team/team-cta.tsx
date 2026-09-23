import React from "react";
import { CtaSection } from "@/components/ui/cta-section";
import type { TeamCtaProps } from "./team-types";

export function TeamCta({
  eyebrow,
  title,
  subtitle,
  discussProjectLabel,
  exploreProjectsLabel,
  careersLabel,
  startProjectLabel,
  contactHref = "/contact",
  projectsHref = "/projects",
  className = "",
}: TeamCtaProps) {
  const primaryLabel = discussProjectLabel || startProjectLabel || "Discuss Your Project";
  const secondaryLabel = exploreProjectsLabel || careersLabel || "Explore Projects";

  return (
    <CtaSection
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryAction={{
        label: primaryLabel,
        href: contactHref,
        variant: "primary",
        showArrow: true,
      }}
      secondaryAction={{
        label: secondaryLabel,
        href: projectsHref,
        variant: "outline",
      }}
      className={className}
    />
  );
}
