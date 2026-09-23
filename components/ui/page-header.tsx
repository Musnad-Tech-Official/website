import React from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  breadcrumbLabel?: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  breadcrumbs,
  breadcrumbLabel = "Breadcrumb",
  eyebrow,
  title,
  subtitle,
  className = "",
  children,
}: PageHeaderProps) {
  return (
    <header className={cn("pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 text-start", className)}>
      {/* Breadcrumb Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label={breadcrumbLabel} className="mb-6 sm:mb-8">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground list-none p-0 m-0">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  {index > 0 && (
                    <li
                      aria-hidden="true"
                      className="text-muted-foreground/60 select-none rtl:rotate-180"
                    >
                      /
                    </li>
                  )}
                  <li
                    aria-current={isLast ? "page" : undefined}
                    className={cn(isLast ? "font-medium text-foreground" : "")}
                  >
                    {!isLast && item.href ? (
                      <Link
                        href={item.href}
                        className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Eyebrow Category */}
      {eyebrow && (
        typeof eyebrow === "string" ? (
          <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 sm:mb-4 select-none">
            {eyebrow}
          </span>
        ) : (
          <div className="mb-3 sm:mb-4">{eyebrow}</div>
        )
      )}

      {/* Main Page Headline */}
      {typeof title === "string" ? (
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-4 sm:mb-5">
          {title}
        </h1>
      ) : (
        title
      )}

      {/* Subtitle */}
      {subtitle && (
        typeof subtitle === "string" ? (
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        ) : (
          subtitle
        )
      )}

      {children}
    </header>
  );
}

