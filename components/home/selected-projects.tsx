import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight, LuArrowUpRight, LuStar } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FEATURED_PROJECTS } from "./home-data";
import { cn } from "@/lib/utils";

export interface SelectedProjectsProps {
  className?: string;
}

export function SelectedProjects({ className = "" }: SelectedProjectsProps) {
  const t = useTranslations("Home.projects");

  return (
    <section
      id="projects"
      aria-labelledby="selected-projects-heading"
      className={cn("w-full py-16 sm:py-20 lg:py-24 border-t border-border/40", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="max-w-2xl text-start">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("eyebrow")}
            </span>
            <h2
              id="selected-projects-heading"
              className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            >
              {t("heading")}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md py-1"
            >
              <span>{t("viewAll")}</span>
              <LuArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* 3 Featured Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PROJECTS.map((project) => {
            const title = t(`items.${project.itemKey}.title`);
            const category = t(`items.${project.itemKey}.category`);
            const description = t(`items.${project.itemKey}.description`);

            return (
              <Card
                key={project.id}
                variant="interactive"
                className="group relative flex flex-col overflow-hidden p-0"
              >
                {/* Media / Visual Area */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted/30 border-b border-border/40 p-4 flex flex-col justify-between">
                  {/* Subtle Grid Backdrop */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-90",
                      project.gradient
                    )}
                  />

                  {/* Wireframe UI representation */}
                  <div className="absolute inset-x-6 top-14 bottom-4 rounded-t-lg border border-white/10 bg-black/40 p-3 shadow-inner backdrop-blur-xs flex flex-col gap-2 pointer-events-none">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-black/70 text-white/90 backdrop-blur-md border border-white/10">
                      {category}
                    </span>

                    {project.featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-primary text-white shadow-xs">
                        <span aria-hidden="true">★</span>
                        <span>{t("featured")}</span>
                      </span>
                    )}
                  </div>

                  {/* Live Demo Status Pill */}
                  {project.liveDemo && (
                    <div className="relative z-10 self-end rtl:self-start">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-black/80 text-white/95 backdrop-blur-md border border-white/15 shadow-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                        <span>{t("liveDemo")}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between text-start">
                  <div>
                    {/* Title & External Link */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                          {title}
                        </h3>
                        <span className="block text-xs font-mono text-muted-foreground/80 mt-0.5">
                          {project.year}
                        </span>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
                        <LuArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>

                    {/* Tech Chips */}
                    <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/40" aria-label="Used technologies">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground/90 bg-muted/60 px-2 py-0.5 rounded-md"
                        >
                          <span className="h-1 w-1 rounded-full bg-foreground/40" aria-hidden="true" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Meta Row */}
                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-1.5 font-medium">
                      <LuStar className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
                      <span className="font-semibold text-foreground">{project.rating}</span>
                      <span className="text-muted-foreground">({project.reviewCount})</span>
                    </div>

                    <Badge variant="outline" size="sm" className="font-normal text-[11px]">
                      {t("completed")}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
