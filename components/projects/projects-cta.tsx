import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import type { ProjectsCtaProps } from "./projects-types";
import { cn } from "@/lib/utils";

/**
 * ProjectsCta renders the bottom inquiry callout section:
 * - Left/start: Heading and neutral invitation to share project requirements
 * - Right/end: Action button linking to /contact
 * - Ambient subtle glow, responsive layout (horizontal on tablet/desktop, stacked on mobile)
 */
export function ProjectsCta({
  title = "Have a project in mind?",
  subtitle = "Tell us about what you want to build.",
  buttonLabel = "Start a project inquiry",
  contactHref = "/contact",
  className = "",
}: ProjectsCtaProps) {
  return (
    <section
      aria-labelledby="projects-cta-heading"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 my-12 sm:my-16 lg:my-20 shadow-xs",
        className
      )}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-64 w-80 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8">
        {/* Left/Start Content */}
        <div className="max-w-2xl text-start">
          <h2
            id="projects-cta-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground mb-2 sm:mb-3"
          >
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Right/End Action */}
        <div className="shrink-0 flex items-center">
          <Link href={contactHref}>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 sm:px-8 font-medium shadow-xs gap-2 group cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              <span>{buttonLabel}</span>
              <FaArrowRight className="h-3 w-3 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
