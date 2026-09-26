import { LuCrosshair } from "react-icons/lu";
import { FaqAccordion } from "./faq-accordion";
import type { FaqTopicGroupProps } from "./faq-types";
import { cn } from "@/lib/utils";

export function FaqTopicGroup({
  group,
  className = "",
}: FaqTopicGroupProps) {
  return (
    <section
      id={group.id}
      aria-labelledby={`topic-${group.id}`}
      className={cn("scroll-mt-28 space-y-4", className)}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-muted text-muted-foreground"
        >
          <LuCrosshair className="w-3.5 h-3.5" />
        </span>
        <h2
          id={`topic-${group.id}`}
          className="text-xl sm:text-2xl font-serif font-bold text-foreground rtl:font-sans flex items-baseline gap-2"
        >
          <span>{group.title}</span>
          <span className="text-muted-foreground font-sans font-normal text-sm sm:text-base">
            ({group.count})
          </span>
        </h2>
      </div>

      <FaqAccordion items={group.items} groupId={group.id} />
    </section>
  );
}
