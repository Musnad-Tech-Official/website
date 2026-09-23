import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { TeamMemberCardProps } from "./team-types";
import { cn } from "@/lib/utils";

/**
 * TeamMemberCard renders an individual team member card:
 * - Visual monogram or portrait photo banner using Design System tokens
 * - Team member name, role title, and bio
 * - Design System Badge components for technical competencies
 */
export function TeamMemberCard({ member, className = "" }: TeamMemberCardProps) {
  return (
    <article
      aria-labelledby={`team-member-${member.id}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card text-card-foreground p-4 sm:p-5 shadow-xs transition-all duration-200",
        "hover:border-border hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div>
        {/* Visual Monogram Banner / Photo */}
        <div
          className={cn(
            "relative w-full h-56 sm:h-64 rounded-xl overflow-hidden flex items-center justify-center select-none transition-transform duration-300",
            "bg-muted/70 text-foreground border border-border/50 dark:bg-muted/40"
          )}
        >
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-3xl sm:text-4xl font-serif tracking-widest font-semibold text-foreground/90">
              {member.initials}
            </span>
          )}
        </div>

        {/* Member Profile Details */}
        <div className="pt-4 text-start">
          <h2
            id={`team-member-${member.id}`}
            className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
          >
            {member.name}
          </h2>
          <p className="text-sm font-medium text-foreground/80 mt-0.5">
            {member.role}
          </p>
          <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
            {member.bio}
          </p>
        </div>
      </div>

      {/* Competencies & Skill Badges */}
      {member.skills && member.skills.length > 0 && (
        <div className="mt-5 pt-3.5 border-t border-border/60 flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              size="sm"
              className="rounded-md font-normal text-muted-foreground hover:text-foreground border border-border/40"
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
}
