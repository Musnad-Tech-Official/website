"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import type { TrustedCompanyItem } from "@/lib/companies/types";
import { cn } from "@/lib/utils";

export interface TrustedCompaniesProps {
  className?: string;
  companies?: TrustedCompanyItem[];
}

export function TrustedCompanies({
  className = "",
  companies,
}: TrustedCompaniesProps) {
  const t = useTranslations("Home.trustedCompanies");
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!companies || companies.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t("eyebrow")}
      className={cn(
        "w-full border-y border-border/50 bg-muted/20 py-10 sm:py-12 lg:py-14 transition-colors relative overflow-hidden",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-semibold tracking-wide text-muted-foreground/90 mb-8 sm:mb-10">
          {t("eyebrow")}
        </p>

        {/* Logos container with responsive layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 items-stretch justify-center gap-4 sm:gap-6">
          {companies.map((company) => {
            const companyName = isAr
              ? company.nameAr || company.nameEn
              : company.nameEn || company.nameAr;

            const CardWrapper = company.websiteUrl ? "a" : "div";
            const wrapperProps = company.websiteUrl
              ? {
                  href: company.websiteUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {};

            return (
              <CardWrapper
                key={company.id}
                {...wrapperProps}
                className={cn(
                  "group flex flex-col items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-card/90 shadow-2xs hover:shadow-xs transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 min-h-[110px]",
                  company.websiteUrl && "cursor-pointer"
                )}
                title={companyName}
              >
                <div className="relative h-12 w-full flex items-center justify-center px-2 flex-1">
                  <Image
                    src={company.logo}
                    alt={companyName}
                    width={130}
                    height={44}
                    unoptimized
                    className="max-h-9 sm:max-h-11 max-w-[120px] object-contain filter grayscale dark:brightness-200 opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  />
                </div>
                <span className="mt-2 text-[11px] sm:text-xs font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors truncate max-w-full text-center">
                  {companyName}
                </span>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}