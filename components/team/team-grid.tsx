"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import type { TeamGridProps } from "./team-types";
import { cn } from "@/lib/utils";
import TeamMemberCard from "./team-member-card";


export function TeamGrid({ members, className = "" }: TeamGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const isRtl = getComputedStyle(el).direction === "rtl";
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    if (isRtl) {
      // In RTL: start is right edge (~0), end is left edge (-maxScroll)
      const absScroll = Math.abs(scrollLeft);
      setCanScrollRight(absScroll > 5);
      setCanScrollLeft(absScroll < maxScroll - 5);
    } else {
      // In LTR: start is left edge (~0), end is right edge (maxScroll)
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < maxScroll - 5);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [members, updateScrollButtons]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    // Scroll by roughly 1-2 card widths per click
    const scrollAmount = Math.max(280, el.clientWidth * 0.5);
    const delta = direction === "left" ? -scrollAmount : scrollAmount;

    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Team members"
      className={cn("relative w-full pb-16 sm:pb-20", className)}
    >
      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory",
          "py-3 px-1 -mx-1",
          "scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {members.map((member) => (
          <div
            key={member.id}
            className="w-65 sm:w-70 md:w-75 lg:w-[320px] shrink-0 snap-start"
          >
            <TeamMemberCard member={member} />
          </div>
        ))}
      </div>

      {/* Bottom Navigation Buttons using Design System Button */}
      <div className="flex items-center justify-end gap-3 pt-6 sm:pt-8 select-none">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className="rounded-full shadow-2xs h-10 w-10 sm:h-11 sm:w-11 cursor-pointer"
        >
          <HiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className="rounded-full shadow-2xs h-10 w-10 sm:h-11 sm:w-11 cursor-pointer"
        >
          <HiArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </section>
  );
}
