"use client";

import Link from "next/link";
import type { NavLinksProps } from "./nav-types";
import { isNavItemVisible, isNavItemActive } from "./nav-utils";

/**
 * NavLinks renders navigation items with active state detection,
 * feature flag filtering, and presentation variants (desktop vs. mobile).
 */
export function NavLinks({
  items,
  currentPath,
  showBlog = true,
  showCareers = true,
  onItemClick,
  variant = "desktop",
  className = "",
  itemClassName = "",
  activeItemClassName = "",
}: NavLinksProps) {
  const visibleItems = items.filter((item) =>
    isNavItemVisible(item, showBlog, showCareers)
  );

  const isDesktop = variant === "desktop";

  return (
    <nav
      aria-label={isDesktop ? "Main navigation" : "Mobile navigation links"}
      className={className}
    >
      <ul
        role="list"
        className={
          isDesktop
            ? "flex items-center gap-1 list-none m-0 p-0"
            : "flex flex-col gap-1 list-none m-0 p-0"
        }
      >
        {visibleItems.map((item) => {
          const isActive = isNavItemActive(currentPath, item.href);

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => onItemClick?.(item)}
                className={
                  isDesktop
                    ? `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
                        isActive
                          ? `text-foreground font-semibold bg-black/5 dark:bg-white/10 ${activeItemClassName}`
                          : `text-foreground/70 hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] ${itemClassName}`
                      }`
                    : `flex w-full items-center rounded-md px-3 py-2.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${
                        isActive
                          ? `bg-black/5 font-semibold text-foreground dark:bg-white/10 ${activeItemClassName}`
                          : `text-foreground/70 hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06] ${itemClassName}`
                      }`
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
