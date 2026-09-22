import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowUpRight, LuArrowRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FinalCtaProps {
  className?: string;
}

export function FinalCta({ className = "" }: FinalCtaProps) {
  const t = useTranslations("Home.finalCta");

  return (
    <section
      id="contact-cta"
      aria-labelledby="cta-heading"
      className={cn(
        "relative w-full border-t border-border/40 bg-gradient-to-b from-background via-muted/15 to-background py-20 sm:py-28 lg:py-32 overflow-hidden transition-colors",
        className
      )}
    >
      {/* Subtle background ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Eyebrow Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/70 bg-card text-xs font-semibold text-muted-foreground shadow-2xs mb-6 select-none">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>{t("badge")}</span>
        </div>

        {/* Big Centered Heading */}
        <h2
          id="cta-heading"
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] max-w-3xl"
        >
          {t("heading")}
        </h2>

        {/* Supporting Copy */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {t("description")}
        </p>

        {/* Call to Actions */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <Link href="/contact">
            <Button
              size="xl"
              className="rounded-full px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-semibold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all gap-2"
            >
              <span>{t("primaryCta")}</span>
              <LuArrowUpRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
            </Button>
          </Link>

          <Link href="/careers">
            <Button
              variant="secondary"
              size="xl"
              className="rounded-full px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-semibold border border-border/80 shadow-xs hover:bg-muted active:scale-[0.98] transition-all gap-2"
            >
              <span>{t("secondaryCta")}</span>
              <LuArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
