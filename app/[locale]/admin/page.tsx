import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Alert, Badge } from "@/components/ui";
import { HiOutlineSquares2X2, HiOutlineFolder, HiOutlineNewspaper, HiOutlineCpuChip, HiOutlineInbox, HiOutlineCircleStack } from "react-icons/hi2";
import { Overview } from "./overview";
import { ContentManager } from "./content-manager";
import { TechnologyManager } from "./technology-manager";
import { InquiryManager } from "./inquiry-manager";
import { DatabaseExplorer } from "./database-explorer";

type Section = "overview" | "projects" | "articles" | "technologies" | "inquiries" | "database";
type Query = { section?: string; edit?: string; status?: string; q?: string; page?: string; notice?: string; table?: string; row?: string };
type PageProps = { params: Promise<{ locale: string }>; searchParams: Promise<Query> };
const sections: Section[] = ["overview", "projects", "articles", "technologies", "inquiries", "database"];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AdminDashboard" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AdminDashboard({ params, searchParams }: PageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/" + locale + "/sign-in");
  const metadata = sessionClaims?.metadata;
  if (!metadata || typeof metadata !== "object" || !("role" in metadata) || metadata.role !== "admin") notFound();

  const t = await getTranslations({ locale, namespace: "AdminDashboard" });
  const section: Section = sections.includes(query.section as Section) ? query.section as Section : "overview";
  const notice = query.notice && ["saved", "error", "invalid", "duplicate"].includes(query.notice)
    ? query.notice as "saved" | "error" | "invalid" | "duplicate" : null;
  const nav = [
    { key: "overview", label: t("overview"), Icon: HiOutlineSquares2X2 },
    { key: "projects", label: t("projects"), Icon: HiOutlineFolder },
    { key: "articles", label: t("articles"), Icon: HiOutlineNewspaper },
    { key: "technologies", label: t("technologies"), Icon: HiOutlineCpuChip },
    { key: "inquiries", label: t("inquiries"), Icon: HiOutlineInbox },
    { key: "database", label: t("database"), Icon: HiOutlineCircleStack },
  ] as const;
  const active = nav.find((item) => item.key === section)!;

  return (
    <div className="min-h-full bg-muted/30">
      <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-card p-4 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-e lg:p-6">
          <p className="mb-5 hidden text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground lg:block">{t("workspace")}</p>
          <nav aria-label={t("adminNavigation")} className="flex gap-1 overflow-x-auto lg:flex-col">
            {nav.map((item) => (
              <Link key={item.key} href={"/admin?section=" + item.key} aria-current={section === item.key ? "page" : undefined}
                className={"whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                  (section === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <span className="inline-flex items-center gap-3"><item.Icon aria-hidden="true" className="h-4 w-4 shrink-0" />{item.label}</span>
              </Link>
            ))}
          </nav>
          <p className="mt-8 hidden border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground lg:block">{t("sidebarNote")}</p>
        </aside>
        <div className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <header className="relative mb-7 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div aria-hidden="true" className="absolute -end-12 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <Badge variant="accent">{t("eyebrow")}</Badge>
            <h1 className="relative mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section === "overview" ? t("title") : active.label}</h1>
            <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{t("sectionDescription." + section)}</p>
          </header>
          {notice && <Alert variant={notice === "saved" ? "success" : "destructive"} className="mb-6">{t("notice." + notice)}</Alert>}
          {section === "overview" && <Overview locale={locale} />}
          {(section === "projects" || section === "articles") && <ContentManager locale={locale} kind={section} query={query} />}
          {section === "technologies" && <TechnologyManager locale={locale} query={query} />}
          {section === "inquiries" && <InquiryManager locale={locale} query={query} />}
          {section === "database" && <DatabaseExplorer locale={locale} query={query} />}
        </div>
      </div>
    </div>
  );
}
