"use client";

import * as React from "react";
import {
  LuSettings,
  LuDatabase,
  LuKey,
  LuServer,
  LuShieldCheck,
  LuRefreshCw,
  LuTrash2,
  LuCircleCheck,
  LuFileText,
  LuBriefcase,
  LuLayers,
  LuUsers,
  LuMessageSquare,
  LuBell,
  LuMail,
  LuHardDrive,
} from "react-icons/lu";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { SystemTelemetry } from "@/lib/settings/actions";
import { purgeSystemCacheAction, getSystemTelemetryAction } from "@/lib/settings/actions";

interface SettingsClientProps {
  initialTelemetry: SystemTelemetry;
  locale: string;
}

export function SettingsClient({ initialTelemetry, locale }: SettingsClientProps) {
  const isAr = locale === "ar";
  const [telemetry, setTelemetry] = React.useState<SystemTelemetry>(initialTelemetry);
  const [isPurging, setIsPurging] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [alertInfo, setAlertInfo] = React.useState<{
    type: "success" | "destructive";
    message: string;
  } | null>(null);

  const showAlert = (message: string, type: "success" | "destructive" = "success") => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 4500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getSystemTelemetryAction();
      setTelemetry(fresh);
      showAlert(
        isAr ? "تم تحديث بيانات النظام بنجاح" : "System diagnostics refreshed successfully."
      );
    } catch {
      showAlert(
        isAr ? "فشل تحديث بيانات النظام" : "Failed to refresh diagnostics.",
        "destructive"
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePurgeCache = async () => {
    setIsPurging(true);
    try {
      const res = await purgeSystemCacheAction();
      showAlert(
        isAr
          ? "تم مسح الذاكرة المؤقتة وإعادة بناء المسارات العامة بنجاح."
          : res.message
      );
    } catch {
      showAlert(
        isAr ? "فشل تفريغ الذاكرة المؤقتة." : "Failed to purge cache.",
        "destructive"
      );
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Alert Notification */}
      {alertInfo && (
        <Alert variant={alertInfo.type} className="animate-in fade-in-50 duration-200">
          <AlertTitle className="font-semibold text-xs sm:text-sm">
            {alertInfo.type === "success"
              ? isAr
                ? "عملية ناجحة"
                : "Success"
              : isAr
              ? "تنبيه خطأ"
              : "Notice"}
          </AlertTitle>
          <AlertDescription className="text-xs">{alertInfo.message}</AlertDescription>
        </Alert>
      )}

      {/* Header and Telemetry Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LuSettings className="w-6 h-6 text-primary" />
            {isAr ? "إعدادات وتشخيصات النظام" : "System Settings & Diagnostics"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr
              ? "مراقبة تكوين البيئة، المقاييس الحية لقواعد البيانات، والتحكم في الذاكرة المؤقتة."
              : "Environment telemetry, live database metrics, and cache lifecycle controls."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-xl gap-2 cursor-pointer"
          >
            <LuRefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isAr ? "تحديث الفحص" : "Refresh"}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePurgeCache}
            disabled={isPurging}
            className="rounded-xl gap-2 cursor-pointer shadow-2xs"
          >
            <LuTrash2 className={`w-3.5 h-3.5 ${isPurging ? "animate-spin" : ""}`} />
            <span>{isAr ? "تفريغ الكاش العام" : "Purge All Cache"}</span>
          </Button>
        </div>
      </div>

      {/* System Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Database Config */}
        <Card className="border-border/70 shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <LuDatabase className="w-4 h-4 text-emerald-500" />
                {isAr ? "قاعدة بيانات Supabase" : "Supabase Database"}
              </CardTitle>
              <Badge variant="success" size="sm" className="gap-1">
                <LuCircleCheck className="w-3 h-3" />
                {isAr ? "متصل" : "Connected"}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              PostgreSQL DB & Row Level Security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">{isAr ? "المزود:" : "Provider:"}</span>
              <span className="font-semibold text-foreground">Supabase Cloud</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">{isAr ? "حالة RLS:" : "RLS Security:"}</span>
              <span className="font-semibold text-emerald-500">{isAr ? "مفعل ومراقب" : "Enforced"}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">{isAr ? "المرونة الاحتياطية:" : "Resilient Failover:"}</span>
              <span className="font-semibold text-foreground">{isAr ? "مفعلة (Local Fallback)" : "Active"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Auth & Identity */}
        <Card className="border-border/70 shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <LuKey className="w-4 h-4 text-purple-500" />
                {isAr ? "الهوية والمصادقة" : "Authentication & JWT"}
              </CardTitle>
              <Badge variant="success" size="sm" className="gap-1">
                <LuCircleCheck className="w-3 h-3" />
                {isAr ? "نشط" : "Active"}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Clerk Provider & Session Claims
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">{isAr ? "المزود:" : "Provider:"}</span>
              <span className="font-semibold text-foreground">Clerk Core v7</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">{isAr ? "مطالبة الصلاحيات:" : "Role Claim:"}</span>
              <span className="font-semibold font-mono text-primary text-[11px]">metadata.role</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">{isAr ? "حماية المسارات:" : "Edge Guard:"}</span>
              <span className="font-semibold text-emerald-500">proxy.ts + Admin Guard</span>
            </div>
          </CardContent>
        </Card>

        {/* Runtime & Hosting */}
        <Card className="border-border/70 shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <LuServer className="w-4 h-4 text-sky-500" />
                {isAr ? "بيئة التشغيل" : "Runtime Telemetry"}
              </CardTitle>
              <Badge variant="accent" size="sm">
                Next.js 16
              </Badge>
            </div>
            <CardDescription className="text-xs">
              App Router & ISR Caching
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">{isAr ? "بيئة التنفيذ:" : "Environment:"}</span>
              <span className="font-semibold font-mono text-foreground capitalize">{telemetry.nodeEnv}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">{isAr ? "إدارة اللغات:" : "Localization:"}</span>
              <span className="font-semibold text-foreground">Arabic & English (RTL/LTR)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">{isAr ? "حالة السرية:" : "Secrets Guard:"}</span>
              <span className="font-semibold text-emerald-500">{isAr ? "محمية (No Leak)" : "Secured"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Entity Telemetry Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
          {isAr ? "إحصائيات السجلات الفعلية في النظام" : "Live Content & Table Metrics"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-3.5 rounded-2xl bg-card border-border/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <LuFileText className="w-3.5 h-3.5 text-primary" />
                {isAr ? "المقالات" : "Articles"}
              </span>
            </div>
            <p className="text-xl font-bold mt-1.5 text-foreground font-mono">{telemetry.articlesCount}</p>
          </Card>

          <Card className="p-3.5 rounded-2xl bg-card border-border/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <LuBriefcase className="w-3.5 h-3.5 text-indigo-500" />
                {isAr ? "المشاريع" : "Projects"}
              </span>
            </div>
            <p className="text-xl font-bold mt-1.5 text-foreground font-mono">{telemetry.projectsCount}</p>
          </Card>

          <Card className="p-3.5 rounded-2xl bg-card border-border/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <LuLayers className="w-3.5 h-3.5 text-teal-500" />
                {isAr ? "الخدمات" : "Services"}
              </span>
            </div>
            <p className="text-xl font-bold mt-1.5 text-foreground font-mono">{telemetry.servicesCount}</p>
          </Card>

          <Card className="p-3.5 rounded-2xl bg-card border-border/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <LuUsers className="w-3.5 h-3.5 text-amber-500" />
                {isAr ? "فريق العمل" : "Team"}
              </span>
            </div>
            <p className="text-xl font-bold mt-1.5 text-foreground font-mono">{telemetry.teamCount}</p>
          </Card>

          <Card className="p-3.5 rounded-2xl bg-card border-border/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <LuMessageSquare className="w-3.5 h-3.5 text-sky-500" />
                {isAr ? "الاستفسارات" : "Inquiries"}
              </span>
            </div>
            <p className="text-xl font-bold mt-1.5 text-foreground font-mono">{telemetry.inquiriesCount}</p>
          </Card>

          <Card className="p-3.5 rounded-2xl bg-card border-border/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <LuBell className="w-3.5 h-3.5 text-rose-500" />
                {isAr ? "الإعلانات" : "Announcements"}
              </span>
            </div>
            <p className="text-xl font-bold mt-1.5 text-foreground font-mono">{telemetry.announcementsCount}</p>
          </Card>

          <Card className="p-3.5 rounded-2xl bg-card border-border/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <LuMail className="w-3.5 h-3.5 text-emerald-500" />
                {isAr ? "المشتركون" : "Subscribers"}
              </span>
            </div>
            <p className="text-xl font-bold mt-1.5 text-foreground font-mono">{telemetry.subscribersCount}</p>
          </Card>

          <Card className="p-3.5 rounded-2xl bg-card border-border/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <LuUsers className="w-3.5 h-3.5 text-purple-500" />
                {isAr ? "المستخدمون" : "Users"}
              </span>
            </div>
            <p className="text-xl font-bold mt-1.5 text-foreground font-mono">{telemetry.usersCount}</p>
          </Card>
        </div>
      </div>

      {/* Security Policies & Health Certification */}
      <Card className="border-border/70 shadow-2xs bg-muted/20">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <LuShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {isAr ? "معايير الأمان والتوافق معتمدة" : "Security & Privacy Baseline Enforced"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isAr
                    ? "جميع عمليات التعديل والحذف تخضع لفحص verifyAdminAuth() الصارم مع عزل بيانات الزوار وتشفير الرموز."
                    : "Mutating server actions enforce verifyAdminAuth() with zero public leaks of server credentials."}
                </p>
              </div>
            </div>

            <Badge variant="accent" size="sm" className="font-mono gap-1 shrink-0">
              <LuHardDrive className="w-3 h-3" />
              Production Ready
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
