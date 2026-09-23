import React from "react";
import { TeamMemberCard } from "./team-member-card";
import type { TeamGridProps } from "./team-types";
import { cn } from "@/lib/utils";

/**
 * TeamGrid renders the responsive 3-column layout of team members:
 * - 1 column on mobile (< 768px)
 * - 2 columns on tablet (768px - 1023px)
 * - 3 columns on desktop (>= 1024px)
 */
export function TeamGrid({ members, className = "" }: TeamGridProps) {
  return (
    <section
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-16 sm:pb-20 lg:pb-24",
        className
      )}
    >
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </section>
  );
}
