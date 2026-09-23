import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/page-header";
import type { AboutIntroProps } from "./about-types";
import { cn } from "@/lib/utils";

export function AboutIntro({ className = "" }: AboutIntroProps) {
  const t = useTranslations("About.intro");

  return (
    <PageHeader
      breadcrumbs={[
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbAbout") },
      ]}
      breadcrumbLabel={t("breadcrumbLabel")}
      eyebrow={t("eyebrow")}
      title={
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-4 sm:mb-5 whitespace-pre-line">
          {t("title")}
        </h1>
      }
      subtitle={t("subtitle")}
      className={cn("pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6", className)}
    />
  );
}
