import type { TeamMember, TeamStat } from "@/data/team";

export type { TeamMember, TeamStat };

export interface TeamHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  homeLabel: string;
  teamLabel: string;
  breadcrumbLabel?: string;
  className?: string;
}

export interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

export interface TeamGridProps {
  members: TeamMember[];
  className?: string;
}

export interface TeamCultureProps {
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
  stats: TeamStat[];
  className?: string;
}

export interface TeamCtaProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  discussProjectLabel?: string;
  exploreProjectsLabel?: string;
  careersLabel?: string;
  startProjectLabel?: string;
  contactHref?: string;
  projectsHref?: string;
  careersHref?: string;
  className?: string;
}

