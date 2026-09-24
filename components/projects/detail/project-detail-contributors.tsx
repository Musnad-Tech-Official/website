import React from "react";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { LuArrowUpRight } from "react-icons/lu";
import type { ProjectDetailContributorsProps } from "./project-detail-types";
import { cn } from "@/lib/utils";

export function ProjectDetailContributors({
  title,
  members,
  className = "",
}: ProjectDetailContributorsProps) {
  return (
    <section
      aria-labelledby="detail-contributors-heading"
      className={cn("py-12 sm:py-16 border-b border-border/60", className)}
    >
      <h2
        id="detail-contributors-heading"
        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8"
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {members.map((member) => {
          const content = (
            <Card
              variant="interactive"
              className="p-4 sm:p-5 flex items-center justify-between gap-4 border border-border/70 bg-card hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Avatar
                  size="md"
                  fallback={member.initials}
                  alt={member.name}
                  className="border border-border/80 shadow-2xs"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                    {member.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="h-8 w-8 rounded-full border border-border/60 bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:text-primary shrink-0"
              >
                <LuArrowUpRight className="h-4 w-4 rtl:-rotate-90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Card>
          );

          if (member.href) {
            return (
              <Link
                key={member.id}
                href={member.href}
                className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
              >
                {content}
              </Link>
            );
          }

          return <div key={member.id}>{content}</div>;
        })}
      </div>
    </section>
  );
}
