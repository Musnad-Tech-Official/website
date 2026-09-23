import React from "react";
import { ProjectCard } from "@/components/projects/project-card";
import type { ProjectDetailRelatedProps } from "./project-detail-types";
import { cn } from "@/lib/utils";

export function ProjectDetailRelated({
  title,
  projects,
  locale,
  className = "",
}: ProjectDetailRelatedProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section
      aria-labelledby="detail-related-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      <h2
        id="detail-related-heading"
        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8"
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </section>
  );
}
