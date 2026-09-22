import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { NavbarUtilities } from "@/components/navbar-utilities";
import type { NavbarProps } from "./nav-types";
import {
  DEFAULT_NAV_CONFIG,
  DEFAULT_NAV_LABELS,
  ARABIC_NAV_LABELS,
  getLocalizedNavItems,
} from "./nav-config";
import { NavLogo } from "./nav-logo";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { AnnouncementBanner } from "./announcement-banner";
import { cn } from "@/lib/utils";

/**
 * Public website navbar for Musnad Tech.
 *
 * Architecture:
 * - Pure structural shell with clean design system tokens
 * - Localized routing support across all links
 * - Integrated Button, Badge, and NavbarUtilities
 * - Fully locale/direction-aware with automatic defaults
 */
export function Navbar({
  currentPath,
  showBlog = true,
  showCareers = true,
  isSticky = true,
  homeHref = DEFAULT_NAV_CONFIG.homeHref,
  contactHref = DEFAULT_NAV_CONFIG.contactHref,
  signInHref = DEFAULT_NAV_CONFIG.signInHref,
  announcement,
  locale,
  direction = "ltr",
  customItems,
  labels: customLabels,
  utilities,
  showUtilities = true,
  className = "",
}: NavbarProps) {
  // Locale-aware default items and labels
  const navItems = customItems || getLocalizedNavItems(locale);
  const defaultLabels = locale === "ar" ? ARABIC_NAV_LABELS : DEFAULT_NAV_LABELS;
  const labels = { ...defaultLabels, ...customLabels };
  const stickyClass = isSticky ? "sticky top-0 z-40" : "relative";

  // Default utilities if not explicitly passed
  const renderedUtilities = utilities ?? (showUtilities ? <NavbarUtilities /> : null);

  return (
    <header
      role="banner"
      dir={direction}
      lang={locale}
      className={cn(
        "w-full max-w-full overflow-x-clip bg-background/95 backdrop-blur-md border-b border-border transition-colors",
        stickyClass,
        className
      )}
    >
      {/* Optional Announcement Banner */}
      {announcement && (
        <AnnouncementBanner {...announcement} direction={direction} />
      )}

      {/* Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-6">
          <NavLogo homeHref={homeHref} wordmark={labels.brandName} />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          <NavLinks
            items={navItems}
            currentPath={currentPath}
            showBlog={showBlog}
            showCareers={showCareers}
            variant="desktop"
          />
        </div>

        {/* Desktop Utility Actions Area */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {/* Integration slot for LocaleSwitcher / ThemeToggle */}
          {renderedUtilities}

          {/* Sign In link button */}
          <Link href={signInHref}>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground/80 hover:text-foreground font-medium rounded-lg"
            >
              {labels.signIn}
            </Button>
          </Link>

          {/* Primary Contact CTA */}
          <Link href={contactHref}>
            <Button
              variant="primary"
              size="sm"
              className="font-semibold shadow-xs rounded-lg px-4"
            >
              {labels.contactCta}
            </Button>
          </Link>
        </div>

        {/* Mobile & Tablet Navigation Area: [LanguageSwitcher] [ThemeSwitcher] [Menu Button] */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          {showUtilities && (
            utilities ? (
              utilities
            ) : (
              <NavbarUtilities size="sm" />
            )
          )}

          <MobileNav
            items={navItems}
            currentPath={currentPath}
            showBlog={showBlog}
            showCareers={showCareers}
            homeHref={homeHref}
            contactHref={contactHref}
            signInHref={signInHref}
            direction={direction}
            labels={labels}
          />
        </div>
      </div>
    </header>
  );
}

