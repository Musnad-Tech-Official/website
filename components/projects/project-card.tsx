import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { LuArrowUpRight } from "react-icons/lu";
import type { ProjectCardProps } from "./projects-types";
import { cn } from "@/lib/utils";


export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const t = useTranslations("Projects.card");

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl transition-transform"
      aria-label={t("viewProject", { title: project.title })}
    >
      <Card
        variant="interactive"
        className={cn(
          "h-full flex flex-col overflow-hidden border border-border/80 bg-card hover:border-primary/50 transition-all duration-200",
          className
        )}
      >
        {/* Decorative thumbnail canvas */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-linear-to-br from-muted/90 via-muted/40 to-background border-b border-border/60 flex items-center justify-center">
          {/* Subtle architectural background texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.12] dark:opacity-[0.18] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Ambient gradient aura */}
          <div
            aria-hidden="true"
            className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl dark:bg-primary/20 pointer-events-none"
          />

          {/* Subtle decorative center emblem */}
          <div
            aria-hidden="true"
            className="h-12 w-12 rounded-xl border border-border/60 bg-background/50 backdrop-blur-xs flex items-center justify-center text-muted-foreground/60 shadow-xs"
          >
            <LuArrowUpRight className="h-5 w-5 rtl:-rotate-90" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Title & Arrow */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
              {project.title}
            </h2>

            <div
              aria-hidden="true"
              className="h-8 w-8 rounded-full border border-border/70 bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/5 transition-all shrink-0"
            >
              <LuArrowUpRight className="h-4 w-4 rtl:-rotate-90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Neutral description */}
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Bottom action link */}
          <div className="mt-auto pt-6 border-t border-border/60 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
            <span>{t("viewProjectAction")}</span>
            <LuArrowUpRight
              className="h-3.5 w-3.5 rtl:-rotate-90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
