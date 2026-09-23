import type React from "react";

export interface AboutValueItem {
  id: "proof" | "flexibility" | "security" | "bilingual";
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

export interface ApproachStepItem {
  id: "discovery" | "architecture" | "cadence" | "operate";
  stepNumber: string;
}

export interface MilestoneItem {
  id: string;
  year: string;
}

export interface AboutIntroProps {
  className?: string;
}

export interface MissionVisionProps {
  className?: string;
}

export interface ValuesSectionProps {
  className?: string;
}

export interface ApproachSectionProps {
  className?: string;
}

export interface StorySectionProps {
  className?: string;
}

export interface MilestonesSectionProps {
  className?: string;
}

export interface AboutCtaProps {
  className?: string;
}
