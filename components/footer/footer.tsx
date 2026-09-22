import { useTranslations } from "next-intl";
import { FooterBrand } from "./footer-brand";
import { FooterLinks } from "./footer-links";
import { FooterBottom } from "./footer-bottom";
import { getFooterSections } from "./footer-config";
import type { FooterProps } from "./footer-types";
import { cn } from "@/lib/utils";

/**
 * Global responsive Footer for Musnad Tech.
 *
 * Layout Structure:
 * - Desktop: 4 multi-column sections (Brand, Explore, Company, Legal)
 * - Tablet: Adaptive multi-column grid with comfortable spacing
 * - Mobile: Stacked vertical sections with touch-friendly navigation
 * - Bottom Bar: Dynamic year copyright and localized "Built in Yemen" brand detail
 * - Accessible: Semantic HTML, aria-labels, high-contrast tokens, keyboard focusable
 * - Theme-ready: Dark and Light mode support via semantic tokens and dual-logo assets
 */
export function Footer({
  locale,
  direction = "ltr",
  className = "",
}: FooterProps) {
  const t = useTranslations("Footer");
  const tBrand = useTranslations("Brand");
  const sections = getFooterSections(t);

  return (
    <footer
      role="contentinfo"
      dir={direction}
      lang={locale}
      className={cn(
        "w-full max-w-full overflow-x-clip border-t border-border bg-background text-foreground transition-colors",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content Grid */}
        <div className="py-12 sm:py-14 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Section 1: Brand Identity & Social */}
          <div className="md:col-span-2 lg:col-span-5">
            <FooterBrand
              brandName={tBrand("name")}
              description={t("brandDescription")}
            />
          </div>

          {/* Sections 2, 3, 4: Explore, Company, Legal Links */}
          <div className="md:col-span-2 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {sections.map((section) => (
              <FooterLinks key={section.id} section={section} />
            ))}
          </div>
        </div>

        {/* Bottom Section Bar */}
        <FooterBottom
          brandName={tBrand("name")}
          allRightsReserved={t("allRightsReserved")}
        />
      </div>
    </footer>
  );
}
