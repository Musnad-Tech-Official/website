import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { NavLogoProps } from "./nav-types";
import { DEFAULT_NAV_CONFIG, DEFAULT_NAV_LABELS } from "./nav-config";
import { cn } from "@/lib/utils";

/**
 * NavLogo renders the brand logo with theme-aware images:
 * - Light Mode: /brand/logo-light.png
 * - Dark Mode: /brand/logo-dark.png
 *
 * Uses CSS classes `dark:hidden` and `hidden dark:block` for instant,
 * flicker-free theme adaptation matching Next.js & next-themes best practices.
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
      className={cn(
        "inline-flex items-center rounded-lg text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0 select-none",
        className
      )}
    >
      {/* Light Mode Logo (black + red) */}
      <Image
        src="/brand/logo-light.png"
        alt={`${wordmark} Logo`}
        width={1024}
        height={341}
        priority
        className="h-8 sm:h-9 w-auto object-contain dark:hidden"
      />

      {/* Dark Mode Logo (white + red) */}
      <Image
        src="/brand/logo-dark.png"
        alt={`${wordmark} Logo`}
        width={1024}
        height={341}
        priority
        className="h-8 sm:h-9 w-auto object-contain hidden dark:block"
      />
    </Link>
  );
}


