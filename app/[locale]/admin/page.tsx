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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LuFolderGit2,
  LuFileText,
  LuMessageSquare,
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
  LuBriefcase,
  LuCircleHelp,
  LuBuilding2,
  LuCpu,
  LuQuote,
  LuMegaphone,
  LuMail,
  LuDatabase,
  LuServer,
  LuRadio,
} from "react-icons/lu";

import { getInquiriesAction } from "@/lib/inquiries/actions";
import { getProjectsAction } from "@/lib/projects/actions";
import { getArticlesAction } from "@/lib/articles/actions";
import { getServicesAction } from "@/lib/services/actions";
import { getTeamMembersAction } from "@/lib/team/actions";
import { getTrustedCompaniesAction } from "@/lib/companies/actions";
import { getTestimonialsAction } from "@/lib/testimonials/actions";
import { getHomeTechnologiesAction } from "@/lib/technologies/actions";
import { getAllAnnouncementsAction } from "@/lib/announcements/actions";
import { getCareerJobsAction } from "@/lib/careers/actions";
import { getFaqQuestionsAction } from "@/lib/faqs/actions";
import { getSystemTelemetryAction } from "@/lib/settings/actions";

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboardPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  const isAr = locale === "ar";

  const [
    inquiries,
    projects,
    articles,
    services,
    teamMembers,
    companies,
    testimonials,
    technologies,
    announcements,
    careerJobs,
    faqQuestions,
    telemetry,
  ] = await Promise.all([
    getInquiriesAction().catch(() => []),
    getProjectsAction().catch(() => []),
    getArticlesAction().catch(() => []),
    getServicesAction(true).catch(() => []),
    getTeamMembersAction(true).catch(() => []),
    getTrustedCompaniesAction(false).catch(() => []),
    getTestimonialsAction(false).catch(() => []),
    getHomeTechnologiesAction().catch(() => []),
    getAllAnnouncementsAction().catch(() => []),
    getCareerJobsAction(true).catch(() => []),
    getFaqQuestionsAction(undefined, true).catch(() => []),
    getSystemTelemetryAction().catch(() => null),
  ]);

  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;
  const recentInquiries = inquiries.slice(0, 5);
  const recentArticles = articles.slice(0, 4);
  const recentProjects = projects.slice(0, 4);

  const primaryKpis = [
    {
      title: t("cockpit.kpi.projects"),
      sub: t("cockpit.kpi.projectsSub"),
      value: String(projects.length),
      delta: `${projects.filter((p) => p.status === "published").length} ${isAr ? "نشط" : "active"}`,
      icon: LuFolderGit2,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      href: "/admin/projects",
    },
    {
      title: t("cockpit.kpi.articles"),
      sub: t("cockpit.kpi.articlesSub"),
      value: String(articles.length),
      delta: `${articles.filter((a) => a.status === "published").length} ${isAr ? "منشور" : "published"}`,
      icon: LuFileText,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      href: "/admin/articles",
    },
    {
      title: t("cockpit.kpi.inquiries"),
      sub: t("cockpit.kpi.inquiriesSub"),
      value: String(inquiries.length),
      delta: newInquiriesCount > 0 ? `+${newInquiriesCount} ${isAr ? "جديد" : "new"}` : `0 ${isAr ? "جديد" : "new"}`,
      icon: LuMessageSquare,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      href: "/admin/inquiries",
    },
    {
      title: t("nav.services"),
      sub: isAr
        ? `${services.filter((s) => s.enabledHome).length} على الرئيسية`
        : `${services.filter((s) => s.enabledHome).length} on Home page`,
      value: String(services.length),
      delta: `${services.filter((s) => s.isActive).length} ${isAr ? "نشط" : "active"}`,
      icon: LuLayers,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      href: "/admin/services",
    },
  ];

  const secondaryKpis = [
    {
      title: isAr ? "أعضاء الفريق" : "Team Members",
      value: String(teamMembers.length),
      sub: isAr ? "المهندسون والقيادة" : "Engineers & Leadership",
      icon: LuUsers,
      href: "/admin/team",
    },
    {
      title: isAr ? "الشواغر الوظيفية" : "Career Openings",
      value: String(careerJobs.length),
      sub: `${careerJobs.filter((j) => j.isActive).length} ${isAr ? "متاحة للتقديم" : "open positions"}`,
      icon: LuBriefcase,
      href: "/admin/careers",
    },
    {
      title: isAr ? "الأسئلة الشائعة" : "FAQs",
      value: String(faqQuestions.length),
      sub: `${faqQuestions.filter((q) => q.isActive).length} ${isAr ? "سؤال نشط" : "active questions"}`,
      icon: LuCircleHelp,
      href: "/admin/faqs",
    },
    {
      title: isAr ? "الشركات الموثوقة" : "Trusted Clients",
      value: String(companies.length),
      sub: isAr ? "شريط العملاء والشركاء" : "Client logos on Home",
      icon: LuBuilding2,
      href: "/admin/companies",
    },
    {
      title: isAr ? "التقنيات والأدوات" : "Technologies",
      value: String(technologies.length),
      sub: isAr ? "حزمة التقنيات واللغات" : "Tech stack cloud",
      icon: LuCpu,
      href: "/admin/technologies",
    },
    {
      title: isAr ? "توصيات العملاء" : "Testimonials",
      value: String(testimonials.length),
      sub: isAr ? "آراء الشركاء والعملاء" : "Verified client feedback",
      icon: LuQuote,
      href: "/admin/testimonials",
    },
    {
      title: isAr ? "أشرطة الإعلانات" : "Announcements",
      value: String(announcements.length),
      sub: `${announcements.filter((a) => a.isActive).length} ${isAr ? "مفعل حالياً" : "active currently"}`,
      icon: LuMegaphone,
      href: "/admin/announcements",
    },
    {
      title: isAr ? "المشتركون بالنشرة" : "Newsletter",
      value: String(telemetry?.subscribersCount ?? 0),
      sub: isAr ? "مشترك بالبريد" : "Verified subscribers",
      icon: LuMail,
      href: "/admin/settings",
    },
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

  // Configuration checks are not live health probes. Do not claim security or telemetry health.
  const systemStatus = [
    {
      name: "Supabase Configuration",
      status: telemetry?.supabaseConfigured ? (isAr ? "مهيأ" : "Configured") : (isAr ? "غير مهيأ" : "Unconfigured"),
      isOk: Boolean(telemetry?.supabaseConfigured),
    },
    {
      name: "Row Level Security (RLS)",
      status: isAr ? "لم يُفحص مباشرة" : "Not live-checked",
      isOk: false,
    },
    {
      name: "Clerk Configuration",
      status: telemetry?.clerkConfigured ? (isAr ? "مهيأ" : "Configured") : (isAr ? "غير مهيأ" : "Unconfigured"),
      isOk: Boolean(telemetry?.clerkConfigured),
    },
    {
      name: "Vercel Web Analytics",
      status: isAr ? "الفحص عبر Vercel" : "Verify in Vercel",
      isOk: false,
    },
    {
      name: "Vercel Speed Insights",
      status: isAr ? "الفحص عبر Vercel" : "Verify in Vercel",
      isOk: false,
    },
    {
      name: "Runtime Environment",
      status: telemetry?.nodeEnv || (isAr ? "غير معروف" : "Unknown"),
      isOk: Boolean(telemetry?.nodeEnv),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300 pb-12 min-w-0">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="space-y-1 min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground truncate">
            {t("cockpit.title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {isAr
              ? "لوحة القيادة التشغيلية لجميع كيانات وقواعد بيانات منصة مسند للتقنية."
              : "Operational cockpit managing all dynamic entities, database records, and platform workflows."}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
          <a
            href="https://vercel.com/sabrideveloper2-9600s-projects/musnad-tech/analytics?source=prod-checklist&environment=all"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto gap-2 border-primary/30 hover:bg-primary/5 text-xs font-semibold cursor-pointer justify-center"
            >
              <LuActivity className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{t("cockpit.analytics.openConsole")}</span>
              <LuExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
            </Button>
          </a>
          <Link href="/admin/articles" className="flex-1 sm:flex-initial">
            <Button variant="primary" size="sm" className="w-full sm:w-auto gap-2 text-xs font-semibold cursor-pointer justify-center">
              <LuPlus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t("cockpit.actions.createArticle")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Primary Content KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
        {primaryKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.title} href={kpi.href}>
              <Card
                variant="default"
                className="relative overflow-hidden transition-all duration-200 hover:shadow-sm hover:border-primary/40 h-full min-w-0"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-5">
                  <CardTitle className="text-xs font-medium text-muted-foreground truncate">
                    {kpi.title}
                  </CardTitle>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-mono">
                      {kpi.value}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
                      {kpi.delta}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {kpi.sub}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 3. Secondary Platform Entities Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <LuDatabase className="w-4 h-4 text-primary shrink-0" />
          <span>{isAr ? "قواعد البيانات والمحتوى الديناميكي" : "Database Entities & CMS Models"}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-2.5 sm:gap-3">
          {secondaryKpis.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href}>
                <Card className="p-3 sm:p-3.5 hover:border-primary/40 transition-colors h-full flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="font-mono font-bold text-sm sm:text-base text-foreground shrink-0">{item.value}</span>
                  </div>
                  <div className="mt-2 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.sub}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Live Inquiries Feed vs Content Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column (7 cols): Real Inquiries Feed */}
        <Card className="lg:col-span-7 min-w-0">
          <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <LuMessageSquare className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">{isAr ? "أحدث استفسارات العملاء الواردة" : "Recent Client Inquiries"}</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  {isAr
                    ? "الاستفسارات المحفوظة في قاعدة بيانات Supabase من نموذج التواصل"
                    : "Live submissions stored directly in Supabase from the contact form"}
                </CardDescription>
              </div>
              <Link href="/admin/inquiries" className="self-end sm:self-auto shrink-0">
                <Button size="sm" variant="ghost" className="h-8 text-xs gap-1">
                  <span>{isAr ? "عرض الكل" : "View All"}</span>
                  <LuArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5">
            {recentInquiries.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                {isAr ? "لا توجد استفسارات جديدة مسجلة حالياً." : "No client inquiries received yet."}
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs min-w-0"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-bold text-foreground truncate max-w-[140px] sm:max-w-none">{inq.name}</span>
                        {inq.company && (
                          <span className="text-muted-foreground font-medium truncate max-w-[120px] sm:max-w-none">({inq.company})</span>
                        )}
                        <Badge
                          variant={
                            inq.status === "new"
                              ? "default"
                              : inq.status === "in_review"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px] uppercase font-mono shrink-0"
                        >
                          {inq.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-1 break-words">
                        {inq.projectType || inq.inquiryType || inq.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground font-mono text-[11px] self-start sm:self-center">
                      <LuClock className="w-3.5 h-3.5" />
                      <span>
                        {inq.createdAt
                          ? new Date(inq.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : isAr
                          ? "مؤخراً"
                          : "Recent"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column (5 cols): Content Publishing Status */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5 min-w-0">
          <Card className="min-w-0">
            <CardHeader className="p-4 pb-3 border-b border-border/40">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 truncate">
                  <LuFolderGit2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">{isAr ? "أحدث المشاريع في قاعدة البيانات" : "Recent Projects"}</span>
                </CardTitle>
                <Link href="/admin/projects" className="shrink-0">
                  <Button size="sm" variant="ghost" className="h-7 text-xs px-2">
                    <LuArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 space-y-2">
              {recentProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 text-xs p-2.5 rounded-lg bg-muted/20 min-w-0">
                  <span className="font-semibold text-foreground truncate flex-1 min-w-0">
                    {isAr ? p.titleAr || p.titleEn : p.titleEn}
                  </span>
                  <Badge variant={p.status === "published" ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {p.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="p-4 pb-3 border-b border-border/40">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 truncate">
                  <LuFileText className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{isAr ? "أحدث المقالات في الـ CMS" : "Recent Articles"}</span>
                </CardTitle>
                <Link href="/admin/articles" className="shrink-0">
                  <Button size="sm" variant="ghost" className="h-7 text-xs px-2">
                    <LuArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 space-y-2">
              {recentArticles.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 text-xs p-2.5 rounded-lg bg-muted/20 min-w-0">
                  <span className="font-semibold text-foreground truncate flex-1 min-w-0">
                    {isAr ? a.titleAr || a.titleEn : a.titleEn}
                  </span>
                  <Badge variant={a.status === "published" ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {a.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Production Telemetry & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              {t("cockpit.actions.quickTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <Card
                    variant="interactive"
                    className={`p-4 sm:p-5 flex items-center justify-between group ${action.color} min-w-0`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted flex items-center justify-center text-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {action.label}
                      </span>
                    </div>
                    <LuArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Real-time Telemetry Explanation Card */}
          <Card className="mt-4 sm:mt-6 min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-5 border-b border-border/40">
              <div className="space-y-0.5 min-w-0 flex-1">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <LuRadio className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">{isAr ? "تحليلات الويب المباشرة عبر Vercel" : "Real-time Telemetry & Web Vitals"}</span>
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 sm:line-clamp-none">
                  {isAr
                    ? "يتم جمع إحصائيات التفاعل الحقيقية ومؤشرات الأداء عبر حافة شبكة Vercel بدون ملفات تعريف ارتباط (Cookieless)"
                    : "Real user monitoring & Core Web Vitals are captured live at Vercel edge without intrusive cookies"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                {isAr
                  ? "حرصاً على دقة البيانات ومبدأ 'البرهان قبل الادعاء'، يتم تسجيل إشارات الزوار وأوقات التحميل عبر @vercel/analytics و @vercel/speed-insights، ويمكن معاينتها مباشرة عبر لوحة تحكم Vercel الحية."
                  : "In accordance with our 'Proof over claims' principle, production visitor metrics and latency vitals are ingested directly by Vercel Analytics and Speed Insights consoles without storing mock values."}
              </p>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto shrink-0">
                <a
                  href="https://vercel.com/sabrideveloper2-9600s-projects/musnad-tech/analytics?source=prod-checklist&environment=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial"
                >
                  <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs gap-1.5 cursor-pointer justify-center">
                    <LuActivity className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{t("cockpit.analytics.openConsole")}</span>
                    <LuExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  </Button>
                </a>
                <a
                  href="https://vercel.com/sabrideveloper2-9600s-projects/musnad-tech/speed-insights"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial"
                >
                  <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs gap-1.5 cursor-pointer justify-center">
                    <LuZap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{t("cockpit.analytics.viewSpeedInsights")}</span>
                    <LuExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Platform Services & Infrastructure Telemetry */}
        <div className="space-y-4 min-w-0">
          <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
            <LuShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{isAr ? "التهيئة والتحقق" : "Configuration & Verification"}</span>
          </h2>

          <Card className="min-w-0">
            <CardHeader className="p-4 pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <LuServer className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{isAr ? "حالة إعداد الخدمات" : "Service Configuration Status"}</span>
              </CardTitle>
              <CardDescription className="text-xs line-clamp-1">
                {isAr ? "مؤشرات تهيئة فقط؛ ليست فحصاً مباشراً لصحة الخدمات" : "Configuration indicators only; not live health checks"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 space-y-2.5">
              {systemStatus.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between gap-2.5 p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs min-w-0"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <LuCircleCheck
                      className={`w-3.5 h-3.5 shrink-0 ${
                        service.isOk ? "text-emerald-500" : "text-amber-500"
                      }`}
                    />
                    <span className="font-medium text-foreground truncate">
                      {service.name}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-mono font-semibold shrink-0 ${
                      service.isOk
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
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
