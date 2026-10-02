import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Alert, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState } from "@/components/ui";
import { createClient } from "@/utils/supabase/server";

type Inquiry = { id: string; name: string; subject: string | null; status: string; created_at: string };

export async function Overview({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "AdminDashboard" });
  const supabase = await createClient();
  const [
    projects, articles, technologies, inquiries, draftProjects, draftArticles,
    newInquiries, activeInquiries, recentInquiries,
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("technologies").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("inquiries").select("id,name,subject,status,created_at").order("created_at", { ascending: false }).limit(6),
  ]);
  const results = [projects, articles, technologies, inquiries, draftProjects, draftArticles, newInquiries, activeInquiries, recentInquiries];
  const number = (value: number | null) => value === null ? "—" : new Intl.NumberFormat(locale === "ar" ? "ar" : "en").format(value);
  const date = (value: string) => new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" }).format(new Date(value));
  const metrics = [
    { label: t("projects"), count: projects.count, detail: draftProjects.error ? "—" : t("draftCount", { count: draftProjects.count ?? 0 }), href: "/admin?section=projects" },
    { label: t("articles"), count: articles.count, detail: draftArticles.error ? "—" : t("draftCount", { count: draftArticles.count ?? 0 }), href: "/admin?section=articles" },
    { label: t("technologies"), count: technologies.count, detail: t("catalogItems"), href: "/admin?section=technologies" },
    { label: t("inquiries"), count: inquiries.count, detail: newInquiries.error ? "—" : t("newCount", { count: newInquiries.count ?? 0 }), href: "/admin?section=inquiries" },
  ];
  const inquiryLabel = (status: string) => status === "in_progress" ? t("status.in_progress") : status === "resolved" ? t("status.resolved") : status === "closed" ? t("status.closed") : t("status.new");

  return <div className="space-y-7">
    {results.some((result) => result.error) && <Alert variant="warning">{t("loadError")}</Alert>}
    <section aria-label={t("overview")} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((item) => <Link key={item.href} href={item.href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Card variant="interactive" className="h-full p-5">
          <div className="flex items-start justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>{item.label}</span><span aria-hidden="true" className="text-lg text-primary">↗</span>
          </div>
          <p className="mt-5 text-4xl font-bold tracking-tight text-foreground tabular-nums">{number(item.count)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
        </Card>
      </Link>)}
    </section>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
      <Card className="min-w-0">
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div><CardTitle>{t("recentInquiries")}</CardTitle><CardDescription className="mt-2">{t("recentInquiriesDescription")}</CardDescription></div>
          <Link href="/admin?section=inquiries" className="shrink-0 text-sm font-medium text-primary hover:underline">{t("viewAll")}</Link>
        </CardHeader>
        <CardContent>
          {recentInquiries.error ? <p className="text-sm text-muted-foreground">{t("sectionLoadError")}</p>
            : !recentInquiries.data?.length ? <EmptyState title={t("emptyInquiries")} className="my-0 py-10" />
            : <ul className="divide-y divide-border">{(recentInquiries.data as Inquiry[]).map((row) =>
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0"><p className="truncate font-medium text-foreground">{row.subject || row.name}</p><p className="text-xs text-muted-foreground">{row.name} · {date(row.created_at)}</p></div>
                <Badge variant={row.status === "new" ? "warning" : row.status === "resolved" ? "success" : "secondary"}>{inquiryLabel(row.status)}</Badge>
              </li>)}</ul>}
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card variant="elevated" className="bg-primary text-primary-foreground">
          <CardHeader><CardTitle className="text-primary-foreground">{t("attentionTitle")}</CardTitle><CardDescription className="text-primary-foreground/80">{t("attentionDescription")}</CardDescription></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div><p className="text-3xl font-bold tabular-nums">{number(newInquiries.count)}</p><p className="text-sm text-primary-foreground/80">{t("status.new")}</p></div>
            <div><p className="text-3xl font-bold tabular-nums">{number(activeInquiries.count)}</p><p className="text-sm text-primary-foreground/80">{t("status.in_progress")}</p></div>
            <Link href="/admin?section=inquiries" className="col-span-2 mt-2 inline-flex min-h-10 items-center justify-center rounded-lg bg-background px-4 text-sm font-semibold text-foreground hover:opacity-90">{t("openQueue")}</Link>
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle>{t("quickActions")}</CardTitle></CardHeader><CardContent className="grid gap-2">
          {(["projects", "articles", "technologies"] as const).map((target) =>
            <Link key={target} href={"/admin?section=" + target + "&edit=new"} className="flex min-h-11 items-center justify-between rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span>{target === "projects" ? t("newProject") : target === "articles" ? t("newArticle") : t("newTechnology")}</span><span aria-hidden="true" className="text-primary">＋</span>
            </Link>)}
        </CardContent></Card>
      </div>
    </div>
  </div>;
}
