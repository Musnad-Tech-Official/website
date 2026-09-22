"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import type { NavLinksProps } from "./nav-types";
import { isNavItemVisible, isNavItemActive } from "./nav-utils";
import { cn } from "@/lib/utils";

/**
 * NavLinks renders navigation items with active state detection,
 * badge support, feature flag filtering, and presentation variants (desktop vs. mobile).
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
  const pathname = usePathname();
  const resolvedPath = currentPath ?? pathname;

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
            : "flex flex-col gap-1.5 list-none m-0 p-0"
        }
      >
        {visibleItems.map((item) => {
          const isActive = isNavItemActive(resolvedPath, item.href);

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
                    ? cn(
                        "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 select-none",
                        isActive
                          ? cn("text-primary", activeItemClassName)
                          : cn(
                              "text-foreground/75 hover:text-foreground hover:bg-muted/70",
                              itemClassName
                            )
                      )
                    : cn(
                        "group flex w-full items-center justify-between min-h-[48px] rounded-xl px-3.5 py-2.5 text-base font-medium transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none",
                        isActive
                          ? cn("text-primary", activeItemClassName)
                          : cn(
                              "text-foreground/80 hover:bg-muted/80 hover:text-foreground active:bg-muted",
                              itemClassName
                            )
                      )
                }
              >
                <div className="flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "accent"}
                      size="sm"
                      className="shrink-0 text-[10px] uppercase font-bold tracking-wider"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>

                {!isDesktop && (
                  <svg
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200 rtl:rotate-180",
                      isActive
                        ? "text-primary translate-x-0.5 rtl:-translate-x-0.5"
                        : "text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

