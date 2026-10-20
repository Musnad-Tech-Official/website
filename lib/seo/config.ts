import { routing } from "@/i18n/routing";

/** The canonical origin must be stable across requests and deployment previews. */
export function getSiteUrl(): URL {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://musnad.tech");

  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path, credentials, query, or fragment.");
  }

  return url;
}

export function isSiteIndexable(): boolean {
  return process.env.SITE_INDEXABLE !== "false" &&
    process.env.NODE_ENV !== "development" &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
}

export function localizedUrl(locale: string, path = "/"): string {
  const validLocale = routing.locales.find((value) => value === locale);
  if (!validLocale) throw new Error(`Unsupported SEO locale: ${locale}`);
  if (!path.startsWith("/") || path.startsWith("//") || /[?#]/.test(path)) {
    throw new Error("SEO paths must be absolute site paths without a query or fragment.");
  }
  const suffix = path === "/" ? "" : path.replace(/\/+$/, "");
  return new URL(`/${validLocale}${suffix}`, getSiteUrl()).href;
}

export function languageAlternates(path = "/"): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((locale) => [locale, localizedUrl(locale, path)])),
    "x-default": localizedUrl(routing.defaultLocale, path),
  };
}

export function absoluteImageUrl(image?: string): string | undefined {
  if (!image) return undefined;
  try {
    const url = new URL(image, getSiteUrl());
    return ["http:", "https:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
