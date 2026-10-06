/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { LuArrowUpRight } from "react-icons/lu";
import type { ProjectCardProps } from "./projects-types";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const tProjects = useTranslations("Projects.card");

  const category = project.category || "Case Study";
  const technologies = project.technologies || [];
  const gradient = project.gradient || "from-zinc-900 via-neutral-900 to-zinc-950";

  // Clean monogram for placeholder
  const monogram = project.title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl transition-transform"
      aria-label={tProjects("viewProject", { title: project.title })}
    >
      <Card
        variant="interactive"
        className={cn(
          "h-full flex flex-col overflow-hidden p-0 rounded-2xl border border-border/70 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl",
          className
        )}
      >
        {/* Clean Media Showcase */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-muted/30 border-b border-border/40">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-zinc-950">
              <div className={cn("absolute inset-0 bg-linear-to-br opacity-70", gradient)} />
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.1]"
                style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative z-10 h-14 w-14 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-lg tracking-wider shadow-lg group-hover:scale-105 transition-transform">
                {monogram}
              </div>
            </div>
          )}
        </div>

        {/* Clean Content Body */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between text-start">
          <div>
            {/* Category */}
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
              {category}
            </span>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight mt-1.5 leading-snug">
              {project.title}
            </h3>

            {/* Short Description */}
            <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Subtle Tech Tags */}
            {technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {technologies.slice(0, 4).map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/40"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="text-[11px] text-muted-foreground/60 px-1">
                    +{technologies.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Minimal Bottom Action */}
          <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            <span className="font-semibold text-xs">
              {tProjects("viewProjectAction")}
            </span>
            <LuArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5 rtl:-scale-x-100 text-primary" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ProjectCard;
