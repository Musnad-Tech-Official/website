"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import type { MobileNavProps } from "./nav-types";
import { DEFAULT_NAV_CONFIG, DEFAULT_NAV_LABELS } from "./nav-config";
import { NavLogo } from "./nav-logo";
import { NavLinks } from "./nav-links";
import { getFocusableElements } from "./nav-utils";
import { cn } from "@/lib/utils";

/**
 * Accessible, animated mobile navigation drawer.
 *
 * Implements:
 * - Enter and exit slide/fade animations
 * - Animated morphing hamburger / close icon
 * - Touch-optimized segmented utilities for Theme and Language
 * - Keyboard focus trap while open
 * - Auto-close on desktop viewport resize (>= 1024px)
 * - Escape key dismiss and focus restoration
 * - Safe area & dynamic 100dvh viewport support
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
  className = "",
}: MobileNavProps) {
  // Mounting and animation states
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const labels = { ...DEFAULT_NAV_LABELS, ...customLabels };
  const isRtl = direction === "rtl";

  // Open drawer with smooth enter animation
  const handleOpen = useCallback(() => {
    setIsMounted(true);
    // Double requestAnimationFrame ensures DOM is painted before transition starts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
  }, []);

  // Close drawer with smooth exit animation
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    const timer = setTimeout(() => {
      setIsMounted(false);
      triggerRef.current?.focus();
    }, 280); // matches CSS transition duration

    return () => clearTimeout(timer);
  }, []);

  // 1. Viewport resize & orientation listener: auto-close if viewport becomes >= 1024px (desktop)
  useEffect(() => {
    if (!isMounted) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsAnimating(false);
        setIsMounted(false);
      }
    };

    if (mediaQuery.matches) {
      queueMicrotask(() => {
        setIsAnimating(false);
        setIsMounted(false);
      });
      return;
    }

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [isMounted]);

  // 2. Body scroll locking with scrollbar width compensation
  useEffect(() => {
    if (!isMounted) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isMounted]);

  // 3. Focus trap and keyboard navigation (Tab cycling & Escape)
  useEffect(() => {
    if (!isMounted || !isAnimating) return;

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

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
  }, [isMounted, isAnimating, handleClose]);

  // Position and transition transforms
  const drawerPositionClass = isRtl ? "left-0 border-r" : "right-0 border-l";
  const drawerTranslateClass = isAnimating
    ? "translate-x-0"
    : isRtl
      ? "-translate-x-full"
      : "translate-x-full";

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Animated Hamburger Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={isMounted ? handleClose : handleOpen}
        aria-expanded={isMounted}
        aria-controls="mobile-nav-dialog"
        aria-label={isMounted ? labels.closeMenu : labels.openMenu}
        className={cn(
          "relative inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground transition-all duration-150 select-none cursor-pointer shrink-0",
          "hover:bg-accent hover:text-accent-foreground hover:border-primary/40 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        )}
      >
        <span className="sr-only">
          {isMounted ? labels.closeMenu : labels.openMenu}
        </span>
        <div className="relative flex h-3.5 w-4 flex-col justify-between">
          <span
            className={cn(
              "h-0.5 w-full rounded-full bg-current transition-all duration-250 ease-out origin-center",
              isMounted && "translate-y-[6px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-full rounded-full bg-current transition-all duration-200 ease-out",
              isMounted && "opacity-0 scale-x-0"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-full rounded-full bg-current transition-all duration-250 ease-out origin-center",
              isMounted && "-translate-y-[6px] -rotate-45"
            )}
          />
        </div>
      </button>

      {/* Accessible Drawer Modal & Backdrop */}
      {isMounted && (
        <div
          className="fixed inset-0 z-50 flex overflow-hidden"
          role="presentation"
        >
          {/* Backdrop overlay with fade transition */}
          <div
            className={cn(
              "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out",
              isAnimating ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Drawer container with slide transition */}
          <div
            ref={drawerRef}
            id="mobile-nav-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={labels.openMenu}
            dir={direction}
            className={cn(
              "fixed inset-y-0 z-50 flex h-[100dvh] w-[88vw] max-w-sm sm:max-w-xs flex-col bg-card text-card-foreground p-5 shadow-2xl transition-transform duration-300 ease-out border-border",
              drawerPositionClass,
              drawerTranslateClass
            )}
          >
            {/* Header: Logo and Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <NavLogo
                homeHref={homeHref}
                wordmark={labels.brandName}
                onClick={handleClose}
              />
              <Button
                ref={closeButtonRef}
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleClose}
                aria-label={labels.closeMenu}
                className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            {/* Navigation links (reusing NavLinks with mobile variant) */}
            <div className="flex-1 overflow-y-auto overscroll-contain py-4">
              <NavLinks
                items={items}
                currentPath={currentPath}
                showBlog={showBlog}
                showCareers={showCareers}
                onItemClick={handleClose}
                variant="mobile"
              />
            </div>

            {/* Footer Action CTAs */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-border/80">
              {/* Authentication Controls */}
              <Show when="signed-out">
                <SignInButton>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    className="rounded-xl font-medium"
                    onClick={handleClose}
                  >
                    {labels.signIn}
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    className="rounded-xl font-medium"
                    onClick={handleClose}
                  >
                    {labels.signUp}
                  </Button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/40">
                  <span className="text-sm font-medium text-foreground">
                    {direction === "rtl" ? "الحساب الشخصي" : "My Account"}
                  </span>
                  <UserButton />
                </div>
              </Show>

              {/* Primary Contact CTA */}
              <Link
                href={contactHref}
                onClick={handleClose}
                className="w-full block"
              >
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className="rounded-xl font-semibold shadow-sm"
                >
                  {labels.contactCta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

