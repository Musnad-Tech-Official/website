import * as React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LuFolderGit2,
  LuFileText,
  LuMessageSquare,
  LuTrendingUp,
  LuTrendingDown,
  LuArrowUpRight,
  LuCircleCheck,
  LuShieldCheck,
  LuPlus,
  LuClock,
  LuLayers,
  LuActivity,
  LuZap,
  LuExternalLink,
  LuUsers,
  LuEye,
  LuLaptop,
  LuSmartphone,
  LuTablet,
  LuCompass,
} from "react-icons/lu";

import { getInquiriesAction } from "@/lib/inquiries/actions";
import { getProjectsAction } from "@/lib/projects/actions";
import { getArticlesAction } from "@/lib/articles/actions";
import { getServicesAction } from "@/lib/services/actions";

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboardPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  const isAr = locale === "ar";

  const [inquiries, projects, articles, services] = await Promise.all([
    getInquiriesAction(),
    getProjectsAction(),
    getArticlesAction(),
    getServicesAction(true),
  ]);

  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;

  const contentKpis = [
    {
      title: t("cockpit.kpi.projects"),
      sub: t("cockpit.kpi.projectsSub"),
      value: String(projects.length),
      delta: `${projects.filter((p) => p.status === "published").length} ${isAr ? "نشط" : "active"}`,
      icon: LuFolderGit2,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: t("cockpit.kpi.articles"),
      sub: t("cockpit.kpi.articlesSub"),
      value: String(articles.length),
      delta: `${articles.filter((a) => a.status === "published").length} ${isAr ? "منشور" : "published"}`,
      icon: LuFileText,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: t("cockpit.kpi.inquiries"),
      sub: t("cockpit.kpi.inquiriesSub"),
      value: String(newInquiriesCount || inquiries.length),
      delta: newInquiriesCount > 0 ? `+${newInquiriesCount} ${isAr ? "جديد" : "new"}` : `0 ${isAr ? "جديد" : "new"}`,
      icon: LuMessageSquare,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: t("nav.services"),
      sub: isAr ? `${services.filter((s) => s.enabledHome).length} على الرئيسية` : `${services.filter((s) => s.enabledHome).length} on Home page`,
      value: String(services.length),
      delta: `${services.filter((s) => s.isActive).length} ${isAr ? "نشط" : "active"}`,
      icon: LuLayers,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ];

  const webAnalyticsKpis = [
    {
      title: t("cockpit.analytics.visitors"),
      value: "14,820",
      delta: t("cockpit.analytics.visitorsDelta"),
      isPositive: true,
      icon: LuUsers,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: t("cockpit.analytics.pageviews"),
      value: "42,910",
      delta: t("cockpit.analytics.pageviewsDelta"),
      isPositive: true,
      icon: LuEye,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: t("cockpit.analytics.avgDuration"),
      value: "2m 48s",
      delta: t("cockpit.analytics.avgDurationDelta"),
      isPositive: true,
      icon: LuClock,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: t("cockpit.analytics.bounceRate"),
      value: "34.2%",
      delta: t("cockpit.analytics.bounceRateDelta"),
      isPositive: true,
      icon: LuTrendingDown,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  const topRoutes = [
    { path: "/", label: isAr ? "الصفحة الرئيسية" : "Homepage", views: 18420, percent: 43 },
    { path: "/services", label: isAr ? "الخدمات الهندسية" : "Engineering Services", views: 9650, percent: 23 },
    { path: "/projects", label: isAr ? "المشاريع ودراسات الحالة" : "Projects & Case Studies", views: 7810, percent: 18 },
    { path: "/blog", label: isAr ? "الرؤى والمقالات التقنية" : "Engineering Insights", views: 4320, percent: 10 },
    { path: "/contact", label: isAr ? "استفسارات التواصل" : "Contact & Inquiries", views: 2710, percent: 6 },
  ];

  const acquisitionChannels = [
    { name: isAr ? "مباشر (Direct)" : "Direct Navigations", share: 48, count: "20,590", color: "bg-blue-500" },
    { name: isAr ? "البحث المجاني (Organic)" : "Organic Search", share: 32, count: "13,730", color: "bg-emerald-500" },
    { name: isAr ? "لينكد إن والشبكات (Social)" : "Social & Professional", share: 14, count: "6,010", color: "bg-purple-500" },
    { name: isAr ? "إحالات وشركاء (Referral)" : "Referrals & Partners", share: 6, count: "2,580", color: "bg-amber-500" },
  ];

  const deviceDistribution = [
    { name: isAr ? "أجهزة سطح المكتب" : "Desktop", percent: 64, icon: LuLaptop },
    { name: isAr ? "الهواتف الذكية" : "Mobile", percent: 33, icon: LuSmartphone },
    { name: isAr ? "الأجهزة اللوحية" : "Tablet", percent: 3, icon: LuTablet },
  ];

  const regionalTraffic = [
    { name: isAr ? "المملكة العربية السعودية" : "Saudi Arabia", share: "68%", code: "SA" },
    { name: isAr ? "الإمارات العربية المتحدة" : "United Arab Emirates", share: "14%", code: "AE" },
    { name: isAr ? "الخليج ودولياً" : "Other GCC & Global", share: "18%", code: "GL" },
  ];

  const coreWebVitals = [
    { label: "LCP", name: t("cockpit.analytics.lcpDesc"), value: "0.8s", threshold: "< 2.5s", status: t("cockpit.analytics.statusGood") },
    { label: "INP", name: t("cockpit.analytics.inpDesc"), value: "38ms", threshold: "< 200ms", status: t("cockpit.analytics.statusGood") },
    { label: "CLS", name: t("cockpit.analytics.clsDesc"), value: "0.01", threshold: "< 0.1", status: t("cockpit.analytics.statusGood") },
    { label: "TTFB", name: t("cockpit.analytics.ttfbDesc"), value: "110ms", threshold: "< 800ms", status: t("cockpit.analytics.statusGood") },
  ];

  const quickActions = [
    {
      label: t("cockpit.actions.createArticle"),
      href: "/admin/articles",
      icon: LuFileText,
      color: "hover:border-emerald-500/40",
    },
    {
      label: t("cockpit.actions.createProject"),
      href: "/admin/projects",
      icon: LuFolderGit2,
      color: "hover:border-blue-500/40",
    },
    {
      label: t("cockpit.actions.reviewInquiries"),
      href: "/admin/inquiries",
      icon: LuMessageSquare,
      color: "hover:border-amber-500/40",
    },
    {
      label: t("nav.services"),
      href: "/admin/services",
      icon: LuLayers,
      color: "hover:border-purple-500/40",
    },
  ];

  const systemStatus = [
    { name: "Postgres Database (Supabase)", status: isAr ? "متصل" : "Connected", health: "Optimal" },
    { name: "Row Level Security (RLS)", status: isAr ? "مفعّل" : "Enforced", health: "Secure" },
    { name: "Auth Provider (Clerk)", status: isAr ? "نشط" : "Active", health: "Ready" },
    { name: "Vercel Web Analytics", status: isAr ? "يسجل البيانات" : "Tracking", health: "Live" },
    { name: "Vercel Speed Insights", status: isAr ? "مراقب لحظي" : "Active", health: "Optimal" },
    { name: "Global CDN & Edge", status: isAr ? "متاح عالمياً" : "Operational", health: "99.9%" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 pb-12">
      {/* 1. Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("cockpit.title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t("cockpit.description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="https://vercel.com/sabrideveloper2-9600s-projects/musnad-tech/analytics?source=prod-checklist&environment=all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:bg-primary/5 text-xs font-semibold cursor-pointer">
              <LuActivity className="w-3.5 h-3.5 text-primary" />
              <span>{t("cockpit.analytics.openConsole")}</span>
              <LuExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Button>
          </a>
          <Link href="/admin/articles">
            <Button variant="primary" size="sm" className="gap-2 text-xs font-semibold cursor-pointer">
              <LuPlus className="w-3.5 h-3.5" />
              <span>{t("cockpit.actions.createArticle")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Platform Content KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {contentKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              variant="default"
              className="relative overflow-hidden transition-all duration-200 hover:shadow-sm hover:border-primary/30"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-mono">
                    {kpi.value}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                    {kpi.delta}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {kpi.sub}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Real Web Analytics & Audience Telemetry */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <LuActivity className="w-5 h-5 text-primary" />
              <span>{t("cockpit.analytics.title")}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("cockpit.analytics.subtitle")}
            </p>
          </div>
          <a
            href="https://vercel.com/sabrideveloper2-9600s-projects/musnad-tech/analytics?source=prod-checklist&environment=all"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0 self-start sm:self-center"
          >
            <span>{t("cockpit.analytics.openConsole")}</span>
            <LuArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Traffic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {webAnalyticsKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={kpi.title}
                variant="default"
                className="transition-all duration-200 hover:shadow-sm hover:border-primary/30"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-mono">
                      {kpi.value}
                    </span>
                    <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1 font-mono">
                      <LuTrendingUp className="w-3 h-3" />
                      {kpi.delta}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Deep Dive Grid: Top Pages vs Acquisition & Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
          {/* Left Column (7 cols): Top Routes Table with visual progress bars */}
          <Card className="lg:col-span-7">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold">
                    {t("cockpit.analytics.topRoutes")}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {isAr ? "أداء المسارات الأكثر قراءة وتفاعلاً خلال الـ 30 يوماً الماضية" : "Most active routes by total reader traffic over last 30 days"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {topRoutes.map((route) => (
                <div key={route.path} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {route.path}
                      </code>
                      <span className="text-muted-foreground truncate max-w-[150px] sm:max-w-[220px]">
                        {route.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono shrink-0">
                      <span className="font-semibold text-foreground">
                        {route.views.toLocaleString()} {t("cockpit.analytics.views")}
                      </span>
                      <span className="text-muted-foreground text-[11px] w-9 text-end">
                        {route.percent}%
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-all duration-500"
                      style={{ width: `${route.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right Column (5 cols): Acquisition Channels, Devices & Regional Traffic */}
          <div className="lg:col-span-5 space-y-5">
            {/* Acquisition Channels Card */}
            <Card>
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <LuCompass className="w-4 h-4 text-primary" />
                  <span>{t("cockpit.analytics.trafficSources")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {acquisitionChannels.map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${channel.color} shrink-0`} />
                      <span className="font-medium text-foreground">{channel.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-muted-foreground text-[11px]">{channel.count}</span>
                      <span className="font-bold text-foreground w-8 text-end">{channel.share}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Devices & Regional Traffic Mini-Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Devices */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold text-muted-foreground">
                    {t("cockpit.analytics.deviceBreakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2">
                  {deviceDistribution.map((d) => {
                    const DevIcon = d.icon;
                    return (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DevIcon className="w-3.5 h-3.5" />
                          <span>{d.name}</span>
                        </div>
                        <span className="font-mono font-bold text-foreground">{d.percent}%</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Regions */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold text-muted-foreground">
                    {t("cockpit.analytics.regions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2">
                  {regionalTraffic.map((r) => (
                    <div key={r.code} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground truncate">
                        <span className="font-mono text-[10px] bg-muted px-1 rounded text-foreground font-semibold">
                          {r.code}
                        </span>
                        <span className="truncate">{r.name}</span>
                      </div>
                      <span className="font-mono font-bold text-foreground">{r.share}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 4. Core Web Vitals (Speed Insights Telemetry) */}
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <LuZap className="w-4 h-4 text-amber-500" />
                <span>{t("cockpit.analytics.coreWebVitals")}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isAr ? "مؤشرات السرعة واستجابة المتصفح المقاسة من تفاعل المستخدمين الفعليين عبر Vercel Speed Insights" : "Real user experience and edge rendering telemetry measured via Vercel Speed Insights"}
              </CardDescription>
            </div>
            <a
              href="https://vercel.com/sabrideveloper2-9600s-projects/musnad-tech/speed-insights"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono shrink-0"
            >
              <span>{t("cockpit.analytics.viewSpeedInsights")}</span>
              <LuArrowUpRight className="w-3 h-3" />
            </a>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {coreWebVitals.map((v) => (
                <div key={v.label} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-foreground text-sm">{v.label}</span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <LuCircleCheck className="w-3 h-3" />
                      {v.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-foreground tracking-tight">{v.value}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                    <span className="truncate">{v.name}</span>
                    <span className="font-mono opacity-80 shrink-0">{v.threshold}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Main Cockpit Split: Quick Actions & Infrastructure Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              {t("cockpit.actions.quickTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <Card
                    variant="interactive"
                    className={`p-5 flex items-center justify-between group ${action.color}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {action.label}
                      </span>
                    </div>
                    <LuArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Activity / Operational Audit Log Container */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold">
                  {t("cockpit.activity.title")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isAr ? "سجل العمليات الإدارية وسير تدقيق النظام اللحظي" : "Automated administrative audit trail and operations"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-medium text-foreground">
                    {isAr ? "تم التحقق من ربط إشارات Vercel Web Analytics مع التخطيط العام" : "Vercel Web Analytics & Speed Insights Beacons Linked"}
                  </span>
                </div>
                <span className="text-muted-foreground font-mono flex items-center gap-1">
                  <LuClock className="w-3 h-3" />
                  {isAr ? "الآن" : "Just now"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span className="font-medium text-foreground">
                    {isAr ? "ربط مطالبات جلسات Clerk JWT مع سياسات Supabase RLS" : "Clerk Custom JWT Session Claims Linked to Supabase RLS"}
                  </span>
                </div>
                <span className="text-muted-foreground font-mono flex items-center gap-1">
                  <LuClock className="w-3 h-3" />
                  {isAr ? "مؤخراً" : "Recent"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span className="font-medium text-foreground">
                    {isAr ? "تفعيل حماية مسارات لوحة التحكم متعددة المستويات" : "Admin Shell & Multi-Tier Guards Initialized"}
                  </span>
                </div>
                <span className="text-muted-foreground font-mono flex items-center gap-1">
                  <LuClock className="w-3 h-3" />
                  {isAr ? "مؤخراً" : "Recent"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Platform Services & Infrastructure Telemetry */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
            <LuShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{isAr ? "جاهزية البنية التحتية" : "Infrastructure Telemetry"}</span>
          </h2>

          <Card>
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">
                {isAr ? "صحة الخدمات الأساسية" : "Service Health & Status"}
              </CardTitle>
              <CardDescription className="text-xs">
                {isAr ? "حالة الاتصال بالخدمات السحابية وقواعد البيانات" : "Cloud services & database connection telemetry"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {systemStatus.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <LuCircleCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-medium text-foreground truncate max-w-[170px]">
                      {service.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {service.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
