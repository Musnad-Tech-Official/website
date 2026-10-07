import { useTranslations, useLocale } from "next-intl";
import { ServiceCard } from "./service-card";
import type { ServicesGridProps } from "./services-types";
import { getServiceIconComponent } from "@/lib/services/service-icons";
import { cn } from "@/lib/utils";

export function ServicesGrid({ className = "", services }: ServicesGridProps) {
  const t = useTranslations("Services");
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="services-grid-heading"
      className={cn("w-full pb-16 sm:pb-20 lg:pb-24", className)}
    >
      <h2 id="services-grid-heading" className="sr-only">
        {t("intro.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const title = isAr
            ? service.titleAr || service.titleEn
            : service.titleEn || service.titleAr;
          const description = isAr
            ? service.descriptionAr || service.descriptionEn
            : service.descriptionEn || service.descriptionAr;
          const tags = isAr
            ? service.tagsAr?.length
              ? service.tagsAr
              : service.tagsEn
            : service.tagsEn?.length
            ? service.tagsEn
            : service.tagsAr;
          const Icon = getServiceIconComponent(service.icon);

          return (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={title}
              description={description}
              tags={tags || []}
              href={service.href || `/services/${service.slug}`}
              icon={Icon}
              learnMoreLabel={t("card.learnMore")}
              ariaLabel={t("card.viewService", { title })}
            />
          );
        })}
      </div>
    </section>
  );
}
