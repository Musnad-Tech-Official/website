"use client";

import { useEffect, useState } from "react";
import type { LegalTocProps } from "./legal-types";
import { cn } from "@/lib/utils";

export function LegalToc({
  sections,
  onThisPageLabel,
  className = "",
}: LegalTocProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      // Find the section closest to the top of the viewport
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(sections[i].id);
          return;
        }
      }

      if (sections.length > 0) {
        setActiveId(sections[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <nav
      aria-label={onThisPageLabel}
      className={cn("text-start", className)}
    >
      <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4 select-none">
        {onThisPageLabel}
      </h2>

      <ul className="space-y-3 text-sm">
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => scrollToSection(e, section.id)}
                className={cn(
                  "group flex items-baseline gap-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm py-0.5",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs select-none transition-colors",
                    isActive
                      ? "text-primary font-bold"
                      : "text-muted-foreground/60 group-hover:text-muted-foreground"
                  )}
                >
                  {section.number}
                </span>
                <span className="leading-snug transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                  {section.title}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
