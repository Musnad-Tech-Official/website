import { PageHeader } from "@/components/ui/page-header";
import type { ServicesIntroProps } from "./services-types";

export function ServicesIntro({
  eyebrow,
  title,
  subtitle,
  homeLabel,
  servicesLabel,
  breadcrumbLabel,
  className = "",
}: ServicesIntroProps) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: homeLabel, href: "/" },
        { label: servicesLabel },
      ]}
      breadcrumbLabel={breadcrumbLabel || servicesLabel}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      className={className}
    />
  );
}
