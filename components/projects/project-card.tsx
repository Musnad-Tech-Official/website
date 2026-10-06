/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { LuArrowUpRight, LuStar, LuSparkles } from "react-icons/lu";
import type { ProjectCardProps } from "./projects-types";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const tHome = useTranslations("Home.projects");
  const tProjects = useTranslations("Projects.card");

  const category = project.category || "Case Study";
  const year = project.year || "2025";
  const rating = project.rating ?? 4.9;
  const reviewCount = project.reviewCount ?? 32;
  const technologies = project.technologies || ["TypeScript", "Next.js", "PostgreSQL"];
  const gradient = project.gradient || "from-blue-600 via-indigo-600 to-violet-700";

  // Pick first metric if available
  const topMetric = project.keyMetric || (project.metrics && project.metrics.length > 0 ? project.metrics[0] : null);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl transition-all"
      aria-label={tProjects("viewProject", { title: project.title })}
    >
      <Card
        variant="interactive"
        className={cn(
          "h-full flex flex-col overflow-hidden p-0 rounded-2xl border border-border/70 bg-card/70 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
          className
        )}
      >
        {/* Media / Visual Hero Showcase */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-muted/40 border-b border-border/40 flex flex-col justify-between">
          {project.image ? (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/30 to-black/30 pointer-events-none" />
            </div>
          ) : (
            <>
              {/* Premium Gradient Canvas */}
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br opacity-85 group-hover:opacity-95 transition-opacity duration-500",
                  gradient
                )}
              />

              {/* Architectural Technical Mesh Grid */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.14] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Ambient Glowing Node */}
              <div
                aria-hidden="true"
                className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/20 blur-2xl pointer-events-none"
              />

              {/* Architectural telemetry / topology wire */}
              <div
                aria-hidden="true"
                className="absolute inset-x-5 bottom-4 h-24 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md p-3.5 shadow-2xl flex flex-col justify-between pointer-events-none group-hover:border-white/25 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                      SYS_SCALE // READY
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/50">{year}</div>
                </div>

                {/* Simulated Signal Bars */}
                <div className="flex items-end gap-1.5 h-8 pt-1">
                  <div className="w-1/6 bg-white/25 h-[40%] rounded-xs group-hover:h-[65%] transition-all duration-500" />
                  <div className="w-1/6 bg-white/35 h-[65%] rounded-xs group-hover:h-[85%] transition-all duration-500" />
                  <div className="w-1/6 bg-white/45 h-[80%] rounded-xs group-hover:h-[50%] transition-all duration-500" />
                  <div className="w-1/6 bg-white/60 h-[50%] rounded-xs group-hover:h-[95%] transition-all duration-500" />
                  <div className="w-1/6 bg-white/75 h-[90%] rounded-xs group-hover:h-[70%] transition-all duration-500" />
                  <div className="w-1/6 bg-emerald-400/90 h-[100%] rounded-xs group-hover:bg-emerald-300 transition-colors" />
                </div>
              </div>
            </>
          )}

          {/* Floating Badges Header */}
          <div className="relative z-10 flex items-center justify-between w-full p-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-black/60 text-white/95 backdrop-blur-md border border-white/15 shadow-sm">
              {category}
            </span>

            <div className="flex items-center gap-2">
              {project.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 backdrop-blur-md border border-amber-500/30 shadow-sm">
                  <LuSparkles className="h-3 w-3 text-amber-300" aria-hidden="true" />
                  <span>{tHome("featured")}</span>
                </span>
              )}

              {project.liveDemo && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 text-emerald-400 backdrop-blur-md border border-emerald-500/30 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span>{tHome("liveDemo")}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between text-start">
          <div>
            {/* Client & Year Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/80 mb-2">
              <span>{project.clientName || "Musnad Tech"}</span>
              <span aria-hidden="true">•</span>
              <span>{year}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">
              {project.title}
            </h3>

            {/* Outcome Metric Banner (Stripe / Linear style outcome-driven hook) */}
            {topMetric && (
              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                <span className="font-bold text-foreground">{topMetric.value}</span>
                <span className="text-muted-foreground text-[11px] truncate max-w-[180px]">
                  {topMetric.label}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Tech Chips */}
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
            <div className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
              <LuStar className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
              <span className="font-semibold text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviewCount})</span>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              <span>{tProjects("viewProjectAction")}</span>
              <LuArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5 rtl:-scale-x-100"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ProjectCard;
