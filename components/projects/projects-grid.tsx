import { ProjectCard } from "./project-card";
import type { ProjectsGridProps } from "./projects-types";
import { cn } from "@/lib/utils";


export function ProjectsGrid({
  projects,
  locale,
  className = "",
}: ProjectsGridProps) {
  return (
    <section aria-label="Projects list" className={cn("w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </section>
  );
}
