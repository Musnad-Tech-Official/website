/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { LuChevronRight, LuExternalLink, LuArrowUpRight } from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import type { ProjectDetailHeaderProps } from "./project-detail-types";
import { TechnologyBadge } from "@/components/ui/technology-badge";
import { cn } from "@/lib/utils";

export function ProjectDetailHeader({
  title,
  subtitle,
  actions,
  homeLabel,
  projectsLabel,
  breadcrumbLabel = "Breadcrumb",
  image,
  gradient = "from-zinc-900 via-neutral-900 to-zinc-950",
  category,
  liveDemoUrl,
  githubUrl,
  technologies,
  className = "",
}: ProjectDetailHeaderProps) {
  return (
    <header className={cn("pt-6 sm:pt-10 pb-10 sm:pb-14 border-b border-border/40", className)}>
      {/* 1. Clean Breadcrumbs */}
      <nav aria-label={breadcrumbLabel} className="mb-6 sm:mb-8">
        <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
            >
              {homeLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="select-none text-muted-foreground/60">
            <LuChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </li>
          <li>
            <Link
              href="/projects"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
            >
              {projectsLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="select-none text-muted-foreground/60">
            <LuChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </li>
          <li aria-current="page" className="font-semibold text-foreground truncate max-w-[220px] sm:max-w-xs">
            {title}
          </li>
        </ol>
      </nav>

      {/* 2. Category Eyebrow */}
      {category && (
        <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold block mb-2">
          {category}
        </span>
      )}

      {/* 3. Hero Title */}
      <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.12] max-w-4xl">
        {title}
      </h1>

      {/* 4. Short Description */}
      {subtitle && (
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* 5. Live Actions */}
      <div className="flex items-center flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
        {liveDemoUrl && (
          <a
            href={liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="primary"
              size="lg"
              className="gap-2 shadow-lg shadow-primary/20"
            >
              <span>Live Demonstration</span>
              <LuExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="outline" size="lg" className="gap-2">
              <FaGithub className="h-4 w-4" />
              <span>Repository</span>
            </Button>
          </a>
        )}

        {actions &&
          actions
            .filter((a) => a.href !== liveDemoUrl && a.href !== githubUrl)
            .map((action, idx) => {
              const isExternal = action.href?.startsWith("http");
              const btn = (
                <Button
                  variant={action.variant || (idx === 0 && !liveDemoUrl ? "primary" : "outline")}
                  size="lg"
                  rightIcon={
                    isExternal ? (
                      <LuArrowUpRight className="h-4 w-4 rtl:-rotate-90" />
                    ) : undefined
                  }
                >
                  {action.label}
                </Button>
              );

              if (!action.href) {
                return <React.Fragment key={idx}>{btn}</React.Fragment>;
              }

              if (isExternal) {
                return (
                  <a
                    key={idx}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    {btn}
                  </a>
                );
              }

              return (
                <Link key={idx} href={action.href} className="inline-block">
                  {btn}
                </Link>
              );
            })}
      </div>

      {/* 6. Prominent Cinematic Cover Showcase */}
      <div className="mt-8 sm:mt-12 relative w-full">
        {/* Subtle Ambient Color Glow */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute -inset-4 sm:-inset-6 rounded-3xl bg-linear-to-r opacity-25 blur-3xl pointer-events-none",
            gradient
          )}
        />

        {/* Clean Cover Frame */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-border/70 dark:border-white/10 bg-card dark:bg-zinc-950 shadow-2xl overflow-hidden">
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className={cn("absolute inset-0 bg-linear-to-br opacity-80", gradient)} />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1.5px, transparent 0)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="relative z-10 p-6 rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-white shadow-inner font-extrabold text-2xl font-mono">
                    {title.split(/\s+/).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 7. Technologies Strip (exact same design as home page) */}
        {technologies && technologies.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {technologies.map((tech, idx) => (
              <TechnologyBadge key={idx} name={tech} />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default ProjectDetailHeader;
