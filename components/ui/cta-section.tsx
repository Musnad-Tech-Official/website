import React from "react";
import { Link } from "@/i18n/routing";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export interface CtaAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  showArrow?: boolean;
  className?: string;
}

export interface CtaSectionProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryAction?: CtaAction;
  secondaryAction?: CtaAction;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  showGlow?: boolean;
  align?: "center" | "start";
  className?: string;
  containerClassName?: string;
}

function renderActionButton(action: CtaAction, isPrimary = false) {
  const isExternal = action.href?.startsWith("http") || action.href?.startsWith("mailto:");
  const variant: ButtonVariant = action.variant || (isPrimary ? "primary" : "outline");

  const buttonElement = (
    <Button
      variant={variant}
      size="lg"
      onClick={action.onClick}
      className={cn(
        "rounded-full px-6 sm:px-8 font-semibold shadow-xs gap-2 group cursor-pointer",
        action.className
      )}
    >
      <span>{action.label}</span>
      {action.icon}
      {action.showArrow && (
        <FaArrowRight className="h-3 w-3 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      )}
    </Button>
  );

  if (!action.href) {
    return buttonElement;
  }

  if (isExternal) {
    return (
      <a
        key={action.label}
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {buttonElement}
      </a>
    );
  }

  return (
    <Link key={action.label} href={action.href} className="inline-block">
      {buttonElement}
    </Link>
  );
}


export function CtaSection({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  actions,
  children,
  showGlow = true,
  align = "center",
  className = "",
  containerClassName = "",
}: CtaSectionProps) {
  const isCenter = align === "center";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-12 lg:p-16 my-12 sm:my-16 lg:my-20 shadow-xs",
        isCenter ? "text-center" : "text-start",
        className
      )}
    >
      {/* Subtle ambient background glow */}
      {showGlow && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-24 h-72 w-96 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10",
            isCenter ? "left-1/2 -translate-x-1/2" : "left-10"
          )}
        />
      )}

      <div
        className={cn(
          "relative z-10 flex flex-col",
          isCenter ? "items-center" : "items-start",
          containerClassName
        )}
      >
        {/* Eyebrow status pill */}
        {eyebrow && (
          typeof eyebrow === "string" ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-medium text-foreground mb-6 shadow-xs select-none">
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
                aria-hidden="true"
              />
              <span>{eyebrow}</span>
            </div>
          ) : (
            <div className="mb-6">{eyebrow}</div>
          )
        )}

        {/* Headline */}
        {typeof title === "string" ? (
          <h2
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-4 sm:mb-5",
              isCenter && "max-w-2xl mx-auto"
            )}
          >
            {title}
          </h2>
        ) : (
          title
        )}

        {/* Subtitle */}
        {subtitle && (
          typeof subtitle === "string" ? (
            <p
              className={cn(
                "text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed",
                isCenter && "max-w-xl mx-auto"
              )}
            >
              {subtitle}
            </p>
          ) : (
            subtitle
          )
        )}

        {/* Action Buttons */}
        {actions ? (
          actions
        ) : (
          (primaryAction || secondaryAction) && (
            <div
              className={cn(
                "flex flex-wrap items-center gap-3.5 sm:gap-4",
                isCenter ? "justify-center" : "justify-start"
              )}
            >
              {primaryAction && renderActionButton(primaryAction, true)}
              {secondaryAction && renderActionButton(secondaryAction, false)}
            </div>
          )
        )}

        {/* Optional custom children */}
        {children}
      </div>
    </section>
  );
}

