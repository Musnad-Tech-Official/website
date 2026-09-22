import type { FooterBottomProps } from "./footer-types";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

/**
 * FooterBottom renders the bottom copyright bar:
 * - Dynamic copyright year
 * - Localized brand rights statement
 * - Separated from footer body by a subtle border
 */
export function FooterBottom({
  brandName = "Musnad Tech",
  allRightsReserved = "All rights reserved.",
  builtInRiyadh = "Built in Riyadh",
  className = "",
}: FooterBottomProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className={cn(
        "border-t border-border/80 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground transition-colors",
        className
      )}
    >
      <p className="m-0 text-center sm:text-start">
        &copy; {currentYear} {brandName}. {allRightsReserved}
      </p>

      <div className="flex items-center gap-4 sm:gap-6">
        {builtInRiyadh && (
          <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            {builtInRiyadh}
          </span>
        )}

        <LanguageSwitcher variant="toggle" size="sm" className="h-7 px-2 text-xs border-transparent hover:border-border/60" />
      </div>
    </div>
  );
}
