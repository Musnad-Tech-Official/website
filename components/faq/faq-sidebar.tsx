import { Link } from "@/i18n/routing";
import { LuCircleHelp, LuArrowUpRight, LuCrosshair } from "react-icons/lu";
import type { FaqSidebarProps } from "./faq-types";
import { cn } from "@/lib/utils";

export function FaqSidebar({
  sidebarTopics,
  browseTitle,
  quickLinksTitle,
  quickLinks,
  stillHaveQuestions,
  className = "",
}: FaqSidebarProps) {
  return (
    <aside
      aria-label="FAQ navigation and quick links"
      className={cn("space-y-6", className)}
    >
      {/* Card A: Browse by topic */}
      <div className="border border-border/80 rounded-2xl bg-card p-6 shadow-xs transition-colors">
        <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4 select-none">
          {browseTitle}
        </h3>
        <ul className="space-y-2.5">
          {sidebarTopics.map((topic) => (
            <li key={topic.id}>
              <a
                href={topic.href}
                className="group flex items-center justify-between py-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 group-hover:bg-primary transition-colors"
                  />
                  <span className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                    {topic.title}
                  </span>
                </span>
                <span className="font-mono text-xs text-muted-foreground/70 group-hover:text-foreground transition-colors">
                  {topic.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Card B: Still have questions? */}
      <div className="border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xs bg-gradient-to-b from-card via-card to-muted/20 relative overflow-hidden transition-colors">
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center text-foreground mb-4 border border-border/60"
        >
          <LuCircleHelp className="w-5 h-5 text-muted-foreground" />
        </div>

        <h3 className="text-xl font-serif font-bold text-foreground mb-2 rtl:font-sans">
          {stillHaveQuestions.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {stillHaveQuestions.description}
        </p>

        <Link
          href={stillHaveQuestions.ctaHref}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{stillHaveQuestions.ctaLabel}</span>
          <LuArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
        </Link>
      </div>

      {/* Card C: Quick links */}
      <div className="border border-border/80 rounded-2xl bg-card p-6 shadow-xs transition-colors">
        <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4 select-none">
          {quickLinksTitle}
        </h3>
        <ul className="space-y-2.5">
          {quickLinks.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                className="group flex items-center gap-2.5 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                <span
                  aria-hidden="true"
                  className="w-5 h-5 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                >
                  <LuCrosshair className="w-3 h-3" />
                </span>
                <span className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                  {link.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
