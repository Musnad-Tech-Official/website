import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 sm:p-16 text-center my-6",
        className
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4"
        >
          {icon}
        </div>
      )}

      {typeof title === "string" ? (
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      ) : (
        title
      )}

      {description && (
        typeof description === "string" ? (
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
            {description}
          </p>
        ) : (
          description
        )
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

