import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuArrowRight } from "react-icons/lu";
import { LATEST_ARTICLES } from "./home-data";
import { FeaturedArticleCard } from "./featured-article-card";
import { cn } from "@/lib/utils";

export interface LatestInsightsProps {
  className?: string;
}

export function LatestInsights({ className = "" }: LatestInsightsProps) {
  const t = useTranslations("Home.latestInsights");

  // Editorial layout: show exactly 2 prominent featured articles on large screens
  const featuredArticles = LATEST_ARTICLES.slice(0, 2);

  return (
    <section
      id="insights"
      aria-labelledby="insights-heading"
      className={cn("w-full py-16 sm:py-20 lg:py-24 border-t border-border/40", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14">
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

        {/* Exactly 2 Large Editorial Featured Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {featuredArticles.map((article) => (
            <FeaturedArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

