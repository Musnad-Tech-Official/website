import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { TeamMemberCardProps } from "./team-types";
import { cn } from "@/lib/utils";

export default function TeamMemberCard({ member, className = "" }: TeamMemberCardProps) {
  return (
    <Card
      variant="interactive"
      aria-labelledby={`team-member-${member.id}`}
      className={cn(
        "group relative flex flex-col p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-border/80 shadow-2xs transition-all duration-200",
        "hover:border-border hover:shadow-md hover:-translate-y-1",
        className
      )}
    >
      {/* Portrait Photo Container */}
      <div
        className={cn(
          "relative w-full aspect-4/5 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center select-none",
          "bg-[#eaeff3] dark:bg-muted/40 border border-border/40"
        )}
      >
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 320px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className="text-3xl sm:text-4xl font-serif tracking-widest font-semibold text-foreground/80">
              {member.initials}
            </span>
          </div>
        )}
      </div>

      {/* Member Profile Details */}
      <div className="pt-3.5 sm:pt-4 pb-1 text-start">
        <h3
          id={`team-member-${member.id}`}
          className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate"
        >
          {member.name}
        </h3>
        <p className="text-sm font-medium text-muted-foreground mt-0.5 truncate">
          {member.role}
        </p>
      </div>
    </Card>
  );
}
