import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowUpRight } from "react-icons/lu";
import { SUGGESTED_PAGES } from "./not-found-data";
import { cn } from "@/lib/utils";
import type { SuggestedPagesProps } from "./not-found-types";

/**
 * Suggested destination cards section for 404 recovery.
 *
 * Visual hierarchy:
 * - Eyebrow heading with subtle signature brand crimson marker
 * - 2-column desktop / 1-column mobile grid of compact destination cards
 * - Leading category icon, prominent title, contextual metadata, and interactive arrow affordance
 */
export function SuggestedPages({
  className = "",
  items = SUGGESTED_PAGES,
}: SuggestedPagesProps) {
  const t = useTranslations("NotFoundPage");

  return (
    <section
      aria-labelledby="suggested-pages-eyebrow"
      className={cn("w-full text-start", className)}
    >
      {/* Section Eyebrow with Brand Crimson Marker */}
      <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
        <span
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary border border-primary/25 text-[11px] font-bold select-none shrink-0"
          aria-hidden="true"
        >
          +
        </span>
        <h2
          id="suggested-pages-eyebrow"
          className="text-xs font-bold tracking-widest text-muted-foreground uppercase select-none"
        >
          {t("suggestedPagesEyebrow")}
        </h2>
      </div>

      {/* Suggested Destination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        {items.map((item) => {
          const Icon = item.icon;
          const title = t(`items.${item.translationKey}.title`, {
            defaultMessage: item.fallbackTitle,
          });
          const meta = t(`items.${item.translationKey}.meta`, {
            defaultMessage: item.fallbackMeta,
          });

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl",
                "bg-card/90 hover:bg-card border border-border/80 hover:border-primary/40",
                "shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Leading circular domain icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full bg-secondary/80 border border-border/50 shrink-0",
                    "flex items-center justify-center text-muted-foreground",
                    "group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors"
                  )}
                  aria-hidden="true"
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                {/* Content block: title & meta */}
                <div className="min-w-0 text-start">
                  <span className="block text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {title}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5 truncate">
                    {meta}
                  </span>
                </div>
              </div>

              {/* Trailing directional affordance */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full shrink-0 ms-2",
                  "flex items-center justify-center text-muted-foreground/60",
                  "group-hover:text-primary group-hover:bg-primary/5 transition-all"
                )}
                aria-hidden="true"
              >
                <LuArrowUpRight
                  className="w-4 h-4 rtl:-scale-x-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
