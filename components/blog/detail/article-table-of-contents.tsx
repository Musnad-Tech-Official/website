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
  const [activeId, setActiveId] = useState<string>("");

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
        rootMargin: "-80px 0% -60% 0%",
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

  return (
    <nav
      aria-label={headingText}
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-3",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase select-none pb-2 border-b border-border/40">
        <LuList className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{headingText}</span>
      </div>

      <ul className="space-y-1.5 text-sm">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block py-1 px-2.5 rounded-lg transition-colors leading-snug truncate",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold border-s-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
