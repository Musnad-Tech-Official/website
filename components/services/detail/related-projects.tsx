import React from "react";
import { ServiceProjectCard } from "./service-project-card";
import type { RelatedProjectsProps } from "./service-detail-types";
import { cn } from "@/lib/utils";

export function RelatedProjects({
  eyebrow,
  heading,
  projects,
  featuredLabel,
  liveDemoLabel,
  completedLabel,
  getProjectTranslations,
  className = "",
}: RelatedProjectsProps) {
  return (
    <section
      id="related-projects"
      className={cn("scroll-mt-24 pt-16 sm:pt-20 border-t border-border/40 text-start", className)}
      aria-labelledby="related-projects-heading"
    >
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
          {eyebrow}
        </span>
        <h2
          id="related-projects-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground"
        >
          {heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 sm:mt-10">
        {projects.map((project) => {
          const trans = getProjectTranslations(project.itemKey);
          return (
            <ServiceProjectCard
              key={project.id}
              project={project}
              title={trans.title}
              category={trans.category}
              description={trans.description}
              featuredLabel={featuredLabel}
              liveDemoLabel={liveDemoLabel}
              completedLabel={completedLabel}
            />
          );
        })}
      </div>
    </section>
  );
}
