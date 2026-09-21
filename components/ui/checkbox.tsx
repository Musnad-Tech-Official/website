import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
  error?: string;
  containerClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      containerClassName,
      label,
      description,
      indeterminate = false,
      error,
      id: customId,
      disabled,
      checked,
      defaultChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = customId || generatedId;
    const internalRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <div className={cn("flex flex-col space-y-1", containerClassName)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            "group inline-flex items-start gap-2.5 select-none cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="relative flex items-center justify-center pt-0.5">
            <input
              ref={setRefs}
              id={checkboxId}
              type="checkbox"
              disabled={disabled}
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={onChange}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                "h-4 w-4 rounded border transition-all duration-150 flex items-center justify-center",
                "border-border bg-background group-hover:border-primary/60",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground",
                indeterminate && "bg-primary border-primary text-primary-foreground",
                error && "border-destructive",
                className
              )}
            >
              {indeterminate ? (
                <svg
                  className="h-3 w-3 stroke-current stroke-2"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              ) : (
                <svg
                  className="h-3 w-3 stroke-current stroke-2 fill-none opacity-0 transition-opacity peer-checked:opacity-100"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>

          {(label || description) && (
            <div className="flex flex-col text-sm">
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
        </label>

        {error && (
          <p className="text-xs font-medium text-destructive pl-6">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

