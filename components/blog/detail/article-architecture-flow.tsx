"use client";

import React from "react";
import { LuLayers, LuArrowRight } from "react-icons/lu";
import { cn } from "@/lib/utils";

export interface ArchitectureStep {
  title: string;
  desc: string;
  tag?: string;
}

export interface ArticleArchitectureFlowProps {
  title?: string;
  caption?: string;
  steps: ArchitectureStep[];
  className?: string;
}

/**
 * ArticleArchitectureFlow visualizes system architecture pipelines,
 * data flows, and protocol steps cleanly without requiring external heavyweight renderers.
 */
export function ArticleArchitectureFlow({
  title = "Architecture Pipeline",
  caption,
  steps,
  className = "",
}: ArticleArchitectureFlowProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <figure className={cn("my-8 space-y-2.5", className)}>
      <div className="rounded-2xl border border-border/80 bg-zinc-950/90 text-zinc-100 p-5 sm:p-7 shadow-xs">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-zinc-800 text-xs font-mono font-bold tracking-wider uppercase text-zinc-400 select-none">
          <LuLayers className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{title}</span>
        </div>

        {/* Steps Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col justify-between">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      0{idx + 1}
                    </span>
                    {step.tag && (
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {step.tag}
                      </span>
                    )}
                  </div>
                  <h5 className="text-sm font-bold text-zinc-100 tracking-tight">
                    {step.title}
                  </h5>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Arrow Connector between steps for desktop */}
              {idx < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-zinc-500 bg-zinc-950 p-0.5 rounded-full rtl:rotate-180"
                >
                  <LuArrowRight className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {caption && (
        <figcaption className="text-xs text-center text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
