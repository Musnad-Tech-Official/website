import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import type { CareersIntroProps } from "./careers-types";
import { cn } from "@/lib/utils";

export function CareersIntro({
  homeLabel,
  careersLabel,
  breadcrumbLabel,
  eyebrow,
  title,
  subtitle,
  className = "",
}: CareersIntroProps) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: homeLabel, href: "/" },
        { label: careersLabel },
      ]}
      breadcrumbLabel={breadcrumbLabel || careersLabel}
      eyebrow={eyebrow}
      title={
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-serif rtl:font-sans text-foreground leading-[1.1] mb-4 sm:mb-5">
          {title}
        </h1>
      }
      subtitle={subtitle}
      className={cn("pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12", className)}
    />
  );
}
