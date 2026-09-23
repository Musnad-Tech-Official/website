import React from "react";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuArrowUpRight, LuStar } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { ServiceProjectCardProps } from "./service-detail-types";

export function ServiceProjectCard({
  project,
  title,
  category,
  description,
  featuredLabel,
  liveDemoLabel,
  completedLabel,
  className = "",
}: ServiceProjectCardProps) {
  return (
    <Link
      href={project.href}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl transition-transform"
      aria-label={`${title} — ${category}`}
    >
      <Card
        variant="interactive"
        className={cn(
          "h-full flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-200 p-0 shadow-xs",
          className
        )}
      >
        {/* Media / Visual Area */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted/40 border-b border-border/50 p-4 flex flex-col justify-between">
          {/* Subtle Ambient Background Gradient */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-90",
              project.gradient || "from-zinc-900 via-neutral-900 to-zinc-950"
            )}
          />

          {/* Wireframe UI representation */}
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-14 bottom-4 rounded-t-lg border border-white/10 bg-black/40 p-3 shadow-inner backdrop-blur-xs flex flex-col gap-2 pointer-events-none"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500/80" />
                <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-2 w-16 rounded-full bg-white/20" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="h-8 rounded bg-white/5 border border-white/5" />
              <div className="h-8 rounded bg-white/5 border border-white/5" />
              <div className="h-8 rounded bg-white/5 border border-white/5" />
            </div>
          </div>

          {/* Top Badges Row */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-black/70 text-white/90 backdrop-blur-md border border-white/10 select-none">
              {category}
            </span>

            {project.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-primary text-white shadow-xs select-none">
                <span aria-hidden="true">★</span>
                <span>{featuredLabel}</span>
              </span>
            )}
          </div>

          {/* Live Demo Status Pill */}
          {project.liveDemo && (
            <div className="relative z-10 self-end rtl:self-start">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-black/80 text-white/95 backdrop-blur-md border border-white/15 shadow-xs select-none">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
                  aria-hidden="true"
                />
                <span>{liveDemoLabel}</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Content Body */}
        <div className="p-6 flex flex-col flex-1 justify-between text-start">
          <div>
            {/* Title & Arrow */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                  {title}
                </h3>
                <span className="block text-xs font-mono text-muted-foreground/80 mt-0.5">
                  {project.year}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors shrink-0"
              >
                <LuArrowUpRight className="h-4 w-4 rtl:-rotate-90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>

            {/* Tech Chips */}
            <div
              className="mt-5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/40"
              aria-label="Technologies used"
            >
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground/90 bg-muted/60 px-2 py-0.5 rounded-md"
                >
                  <span
                    className="h-1 w-1 rounded-full bg-blue-500"
                    aria-hidden="true"
                  />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Meta Row */}
          <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <div className="inline-flex items-center gap-1.5 font-medium">
              <LuStar
                className="h-3.5 w-3.5 fill-amber-400 text-amber-500"
                aria-hidden="true"
              />
              <span className="font-semibold text-foreground">
                {project.rating}
              </span>
              <span className="text-muted-foreground">
                ({project.reviewCount})
              </span>
            </div>

            <Badge
              variant="outline"
              size="sm"
              className="font-normal text-[11px]"
            >
              {completedLabel}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
