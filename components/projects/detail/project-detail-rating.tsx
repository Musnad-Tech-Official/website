"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuStar, LuLock, LuInfo } from "react-icons/lu";
import type { ProjectDetailRatingProps } from "./project-detail-types";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * SECURITY BOUNDARY & ARCHITECTURAL NOTE:
 * Frontend gating is UX only.
 * Real security enforcement must happen later in the Backend / Supabase RLS
 * layer using:
 *   authenticated user ID + project ID + verified project experience record.
 * The frontend must NEVER be treated as the security boundary.
 *
 * FUTURE BACKEND FLOW:
 *   Clerk authenticated user
 *   → project resolved by slug
 *   → backend obtains stable project ID
 *   → backend checks verified project experience
 *   → backend returns interaction eligibility
 *   → Project Detail UI enables/disables Rating control
 * ============================================================================
 */
export function ProjectDetailRating({
  title,
  subtitle,
  ratePrompt = "Select your rating:",
  summary,
  submitLabel = "Submit Rating",
  ratingsLabel = "ratings",
  integrationNotice = "Project ratings will be available when account interactions are connected.",
  previewNotice = "Rating preview only — ratings are not persisted.",
  eligibility,
  eligibilityMessages,
  onSubmitRating,
  className = "",
}: ProjectDetailRatingProps) {
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [hoveredStars, setHoveredStars] = useState<number>(0);
  const [showPreviewNotice, setShowPreviewNotice] = useState<boolean>(false);

  // If eligibility is provided, respect canRate; otherwise default to locked until connected
  const isLocked = eligibility ? !eligibility.canRate : true;
  const reason = eligibility?.reason || "signed_out";

  const activeStars = hoveredStars || selectedStars;
  const hasSummary = summary && summary.totalCount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || selectedStars === 0) return;

    // Trigger optional external callback for future integration
    onSubmitRating?.(selectedStars);

    // Show non-persistence disclaimer without claiming a database write
    setShowPreviewNotice(true);
  };

  return (
    <section
      aria-labelledby="detail-rating-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      <Card
        variant="default"
        className="p-6 sm:p-8 lg:p-10 border border-border/80 bg-card overflow-hidden"
      >
        <div
          className={cn(
            "grid gap-8 lg:gap-12 items-center",
            hasSummary ? "grid-cols-1 md:grid-cols-12" : "grid-cols-1 max-w-2xl"
          )}
        >
          {/* Left Column: Rating Form & Eligibility UX */}
          <div className={cn("space-y-4", hasSummary && "md:col-span-7")}>
            <div>
              <h2
                id="detail-rating-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mt-1.5">
                  {subtitle}
                </p>
              )}
            </div>

            {/* 1. Integration Status Notice */}
            {integrationNotice && (
              <div
                role="note"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground"
              >
                <LuInfo className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{integrationNotice}</span>
              </div>
            )}

            {/* 2. Eligibility Gating Banner (Locked States) */}
            {isLocked && eligibilityMessages && (
              <div
                role="status"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 text-foreground"
              >
                <div className="flex items-start gap-2.5">
                  <LuLock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium">
                      {reason === "signed_out"
                        ? eligibilityMessages.signedOut
                        : eligibilityMessages.experienceRequired}
                    </p>
                    {reason === "experience_required" &&
                      eligibilityMessages.experienceRequiredSecondary && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {eligibilityMessages.experienceRequiredSecondary}
                        </p>
                      )}
                  </div>
                </div>

                {reason === "signed_out" && (
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center h-8 px-3.5 text-xs rounded-lg font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors shrink-0 shadow-sm"
                  >
                    {eligibilityMessages.signIn}
                  </Link>
                )}
              </div>
            )}

            {/* 3. Rating Star Control */}
            <form onSubmit={handleSubmit} className="pt-2 space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {ratePrompt}
              </span>

              {/* Star Picker */}
              <div
                className="flex items-center gap-1.5"
                role="radiogroup"
                aria-label={ratePrompt}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= activeStars;
                  return (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      disabled={isLocked}
                      aria-checked={selectedStars === star}
                      aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                      onClick={() => !isLocked && setSelectedStars(star)}
                      onMouseEnter={() => !isLocked && setHoveredStars(star)}
                      onMouseLeave={() => !isLocked && setHoveredStars(0)}
                      className={cn(
                        "p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isLocked
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-muted/60 cursor-pointer"
                      )}
                    >
                      <LuStar
                        className={cn(
                          "h-6 w-6 sm:h-7 sm:w-7 transition-colors",
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : isLocked
                            ? "text-muted-foreground/30"
                            : "text-muted-foreground/40 hover:text-amber-300"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={isLocked || selectedStars === 0}
                >
                  {submitLabel}
                </Button>

                {/* Non-Persistence Preview Disclaimer */}
                {showPreviewNotice && (
                  <p
                    role="status"
                    className="text-xs text-muted-foreground italic animate-in fade-in"
                  >
                    {previewNotice}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Rating Breakdown & Summary (rendered only if real summary exists) */}
          {hasSummary && summary && (
            <div className="md:col-span-5 p-6 rounded-2xl bg-muted/20 border border-border/60 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/60">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-foreground">
                      {summary.average.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <LuStar
                        key={s}
                        className={cn(
                          "h-4 w-4",
                          s <= Math.round(summary.average)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-end">
                  <span className="block text-sm font-semibold text-foreground">
                    {summary.totalCount}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {ratingsLabel}
                  </span>
                </div>
              </div>

              {/* Distribution bars */}
              {summary.distribution && (
                <div className="space-y-2">
                  {summary.distribution.map(
                    (item: { stars: number; count: number; percentage: number }) => (
                      <div key={item.stars} className="flex items-center gap-2.5 text-xs">
                        <span className="w-4 font-mono font-medium text-muted-foreground">
                          {item.stars}
                        </span>
                        <LuStar className="h-3 w-3 fill-muted-foreground/40 text-muted-foreground/40 shrink-0" />
                        <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/80 transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-end font-mono text-muted-foreground">
                          {item.percentage}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
