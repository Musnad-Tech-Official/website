import React from "react";
import { Card } from "@/components/ui/card";
import { LuCircleAlert, LuTarget, LuCircleCheck, LuCheck } from "react-icons/lu";
import type { ProjectDetailContextProps } from "./project-detail-types";
import { cn } from "@/lib/utils";

function renderContextIcon(iconType: string) {
  const iconProps = { className: "h-5 w-5 text-primary shrink-0" };
  switch (iconType) {
    case "alert":
      return <LuCircleAlert {...iconProps} />;
    case "target":
      return <LuTarget {...iconProps} />;
    case "check":
    default:
      return <LuCircleCheck {...iconProps} />;
  }
}

export function ProjectDetailContext({
  title,
  cards,
  className = "",
}: ProjectDetailContextProps) {
  return (
    <section
      aria-labelledby="detail-context-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      <h2
        id="detail-context-heading"
        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8"
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            variant="default"
            className="p-6 flex flex-col h-full border border-border/70 bg-card hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                {renderContextIcon(card.iconType)}
              </div>
              <h3 className="font-bold text-lg text-foreground">{card.title}</h3>
            </div>

            {card.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {card.description}
              </p>
            )}

            {card.items && card.items.length > 0 && (
              <ul className="space-y-2.5 mt-auto pt-2 text-sm text-foreground/90">
                {card.items.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <LuCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
