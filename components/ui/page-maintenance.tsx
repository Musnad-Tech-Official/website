import * as React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LuWrench,
  LuArrowLeft,
  LuArrowRight,
  LuMail,
  LuShieldAlert,
  LuEye,
} from "react-icons/lu";

interface PageMaintenanceNoticeProps {
  locale: string;
  pageTitle: string;
  customMessage?: string;
  backHref?: string;
}

export function PageMaintenanceNotice({
  locale,
  pageTitle,
  customMessage,
  backHref = "/",
}: PageMaintenanceNoticeProps) {
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? LuArrowLeft : LuArrowRight;

  const defaultTitle = isRtl
    ? "هذه الصفحة قيد الصيانة المجدولة"
    : "This Page is Under Scheduled Maintenance";

  const defaultDescription = isRtl
    ? "نعمل حالياً على تحسين وتحديث محتوى هذه الصفحة لتقديم تجربة أفضل. يرجى التحقق مرة أخرى قريباً."
    : "We are currently making updates and improvements to provide you with a superior experience. Please check back shortly.";

  const homeLabel = isRtl ? "العودة للرئيسية" : "Return to Home";
  const contactLabel = isRtl ? "تواصل معنا" : "Contact Support";
  const badgeLabel = isRtl ? "تحديث وتطوير" : "System Maintenance";

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-xl w-full border border-border/80 shadow-2xl bg-card/60 backdrop-blur-xl relative overflow-hidden text-center p-8 sm:p-10">
        {/* Glow ambient decoration */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <CardContent className="p-0 relative z-10 flex flex-col items-center">
          {/* Animated maintenance badge */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-6 shadow-inner">
            <LuWrench className="w-8 h-8 animate-pulse" />
          </div>

          <Badge variant="outline" className="mb-4 text-xs font-medium border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 px-3 py-1">
            {badgeLabel}
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
            {pageTitle || defaultTitle}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mb-8">
            {customMessage || defaultDescription}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link href={backHref} className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full gap-2 font-medium">
                <span>{homeLabel}</span>
                <ArrowIcon className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full gap-2 font-medium">
                <LuMail className="w-4 h-4 text-muted-foreground" />
                <span>{contactLabel}</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Floating bar displayed to logged-in administrators when previewing a page
 * that is currently set to Maintenance or Hidden for the public.
 */
export function AdminPreviewBanner({
  status,
  isRtl,
}: {
  status: "maintenance" | "hidden";
  isRtl?: boolean;
}) {
  const isMaintenance = status === "maintenance";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="sticky top-0 z-50 w-full bg-amber-500/90 dark:bg-amber-600/90 text-amber-950 dark:text-amber-50 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-medium border-b border-amber-600/30 shadow-md flex items-center justify-between"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isMaintenance ? (
            <LuWrench className="w-4 h-4 shrink-0 text-amber-950 dark:text-amber-200" />
          ) : (
            <LuShieldAlert className="w-4 h-4 shrink-0 text-amber-950 dark:text-amber-200" />
          )}
          <span>
            <strong>
              {isRtl ? "وضع معاينة المشرف:" : "Admin Preview Mode:"}
            </strong>{" "}
            {isMaintenance
              ? isRtl
                ? "هذه الصفحة قيد الصيانة. يرى الزوار العاديون شاشة الصيانة."
                : "This page is in Maintenance mode. Visitors see the maintenance screen."
              : isRtl
              ? "هذه الصفحة مخفية. الزوار العاديون يحصلون على خطأ 404."
              : "This page is Hidden from the public. Regular visitors receive a 404 Not Found."}
          </span>
        </div>

        <Link
          href="/admin/pages"
          className="underline hover:no-underline font-semibold text-xs shrink-0 flex items-center gap-1"
        >
          <LuEye className="w-3.5 h-3.5" />
          <span>{isRtl ? "إدارة الصفحات" : "Page Settings"}</span>
        </Link>
      </div>
    </div>
  );
}
