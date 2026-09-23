import { PageHeader } from "@/components/ui/page-header";
import type { ProjectsHeaderProps } from "./projects-types";


export function ProjectsHeader({
  eyebrow,
  title,
  subtitle,
  homeLabel,
  projectsLabel,
  breadcrumbLabel,
  className = "",
}: ProjectsHeaderProps) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: homeLabel, href: "/" },
        { label: projectsLabel },
      ]}
      breadcrumbLabel={breadcrumbLabel || projectsLabel}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      className={className}
    />
  );
}
