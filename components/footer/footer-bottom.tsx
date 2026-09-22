import type { FooterBottomProps } from "./footer-types";
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
  className = "",
}: FooterBottomProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className={cn(
        "border-t border-border/80 py-6 sm:py-8 flex items-center justify-center sm:justify-start text-xs text-muted-foreground transition-colors",
        className
      )}
    >
      <p className="m-0 text-center sm:text-start">
        &copy; {currentYear} {brandName}. {allRightsReserved}
      </p>
    </div>
  );
}
