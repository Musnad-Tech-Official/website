import { useTranslations } from "next-intl";
import { LuTarget, LuEye } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import type { MissionVisionProps } from "./about-types";
import { cn } from "@/lib/utils";

export function MissionVision({ className = "" }: MissionVisionProps) {
  const t = useTranslations("About.missionVision");

  return (
    <section
      aria-labelledby="mission-vision-heading"
      className={cn("w-full", className)}
    >
      <h2 id="mission-vision-heading" className="sr-only">
        {t("missionTitle")} &amp; {t("visionTitle")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Mission Card */}
        <Card className="p-8 sm:p-10 flex flex-col justify-start relative overflow-hidden rounded-2xl border-border/80 bg-card shadow-xs">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-muted/60 text-foreground mb-6 select-none"
            aria-hidden="true"
          >
            <LuTarget className="h-5 w-5 text-primary" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t("missionTitle")}
          </h3>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
            {t("missionDescription")}
          </p>
        </Card>

        {/* Vision Card with subtle brand accent treatment */}
        <Card className="p-8 sm:p-10 flex flex-col justify-start relative overflow-hidden rounded-2xl border-border/80 bg-card shadow-xs">
          {/* Subtle brand ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 end-0 h-48 w-48 rounded-full bg-primary/5 blur-2xl dark:bg-primary/10"
          />

          <div
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-accent text-accent-foreground mb-6 select-none"
            aria-hidden="true"
          >
            <LuEye className="h-5 w-5 text-primary" />
          </div>

          <h3 className="relative z-10 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t("visionTitle")}
          </h3>

          <p className="relative z-10 mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
            {t("visionDescription")}
          </p>
        </Card>
      </div>
    </section>
  );
}
