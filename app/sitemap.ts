import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { isSiteIndexable } from "@/lib/seo/config";
import { buildSitemap } from "@/lib/seo/sitemap";
import { getSitemapContent } from "@/lib/seo/sitemap-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  if (!isSiteIndexable()) return [];
  return buildSitemap(await getSitemapContent());
}
