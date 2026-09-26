import React from "react";
import { LuInfo, LuTriangleAlert, LuCircleCheck } from "react-icons/lu";
import { ArticleCodeBlock } from "./article-code-block";
import type { ArticleContentRendererProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleContentRenderer({
  blocks,
  className = "",
}: ArticleContentRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={index}
                className="text-foreground/90 leading-relaxed font-normal"
              >
                {block.text}
              </p>
            );

          case "heading":
            if (block.level === 3) {
              return (
                <h3
                  key={index}
                  id={block.id}
                  className="text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-4 pb-2 scroll-mt-24"
                >
                  {block.text}
                </h3>
              );
            }
            return (
              <h2
                key={index}
                id={block.id}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground pt-6 pb-3 border-b border-border/40 scroll-mt-24"
              >
                {block.text}
              </h2>
            );

          case "list":
            if (block.style === "ordered") {
              return (
                <ol
                  key={index}
                  className="space-y-2 ps-6 list-decimal text-foreground/90 leading-relaxed"
                >
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ol>
              );
            }
            return (
              <ul
                key={index}
                className="space-y-2 ps-6 list-disc text-foreground/90 leading-relaxed"
              >
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="my-8 ps-5 sm:ps-6 py-2 border-s-4 border-primary bg-muted/20 rounded-e-xl text-lg sm:text-xl italic text-foreground leading-relaxed"
              >
                <p>{block.text}</p>
                {block.attribution && (
                  <cite className="block mt-2 text-sm not-italic font-medium text-muted-foreground">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            );

          case "callout": {
            const variant = block.variant || "info";
            const borderColors = {
              info: "border-primary/40 bg-primary/5 text-foreground",
              warning: "border-amber-500/40 bg-amber-500/5 text-foreground",
              success: "border-emerald-500/40 bg-emerald-500/5 text-foreground",
            };
            const iconColors = {
              info: "text-primary",
              warning: "text-amber-500",
              success: "text-emerald-500",
            };
            const Icon =
              variant === "warning"
                ? LuTriangleAlert
                : variant === "success"
                ? LuCircleCheck
                : LuInfo;

            return (
              <div
                key={index}
                className={cn(
                  "my-8 rounded-2xl border p-5 sm:p-6 flex items-start gap-4 shadow-2xs",
                  borderColors[variant]
                )}
                role="note"
              >
                <Icon
                  className={cn("h-5 w-5 shrink-0 mt-0.5", iconColors[variant])}
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  {block.title && (
                    <h4 className="font-bold text-sm sm:text-base text-foreground">
                      {block.title}
                    </h4>
                  )}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {block.text}
                  </p>
                </div>
              </div>
            );
          }

          case "code":
            return (
              <ArticleCodeBlock
                key={index}
                code={block.code}
                language={block.language}
                filename={block.filename}
              />
            );

          case "media":
            return (
              <figure key={index} className="my-8 space-y-2">
                <div
                  className={cn(
                    "relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-border/60 bg-linear-to-br flex items-center justify-center",
                    block.previewGradient ||
                      "from-muted/80 via-muted/40 to-background"
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.12] dark:opacity-[0.18] pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <span className="text-xs uppercase tracking-wider font-mono text-muted-foreground/70">
                    Figure Canvas
                  </span>
                </div>
                {block.caption && (
                  <figcaption className="text-xs sm:text-sm text-center text-muted-foreground">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
