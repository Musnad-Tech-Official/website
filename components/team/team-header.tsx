import { Link } from "@/i18n/routing";
import type { TeamHeaderProps } from "./team-types";
import { cn } from "@/lib/utils";

/**
 * TeamHeader renders the breadcrumbs and intro headline for the Team page:
 * - Accessible breadcrumb navigation
 * - Small uppercase section category label
 * - Commanding bold display title
 * - Descriptive subtitle
 */
export function TeamHeader({
  eyebrow,
  title,
  subtitle,
  homeLabel,
  teamLabel,
  breadcrumbLabel,
  className = "",
}: TeamHeaderProps) {
  return (
    <header className={cn("pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-12 text-start", className)}>
      {/* Breadcrumb Navigation */}
      <nav aria-label={breadcrumbLabel || teamLabel} className="mb-6 sm:mb-8">
        <ol className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground list-none p-0 m-0">
          <li>
            <Link
              href="/"
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
            >
              {homeLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground/60 select-none">
            /
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {teamLabel}
          </li>
        </ol>
      </nav>

      {/* Eyebrow Category */}
      {eyebrow && (
        <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 sm:mb-4 select-none">
          {eyebrow}
        </span>
      )}

      {/* Main Page Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-4 sm:mb-6">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}
