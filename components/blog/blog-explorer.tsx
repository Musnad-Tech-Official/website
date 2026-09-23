"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { BlogFilter } from "./blog-filter";
import { FeaturedArticleCard } from "./featured-article-card";
import { BlogGrid } from "./blog-grid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LuSearch, LuRotateCcw } from "react-icons/lu";
import type { BlogExplorerProps, BlogFilterState } from "./blog-types";

const INITIAL_FILTER_STATE: BlogFilterState = {
  search: "",
};

export function BlogExplorer({
  articles,
  className = "",
}: BlogExplorerProps) {
  const t = useTranslations("Blog");
  const [filterState, setFilterState] =
    useState<BlogFilterState>(INITIAL_FILTER_STATE);

  const handleSearchChange = (search: string) => {
    setFilterState({ search });
  };

  const handleReset = () => {
    setFilterState(INITIAL_FILTER_STATE);
  };

  const hasActiveSearch = Boolean(filterState.search.trim());

  // Filter articles based on search query matching title or excerpt
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    const query = filterState.search.trim().toLowerCase();
    if (query) {
      result = result.filter((a) => {
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesExcerpt = a.excerpt.toLowerCase().includes(query);
        return matchesTitle || matchesExcerpt;
      });
    }

    return result;
  }, [articles, filterState]);

  // When no search is active, separate presentation featured article from newest grid
  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.layoutVariant === "featured") || articles[0];
  }, [articles]);

  const regularArticles = useMemo(() => {
    if (!featuredArticle) return articles;
    return articles.filter((a) => a.id !== featuredArticle.id);
  }, [articles, featuredArticle]);

  return (
    <div className={className}>
      {/* 1. Filter Controls */}
      <BlogFilter
        filterState={filterState}
        onFilterChange={handleSearchChange}
        onReset={handleReset}
      />

      {/* 2. Results or Empty State */}
      {filteredArticles.length === 0 ? (
        <EmptyState
          icon={<LuSearch className="h-6 w-6" aria-hidden="true" />}
          title={t("filters.noResultsTitle")}
          description={t("filters.noResultsDescription")}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 rounded-lg cursor-pointer"
            >
              <LuRotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("filters.clearFilters")}</span>
            </Button>
          }
        />
      ) : hasActiveSearch ? (
        /* When search query is active, display matching articles in grid */
        <BlogGrid
          articles={filteredArticles}
          heading={`${t("sections.articles")} (${filteredArticles.length})`}
        />
      ) : (
        /* Default view: Featured article layout on top, Articles below */
        <div className="space-y-12 sm:space-y-16">
          {featuredArticle && (
            <section aria-labelledby="featured-heading">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <span
                  id="featured-heading"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground select-none"
                >
                  <span
                    className="h-2 w-2 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{t("sections.featured")}</span>
                </span>
              </div>
              <FeaturedArticleCard article={featuredArticle} />
            </section>
          )}

          {regularArticles.length > 0 && (
            <BlogGrid
              articles={regularArticles}
              heading={t("sections.articles")}
            />
          )}
        </div>
      )}
    </div>
  );
}
