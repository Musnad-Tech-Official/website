import Link from "next/link";
import type { NavbarProps } from "./nav-types";
import { DEFAULT_NAV_ITEMS, DEFAULT_NAV_CONFIG, DEFAULT_NAV_LABELS } from "./nav-config";
import { NavLogo } from "./nav-logo";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { AnnouncementBanner } from "./announcement-banner";

/**
 * Public website navbar for Musnad Tech.
 *
 * Server Component architecture:
 * - Pure structural shell with no direct DOM event handlers
 * - Interactive leaves (NavLinks, MobileNav, AnnouncementBanner) manage their own client interactivity
 * - Reusable utilities slot for future ThemeToggle and LocaleSwitcher
 * - Fully locale/direction-ready
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
  className = "",
}: NavbarProps) {
  const navItems = customItems || DEFAULT_NAV_ITEMS;
  const labels = { ...DEFAULT_NAV_LABELS, ...customLabels };
  const stickyClass = isSticky ? "sticky top-0 z-40" : "relative";

  return (
    <header
      role="banner"
      dir={direction}
      lang={locale}
      className={`w-full max-w-full overflow-x-clip ${stickyClass} bg-background/95 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors ${className}`}
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
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          {/* Integration slot for LocaleSwitcher / ThemeToggle */}
          {utilities}

          {/* Sign In link */}
          <Link
            href={signInHref}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded px-2 py-1"
          >
            {labels.signIn}
          </Link>

          {/* Primary Contact CTA */}
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
          >
            {labels.contactCta}
          </Link>
        </div>

        {/* Mobile Navigation Trigger & Drawer */}
        <div className="flex items-center gap-2 lg:hidden">
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
            utilities={utilities}
          />
        </div>
      </div>
    </header>
  );
}
