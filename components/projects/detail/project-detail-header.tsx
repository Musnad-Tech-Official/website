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

      {/* 6. Cinematic Device / Browser Window Showcase */}
      <div className="mt-10 sm:mt-14 relative w-full">
        {/* Ambient Color Glow behind container */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute -inset-4 sm:-inset-6 rounded-3xl bg-linear-to-r opacity-25 blur-3xl pointer-events-none transition-all duration-700",
            gradient
          )}
        />

        {/* Browser Frame */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Browser Chrome Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/60 bg-muted/40 text-muted-foreground select-none">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* URL Bar Capsule */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 border border-border/60 text-[11px] sm:text-xs font-mono text-muted-foreground max-w-xs sm:max-w-md truncate shadow-inner">
              <LuLock className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="truncate">
                {liveDemoUrl ? liveDemoUrl.replace(/^https?:\/\//, "") : `musnad.tech/projects/${title.toLowerCase().replace(/\s+/g, "-")}`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/60 hidden sm:flex">
              <span>PROD</span>
            </div>
          </div>

          {/* Media Content Showcase */}
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-black/60 flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                {/* Gradient background */}
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-br opacity-70",
                    gradient
                  )}
                />

                {/* Grid Overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.15]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, #ffffff 1.5px, transparent 0)",
                    backgroundSize: "28px 28px",
                  }}
                />

                {/* Central System Architecture Graphic */}
                <div className="relative z-10 max-w-lg p-6 sm:p-8 rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shadow-inner">
                    <LuSparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 max-w-sm">
                    High-performance production architecture engineered by Musnad Tech
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
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
