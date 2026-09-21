import Link from "next/link";
import type { NavLogoProps } from "./nav-types";
import { DEFAULT_NAV_CONFIG, DEFAULT_NAV_LABELS } from "./nav-config";

/**
 * NavLogo renders the brand logo mark and the "Musnad Tech" wordmark.
 *
 * Server-compatible component.
 *
 * Future replacement: Replace the inline `<span data-slot="logo-mark">`
 * with `<Image src="/brand/logo.svg" ... />` once the transparent logo asset is provided.
 */
export function NavLogo({
  homeHref = DEFAULT_NAV_CONFIG.homeHref,
  wordmark = DEFAULT_NAV_LABELS.brandName,
  onClick,
  className = "",
}: NavLogoProps) {
  return (
    <Link
      href={homeHref}
      aria-label={`${wordmark} - Home`}
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 rounded-md text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${className}`}
    >
      {/* Logo mark area - isolated for easy replacement with final SVG asset */}
      <span
        data-slot="logo-mark"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-base select-none transition-transform group-hover:scale-105"
        aria-hidden="true"
      >
        M
      </span>

      {/* Wordmark */}
      <span
        data-slot="logo-wordmark"
        className="font-semibold text-lg tracking-tight text-foreground select-none"
      >
        {wordmark}
      </span>
    </Link>
  );
}
