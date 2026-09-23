import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LuCode,
  LuTerminal,
  LuDatabase,
  LuServer,
  LuWrench,
  LuArrowUpRight,
} from "react-icons/lu";
import type { ProjectDetailToolsProps } from "./project-detail-types";
import { cn } from "@/lib/utils";

function renderToolIcon(iconType: string) {
  const iconProps = { className: "h-5 w-5 text-primary shrink-0" };
  switch (iconType) {
    case "terminal":
      return <LuTerminal {...iconProps} />;
    case "database":
      return <LuDatabase {...iconProps} />;
    case "server":
      return <LuServer {...iconProps} />;
    case "tool":
      return <LuWrench {...iconProps} />;
    case "code":
    default:
      return <LuCode {...iconProps} />;
  }
}

export function ProjectDetailTools({
  title,
  subtitle,
  items,
  className = "",
}: ProjectDetailToolsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      aria-labelledby="detail-tools-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      <div className="mb-8">
        <h2
          id="detail-tools-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {items.map((tool) => (
          <Card
            key={tool.id}
            variant="default"
            className="p-4 sm:p-5 flex items-start justify-between gap-4 border border-border/70 bg-card hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60 shrink-0 mt-0.5">
                {renderToolIcon(tool.iconType)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    {tool.name}
                  </h3>
                  <Badge variant="secondary" size="sm" className="text-[10px]">
                    {tool.category}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="h-8 w-8 rounded-full border border-border/60 bg-muted/30 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5"
            >
              <LuArrowUpRight className="h-4 w-4 rtl:-rotate-90 text-muted-foreground/70" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
