import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
      <div className="text-center space-y-5 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner border border-primary/20">
          <span className="text-3xl font-extrabold tracking-tight">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t("subtitle")}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {t("description")}
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
          >
            {t("returnHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

