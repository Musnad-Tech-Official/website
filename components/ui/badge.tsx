import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive"
  | "accent"
  | "success"
  | "warning";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  onRemove?: () => void;
  removeAriaLabel?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground border-transparent",
  secondary:
    "bg-secondary text-secondary-foreground border-border/40 hover:bg-secondary/80",
  outline: "border-border text-foreground bg-transparent",
  destructive: "bg-destructive text-destructive-foreground border-transparent",
  accent:
    "bg-accent text-accent-foreground border-primary/20",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  warning:
    "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-white",
  secondary: "bg-foreground/60",
  outline: "bg-foreground/60",
  destructive: "bg-white",
  accent: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] gap-1 rounded-md font-medium",
  md: "px-2.5 py-1 text-xs gap-1.5 rounded-md font-medium",
  lg: "px-3 py-1.5 text-sm gap-2 rounded-lg font-medium",
};

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  onRemove,
  removeAriaLabel = "Remove tag",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border select-none transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={removeAriaLabel}
          className="ml-0.5 -mr-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/15 focus:outline-none"
        >
          <svg
            className="h-2.5 w-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

