"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  shape?: "circle" | "rounded";
  status?: AvatarStatus;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; dot: string; px: number }> = {
  xs: { container: "h-6 w-6", text: "text-[10px]", dot: "h-1.5 w-1.5", px: 24 },
  sm: { container: "h-8 w-8", text: "text-xs", dot: "h-2 w-2", px: 32 },
  md: { container: "h-10 w-10", text: "text-sm", dot: "h-2.5 w-2.5", px: 40 },
  lg: { container: "h-12 w-12", text: "text-base", dot: "h-3 w-3", px: 48 },
  xl: { container: "h-16 w-16", text: "text-xl", dot: "h-3.5 w-3.5", px: 64 },
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-emerald-500 ring-background",
  busy: "bg-destructive ring-background",
  away: "bg-amber-500 ring-background",
  offline: "bg-muted-foreground ring-background",
};

export function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  shape = "circle",
  status,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (text?: string) => {
    if (!text) return "?";
    const parts = text.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = fallback || getInitials(alt);
  const sizeConfig = sizeStyles[size];

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center select-none overflow-visible",
        sizeConfig.container,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-muted flex items-center justify-center font-medium text-foreground",
          shape === "circle" ? "rounded-full" : "rounded-xl border border-border"
        )}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt}
            width={sizeConfig.px}
            height={sizeConfig.px}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={cn("font-semibold text-muted-foreground", sizeConfig.text)}>
            {initials}
          </span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2",
            statusColors[status],
            sizeConfig.dot
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

