"use client";

import * as React from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

export interface NavbarUtilitiesProps {
  className?: string;
  themeVariant?: "icon" | "segmented" | "dropdown";
  languageVariant?: "toggle" | "segmented" | "dropdown";
  size?: "sm" | "md" | "lg";
}

export function NavbarUtilities({
  className,
  themeVariant = "icon",
  languageVariant = "toggle",
  size = "sm",
}: NavbarUtilitiesProps) {
  return (
    <div className={cn("flex items-center gap-1.5 sm:gap-2 shrink-0", className)}>
      <LanguageSwitcher variant={languageVariant} size={size} />
      <ThemeSwitcher variant={themeVariant} size={size} />
    </div>
  );
}

