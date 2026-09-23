import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight, LuClock } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { InsightArticleData } from "./home-types";
import { cn } from "@/lib/utils";

export interface FeaturedArticleCardProps {
  article: InsightArticleData;
  className?: string;
}

export function FeaturedArticleCard({
  article,
  className = "",
}: FeaturedArticleCardProps) {
  const t = useTranslations("Home.latestInsights");
  const title = t(`articles.${article.articleKey}.title`);
  const excerpt = t(`articles.${article.articleKey}.excerpt`);
  const category = t(`articles.${article.articleKey}.category`);
  const author = t(`articles.${article.articleKey}.author`);
  const minRead = t("minRead", { count: article.readTime });

  return (
    <Card
      variant="default"
      className={cn(
        "group relative flex flex-col overflow-hidden p-0 rounded-2xl",
        "border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-xs",
        "shadow-xs hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/5 hover:-translate-y-1.5",
        "transition-all duration-300",
        className
      )}
    >
      <Link
        href={article.href || "/blog"}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
        aria-label={title}
      >
        {/* Prominent Visual Editorial Thumbnail Area */}
        <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden bg-muted/30 border-b border-border/50 p-6 flex flex-col justify-between">
          {/* Dynamic Editorial Background with smooth hover zoom */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-105",
              article.previewGradient
            )}
          />

          {/* Geometric Tech Grid Texture Overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50 mix-blend-overlay pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Badges Row */}
          <div className="relative z-10 flex items-center justify-between w-full gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-background/85 dark:bg-black/60 text-foreground backdrop-blur-md border border-border/50 shadow-xs">
              {category}
            </span>

            {article.isTrending && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/80 text-white backdrop-blur-md border border-white/15 shadow-xs">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
                  aria-hidden="true"
                />
                <span>{t("trending")}</span>
              </span>
            )}
          </div>

          {/* Stylized Tech Architecture Preview Graphics */}
          <div
            className="relative z-10 mt-auto flex flex-col gap-2 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-300"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/70" />
              <div className="h-1.5 w-36 rounded-full bg-white/40" />
            </div>
            <div className="h-1.5 w-56 rounded-full bg-white/25" />
            <div className="h-1.5 w-24 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Card Body with Rich Editorial Typography */}
        <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between text-start">
          <div>
            {/* Author Metadata with fully rounded Avatar */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                fallback={article.authorInitials || "SA"}
                size="sm"
                shape="circle"
                className="rounded-full border border-border/80 bg-muted/80 text-foreground font-bold shrink-0"
              />
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                <span className="font-semibold text-foreground">{author}</span>
                <span aria-hidden="true">·</span>
                <span>{article.date || "2024"}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <LuClock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{minRead}</span>
                </span>
              </div>
            </div>

            {/* Article Title */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug line-clamp-2">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="mt-3.5 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
              {excerpt}
            </p>
          </div>

          {/* Bottom Tags & Read Article CTA with animated arrow */}
          <div className="mt-8 pt-5 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" aria-label="Tags">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono bg-muted/60 text-muted-foreground border border-border/40"
                >
                  {tag}
                </span>
              ))}
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-primary/80 transition-colors shrink-0">
              <span>{t("readArticle")}</span>
              <LuArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
