import Image from "next/image";
import { Link } from "@/i18n/routing";
import { LuMail, LuMapPin } from "react-icons/lu";
import type { FooterBrandProps } from "./footer-types";
import { OFFICIAL_SOCIAL_LINKS } from "./footer-config";
import { cn } from "@/lib/utils";

/**
 * FooterBrand renders the brand identity column:
 * - Theme-aware Musnad logo (light and dark mode assets)
 * - Concise company mission / description
 * - Direct contact email and location info
 * - Accessible social links with comfortable touch targets and visible focus indicators
 */
export function FooterBrand({
  homeHref = "/",
  brandName = "Musnad Tech",
  description,
  email,
  location,
  socialLinks = OFFICIAL_SOCIAL_LINKS,
  className = "",
}: FooterBrandProps) {
  return (
    <div className={cn("flex flex-col gap-4 text-start", className)}>
      {/* Brand Logo with instant theme adaptation */}
      <Link
        href={homeHref}
        aria-label={`${brandName} - Home`}
        className={cn(
          "inline-flex items-center w-fit rounded-lg text-foreground transition-opacity hover:opacity-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none"
        )}
      >
        {/* Light Mode Logo (black + red) */}
        <Image
          src="/brand/logo-light.png"
          alt={`${brandName} Logo`}
          width={1024}
          height={341}
          priority={false}
          className="h-8 sm:h-9 w-auto object-contain dark:hidden"
        />

        {/* Dark Mode Logo (white + red) */}
        <Image
          src="/brand/logo-dark.png"
          alt={`${brandName} Logo`}
          width={1024}
          height={341}
          priority={false}
          className="h-8 sm:h-9 w-auto object-contain hidden dark:block"
        />
      </Link>

      {/* Brand Description */}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          {description}
        </p>
      )}

      {/* Contact Information & Location */}
      {(email || location) && (
        <div className="flex flex-col gap-2 text-xs text-muted-foreground pt-1">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
            >
              <LuMail className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" aria-hidden="true" />
              <span>{email}</span>
            </a>
          )}
          {location && (
            <div className="inline-flex items-center gap-2 w-fit">
              <LuMapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" aria-hidden="true" />
              <span>{location}</span>
            </div>
          )}
        </div>
      )}

      {/* Social Links */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1" aria-label="Social media links">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground transition-all duration-150",
                  "hover:bg-muted hover:text-foreground hover:border-border active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 select-none"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{social.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
