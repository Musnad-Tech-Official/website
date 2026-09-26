import React from "react";
import { useTranslations } from "next-intl";
import { LuCircleDot, LuLanguages, LuFolderGit2, LuLaptop } from "react-icons/lu";
import type { CareersValuesProps } from "./careers-types";
import { cn } from "@/lib/utils";

function renderValueIcon(iconType: string) {
  const iconProps = { className: "h-4 w-4 text-foreground/80 shrink-0", "aria-hidden": "true" as const };
  switch (iconType) {
    case "senior":
      return <LuCircleDot {...iconProps} />;
    case "bilingual":
      return <LuLanguages {...iconProps} />;
    case "openSource":
      return <LuFolderGit2 {...iconProps} />;
    case "remote":
    default:
      return <LuLaptop {...iconProps} />;
  }
}

export function CareersValues({
  eyebrow,
  title,
  subtitle,
  items,
  className = "",
}: CareersValuesProps) {
  const t = useTranslations("Careers.values.items");

  return (
    <section
      aria-labelledby="why-work-with-us-heading"
      className={cn("py-10 sm:py-16 border-t border-border/60", className)}
    >
      <div className="max-w-3xl mb-8 sm:mb-12 text-start">
        <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 select-none">
          {eyebrow}
        </span>
        <h2
          id="why-work-with-us-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif rtl:font-sans text-foreground leading-[1.15] mb-4"
        >
          {title}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs hover:border-border hover:shadow-md transition-all flex flex-col text-start"
          >
            <div className="h-9 w-9 rounded-full border border-border/80 bg-muted/40 flex items-center justify-center mb-5 shrink-0">
              {renderValueIcon(item.iconType)}
            </div>
            <h3 className="text-lg font-bold font-serif rtl:font-sans text-foreground mb-2">
              {t(`${item.translationKey}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(`${item.translationKey}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
