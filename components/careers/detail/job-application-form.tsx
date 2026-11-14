"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { JobApplicationFormProps } from "./job-detail-types";

/**
 * Do not collect CVs or show a success state until a secure, persistent
 * applications backend and private file storage are implemented.
 */
export function JobApplicationForm({ className = "" }: JobApplicationFormProps) {
  const t = useTranslations("JobDetail.common.form");
  const locale = useLocale();
  const subject = encodeURIComponent(
    locale === "ar" ? "طلب توظيف - مسند للتقنية" : "Job application - Musnad Tech"
  );

  return (
    <aside
      aria-labelledby="application-form-title"
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs text-start",
        className
      )}
    >
      <h2 id="application-form-title" className="text-xl sm:text-2xl font-bold text-foreground">
        {t("unavailableTitle")}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {t("unavailableDescription")}
      </p>
      <p className="mt-5 text-sm font-medium text-foreground">
        hello@musnad.tech
      </p>
      <a
        className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:bg-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        href={`mailto:hello@musnad.tech?subject=${subject}`}
      >
        {t("emailApplication")}
      </a>
      <Link
        href="/contact"
        className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("contactForCareers")}
      </Link>
    </aside>
  );
}
