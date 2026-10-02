import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, Input } from "@/components/ui";
import { createClient } from "@/utils/supabase/server";
import { saveTechnology } from "./actions";

type Query = { edit?: string; q?: string; page?: string };
type Row = { id: string; slug: string; name: string; icon_key: string | null; created_at: string };

export async function TechnologyManager({ locale, query }: { locale: string; query: Query }) {
  const t = await getTranslations({ locale, namespace: "AdminDashboard" });
  const supabase = await createClient();
  const q = (query.q ?? "").trim().slice(0, 80);
  const page = Math.max(1, Math.min(1000, Number.parseInt(query.page ?? "1", 10) || 1));
  const edit = query.edit ?? "";
  let request = supabase.from("technologies").select("id,slug,name,icon_key,created_at", { count: "exact" }).order("name").range((page - 1) * 20, page * 20 - 1);
  if (q) request = request.ilike("name", "%" + q + "%");
  const [list, detail] = await Promise.all([
    request,
    edit && edit !== "new" ? supabase.from("technologies").select("id,slug,name,icon_key,created_at").eq("id", edit).maybeSingle() : Promise.resolve(null),
  ]);
  const rows = (list.data ?? []) as Row[];
  const selected = detail?.data as Row | null;
  const pageHref = (number: number) => "/admin?section=technologies&page=" + number + (q ? "&q=" + encodeURIComponent(q) : "");

  return <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(320px,390px)]">
    <Card className="min-w-0">
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>{t("technologies")}</CardTitle><CardDescription className="mt-2">{t("recordCount", { count: list.count ?? 0 })}</CardDescription></div><Link href="/admin?section=technologies&edit=new" className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-95">{t("createNew")}</Link></CardHeader>
      <CardContent>
        <form method="get" action={"/" + locale + "/admin"} className="mb-5 flex flex-wrap gap-3"><input type="hidden" name="section" value="technologies" /><Input name="q" defaultValue={q} placeholder={t("searchName")} aria-label={t("searchName")} containerClassName="min-w-44 flex-1" /><Button type="submit" variant="outline">{t("filter")}</Button></form>
        {list.error ? <Alert variant="warning">{t("sectionLoadError")}</Alert> : !rows.length ? <EmptyState title={t("emptyTechnologies")} className="my-0" /> : <ul className="divide-y divide-border">{rows.map((row) =>
          <li key={row.id} className="flex items-center justify-between gap-4 py-3"><div className="min-w-0"><p className="font-medium text-foreground">{row.name}</p><p className="truncate text-xs text-muted-foreground" dir="ltr">{row.slug}{row.icon_key ? " · " + row.icon_key : ""}</p></div><Link href={"/admin?section=technologies&edit=" + row.id} className="text-sm font-medium text-primary hover:underline">{t("edit")}</Link></li>
        )}</ul>}
        <div className="mt-5 flex items-center justify-between gap-3 text-sm"><span className="text-muted-foreground">{t("pageOf", { page, pages: Math.max(1, Math.ceil((list.count ?? 0) / 20)) })}</span><div className="flex gap-3">{page > 1 && <Link href={pageHref(page - 1)} className="font-medium text-primary hover:underline">{t("previous")}</Link>}{(list.count ?? 0) > page * 20 && <Link href={pageHref(page + 1)} className="font-medium text-primary hover:underline">{t("next")}</Link>}</div></div>
      </CardContent>
    </Card>
    {(edit === "new" || selected) && <Card className="h-fit"><CardHeader><CardTitle>{selected ? t("editTechnology") : t("newTechnology")}</CardTitle><CardDescription>{t("technologyHelp")}</CardDescription></CardHeader><CardContent>
      <form action={saveTechnology} className="space-y-4">
        <input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={selected?.id ?? ""} />
        <Input name="name" label={t("name")} defaultValue={selected?.name} required maxLength={180} />
        <Input name="slug" label={t("slug")} defaultValue={selected?.slug} required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" dir="ltr" />
        <Input name="icon_key" label={t("iconKey")} defaultValue={selected?.icon_key ?? ""} maxLength={100} dir="ltr" />
        <div className="flex gap-2"><Button type="submit">{t("save")}</Button><Link href="/admin?section=technologies" className="inline-flex min-h-10 items-center px-3 text-sm text-muted-foreground hover:text-foreground">{t("cancel")}</Link></div>
      </form>
    </CardContent></Card>}
    {edit && edit !== "new" && !selected && <Alert variant="warning">{t("recordUnavailable")}</Alert>}
  </div>;
}
