import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/page-header";
import type { FaqIntroProps } from "./faq-types";
import { cn } from "@/lib/utils";

export function FaqIntro({ className = "" }: FaqIntroProps) {
  const t = useTranslations("Faq");

  return (
    <PageHeader
      breadcrumbs={[
        { label: t("breadcrumb.home"), href: "/" },
        { label: t("breadcrumb.faq") },
      ]}
      breadcrumbLabel={t("breadcrumb.label")}
      eyebrow={t("intro.eyebrow")}
      title={
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-4 sm:mb-5 whitespace-pre-line rtl:font-sans">
          {t("intro.title")}
        </h1>
      }
      subtitle={t("intro.subtitle")}
      className={cn("pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6", className)}
    />
  );
}
