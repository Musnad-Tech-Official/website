"use client";

import { useState } from "react";
import Link from "next/link";
import type { AnnouncementBannerProps } from "./nav-types";
import { DEFAULT_NAV_LABELS } from "./nav-config";

/**
 * AnnouncementBanner displayed above the main navbar.
 *
 * Implements:
 * - Client component with local dismissal state
 * - Optional onClose callback execution
 * - Logical RTL directional spacing (ms-auto) and arrows (← / →)
 * - Accessible announcement region semantics
 */
export function AnnouncementBanner({
  text,
  href,
  linkText = DEFAULT_NAV_LABELS.learnMore,
  direction = "ltr",
  dismissible = true,
  onClose,
  dismissLabel = DEFAULT_NAV_LABELS.dismissAnnouncement,
  className = "",
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !text) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onClose?.();
  };

  const arrow = direction === "rtl" ? "←" : "→";

  return (
    <aside
      role="region"
      aria-label="Announcement"
      dir={direction}
      className={`w-full bg-black/[0.04] dark:bg-white/[0.06] border-b border-black/10 dark:border-white/10 px-4 py-2 text-xs font-medium text-foreground transition-colors ${className}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center">
        <span>{text}</span>

        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
          >
            <span>{linkText}</span>
            <span aria-hidden="true">{arrow}</span>
          </Link>
        )}

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={dismissLabel}
            className="ms-auto inline-flex h-5 w-5 items-center justify-center rounded text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    </aside>
  );
}
