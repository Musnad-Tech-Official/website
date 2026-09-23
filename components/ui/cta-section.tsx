import React from "react";
import { Link } from "@/i18n/routing";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export type CtaVariant = "default" | "projects" | "split";

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

  variant?: CtaVariant;
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

  // Shorthand convenience props for single-action/banner style:
  buttonLabel?: string;
  contactHref?: string;
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
  variant = "default",
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
  buttonLabel,
  contactHref = "/contact",
}: CtaSectionProps) {
  // Normalize actions for the split/projects variant:
  // If buttonLabel was provided directly without primaryAction, wrap it in a CtaAction
  const effectivePrimaryAction: CtaAction | undefined =
    primaryAction ||
    (buttonLabel
      ? {
          label: buttonLabel,
          href: contactHref,
          variant: "outline",
          showArrow: true,
          className:
            "hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 font-medium",
        }
      : undefined);

  // Render Horizontal Split Banner ("projects" | "split")
  if (variant === "projects" || variant === "split") {
    return (
      <section
        aria-label={typeof title === "string" ? title : "Call to action"}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 my-12 sm:my-16 lg:my-20 shadow-xs",
          className
        )}
      >
        {/* Ambient background glow offset to the side */}
        {showGlow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-1/4 h-64 w-80 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10"
          />
        )}

        <div
          className={cn(
            "relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8",
            containerClassName
          )}
        >
          {/* Left/Start Content */}
          <div className="max-w-2xl text-start">
            {eyebrow && (
              typeof eyebrow === "string" ? (
                <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2 select-none">
                  {eyebrow}
                </span>
              ) : (
                <div className="mb-2">{eyebrow}</div>
              )
            )}

            {typeof title === "string" ? (
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground mb-2 sm:mb-3">
                {title}
              </h2>
            ) : (
              title
            )}

            {subtitle && (
              typeof subtitle === "string" ? (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {subtitle}
                </p>
              ) : (
                subtitle
              )
            )}
          </div>

          {/* Right/End Action */}
          <div className="shrink-0 flex items-center">
            {actions ? (
              actions
            ) : effectivePrimaryAction ? (
              effectivePrimaryAction.href ? (
                effectivePrimaryAction.href.startsWith("http") ||
                effectivePrimaryAction.href.startsWith("mailto:") ? (
                  <a
                    href={effectivePrimaryAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant={effectivePrimaryAction.variant || "outline"}
                      size="lg"
                      onClick={effectivePrimaryAction.onClick}
                      className={cn(
                        "rounded-full px-6 sm:px-8 font-medium shadow-xs gap-2 group cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200",
                        effectivePrimaryAction.className
                      )}
                    >
                      <span>{effectivePrimaryAction.label}</span>
                      {effectivePrimaryAction.icon}
                      {effectivePrimaryAction.showArrow !== false && (
                        <FaArrowRight className="h-3 w-3 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      )}
                    </Button>
                  </a>
                ) : (
                  <Link href={effectivePrimaryAction.href}>
                    <Button
                      variant={effectivePrimaryAction.variant || "outline"}
                      size="lg"
                      onClick={effectivePrimaryAction.onClick}
                      className={cn(
                        "rounded-full px-6 sm:px-8 font-medium shadow-xs gap-2 group cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200",
                        effectivePrimaryAction.className
                      )}
                    >
                      <span>{effectivePrimaryAction.label}</span>
                      {effectivePrimaryAction.icon}
                      {effectivePrimaryAction.showArrow !== false && (
                        <FaArrowRight className="h-3 w-3 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      )}
                    </Button>
                  </Link>
                )
              ) : (
                <Button
                  variant={effectivePrimaryAction.variant || "outline"}
                  size="lg"
                  onClick={effectivePrimaryAction.onClick}
                  className={cn(
                    "rounded-full px-6 sm:px-8 font-medium shadow-xs gap-2 group cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200",
                    effectivePrimaryAction.className
                  )}
                >
                  <span>{effectivePrimaryAction.label}</span>
                  {effectivePrimaryAction.icon}
                  {effectivePrimaryAction.showArrow !== false && (
                    <FaArrowRight className="h-3 w-3 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  )}
                </Button>
              )
            ) : null}
          </div>

          {children}
        </div>
      </section>
    );
  }

  // Render Centered Card ("default")
  const isCenter = align === "center";

  return (
    <section
      aria-label={typeof title === "string" ? title : "Call to action"}
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
          (effectivePrimaryAction || secondaryAction) && (
            <div
              className={cn(
                "flex flex-wrap items-center gap-3.5 sm:gap-4",
                isCenter ? "justify-center" : "justify-start"
              )}
            >
              {effectivePrimaryAction && renderActionButton(effectivePrimaryAction, true)}
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

// Re-export aliases for maximum ergonomics
export { CtaSection as CTA, CtaSection as Cta };
