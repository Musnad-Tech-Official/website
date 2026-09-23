import React from "react";
import { CTA } from "@/components/ui/cta-section";
import type { ProjectsCtaProps } from "./projects-types";


export function ProjectsCta({
  title = "Have a project in mind?",
  subtitle = "Tell us about what you want to build.",
  buttonLabel = "Start a project inquiry",
  contactHref = "/contact",
  className = "",
}: ProjectsCtaProps) {
  return (
    <CTA
      variant="projects"
      title={title}
      subtitle={subtitle}
      buttonLabel={buttonLabel}
      contactHref={contactHref}
      className={className}
    />
  );
}
