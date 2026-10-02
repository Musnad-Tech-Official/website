"use client";

import React, { useEffect } from "react";

export interface ArticleReadingProgressProps {
  className?: string;
}

/**
 * ArticleReadingProgress displays a slim, compositor-accelerated
 * reading progress bar fixed to the top of the viewport.
 *
 * Implements Modern Web Guidance:
 * - Uses native CSS `animation-timeline: scroll()` where supported
 * - Hardware-accelerated `transform: scaleX(...)`
 * - Screen-reader safe with `aria-hidden="true"`
 * - Full RTL/LTR direction support
 * - Respects `prefers-reduced-motion`
 * - Smooth fallback for browsers without scroll-driven animations
 */
export function ArticleReadingProgress({ className = "" }: ArticleReadingProgressProps) {
  const barRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Feature detection for CSS Scroll-Driven Animations
    const isSupported =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline", "scroll()");

    if (isSupported) return;

    const handleScroll = () => {
      if (!barRef.current) return;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
        barRef.current.style.transform = `scaleX(${current})`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes article-scroll-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .article-reading-bar {
          transform-origin: left center;
        }

        [dir="rtl"] .article-reading-bar {
          transform-origin: right center;
        }

        @media (prefers-reduced-motion: no-preference) {
          @supports (animation-timeline: scroll()) {
            .article-reading-bar {
              animation: article-scroll-progress auto linear;
              animation-timeline: scroll();
            }
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none ${className}`}
      >
        <div
          ref={barRef}
          className="article-reading-bar h-full w-full bg-linear-to-r from-primary/80 via-primary to-primary shadow-[0_0_8px_rgba(194,44,34,0.6)] dark:shadow-[0_0_12px_rgba(224,52,41,0.8)]"
        />
      </div>
    </>
  );
}
