import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { TESTIMONIALS } from "./home-data";
import { cn } from "@/lib/utils";

export interface TestimonialsSectionProps {
  className?: string;
}

export function TestimonialsSection({ className = "" }: TestimonialsSectionProps) {
  const t = useTranslations("Home.testimonials");

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className={cn("w-full pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 border-t border-border/40", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl text-start">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("eyebrow")}
          </span>
          <h2
            id="testimonials-heading"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
          >
            {t("heading")}
          </h2>
        </div>

        {/* 3 Testimonials Cards Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => {
            const quote = t(`items.${item.itemKey}.quote`);
            const author = t(`items.${item.itemKey}.author`);
            const role = t(`items.${item.itemKey}.role`);

            return (
              <Card
                key={item.id}
                className="relative flex flex-col justify-between p-6 sm:p-7"
              >
                <div>
                  {/* Quote marker / emblem */}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mb-5 select-none">
                    <span aria-hidden="true">“</span>
                  </div>

                  {/* Quote content */}
                  <blockquote className="m-0 text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-3">
                  <Avatar
                    fallback={item.initial}
                    size="sm"
                    className="h-9 w-9 border border-border/60 bg-muted/60 text-foreground font-bold"
                  />
                  <div className="flex flex-col text-start">
                    <span className="text-sm font-semibold text-foreground tracking-tight">
                      {author}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {role}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
