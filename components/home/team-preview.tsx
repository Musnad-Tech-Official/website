import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEAM_MEMBERS } from "./home-data";
import { cn } from "@/lib/utils";

export interface TeamPreviewProps {
  className?: string;
}

export function TeamPreview({ className = "" }: TeamPreviewProps) {
  const t = useTranslations("Home.team");

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className={cn("w-full py-16 sm:py-20 lg:py-24 border-t border-border/40", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="max-w-2xl text-start">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("eyebrow")}
            </span>
            <h2
              id="team-heading"
              className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            >
              {t("heading")}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/team"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md py-1"
            >
              <span>{t("viewAll")}</span>
              <LuArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* 4 Team Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => {
            const name = t(`members.${member.memberKey}.name`);
            const role = t(`members.${member.memberKey}.role`);
            const bio = t(`members.${member.memberKey}.bio`);

            return (
              <Card
                key={member.id}
                variant="interactive"
                className="group relative flex flex-col overflow-hidden p-0"
              >
                {/* Monogram Banner */}
                <div
                  className={cn(
                    "relative h-44 sm:h-48 w-full flex items-center justify-center select-none bg-gradient-to-br border-b border-border/40",
                    member.bannerGradient
                  )}
                >
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-widest text-white/95 drop-shadow-sm font-sans">
                    {member.initials}
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between text-start">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">
                      {role}
                    </p>
                    <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {bio}
                    </p>
                  </div>

                  {/* Skills / Tech Chips */}
                  <div className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-border/40" aria-label="Key skills">
                    {member.skills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        size="sm"
                        className="font-normal text-[11px] text-muted-foreground bg-muted/60"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
