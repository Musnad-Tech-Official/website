import React from "react";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuArrowUpRight } from "react-icons/lu";
import type { ServiceCardProps } from "./services-types";
import { cn } from "@/lib/utils";

export function ServiceCard({
  title,
  description,
  tags,
  href,
  icon: Icon,
  learnMoreLabel,
  ariaLabel,
  className = "",
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl transition-all"
      aria-label={ariaLabel || title}
    >
      <Card
        variant="interactive"
        className={cn(
          "h-full flex flex-col justify-between p-6 sm:p-7 border border-border/80 bg-card hover:border-primary/50 transition-all duration-200",
          className
        )}
      >
        <div>
          {/* Visual Icon Marker */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/40 text-primary mb-5 group-hover:bg-primary/10 transition-colors">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Capability Tags */}
          <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Service capabilities">
            {tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                size="sm"
                className="font-normal text-[11px] text-muted-foreground/90 bg-muted/60 hover:bg-muted"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Learn More Action Footer */}
        <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-1.5 text-xs font-semibold text-foreground/80 group-hover:text-primary transition-colors">
          <span>{learnMoreLabel}</span>
          <LuArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </Card>
    </Link>
  );
}
