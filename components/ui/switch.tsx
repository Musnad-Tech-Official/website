import * as React from "react";
import { cn } from "@/lib/utils";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  label?: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  name?: string;
  className?: string;
  containerClassName?: string;
}

const trackSizes: Record<SwitchSize, string> = {
  sm: "h-4 w-7",
  md: "h-5 w-9",
  lg: "h-6 w-11",
};

const thumbSizes: Record<SwitchSize, string> = {
  sm: "h-3 w-3 translate-x-0.5 peer-checked:translate-x-3.5",
  md: "h-4 w-4 translate-x-0.5 peer-checked:translate-x-4.5",
  lg: "h-5 w-5 translate-x-0.5 peer-checked:translate-x-5.5",
};

export function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
  id: customId,
  name,
  className,
  containerClassName,
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = customId || generatedId;

  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const nextVal = e.target.checked;
    if (!isControlled) {
      setUncontrolledChecked(nextVal);
    }
    onChange?.(nextVal);
  };

  return (
    <div
      className={cn(
        "inline-flex items-start gap-3 select-none cursor-pointer",
        disabled && "cursor-not-allowed opacity-50",
        containerClassName
      )}
    >
      <label htmlFor={switchId} className="relative inline-flex items-center cursor-pointer">
        <input
          id={switchId}
          name={name}
          type="checkbox"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          checked={isChecked}
          onChange={handleToggle}
          className="peer sr-only"
        />

        <div
          className={cn(
            "rounded-full transition-colors duration-200 ease-in-out border border-transparent",
            "bg-muted peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            "peer-checked:bg-primary",
            trackSizes[size],
            className
          )}
        >
          <span
            className={cn(
              "block rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out pointer-events-none mt-[1px]",
              thumbSizes[size]
            )}
          />
        </div>
      </label>

      {(label || description) && (
        <div
          onClick={() => {
            if (!disabled) {
              const next = !isChecked;
              if (!isControlled) setUncontrolledChecked(next);
              onChange?.(next);
            }
          }}
          className="flex flex-col text-sm cursor-pointer"
        >
          {label && (
            <span className="font-medium text-foreground leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

