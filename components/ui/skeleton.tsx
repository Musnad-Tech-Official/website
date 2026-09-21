import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "rectangle" | "circle" | "rounded";
}

export function Skeleton({
  className,
  shape = "rounded",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/80",
        shape === "rounded" && "rounded-lg",
        shape === "circle" && "rounded-full",
        shape === "rectangle" && "rounded-none",
        className
      )}
      {...props}
    />
  );
}

