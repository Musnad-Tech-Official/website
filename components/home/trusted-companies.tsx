import Image from "next/image";
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
        "w-full border-y border-border/50 bg-muted/20 py-10 sm:py-12 lg:py-14 transition-colors relative overflow-hidden",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground/90 mb-8 sm:mb-10">
          {t("eyebrow")}
        </p>

        {/* Logos container with responsive layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 items-center justify-center gap-6 sm:gap-8 lg:gap-10">
          {TRUSTED_COMPANIES.map((company) => (
            <div
              key={company.id}
              className="group flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card/60 dark:bg-card/30 backdrop-blur-xs transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-xs hover:-translate-y-0.5"
              title={company.name}
            >
              <div className="relative h-10 sm:h-12 w-full flex items-center justify-center px-2">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="max-h-8 sm:max-h-10 max-w-32.5 w-auto h-auto object-contain filter grayscale opacity-75 dark:opacity-85 dark:brightness-200 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>
              <span className="mt-2 text-[11px] font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors truncate max-w-full text-center">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
