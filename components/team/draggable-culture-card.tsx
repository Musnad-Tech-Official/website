"use client";

import React, { useState, useRef, useCallback } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { TeamStat } from "./team-types";
import { cn } from "@/lib/utils";

export interface DraggableCultureCardProps {
  stat: TeamStat;
  index: number;
  initialRotation: number;
  icon: React.ReactNode;
}

/**
 * DraggableCultureCard renders an interactive stacked card with:
 * - Fluid pointer drag-and-drop mechanics
 * - Smooth cubic-bezier snap-back physics on release
 * - Design System Card foundation using theme variables and primary accents
 */
export function DraggableCultureCard({
  stat,
  index,
  initialRotation,
  icon,
}: DraggableCultureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dragSessionRef = useRef<{
    startX: number;
    startY: number;
    initialPosX: number;
    initialPosY: number;
  }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
  });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;

      dragSessionRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPosX: position.x,
        initialPosY: position.y,
      };

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }

      setIsDragging(true);
      setIsSnapping(false);
      e.stopPropagation();
    },
    [position.x, position.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragSessionRef.current.startX;
      const deltaY = e.clientY - dragSessionRef.current.startY;

      setPosition({
        x: dragSessionRef.current.initialPosX + deltaX,
        y: dragSessionRef.current.initialPosY + deltaY,
      });
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }

      setIsDragging(false);
      // Snap smoothly back to original stacked position
      setIsSnapping(true);
      setPosition({ x: 0, y: 0 });
    },
    [isDragging]
  );

  const handlePointerCancel = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsSnapping(true);
    setPosition({ x: 0, y: 0 });
  }, [isDragging]);

  const handleTransitionEnd = useCallback(() => {
    if (isSnapping) {
      setIsSnapping(false);
    }
  }, [isSnapping]);

  // Transform, transition, and layering styles
  let transformStyle = "";
  let transitionStyle = "";
  let zIndexStyle = 10;

  if (isDragging) {
    transformStyle = `translate3d(${position.x}px, ${position.y}px, 0) rotate(0deg) scale(1.04)`;
    transitionStyle = "none";
    zIndexStyle = 100;
  } else if (isSnapping) {
    transformStyle = `translate3d(0px, 0px, 0) rotate(${initialRotation}deg) scale(1)`;
    transitionStyle = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    zIndexStyle = 40;
  } else {
    const currentRot = isHovered ? 0 : initialRotation;
    const currentScale = isHovered ? 1.02 : 1;
    transformStyle = `translate3d(0px, 0px, 0) rotate(${currentRot}deg) scale(${currentScale})`;
    transitionStyle = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    zIndexStyle = isHovered ? 50 : 30 - index * 5;
  }

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onTransitionEnd={handleTransitionEnd}
      onMouseEnter={() => !isDragging && setIsHovered(true)}
      onMouseLeave={() => !isDragging && setIsHovered(false)}
      style={{
        transform: transformStyle,
        transition: transitionStyle,
        zIndex: zIndexStyle,
        touchAction: "none",
      }}
      className={cn(
        "relative w-full max-w-[440px] select-none cursor-grab active:cursor-grabbing",
        index > 0 && "mt-[-28px] sm:mt-[-36px]"
      )}
    >
      <Card
        variant="default"
        className={cn(
          "p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card text-card-foreground",
          "shadow-md dark:shadow-black/60 transition-shadow duration-200",
          isDragging && "ring-2 ring-primary/40 shadow-2xl border-primary/50",
          !isDragging && isHovered && "border-primary/40 shadow-lg shadow-primary/5"
        )}
      >
        {/* Card Header: Primary Accent Icon + Eyebrow Category + Index Step */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-3.5 border-b border-border/60 text-start">
          <div className="flex items-center gap-2.5">
            <span className="text-primary shrink-0 text-base sm:text-lg">
              {icon}
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              {stat.eyebrow}
            </span>
          </div>

          <span className="text-xs font-mono font-medium text-muted-foreground/60 select-none">
            0{index + 1}
          </span>
        </div>

        {/* Card Headline */}
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2 text-start">
          {stat.value}
        </CardTitle>

        {/* Card Description */}
        <CardDescription className="text-sm text-muted-foreground leading-relaxed text-start">
          {stat.label}
        </CardDescription>
      </Card>
    </div>
  );
}

