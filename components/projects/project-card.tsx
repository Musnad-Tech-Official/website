/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { LuArrowUpRight, LuSparkles, LuGlobe } from "react-icons/lu";
import type { ProjectCardProps } from "./projects-types";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const tHome = useTranslations("Home.projects");
  const tProjects = useTranslations("Projects.card");

  const category = project.category || "Case Study";
  const year = project.year || "2025";
  const technologies = project.technologies || ["TypeScript", "Next.js", "PostgreSQL"];
  const gradient = project.gradient || "from-blue-600 via-indigo-600 to-violet-700";

  // Pick first outcome metric if available
  const topMetric = project.keyMetric || (project.metrics && project.metrics.length > 0 ? project.metrics[0] : null);

  // Compute clean 2-letter monogram
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
          "h-full flex flex-col overflow-hidden p-0 rounded-2xl border border-border/70 bg-card/60 dark:bg-zinc-950/60 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5",
          className
        )}
      >
        {/* Media / Visual Showcase (16:10 aspect ratio) */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-muted/40 border-b border-border/40 flex flex-col justify-between">
          {project.image ? (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-black/20 pointer-events-none" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {/* Refined Ambient Gradient Canvas */}
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br opacity-80 group-hover:opacity-95 transition-opacity duration-500",
                  gradient
                )}
              />

              {/* Minimalist dot grid */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Ambient radial lighting halo */}
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/20 blur-3xl pointer-events-none"
              />

              {/* Elegant Monogram Emblem */}
              <div className="relative z-10 flex flex-col items-center gap-2 select-none">
                <div className="h-16 w-16 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl flex items-center justify-center text-white font-extrabold text-xl tracking-wider shadow-2xl group-hover:scale-105 group-hover:border-white/35 transition-all duration-300">
                  {monogram}
                </div>
                <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
                  {category}
                </span>
              </div>
            </div>
          )}

          {/* Floating Badges Header */}
          <div className="relative z-10 flex items-center justify-between w-full p-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-black/60 text-white/95 backdrop-blur-md border border-white/15 shadow-xs">
              {category}
            </span>

            <div className="flex items-center gap-2">
              {project.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 backdrop-blur-md border border-amber-500/30 shadow-xs">
                  <LuSparkles className="h-3 w-3 text-amber-300" aria-hidden="true" />
                  <span>{tHome("featured")}</span>
                </span>
              )}

              {project.liveDemo && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 text-emerald-400 backdrop-blur-md border border-emerald-500/30 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span>{tHome("liveDemo")}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between text-start">
          <div>
            {/* Client & Year Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/80 mb-2">
              <span className="truncate max-w-[200px]">{project.clientName || "Musnad Tech"}</span>
              <span aria-hidden="true">•</span>
              <span>{year}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">
              {project.title}
            </h3>

            {/* Outcome Metric Pill (Linear / Stripe style outcome highlight) */}
            {topMetric && (
              <div className="mt-3 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary">
                <span className="font-extrabold text-foreground font-mono text-sm">{topMetric.value}</span>
                <span className="text-muted-foreground text-[11px] truncate max-w-[200px]">
                  {topMetric.label}
                </span>
              </div>
            )}

            {/* Narrative Description */}
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Minimalist Tech Tags */}
            <div
              className="mt-4 flex flex-wrap items-center gap-1.5"
              aria-label="Used technologies"
            >
              {technologies.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[11px] font-mono font-medium text-muted-foreground/90 bg-muted/70 px-2 py-0.5 rounded-md border border-border/50"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="text-[11px] font-mono text-muted-foreground/60 px-1">
                  +{technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Meta & Action Row */}
          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span className="font-semibold uppercase tracking-wider text-foreground/80">
                {project.clientName || "Production"}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              <span>{tProjects("viewProjectAction")}</span>
              <div className="h-6 w-6 rounded-full bg-muted/60 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <LuArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ProjectCard;
