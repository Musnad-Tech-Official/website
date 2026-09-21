"use client";

import React, { useRef } from "react";
import { TechBadge } from "./tech-badge";
import { TechIcon } from "./tech-icon";
import { TECH_ROWS, ALL_TECH_ITEMS } from "./tech-data";

export interface TechCloudProps {
  heroRef?: React.RefObject<HTMLElement | null>;
}

export function TechCloud({ heroRef }: TechCloudProps) {
  // Valid drop zone boundary for draggable pills
  const dropZoneRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={dropZoneRef}
      className="relative w-full max-w-2xl mx-auto flex items-center justify-center py-2 sm:py-4 px-2"
    >
      {/* Ambient Crimson/Burgundy Glow matching reference design */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-visible"
      >
        {/* Dark mode deep crimson/burgundy radial illumination */}
        <div className="w-[115%] h-[115%] max-w-[640px] max-h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(194,44,34,0.35)_0%,rgba(130,18,24,0.20)_38%,rgba(60,6,10,0.07)_62%,transparent_75%)] dark:block hidden blur-xl pointer-events-none" />
        {/* Light mode warm crimson/peach radial illumination */}
        <div className="w-[115%] h-[115%] max-w-[640px] max-h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.15)_0%,rgba(249,115,22,0.08)_40%,transparent_70%)] dark:hidden block blur-2xl pointer-events-none" />
      </div>

      {/* Desktop & Large Tablet Clustered Rows */}
      <div className="hidden sm:flex flex-col items-center gap-3.5 w-full">
        {TECH_ROWS.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-center gap-3.5 sm:gap-4 w-full"
          >
            {row.items.map((item) => (
              <TechBadge
                key={item.id}
                name={item.name}
                icon={<TechIcon id={item.id} />}
                rotation={item.rotation}
                heroRef={heroRef}
                dropZoneRef={dropZoneRef}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Mobile Flow (Fluid Responsive Wrap) */}
      <div className="flex sm:hidden flex-wrap items-center justify-center gap-2.5 px-2">
        {ALL_TECH_ITEMS.map((item) => (
          <TechBadge
            key={item.id}
            name={item.name}
            icon={<TechIcon id={item.id} />}
            rotation={item.rotation}
            heroRef={heroRef}
            dropZoneRef={dropZoneRef}
          />
        ))}
      </div>
    </div>
  );
}
