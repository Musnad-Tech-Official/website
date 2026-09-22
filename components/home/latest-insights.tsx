import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight, LuClock } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { LATEST_ARTICLES } from "./home-data";
import { cn } from "@/lib/utils";

export interface LatestInsightsProps {
  className?: string;
}

export function LatestInsights({ className = "" }: LatestInsightsProps) {
  const t = useTranslations("Home.latestInsights");

  return (
    <section
      id="insights"
      aria-labelledby="insights-heading"
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
              id="insights-heading"
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
              href="/blog"
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

        {/* 3 Insight Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LATEST_ARTICLES.map((article) => {
            const title = t(`articles.${article.articleKey}.title`);
            const excerpt = t(`articles.${article.articleKey}.excerpt`);
            const category = t(`articles.${article.articleKey}.category`);
            const author = t(`articles.${article.articleKey}.author`);
            const minRead = t("minRead", { count: article.readTime });

            return (
              <Card
                key={article.id}
                variant="interactive"
                className="group relative flex flex-col overflow-hidden p-0"
              >
                {/* Visual Thumbnail Area */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-muted/40 border-b border-border/40 p-4 flex flex-col justify-between">
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-70 group-hover:opacity-85 transition-opacity",
                      article.previewGradient
                    )}
                  />

                  {/* Badges Row */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-black/70 text-white/90 backdrop-blur-md border border-white/10">
                      {category}
                    </span>

                    {article.isTrending && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-black/80 text-white backdrop-blur-md border border-white/15">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                        <span>{t("trending")}</span>
                      </span>
                    )}
                  </div>

                  {/* Stylized code/text lines graphic */}
                  <div className="relative z-10 mt-auto flex flex-col gap-1.5 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                    <div className="h-1.5 w-3/4 rounded-full bg-white/40" />
                    <div className="h-1.5 w-1/2 rounded-full bg-white/30" />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col flex-1 justify-between text-start">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-2.5">
                      <span>{author}</span>
                      <span>·</span>
                      <span>{minRead}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug line-clamp-2">
                      {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {excerpt}
                    </p>
                  </div>

                  {/* Bottom Tags & Time */}
                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex flex-wrap gap-1.5" aria-label="Tags">
                      {article.tags.map((tag, idx) => (
                        <span key={idx} className="font-mono text-[11px] text-muted-foreground/80">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {article.timeAgo && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 shrink-0">
                        <LuClock className="h-3 w-3" aria-hidden="true" />
                        <span>{t("timeAgo")}</span>
                      </div>
                    )}
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
