"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsVariant = "pill" | "underline";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within a <Tabs>");
  }
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = "pill",
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue || ""
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (nextVal: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextVal);
      }
      onValueChange?.(nextVal);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider
      value={{ value, onValueChange: handleValueChange, variant }}
    >
      <div className={cn("w-full space-y-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useTabs();

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center justify-start gap-1 select-none",
        variant === "pill" &&
          "p-1 rounded-xl bg-muted text-muted-foreground border border-border/40",
        variant === "underline" &&
          "border-b border-border w-full gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  className,
  disabled,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange, variant } = useTabs();
  const isSelected = activeValue === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "pill" && [
          "px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground",
          isSelected &&
            "bg-card text-foreground shadow-xs font-semibold",
        ],
        variant === "underline" && [
          "py-2.5 px-1 border-b-2 -mb-px text-muted-foreground hover:text-foreground",
          isSelected
            ? "border-primary text-primary font-semibold"
            : "border-transparent",
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: activeValue } = useTabs();
  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring animate-in fade-in-50 duration-150",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

