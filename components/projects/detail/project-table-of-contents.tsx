"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LuListTree, LuChevronDown } from "react-icons/lu";
import type { ProjectTableOfContentsProps } from "./project-detail-types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProjectTableOfContents({
  items,
  title,
  onThisPageText,
  sectionsCountLabel,
  toggleOpenLabel,
  toggleCloseLabel,
  className = "",
  isCollapsible = true,
  defaultCollapsed = false,
}: ProjectTableOfContentsProps) {
  const t = useTranslations("ProjectDetail.toc");
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);
  const [activeId, setActiveId] = useState<string>(items?.[0]?.id || "");

  // IntersectionObserver to dynamically highlight the active section while scrolling
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

  const headingText = title || t("title");
  const subtitleText = onThisPageText || t("onThisPage");
  const countText = sectionsCountLabel || t("sectionsCount", { count: items.length });

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -96; // Offset for sticky navbar + breathing room
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label={headingText}
      className={cn(
        "rounded-2xl border border-border/80 bg-card/75 dark:bg-zinc-950/75 backdrop-blur-md p-5 sm:p-6 shadow-xs transition-all duration-300 mb-10 select-none",
        "hover:border-border hover:shadow-md",
        className
      )}
    >
      {/* Box Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <LuListTree className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                {headingText}
              </h2>
              <Badge variant="outline" size="sm" className="text-[11px] font-mono px-2 py-0">
                {countText}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
              {subtitleText}
            </p>
          </div>
        </div>

        {/* Collapsible Trigger */}
        {isCollapsible && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? (toggleCloseLabel || t("toggleClose")) : (toggleOpenLabel || t("toggleOpen"))}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <LuChevronDown
              className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
            />
          </button>
        )}
      </div>

      {/* Nav List / Tree Content */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in-50 duration-200">
          <div className="relative border-s border-border/60 ms-2 ps-3.5 space-y-1.5">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const isSub = item.level === 3;

              return (
                <div key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleItemClick(e, item.id)}
                    className={cn(
                      "group flex items-center gap-2 -ms-[15px] ps-3.5 pe-2.5 py-1.5 rounded-lg text-xs sm:text-[13px] leading-relaxed transition-all duration-150 truncate",
                      isActive
                        ? "border-s-2 border-primary text-primary font-semibold bg-primary/10"
                        : "border-s-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40",
                      isSub && "ps-6 sm:ps-7 text-[12px]"
                    )}
                  >
                    {isSub ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 group-hover:bg-foreground/60 shrink-0" />
                    ) : (
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0 transition-colors",
                          isActive ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                        )}
                      />
                    )}
                    <span className="truncate">{item.label}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

export default ProjectTableOfContents;
