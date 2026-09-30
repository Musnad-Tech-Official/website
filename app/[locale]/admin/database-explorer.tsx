import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Alert, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState } from "@/components/ui";
import { createClient } from "@/utils/supabase/server";

const tables = {
  content: [
    "services", "service_translations", "projects", "project_translations",
    "technologies", "project_technologies", "project_media", "team_members",
    "team_member_translations", "categories", "articles", "article_translations",
    "jobs", "job_translations", "pages", "page_translations",
  ],
  community: ["comments", "comment_reports", "project_ratings", "saved_projects"],
  operations: ["media_assets", "job_applications", "inquiries", "notifications"],
  identity: ["profiles"],
} as const;

const allowed = new Set<string>(Object.values(tables).flat());
type Query = { table?: string; page?: string; row?: string };
type RecordRow = Record<string, unknown>;

function textValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function summary(row: RecordRow): string {
  const preferred = ["title", "name", "slug", "email", "page_key", "id"];
  for (const key of preferred) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return Object.values(row).filter((value) => typeof value === "string").slice(0, 2).join(" · ") || "—";
}

export async function DatabaseExplorer({ locale, query }: { locale: string; query: Query }) {
  const t = await getTranslations({ locale, namespace: "AdminDashboard" });
  const table = query.table && allowed.has(query.table) ? query.table : "services";
  const page = Math.max(1, Math.min(1000, Number.parseInt(query.page ?? "1", 10) || 1));
  const rowIndex = Number.parseInt(query.row ?? "-1", 10);
  const supabase = await createClient();
  const result = await supabase.from(table).select("*", { count: "exact" }).range((page - 1) * 20, page * 20 - 1);
  const rows = (result.data ?? []) as RecordRow[];
  const selected = Number.isInteger(rowIndex) && rowIndex >= 0 && rowIndex < rows.length ? rows[rowIndex] : null;
  const href = (nextPage: number) => "/admin?section=database&table=" + table + "&page=" + nextPage;

  return <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
    <nav aria-label={t("databaseTables")} className="rounded-xl border border-border bg-card p-3">
      {(Object.entries(tables) as [keyof typeof tables, readonly string[]][]).map(([group, names]) => (
        <div key={group} className="mb-4 last:mb-0">
          <h2 className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("tableGroups." + group)}</h2>
          <ul className="space-y-1">{names.map((name) => (
            <li key={name}><Link href={"/admin?section=database&table=" + name} aria-current={table === name ? "page" : undefined}
              className={"block rounded-lg px-3 py-2 text-sm transition-colors " + (table === name ? "bg-primary/10 font-semibold text-primary" : "text-foreground hover:bg-muted")}>
              {t("tables." + name)}
            </Link></li>
          ))}</ul>
        </div>
      ))}
    </nav>
    <div className="min-w-0 space-y-6">
      <Card className="min-w-0">
        <CardHeader><CardTitle>{t("tables." + table)}</CardTitle><CardDescription>{t("recordCount", { count: result.count ?? 0 })} · {t("readOnlyExplorer")}</CardDescription></CardHeader>
        <CardContent>
          {result.error ? <Alert variant="warning">{t("tableLoadError")}</Alert>
            : !rows.length ? <EmptyState title={t("emptyTable")} className="my-0" />
            : <ul className="divide-y divide-border">{rows.map((row, index) => (
              <li key={index} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0"><p className="truncate font-medium text-foreground">{summary(row)}</p><p className="text-xs text-muted-foreground">{t("rowNumber", { number: (page - 1) * 20 + index + 1 })}</p></div>
                <Link href={href(page) + "&row=" + index} className="shrink-0 text-sm font-medium text-primary hover:underline">{t("view")}</Link>
              </li>
            ))}</ul>}
          <div className="mt-5 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{t("pageOf", { page, pages: Math.max(1, Math.ceil((result.count ?? 0) / 20)) })}</span>
            <div className="flex gap-3">{page > 1 && <Link href={href(page - 1)} className="font-medium text-primary hover:underline">{t("previous")}</Link>}{(result.count ?? 0) > page * 20 && <Link href={href(page + 1)} className="font-medium text-primary hover:underline">{t("next")}</Link>}</div>
          </div>
        </CardContent>
      </Card>
      {selected && <Card><CardHeader><CardTitle>{t("recordDetails")}</CardTitle><CardDescription>{summary(selected)}</CardDescription></CardHeader><CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">{Object.entries(selected).map(([key, value]) => (
          <div key={key} className="min-w-0 rounded-lg border border-border p-3"><dt className="mb-1 text-xs font-medium text-muted-foreground" dir="ltr">{key}</dt><dd className="max-h-64 overflow-auto whitespace-pre-wrap break-words text-sm text-foreground">{textValue(value)}</dd></div>
        ))}</dl>
      </CardContent></Card>}
    </div>
  </div>;
}
