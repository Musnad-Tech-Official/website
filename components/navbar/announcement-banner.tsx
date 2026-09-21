"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import type { AnnouncementBannerProps } from "./nav-types";
import { DEFAULT_NAV_LABELS } from "./nav-config";
import { cn } from "@/lib/utils";


export function AnnouncementBanner({
  text,
  tag,
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
  const defaultTag = direction === "rtl" ? "إعلان" : "New";

  return (
    <aside
      role="region"
      aria-label="Announcement"
      dir={direction}
      className={cn(
        "relative w-full bg-accent/70 text-foreground border-b border-primary/15 px-4 py-2 text-xs font-medium transition-colors",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 text-center">
        <Badge
          variant="default"
          size="sm"
          className="shrink-0 text-[10px] font-bold uppercase tracking-wider py-0 px-2"
        >
          {tag || defaultTag}
        </Badge>

        <span className="truncate max-w-[280px] sm:max-w-md md:max-w-xl text-foreground font-medium">
          {text}
        </span>

        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <span>{linkText}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              {arrow}
            </span>
          </Link>
        )}

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={dismissLabel}
            className="ms-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
          >
            <span aria-hidden="true" className="text-sm font-bold leading-none">&times;</span>
          </button>
        )}
      </div>
    </aside>
  );
}

