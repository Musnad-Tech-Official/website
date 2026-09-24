import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import type { ServiceDetailIntroProps } from "./service-detail-types";

export function ServiceDetailIntro({
  eyebrow,
  title,
  subtitle,
  homeLabel,
  servicesLabel,
  breadcrumbLabel,
  icon: Icon,
  className = "",
}: ServiceDetailIntroProps) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: homeLabel, href: "/" },
        { label: servicesLabel, href: "/services" },
        { label: title },
      ]}
      breadcrumbLabel={breadcrumbLabel || servicesLabel}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      className={className}
    >
      {/* Service Icon Marker below the intro, matching reference design */}
      <div className="mt-6 sm:mt-8 flex items-center">
        <div
          aria-hidden="true"
          className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl border border-border/80 bg-muted/40 dark:bg-muted/20 flex items-center justify-center text-muted-foreground shadow-2xs"
        >
          <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
        </div>
      </div>
    </PageHeader>
  );
}
