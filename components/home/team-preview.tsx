import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight } from "react-icons/lu";
import { TeamMemberCard } from "@/components/team";
import { getTeamMembers } from "@/data/team";
import { cn } from "@/lib/utils";

export interface TeamPreviewProps {
  className?: string;
}

export function TeamPreview({ className = "" }: TeamPreviewProps) {
  const t = useTranslations("Home.team");
  const locale = useLocale();
  const members = getTeamMembers(locale);

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

        {/* Team Members Grid reusing TeamMemberCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
