import { useTranslations } from "next-intl";
import { CtaSection } from "@/components/ui/cta-section";
import { LuArrowUpRight, LuArrowRight } from "react-icons/lu";

export interface FinalCtaProps {
  className?: string;
}

export function FinalCta({ className = "" }: FinalCtaProps) {
  const t = useTranslations("Home.finalCta");

  return (
    <CtaSection
      variant="large"
      title={t("heading")}
      subtitle={t("description")}
      primaryAction={{
        label: t("primaryCta"),
        href: "/contact",
        variant: "primary",
        icon: <LuArrowUpRight className="h-5 w-5 rtl:-scale-x-100" />,
      }}
      secondaryAction={{
        label: t("secondaryCta"),
        href: "/careers",
        variant: "secondary",
        icon: <LuArrowRight className="h-4 w-4 rtl:rotate-180" />,
      }}
      className={className}
    />
  );
}
