/**
 * Frontend Mock Data & Fixtures for About Page.
 *
 * CONTENT CLASSIFICATION NOTE:
 * - Approved Brand Principles: Values (Proof over claims, Structured flexibility,
 *   Security by design, Bilingual first), core delivery approach, and references to
 *   shipped systems (Sahim Analytics, Naft Deploy, Rakeen Portal).
 * - Mock / Reference Frontend Copy: Specific founding details (2021, two-person studio,
 *   etc.) are treated as reference layout fixtures derived from `02-about.png` and are
 *   not classified as verified corporate records.
 */

import {
  LuTarget,
  LuSlidersHorizontal,
  LuShieldCheck,
  LuLanguages,
} from "react-icons/lu";
import type { AboutValueItem, ApproachStepItem, MilestoneItem } from "./about-types";

export const ABOUT_VALUES: AboutValueItem[] = [
  {
    id: "proof",
    icon: LuTarget,
  },
  {
    id: "flexibility",
    icon: LuSlidersHorizontal,
  },
  {
    id: "security",
    icon: LuShieldCheck,
  },
  {
    id: "bilingual",
    icon: LuLanguages,
  },
];

export const APPROACH_STEPS: ApproachStepItem[] = [
  {
    id: "discovery",
    stepNumber: "01",
  },
  {
    id: "architecture",
    stepNumber: "02",
  },
  {
    id: "cadence",
    stepNumber: "03",
  },
  {
    id: "operate",
    stepNumber: "04",
  },
];

export const MILESTONES: MilestoneItem[] = [
  {
    id: "2021",
    year: "2021",
  },
  {
    id: "2022",
    year: "2022",
  },
  {
    id: "2023",
    year: "2023",
  },
  {
    id: "2024",
    year: "2024",
  },
  {
    id: "2025",
    year: "2025",
  },
];
