import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Alert, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, Select } from "@/components/ui";
import { createClient } from "@/utils/supabase/server";
import { updateInquiry } from "./actions";

type Query = { edit?: string; status?: string; page?: string };
type Row = {
  id: string; name: string; email: string; phone: string | null; company: string | null;
  subject: string | null; message: string; inquiry_type: string; status: string; created_at: string;
};
const statuses = ["new", "in_progress", "resolved", "closed"] as const;

export async function InquiryManager({ locale, query }: { locale: string; query: Query }) {
  const t = await getTranslations({ locale, namespace: "AdminDashboard" });
  const supabase = await createClient();
  const filter = statuses.includes(query.status as typeof statuses[number]) ? query.status! : "all";
  const page = Math.max(1, Math.min(1000, Number.parseInt(query.page ?? "1", 10) || 1));
  const edit = query.edit ?? "";
  const select = "id,name,email,phone,company,subject,message,inquiry_type,status,created_at";
  let request = supabase.from("inquiries").select(select, { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * 20, page * 20 - 1);
  if (filter !== "all") request = request.eq("status", filter);
  const [list, detail] = await Promise.all([
    request,
    edit ? supabase.from("inquiries").select(select).eq("id", edit).maybeSingle() : Promise.resolve(null),
  ]);
  const rows = (list.data ?? []) as Row[];
  const selected = detail?.data as Row | null;
  const date = (value: string) => new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" }).format(new Date(value));
  const statusLabel = (value: string) => value === "in_progress" ? t("status.in_progress") : value === "resolved" ? t("status.resolved") : value === "closed" ? t("status.closed") : t("status.new");
  const pageHref = (number: number) => "/admin?section=inquiries&page=" + number + (filter !== "all" ? "&status=" + filter : "");

  return <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
    <Card className="min-w-0">
      <CardHeader><CardTitle>{t("inquiries")}</CardTitle><CardDescription>{t("recordCount", { count: list.count ?? 0 })}</CardDescription></CardHeader>
      <CardContent>
        <form method="get" action={"/" + locale + "/admin"} className="mb-5 flex flex-wrap items-end gap-3"><input type="hidden" name="section" value="inquiries" /><Select name="status" defaultValue={filter} label={t("filterStatus")} containerClassName="min-w-44 flex-1"><option value="all">{t("allStatuses")}</option>{statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</Select><Button type="submit" variant="outline">{t("filter")}</Button></form>
        {list.error ? <Alert variant="warning">{t("sectionLoadError")}</Alert> : !rows.length ? <EmptyState title={t("emptyInquiries")} className="my-0" /> : <ul className="divide-y divide-border">{rows.map((row) =>
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="truncate font-medium text-foreground">{row.subject || row.name}</p><p className="truncate text-xs text-muted-foreground">{row.name} · {row.email} · {date(row.created_at)}</p></div><div className="flex items-center gap-3"><Badge variant={row.status === "new" ? "warning" : row.status === "resolved" ? "success" : "secondary"}>{statusLabel(row.status)}</Badge><Link href={"/admin?section=inquiries&edit=" + row.id} className="text-sm font-medium text-primary hover:underline">{t("view")}</Link></div></li>
        )}</ul>}
        <div className="mt-5 flex items-center justify-between gap-3 text-sm"><span className="text-muted-foreground">{t("pageOf", { page, pages: Math.max(1, Math.ceil((list.count ?? 0) / 20)) })}</span><div className="flex gap-3">{page > 1 && <Link href={pageHref(page - 1)} className="font-medium text-primary hover:underline">{t("previous")}</Link>}{(list.count ?? 0) > page * 20 && <Link href={pageHref(page + 1)} className="font-medium text-primary hover:underline">{t("next")}</Link>}</div></div>
      </CardContent>
    </Card>
    {selected && <Card className="h-fit"><CardHeader><CardTitle>{selected.subject || t("inquiryDetails")}</CardTitle><CardDescription>{date(selected.created_at)}</CardDescription></CardHeader><CardContent className="space-y-5 text-sm">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <dt className="text-muted-foreground">{t("name")}</dt><dd className="break-words">{selected.name}</dd>
        <dt className="text-muted-foreground">{t("email")}</dt><dd className="break-all"><a href={"mailto:" + selected.email} className="text-primary hover:underline">{selected.email}</a></dd>
        {selected.phone && <><dt className="text-muted-foreground">{t("phone")}</dt><dd>{selected.phone}</dd></>}
        {selected.company && <><dt className="text-muted-foreground">{t("company")}</dt><dd>{selected.company}</dd></>}
        <dt className="text-muted-foreground">{t("type")}</dt><dd>{selected.inquiry_type}</dd>
      </dl>
      <div><h3 className="mb-2 font-semibold">{t("message")}</h3><p className="whitespace-pre-wrap rounded-lg bg-muted p-4 leading-relaxed">{selected.message}</p></div>
      <form action={updateInquiry} className="space-y-3"><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={selected.id} /><Select name="status" label={t("statusLabel")} defaultValue={selected.status}>{statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</Select><Button type="submit" fullWidth>{t("updateStatus")}</Button></form>
    </CardContent></Card>}
    {edit && !selected && <Alert variant="warning">{t("recordUnavailable")}</Alert>}
  </div>;
}
