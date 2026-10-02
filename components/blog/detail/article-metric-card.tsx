"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MetricItem {
  value: string;
  label: string;
  description?: string;
}

export interface ArticleMetricCardProps {
  stats: MetricItem[];
  caption?: string;
  className?: string;
}

/**
 * ArticleMetricCard highlights production benchmark numbers,
 * latency cuts, and performance percentiles (Stripe & Cloudflare standard).
 */
export function ArticleMetricCard({
  stats,
  caption,
  className = "",
}: ArticleMetricCardProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className={cn("my-8 space-y-2", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border/70 bg-card/80 dark:bg-card/40 backdrop-blur-xs flex flex-col justify-between shadow-xs hover:border-primary/30 transition-colors"
          >
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-primary font-mono">
              {stat.value}
            </div>
            <div className="mt-2">
              <div className="text-sm font-bold text-foreground">
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {stat.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {caption && (
        <p className="text-xs text-center text-muted-foreground pt-1">
          {caption}
        </p>
      )}
    </div>
  );
}
