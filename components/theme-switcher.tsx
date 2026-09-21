"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export type ThemeSwitcherVariant = "icon" | "segmented" | "dropdown";

export interface ThemeSwitcherProps {
  variant?: ThemeSwitcherVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export function ThemeSwitcher({
  variant = "icon",
  size = "md",
  className,
  showLabel = false,
}: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Hydration-safe mount detection
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Close dropdown on click outside or escape
  React.useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const sizeClasses = {
    sm: "h-8 px-2.5 text-xs rounded-md gap-1.5",
    md: "h-9 px-3 text-sm rounded-lg gap-2",
    lg: "h-11 px-4 text-base rounded-xl gap-2.5",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  // Pre-hydration placeholder to avoid layout shift
  if (!isMounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground opacity-60",
          variant === "icon" ? (size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-9 w-9") : sizeClasses[size],
          className
        )}
        aria-hidden="true"
      >
        <span className="h-4 w-4" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  // 1. Icon Toggle Variant (Light <-> Dark quick toggle)
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        title={`Switch to ${isDark ? "light" : "dark"} theme`}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg border border-border/60 bg-background text-foreground transition-all duration-150 select-none cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground hover:border-primary/40 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-9 w-9",
          showLabel && (size === "sm" ? "w-auto px-2.5 gap-1.5" : size === "lg" ? "w-auto px-4 gap-2.5" : "w-auto px-3 gap-2"),
          className
        )}
      >
        {isDark ? (
          <svg
            className={cn("text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45", iconSizes[size])}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className={cn("text-foreground/80 transition-transform duration-200 -rotate-12 hover:rotate-0", iconSizes[size])}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}

        {showLabel && (
          <span className="text-xs font-medium">
            {isDark ? "Light" : "Dark"}
          </span>
        )}
      </button>
    );
  }

  // 2. Segmented Pill Switcher (Light | System | Dark)
  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme selection"
        className={cn(
          "inline-flex items-center rounded-lg bg-muted/60 p-1 border border-border/50 select-none",
          className
        )}
      >
        <button
          type="button"
          role="radio"
          aria-checked={theme === "light"}
          onClick={() => setTheme("light")}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 gap-1.5 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === "light"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          {showLabel && <span>Light</span>}
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={theme === "system"}
          onClick={() => setTheme("system")}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 gap-1.5 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === "system"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {showLabel && <span>System</span>}
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={theme === "dark"}
          onClick={() => setTheme("dark")}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 gap-1.5 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === "dark"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          {showLabel && <span>Dark</span>}
        </button>
      </div>
    );
  }

  // 3. Dropdown Menu Variant
  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label="Toggle theme menu"
        className={cn(
          "inline-flex items-center justify-between rounded-lg border border-border/60 bg-background text-foreground transition-all duration-150 select-none cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground hover:border-primary/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <svg className={cn("text-amber-400", iconSizes[size])} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : theme === "light" ? (
            <svg className={cn("text-foreground", iconSizes[size])} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className={cn("text-muted-foreground", iconSizes[size])} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}

          <span className="capitalize font-medium text-xs">
            {theme === "system" ? "Auto" : theme}
          </span>
        </div>

        <svg
          className={cn("transition-transform duration-200 text-muted-foreground ml-1", dropdownOpen && "rotate-180", iconSizes[size])}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-1.5 w-36 origin-top-right rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setTheme("light");
              setDropdownOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              theme === "light"
                ? "bg-accent text-accent-foreground font-semibold"
                : "hover:bg-muted text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Light</span>
            </div>
            {theme === "light" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setTheme("dark");
              setDropdownOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              theme === "dark"
                ? "bg-accent text-accent-foreground font-semibold"
                : "hover:bg-muted text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span>Dark</span>
            </div>
            {theme === "dark" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setTheme("system");
              setDropdownOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              theme === "system"
                ? "bg-accent text-accent-foreground font-semibold"
                : "hover:bg-muted text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>System</span>
            </div>
            {theme === "system" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </button>
        </div>
      )}
    </div>
  );
}

export const ThemeToggle = ThemeSwitcher;

