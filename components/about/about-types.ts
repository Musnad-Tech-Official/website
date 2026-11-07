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
  data?: {
    missionTitle?: string;
    missionDescription?: string;
    visionTitle?: string;
    visionDescription?: string;
  };
}

export interface ValuesSectionProps {
  className?: string;
  values?: {
    id: string;
    title: string;
    description: string;
    icon?: string;
  }[];
}

export interface ApproachSectionProps {
  className?: string;
  steps?: {
    id: string;
    stepNumber: string;
    title: string;
    description: string;
  }[];
}

export interface StorySectionProps {
  className?: string;
  data?: {
    title?: string;
    p1?: string;
    p2?: string;
  };
}

export interface MilestonesSectionProps {
  className?: string;
  milestones?: {
    id: string;
    year: string;
    title: string;
    description: string;
  }[];
}

export interface AboutCtaProps {
  className?: string;
}
