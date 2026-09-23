import { useTranslations } from "next-intl";
import { CtaSection } from "@/components/ui/cta-section";
import type { AboutCtaProps } from "./about-types";

/**
 * AboutCta
 *
 * Reuses the repository's shared CtaSection component with About-specific
 * inquiry and team routing.
 */
export function AboutCta({ className = "" }: AboutCtaProps) {
  const t = useTranslations("About.cta");

  return (
    <CtaSection
      eyebrow={t("badge")}
      title={t("title")}
      subtitle={t("subtitle")}
      primaryAction={{
        label: t("primaryAction"),
        href: "/contact",
        variant: "primary",
        showArrow: true,
      }}
      secondaryAction={{
        label: t("secondaryAction"),
        href: "/team",
        variant: "outline",
      }}
      className={className}
    />
  );
}
