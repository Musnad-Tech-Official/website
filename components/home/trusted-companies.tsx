import { useTranslations } from "next-intl";
import { TRUSTED_COMPANIES } from "./home-data";
import { cn } from "@/lib/utils";

export interface TrustedCompaniesProps {
  className?: string;
}

export function TrustedCompanies({ className = "" }: TrustedCompaniesProps) {
  const t = useTranslations("Home.trustedCompanies");

  return (
    <section
      aria-label={t("eyebrow")}
      className={cn(
        "w-full border-y border-border/40 bg-muted/20 py-8 sm:py-10 transition-colors",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 mb-6">
          {t("eyebrow")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12 sm:gap-y-6">
          {TRUSTED_COMPANIES.map((company) => (
            <div
              key={company.id}
              className="inline-flex items-center gap-2.5 text-muted-foreground transition-all duration-150 hover:text-foreground group cursor-default select-none"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border/70 bg-card text-xs font-bold text-foreground/80 shadow-2xs group-hover:border-primary/40 group-hover:text-primary transition-colors">
                {company.letter}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-tight">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
