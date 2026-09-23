import { useTranslations } from "next-intl";
import type { StorySectionProps } from "./about-types";
import { cn } from "@/lib/utils";

/**
 * StorySection ("How we got here")
 *
 * NOTE: The narrative paragraphs rendered here represent reference UI fixtures
 * derived from the design mockup (02-about.png). As instructed by project governance,
 * unverified origin claims are maintained as frontend layout copy and are not certified
 * as verified corporate records.
 */
export function StorySection({ className = "" }: StorySectionProps) {
  const t = useTranslations("About.story");

  return (
    <section
      aria-labelledby="story-heading"
      className={cn("w-full text-start", className)}
    >
      <h2
        id="story-heading"
        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-6 sm:mb-8"
      >
        {t("title")}
      </h2>

      <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
      </div>
    </section>
  );
}
