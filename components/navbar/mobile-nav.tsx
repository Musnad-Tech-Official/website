"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { MobileNavProps } from "./nav-types";
import { DEFAULT_NAV_CONFIG, DEFAULT_NAV_LABELS } from "./nav-config";
import { NavLogo } from "./nav-logo";
import { NavLinks } from "./nav-links";
import { getFocusableElements } from "./nav-utils";

/**
 * Accessible mobile navigation drawer.
 *
 * Implements:
 * - Keyboard focus trap while open
 * - Auto-close and scroll restoration on desktop viewport resize (>= 1024px)
 * - Escape key dismiss
 * - Focus restoration to hamburger trigger on close
 * - Reusable NavLinks integration
 * - Mobile utilities integration slot
 */
export function MobileNav({
  items,
  currentPath,
  showBlog = true,
  showCareers = true,
  homeHref = DEFAULT_NAV_CONFIG.homeHref,
  contactHref = DEFAULT_NAV_CONFIG.contactHref,
  signInHref = DEFAULT_NAV_CONFIG.signInHref,
  direction = "ltr",
  labels: customLabels,
  utilities,
  className = "",
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const labels = { ...DEFAULT_NAV_LABELS, ...customLabels };

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // 1. Viewport resize & orientation listener: auto-close if viewport becomes >= 1024px (desktop)
  useEffect(() => {
    if (!isOpen) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    if (mediaQuery.matches) {
      queueMicrotask(() => setIsOpen(false));
      return;
    }

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [isOpen]);

  // 2. Body scroll locking: guaranteed restoration on close or unmount
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // 3. Focus trap and keyboard navigation (Tab cycling & Escape)
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button on open
    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key === "Tab") {
        if (!drawerRef.current) return;

        const focusable = getFocusableElements(drawerRef.current);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: wrap from first to last
          if (
            document.activeElement === firstElement ||
            !drawerRef.current.contains(document.activeElement)
          ) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: wrap from last to first
          if (
            document.activeElement === lastElement ||
            !drawerRef.current.contains(document.activeElement)
          ) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const drawerPositionClass =
    direction === "rtl" ? "left-0 border-r" : "right-0 border-l";

  return (
    <div className={`lg:hidden ${className}`}>
      {/* Hamburger Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-dialog"
        aria-label={isOpen ? labels.closeMenu : labels.openMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md p-2 text-foreground/80 hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 dark:hover:bg-white/10"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Accessible Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" role="presentation">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Drawer container with focus trap */}
          <div
            ref={drawerRef}
            id="mobile-nav-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={labels.openMenu}
            dir={direction}
            className={`fixed inset-y-0 ${drawerPositionClass} z-50 flex w-full max-w-xs flex-col bg-background p-6 shadow-2xl transition-transform duration-200 ease-in-out dark:bg-zinc-950 border-black/10 dark:border-white/10`}
          >
            {/* Header: Logo and Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10">
              <NavLogo
                homeHref={homeHref}
                wordmark={labels.brandName}
                onClick={handleClose}
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                aria-label={labels.closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:hover:bg-white/10"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation links (reusing NavLinks with mobile presentation variant) */}
            <div className="flex-1 overflow-y-auto py-6">
              <NavLinks
                items={items}
                currentPath={currentPath}
                showBlog={showBlog}
                showCareers={showCareers}
                onItemClick={handleClose}
                variant="mobile"
              />
            </div>

            {/* Utility action area */}
            <div className="flex flex-col gap-3 pt-6 border-t border-black/10 dark:border-white/10">
              {/* Slot for future additions: ThemeToggle, LocaleSwitcher */}
              {utilities && (
                <div className="flex items-center justify-between pb-1">
                  {utilities}
                </div>
              )}

              {/* Sign in entry */}
              <Link
                href={signInHref}
                onClick={handleClose}
                className="w-full text-center py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-md"
              >
                {labels.signIn}
              </Link>

              {/* Primary Contact CTA */}
              <Link
                href={contactHref}
                onClick={handleClose}
                className="w-full flex items-center justify-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
              >
                {labels.contactCta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
