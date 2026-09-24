import { LuCircleHelp, LuArrowUpRight } from "react-icons/lu";
import type { LegalContactCardProps } from "./legal-types";
import { cn } from "@/lib/utils";

export function LegalContactCard({
  config,
  className = "",
}: LegalContactCardProps) {
  return (
    <div
      className={cn(
        "border border-border/80 rounded-2xl bg-card/70 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-xs transition-colors",
        className
      )}
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-muted text-muted-foreground border border-border/60 shrink-0"
        >
          <LuCircleHelp className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-foreground rtl:font-sans">
            {config.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {config.supportingLinePrefix}{" "}
            <a
              href={`mailto:${config.email}`}
              className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
            >
              {config.email}
            </a>
          </p>
        </div>
      </div>

      <a
        href={`mailto:${config.email}`}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-xs shrink-0 self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>{config.buttonText}</span>
        <LuArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
      </a>
    </div>
  );
}
