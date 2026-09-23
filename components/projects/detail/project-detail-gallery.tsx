import React from "react";
import { Card } from "@/components/ui/card";
import { LuImage } from "react-icons/lu";
import type { ProjectDetailGalleryProps } from "./project-detail-types";
import { cn } from "@/lib/utils";

export function ProjectDetailGallery({
  title,
  items,
  previewPrefix = "Preview",
  className = "",
}: ProjectDetailGalleryProps) {
  return (
    <section
      aria-labelledby="detail-gallery-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      <h2
        id="detail-gallery-heading"
        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8"
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <Card
            key={item.id}
            variant="default"
            className="group overflow-hidden border border-border/70 bg-card flex flex-col"
          >
            {/* Visual Canvas Placeholder preserving structural dimensions */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-muted/90 via-muted/50 to-background border-b border-border/60 flex items-center justify-center">
              {/* Subtle architectural grid pattern */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.10] dark:opacity-[0.15] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />

              {/* Ambient radial accent */}
              <div
                aria-hidden="true"
                className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-xl dark:bg-primary/20 pointer-events-none"
              />

              {/* Decorative slide emblem */}
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/60 z-10 select-none">
                <div
                  aria-hidden="true"
                  className="h-11 w-11 rounded-xl border border-border/70 bg-background/60 backdrop-blur-xs flex items-center justify-center text-primary/70 shadow-xs"
                >
                  <LuImage className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80">
                  {`${previewPrefix} 0${idx + 1}`}
                </span>
              </div>
            </div>

            {/* Caption & Title */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {item.caption}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
