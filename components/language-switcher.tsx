"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/components/navbar/nav-config";

export type LanguageSwitcherVariant = "toggle" | "segmented" | "dropdown";

export interface LanguageSwitcherProps {
  variant?: LanguageSwitcherVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
  onLocaleChange?: (locale: SupportedLocale) => void;
}

const LOCALE_DETAILS: Record<
  SupportedLocale,
  { name: string; nativeName: string; short: string; dir: "ltr" | "rtl" }
> = {
  en: { name: "English", nativeName: "English", short: "EN", dir: "ltr" },
  ar: { name: "Arabic", nativeName: "العربية", short: "عربي", dir: "rtl" },
};

function applyDocumentLocale(locale: SupportedLocale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = LOCALE_DETAILS[locale].dir;
  try {
    localStorage.setItem("musnad_locale", locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Storage access might be restricted
  }
}

export function LanguageSwitcher({
  variant = "toggle",
  size = "md",
  className,
  showLabel = true,
  onLocaleChange,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale();
  const currentLocale: SupportedLocale = activeLocale === "ar" ? "ar" : "en";

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Close dropdown on outside click
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

  const switchLocale = (targetLocale: SupportedLocale) => {
    if (targetLocale === currentLocale) {
      setDropdownOpen(false);
      return;
    }

    applyDocumentLocale(targetLocale);
    onLocaleChange?.(targetLocale);

    router.replace(pathname, { locale: targetLocale });
    setDropdownOpen(false);
  };

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

  if (!isMounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground opacity-60",
          sizeClasses[size],
          className
        )}
        aria-hidden="true"
      >
        <span className="h-4 w-4" />
      </div>
    );
  }

  // 1. Direct Toggle Button (e.g. English -> click turns to العربية)
  if (variant === "toggle") {
    const nextLocale: SupportedLocale = currentLocale === "en" ? "ar" : "en";
    const nextDetails = LOCALE_DETAILS[nextLocale];

    return (
      <button
        type="button"
        onClick={() => switchLocale(nextLocale)}
        aria-label={`Switch language to ${nextDetails.name}`}
        title={`Switch language to ${nextDetails.name}`}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg border border-border/60 bg-background text-foreground transition-all duration-150 select-none cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground hover:border-primary/40 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          sizeClasses[size],
          className
        )}
      >
        {/* Globe icon */}
        <svg
          className={cn("text-muted-foreground", iconSizes[size])}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>

        {showLabel && (
          <span className="font-semibold text-xs tracking-tight">
            {nextDetails.nativeName}
          </span>
        )}
      </button>
    );
  }

  // 2. Segmented Pill Switcher (EN | عربي)
  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Language selection"
        className={cn(
          "inline-flex items-center rounded-lg bg-muted/60 p-1 border border-border/50 select-none",
          className
        )}
      >
        {SUPPORTED_LOCALES.map((locale) => {
          const isSelected = currentLocale === locale;
          const details = LOCALE_DETAILS[locale];
          return (
            <button
              key={locale}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => switchLocale(locale)}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {details.short}
            </button>
          );
        })}
      </div>
    );
  }

  // 3. Dropdown Menu Variant
  const activeDetails = LOCALE_DETAILS[currentLocale];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label="Select language"
        className={cn(
          "inline-flex items-center justify-between rounded-lg border border-border/60 bg-background text-foreground transition-all duration-150 select-none cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground hover:border-primary/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center gap-2">
          <svg
            className={cn("text-muted-foreground", iconSizes[size])}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <span className="font-medium text-xs">{activeDetails.nativeName}</span>
        </div>

        <svg
          className={cn(
            "transition-transform duration-200 text-muted-foreground ml-1",
            dropdownOpen && "rotate-180",
            iconSizes[size]
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-1.5 w-40 origin-top-right rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {SUPPORTED_LOCALES.map((locale) => {
            const isSelected = currentLocale === locale;
            const details = LOCALE_DETAILS[locale];
            return (
              <button
                key={locale}
                type="button"
                role="menuitem"
                onClick={() => switchLocale(locale)}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer",
                  isSelected
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <div className="flex flex-col items-start leading-tight">
                  <span>{details.nativeName}</span>
                  <span className="text-[10px] text-muted-foreground">{details.name}</span>
                </div>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const LocaleSwitcher = LanguageSwitcher;

