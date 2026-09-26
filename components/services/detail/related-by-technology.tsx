import React from "react";
import { Link } from "@/i18n/routing";
import { LuArrowRight, LuFolderGit2, LuLayers } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { RelatedByTechnologyProps } from "./service-detail-types";

export function RelatedByTechnology({
  eyebrow,
  heading,
  projectsEyebrow,
  servicesEyebrow,
  projects,
  services,
  getProjectTranslations,
  getServiceTranslations,
  className = "",
}: RelatedByTechnologyProps) {
  return (
    <section
      className={cn("pt-16 sm:pt-20 border-t border-border/40 text-start", className)}
      aria-labelledby="related-by-technology-heading"
    >
      {/* Header with decorative badge */}
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-muted-foreground shadow-2xs"
        >
          <LuLayers className="h-4.5 w-4.5" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            {eyebrow}
          </span>
          <h2
            id="related-by-technology-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground"
          >
            {heading}
          </h2>
        </div>
      </div>

      {/* Two columns: Left = Projects, Right = Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mt-8 sm:mt-10">
        {/* PROJECTS Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/60" aria-hidden="true" />
            <span>{projectsEyebrow}</span>
          </div>

          <div className="space-y-3">
            {projects.map((item) => {
              const trans = getProjectTranslations(item.itemKey);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-200 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* Small visual thumbnail / placeholder */}
                    <div
                      aria-hidden="true"
                      className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors shadow-2xs"
                    >
                      <LuFolderGit2 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {trans.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {trans.category} · {item.year}
                      </p>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
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
                  </div>

                  {/* Trailing arrow button */}
                  <div
                    aria-hidden="true"
                    className="shrink-0 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-border/60 bg-muted/20 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors"
                  >
                    <LuArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SERVICES Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{servicesEyebrow}</span>
          </div>

          <div className="space-y-3">
            {services.map((service) => {
              const ServiceIcon = service.icon;
              const trans = getServiceTranslations(service.serviceKey);
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-200 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* Service Icon Box */}
                    <div
                      aria-hidden="true"
                      className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors shadow-2xs"
                    >
                      <ServiceIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {trans.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 leading-relaxed">
                        {trans.description}
                      </p>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
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
                  </div>

                  {/* Trailing arrow button */}
                  <div
                    aria-hidden="true"
                    className="shrink-0 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-border/60 bg-muted/20 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors"
                  >
                    <LuArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
