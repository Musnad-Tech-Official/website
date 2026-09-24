import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import type { BlogHeaderProps } from "./blog-types";

export function BlogHeader({
  eyebrow,
  title,
  subtitle,
  homeLabel,
  blogLabel,
  breadcrumbLabel,
  className = "",
}: BlogHeaderProps) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: homeLabel, href: "/" },
        { label: blogLabel },
      ]}
      breadcrumbLabel={breadcrumbLabel || blogLabel}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      className={className}
    />
  );
}
