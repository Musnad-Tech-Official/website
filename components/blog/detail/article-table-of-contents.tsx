"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LuList } from "react-icons/lu";
import type { ArticleTableOfContentsProps } from "./article-detail-types";
import { cn } from "@/lib/utils";

export function ArticleTableOfContents({
  items,
  title,
  className = "",
}: ArticleTableOfContentsProps) {
  const t = useTranslations("ArticleDetail.sidebar");
  const [activeId, setActiveId] = useState<string>(items?.[0]?.id || "");

  useEffect(() => {
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-90px 0% -60% 0%",
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  const headingText = title || t("onThisPage");

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -96; // Offset for sticky navbar + breathing room
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label={headingText}
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-4 shadow-2xs space-y-2.5",
        className
      )}
    >
      <div className="flex items-center gap-2 pb-2.5 border-b border-border/40 text-xs font-semibold text-foreground/80 select-none">
        <LuList className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        <span>{headingText}</span>
      </div>

      <ul className="space-y-1 text-xs">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleItemClick(e, item.id)}
                className={cn(
                  "relative flex items-center py-1.5 px-3 rounded-lg leading-relaxed transition-all duration-150 select-none",
                  isActive
                    ? "bg-primary/8 dark:bg-primary/12 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {/* Clean, straight vertical indicator line on active */}
                {isActive && (
                  <span
                    className="absolute start-0 top-1.5 bottom-1.5 w-1 rounded-e-full bg-primary"
                    aria-hidden="true"
                  />
                )}
                <span className="truncate">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
