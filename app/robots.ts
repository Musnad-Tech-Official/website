import type { MetadataRoute } from "next";
import { getSiteUrl, isSiteIndexable } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  if (!isSiteIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    // Auth/internal HTML uses noindex, so crawlers must be able to read those tags.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/__clerk/"] },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).href,
    host: getSiteUrl().origin,
  };
}
