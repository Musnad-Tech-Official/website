/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LuChevronRight,
  LuLayers,
  LuCalendar,
  LuCode,
  LuTag,
  LuUser,
  LuArrowUpRight,
  LuLock,
  LuExternalLink,
  LuSparkles,
} from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import type { ProjectDetailHeaderProps } from "./project-detail-types";
import { TechnologyBadge } from "@/components/ui/technology-badge";
import { cn } from "@/lib/utils";

function renderMetaIcon(iconType: string) {
  const iconProps = { className: "h-4 w-4 text-primary shrink-0" };
  switch (iconType) {
    case "layer":
      return <LuLayers {...iconProps} />;
    case "calendar":
      return <LuCalendar {...iconProps} />;
    case "code":
      return <LuCode {...iconProps} />;
    case "user":
      return <LuUser {...iconProps} />;
    case "tag":
    default:
      return <LuTag {...iconProps} />;
  }
}

export function ProjectDetailHeader({
  title,
  subtitle,
  eyebrowBadges,
  actions,
  metaBar,
  homeLabel,
  projectsLabel,
  breadcrumbLabel = "Breadcrumb",
  image,
  gradient = "from-blue-600 via-indigo-600 to-violet-700",
  category,
  clientName,
  year,
  liveDemoUrl,
  githubUrl,
  technologies,
  className = "",
}: ProjectDetailHeaderProps) {
  return (
    <header className={cn("pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-border/50", className)}>
      {/* 1. Breadcrumb navigation */}
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

      {/* 2. Top Badges & Meta Eyebrow */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        {category && (
          <Badge variant="default" size="sm" className="font-medium bg-primary/10 text-primary border-primary/20">
            {category}
          </Badge>
        )}

        {clientName && (
          <span className="text-xs font-mono text-muted-foreground">
            {clientName}
          </span>
        )}

        {year && (
          <>
            <span className="text-muted-foreground/40 text-xs" aria-hidden="true">•</span>
            <span className="text-xs font-mono text-muted-foreground">{year}</span>
          </>
        )}

        {eyebrowBadges &&
          eyebrowBadges.map((badge, idx) => (
            <Badge key={idx} variant={badge.variant || "secondary"} size="sm">
              {badge.label}
            </Badge>
          ))}
      </div>

      {/* 3. Hero Headline */}
      <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.12] max-w-4xl">
        {title}
      </h1>

      {/* 4. Executive Summary / Subtitle */}
      {subtitle && (
        <p className="mt-4 sm:mt-5 text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* 5. Action Hub */}
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

      {/* 6. Cinematic Project Cover Showcase */}
      <div className="mt-8 sm:mt-12 relative w-full">
        {/* Ambient Color Glow behind container */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute -inset-4 sm:-inset-6 rounded-3xl bg-linear-to-r opacity-25 blur-3xl pointer-events-none transition-all duration-700",
            gradient
          )}
        />

        {/* Cinematic Cover Frame */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-border/70 dark:border-white/10 bg-card dark:bg-zinc-950 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
            {image ? (
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Overlay Badge */}
                <div className="absolute bottom-4 start-4 sm:bottom-6 sm:start-6 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/70 text-white backdrop-blur-md border border-white/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{category || "Verified Case Study"}</span>
                  </span>
                  {year && (
                    <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-black/60 text-white/80 backdrop-blur-md border border-white/10">
                      {year}
                    </span>
                  )}
                </div>
              </div>
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
                <div className="relative z-10 max-w-lg p-6 sm:p-8 rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-white shadow-inner font-extrabold text-2xl font-mono">
                    {title.split(/\s+/).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                  <span className="text-xs font-mono text-white/70 uppercase tracking-widest">
                    {category || "Engineering Architecture"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 7. Technologies Strip using identical Home Page design (TechnologyBadge) */}
        {technologies && technologies.length > 0 && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground shrink-0">
              Stack & Tools //
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {technologies.map((tech, idx) => (
                <TechnologyBadge key={idx} name={tech} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. Meta Bar (4-item grid) */}
      {metaBar && metaBar.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
          {metaBar.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/60"
            >
              <div className="p-2 rounded-lg bg-background border border-border/60 shrink-0">
                {renderMetaIcon(item.iconType)}
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                  {item.label}
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-foreground mt-0.5 truncate">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

export default ProjectDetailHeader;
