import React from "react";
import { Link } from "@/i18n/routing";
import { LuChevronRight } from "react-icons/lu";
import type { ContactHeaderProps } from "./contact-types";
import { cn } from "@/lib/utils";

export function ContactHeader({
  eyebrow,
  title,
  subtitle,
  homeLabel,
  contactLabel,
  breadcrumbLabel = "Breadcrumbs",
  className = "",
}: ContactHeaderProps) {
  return (
    <header className={cn("pt-8 sm:pt-12 pb-8 sm:pb-10", className)}>
      {/* 1. Breadcrumbs Navigation */}
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
          <li
            aria-current="page"
            className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-md"
          >
            {contactLabel}
          </li>
        </ol>
      </nav>

      {/* 2. Eyebrow */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground select-none">
          {eyebrow}
        </span>
      </div>

      {/* 3. Page Title */}
      <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.15] max-w-4xl">
        {title}
      </h1>

      {/* 4. Subtitle */}
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}
