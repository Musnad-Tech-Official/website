import { getTranslations } from "next-intl/server";
import { PageControlClient } from "@/components/admin/pages/page-control-client";
import { getPageControlsAction } from "@/lib/page-control/actions";
import { LuGlobe, LuExternalLink } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

interface AdminPagesProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPagesManagementPage({ params }: AdminPagesProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  // Fetch page settings
  const pages = await getPageControlsAction();

  const isRtl = locale === "ar";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <LuGlobe className="w-5 h-5" />
            </div>
            <span>{t("nav.pages")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? "تحكم في الصفحات النشطة على الموقع، وضع الصيانة المخصص، وإمكانية ظهور الروابط في القائمة العلوية وتذييل الموقع."
              : "Control live page visibility, schedule custom maintenance screens, and toggle Navbar and Footer menu presence."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs font-semibold cursor-pointer h-9 px-3.5">
              <LuExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{isRtl ? "زيارة الموقع المباشر" : "View Live Site"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Control Dashboard */}
      <PageControlClient initialPages={pages} locale={locale} />
    </div>
  );
}
