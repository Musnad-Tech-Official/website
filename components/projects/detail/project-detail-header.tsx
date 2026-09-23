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
} from "react-icons/lu";
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
  className = "",
}: ProjectDetailHeaderProps) {
  return (
    <header className={cn("pt-8 sm:pt-12 pb-10 sm:pb-14 border-b border-border/60", className)}>
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
          <li aria-current="page" className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
            {title}
          </li>
        </ol>
      </nav>

      {/* 2. Badges */}
      {eyebrowBadges && eyebrowBadges.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {eyebrowBadges.map((badge, idx) => (
            <Badge key={idx} variant={badge.variant || "secondary"} size="sm">
              {badge.label}
            </Badge>
          ))}
        </div>
      )}

      {/* 3. Page Title */}
      <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.15] max-w-4xl">
        {title}
      </h1>

      {/* 4. Subtitle / Intro */}
      <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
        {subtitle}
      </p>

      {/* 5. Action Buttons */}
      {actions && actions.length > 0 && (
        <div className="flex items-center flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
          {actions.map((action, idx) => {
            const isExternal = action.href?.startsWith("http");
            const btn = (
              <Button
                variant={action.variant || (idx === 0 ? "primary" : "outline")}
                size="md"
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
      )}

      {/* 6. Meta Bar (4-item grid) */}
      {metaBar && metaBar.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/60">
          {metaBar.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-border/60 bg-muted/20"
            >
              <div className="p-2 rounded-lg bg-background border border-border/60 shrink-0">
                {renderMetaIcon(item.iconType)}
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
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
