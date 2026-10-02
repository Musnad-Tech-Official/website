import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Alert, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, Input, Select, Textarea } from "@/components/ui";
import { createClient } from "@/utils/supabase/server";
import { saveArticle, saveProject } from "./actions";

type Translation = { locale: string; title: string; summary?: string | null; excerpt?: string | null; content?: string | null };
type Row = { id: string; slug: string; status: string; created_at: string; project_translations?: Translation[]; article_translations?: Translation[] };
type Query = { edit?: string; status?: string; q?: string; page?: string };
const statuses = ["draft", "published", "archived"] as const;

export async function ContentManager({ locale, kind, query }: { locale: string; kind: "projects" | "articles"; query: Query }) {
  const t = await getTranslations({ locale, namespace: "AdminDashboard" });
  const supabase = await createClient();
  const isProject = kind === "projects";
  const table = isProject ? "projects" : "articles";
  const select = isProject
    ? "id,slug,status,created_at,project_translations(locale,title,summary)"
    : "id,slug,status,created_at,article_translations(locale,title,excerpt,content)";
  const q = (query.q ?? "").trim().slice(0, 80);
  const filter = statuses.includes(query.status as typeof statuses[number]) ? query.status! : "all";
  const page = Math.max(1, Math.min(1000, Number.parseInt(query.page ?? "1", 10) || 1));
  const edit = query.edit ?? "";
  const offset = (page - 1) * 20;
  let request = supabase.from(table).select(select, { count: "exact" }).order("created_at", { ascending: false }).range(offset, offset + 19);
  if (q) request = request.ilike("slug", "%" + q + "%");
  if (filter !== "all") request = request.eq("status", filter);
  const [list, detail] = await Promise.all([
    request,
    edit && edit !== "new" ? supabase.from(table).select(select).eq("id", edit).maybeSingle() : Promise.resolve(null),
  ]);
  const rows = (list.data ?? []) as unknown as Row[];
  const selected = detail?.data as unknown as Row | null;
  const translations = selected?.project_translations ?? selected?.article_translations ?? [];
  const translation = (locale: string) => translations.find((item) => item.locale === locale);
  const title = (row: Row) => {
    const values = row.project_translations ?? row.article_translations ?? [];
    return values.find((item) => item.locale === locale)?.title ?? values.find((item) => item.locale === "en")?.title ?? row.slug;
  };
  const statusLabel = (value: string) => value === "published" ? t("status.published") : value === "archived" ? t("status.archived") : t("status.draft");
  const date = (value: string) => new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" }).format(new Date(value));
  const base = "/admin?section=" + kind;
  const pageHref = (number: number) => {
    const params = new URLSearchParams({ section: kind, page: String(number) });
    if (q) params.set("q", q);
    if (filter !== "all") params.set("status", filter);
    return "/admin?" + params.toString();
  };

  return <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
    <Card className="min-w-0">
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><CardTitle>{isProject ? t("projects") : t("articles")}</CardTitle><CardDescription className="mt-2">{t("recordCount", { count: list.count ?? 0 })}</CardDescription></div>
        <Link href={base + "&edit=new"} className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-95">{t("createNew")}</Link>
      </CardHeader>
      <CardContent>
        <form method="get" action={"/" + locale + "/admin"} className="mb-5 flex flex-wrap items-end gap-3">
          <input type="hidden" name="section" value={kind} />
          <Input name="q" defaultValue={q} placeholder={t("searchSlug")} aria-label={t("searchSlug")} containerClassName="min-w-44 flex-1" />
          <Select name="status" defaultValue={filter} label={t("filterStatus")} containerClassName="w-40">
            <option value="all">{t("allStatuses")}</option>
            {statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}
          </Select>
          <Button type="submit" variant="outline">{t("filter")}</Button>
        </form>
        {list.error ? <Alert variant="warning">{t("sectionLoadError")}</Alert> : !rows.length ? <EmptyState title={t("emptyContent")} description={t("emptyContentDescription")} className="my-0" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th scope="col" className="pb-3 text-start">{t("name")}</th><th scope="col" className="pb-3 text-start">{t("statusLabel")}</th><th scope="col" className="pb-3 text-start">{t("created")}</th><th scope="col" className="pb-3 text-end">{t("actions")}</th></tr>
              </thead>
              <tbody className="divide-y divide-border">{rows.map((row) => (
                <tr key={row.id}>
                  <td className="max-w-48 py-4 pe-4"><p className="truncate font-medium text-foreground">{title(row)}</p><p className="truncate text-xs text-muted-foreground" dir="ltr">{row.slug}</p></td>
                  <td className="py-4 pe-4"><Badge variant={row.status === "published" ? "success" : row.status === "archived" ? "secondary" : "warning"}>{statusLabel(row.status)}</Badge></td>
                  <td className="whitespace-nowrap py-4 pe-4 text-muted-foreground">{date(row.created_at)}</td>
                  <td className="py-4 text-end"><Link href={base + "&edit=" + row.id} className="font-medium text-primary hover:underline">{t("edit")}</Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">{t("pageOf", { page, pages: Math.max(1, Math.ceil((list.count ?? 0) / 20)) })}</span>
          <div className="flex gap-3">{page > 1 && <Link href={pageHref(page - 1)} className="font-medium text-primary hover:underline">{t("previous")}</Link>}{(list.count ?? 0) > page * 20 && <Link href={pageHref(page + 1)} className="font-medium text-primary hover:underline">{t("next")}</Link>}</div>
        </div>
      </CardContent>
    </Card>
    {(edit === "new" || selected) && <Card className="h-fit">
      <CardHeader><CardTitle>{selected ? t("editContent") : t("createContent")}</CardTitle><CardDescription>{t("bilingualHelp")}</CardDescription></CardHeader>
      <CardContent>
        <form action={isProject ? saveProject : saveArticle} className="space-y-4">
          <input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={selected?.id ?? ""} />
          <Input name="slug" label={t("slug")} defaultValue={selected?.slug} required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" dir="ltr" />
          <Input name="title_en" label={t("titleEn")} defaultValue={translation("en")?.title} required maxLength={180} dir="ltr" />
          <Input name="title_ar" label={t("titleAr")} defaultValue={translation("ar")?.title} required maxLength={180} dir="rtl" />
          {isProject ? <>
            <Textarea name="summary_en" label={t("summaryEn")} defaultValue={translation("en")?.summary ?? ""} rows={3} maxLength={2000} dir="ltr" />
            <Textarea name="summary_ar" label={t("summaryAr")} defaultValue={translation("ar")?.summary ?? ""} rows={3} maxLength={2000} dir="rtl" />
          </> : <>
            <Textarea name="excerpt_en" label={t("excerptEn")} defaultValue={translation("en")?.excerpt ?? ""} rows={3} maxLength={1000} dir="ltr" />
            <Textarea name="excerpt_ar" label={t("excerptAr")} defaultValue={translation("ar")?.excerpt ?? ""} rows={3} maxLength={1000} dir="rtl" />
            <Textarea name="content_en" label={t("contentEn")} defaultValue={translation("en")?.content ?? ""} rows={7} maxLength={50000} required dir="ltr" />
            <Textarea name="content_ar" label={t("contentAr")} defaultValue={translation("ar")?.content ?? ""} rows={7} maxLength={50000} required dir="rtl" />
          </>}
          <Select name="status" label={t("statusLabel")} defaultValue={selected?.status ?? "draft"}>{statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</Select>
          <div className="flex gap-2"><Button type="submit">{t("save")}</Button><Link href={base} className="inline-flex min-h-10 items-center px-3 text-sm text-muted-foreground hover:text-foreground">{t("cancel")}</Link></div>
        </form>
      </CardContent>
    </Card>}
    {edit && edit !== "new" && !selected && <Alert variant="warning">{t("recordUnavailable")}</Alert>}
  </div>;
}
