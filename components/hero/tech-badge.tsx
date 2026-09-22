"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface TechBadgeProps {
  name: string;
  icon: React.ReactNode;
  rotation?: number;
  className?: string;
  heroRef?: React.RefObject<HTMLElement | null>;
  dropZoneRef?: React.RefObject<HTMLElement | null>;
}

export function TechBadge({
  name,
  icon,
  rotation = 0,
  className = "",
  heroRef,
  dropZoneRef,
}: TechBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Tracks pointer starting coordinates & initial element position
  const dragSessionRef = useRef<{
    startX: number;
    startY: number;
    initialPosX: number;
    initialPosY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
    hasMoved: false,
  });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Only process main button clicks (left click / touch)
      if (e.button !== 0) return;

      dragSessionRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPosX: position.x,
        initialPosY: position.y,
        hasMoved: false,
      };

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for environments where pointer capture isn't supported
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

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        dragSessionRef.current.hasMoved = true;
      }

      let nextX = dragSessionRef.current.initialPosX + deltaX;
      let nextY = dragSessionRef.current.initialPosY + deltaY;

      // Restrict movement strictly inside Hero section boundaries
      if (badgeRef.current && heroRef?.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const badgeRect = badgeRef.current.getBoundingClientRect();

        // Calculate original unshifted bounding coordinates
        const originalLeft = badgeRect.left - position.x;
        const originalTop = badgeRect.top - position.y;
        const originalRight = badgeRect.right - position.x;
        const originalBottom = badgeRect.bottom - position.y;

        const minX = heroRect.left - originalLeft;
        const maxX = heroRect.right - originalRight;
        const minY = heroRect.top - originalTop;
        const maxY = heroRect.bottom - originalBottom;

        nextX = Math.max(minX, Math.min(nextX, maxX));
        nextY = Math.max(minY, Math.min(nextY, maxY));
      }

      setPosition({ x: nextX, y: nextY });
    },
    [isDragging, position.x, position.y, heroRef]
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

      if (!dragSessionRef.current.hasMoved) {
        return;
      }

      // Check if dropped inside the valid right-side technology drop area
      if (badgeRef.current && dropZoneRef?.current) {
        const dropRect = dropZoneRef.current.getBoundingClientRect();
        const badgeRect = badgeRef.current.getBoundingClientRect();

        const badgeCenterX = badgeRect.left + badgeRect.width / 2;
        const badgeCenterY = badgeRect.top + badgeRect.height / 2;

        const isInsideDropArea =
          badgeCenterX >= dropRect.left &&
          badgeCenterX <= dropRect.right &&
          badgeCenterY >= dropRect.top &&
          badgeCenterY <= dropRect.bottom;

        if (isInsideDropArea) {
          // Keep new position inside the valid technology drop zone
          setIsSnapping(false);
        } else {
          // Smoothly animate back to predefined original position
          setIsSnapping(true);
          setPosition({ x: 0, y: 0 });
        }
      } else {
        // Fallback: snap back to original position
        setIsSnapping(true);
        setPosition({ x: 0, y: 0 });
      }
    },
    [isDragging, dropZoneRef]
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

  // Compute dynamic transform and transition styles
  let transformStyle = "";
  let transitionStyle = "";
  let zIndexStyle = 10;

  if (isDragging) {
    transformStyle = `translate3d(${position.x}px, ${position.y}px, 0) rotate(0deg) scale(1.08)`;
    transitionStyle = "none";
    zIndexStyle = 50;
  } else if (isSnapping) {
    transformStyle = `translate3d(0px, 0px, 0) rotate(${rotation}deg) scale(1)`;
    transitionStyle = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
    zIndexStyle = 40;
  } else {
    // Idle (either at (0, 0) or settled inside the drop zone)
    const currentRot = isHovered ? 0 : rotation;
    const currentScale = isHovered ? 1.05 : 1;
    transformStyle = `translate3d(${position.x}px, ${position.y}px, 0) rotate(${currentRot}deg) scale(${currentScale})`;
    transitionStyle = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    zIndexStyle = isHovered ? 30 : position.x !== 0 || position.y !== 0 ? 20 : 10;
  }

  return (
    <div
      ref={badgeRef}
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
      aria-label={name}
      dir="ltr"
      className={cn(
        "relative inline-flex items-center gap-3 pl-2.5 pr-4.5 py-2 sm:pl-3 sm:pr-5 sm:py-2.5 rounded-full select-none cursor-grab active:cursor-grabbing",
        "bg-card text-card-foreground dark:bg-[#131418] dark:text-neutral-100 border border-border/75 dark:border-white/10",
        "shadow-xs dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-md dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.7)] transition-shadow duration-200",
        isDragging && "ring-2 ring-primary/40 shadow-xl shadow-primary/15 border-primary/50 dark:border-primary/50",
        !isDragging && isHovered && "border-primary/40 dark:border-primary/40 shadow-md shadow-primary/10",
        className
      )}
    >
      <span className="shrink-0 flex items-center justify-center pointer-events-none">
        {icon}
      </span>
      <span className="text-sm sm:text-[15px] font-semibold tracking-tight whitespace-nowrap pointer-events-none">
        {name}
      </span>
    </div>
  );
}
