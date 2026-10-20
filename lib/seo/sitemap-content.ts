import "server-only";
import { createClient } from "@supabase/supabase-js";
import { MASTER_PAGE_INVENTORY } from "@/lib/page-control/inventory";
import type { SitemapContent, SitemapContentRow, SitemapPageSetting } from "./sitemap";

export async function getSitemapContent(): Promise<SitemapContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase public configuration is required to generate the sitemap.");

  // Never attach a Clerk session: the sitemap must only see anonymous, RLS-visible data.
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  async function readRows<T>(table: string, columns: string, filter?: [string, string | boolean]): Promise<T[]> {
    const rows: T[] = [];
    const pageSize = 1000;
    for (let offset = 0; ; offset += pageSize) {
      let query = client.from(table).select(columns).order("id").range(offset, offset + pageSize - 1);
      if (filter) query = query.eq(filter[0], filter[1]);
      const { data, error } = await query;
      // Return an error instead of publishing a misleading, incomplete sitemap.
      if (error) throw new Error(`Could not generate sitemap: ${table}: ${error.message}`);
      rows.push(...(data as unknown as T[]));
      if (data.length < pageSize) return rows;
    }
  }

  const [articles, projects, services, team, settings] = await Promise.all([
    readRows<SitemapContentRow>("articles", "slug,updated_at", ["status", "published"]),
    readRows<SitemapContentRow>("projects", "slug,updated_at", ["status", "published"]),
    readRows<SitemapContentRow>("services", "slug,updated_at", ["is_active", true]),
    readRows<SitemapContentRow>("team_members", "slug,updated_at", ["is_active", true]),
    readRows<SitemapPageSetting>("page_settings", "path,status"),
  ]);

  return {
    articles, projects, services, team,
    pages: [...MASTER_PAGE_INVENTORY.map(({ path, status }) => ({ path, status })), ...settings]
      .filter((page, index, pages) => pages.findLastIndex((item) => item.path === page.path) === index),
  };
}
