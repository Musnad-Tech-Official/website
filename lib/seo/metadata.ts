import type { Metadata } from "next";
import { absoluteImageUrl, getSiteUrl, isSiteIndexable, languageAlternates, localizedUrl } from "./config";

export interface PageMetadataOptions {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  index?: boolean;
  keywords?: string[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author: string;
    tags?: string[];
    section?: string;
  };
}

export function createPageMetadata({
  locale, path, title, description, image, index = true, keywords, article,
}: PageMetadataOptions): Metadata {
  const url = localizedUrl(locale, path);
  const indexable = index && isSiteIndexable();
  const cleanDescription = description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const customImage = absoluteImageUrl(image);
  const images = [{
    url: customImage || new URL("/og", getSiteUrl()).href,
    alt: title,
    ...(!customImage ? { width: 1200, height: 630, type: "image/png" } : {}),
  }];

  return {
    // Existing translations already include the brand; preserve them exactly once.
    title: { absolute: title },
    description: cleanDescription,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    authors: article ? [{ name: article.author }] : [{ name: "Musnad Tech", url: getSiteUrl().origin }],
    creator: "Musnad Tech",
    publisher: "Musnad Tech",
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title,
      description: cleanDescription,
      url,
      siteName: "Musnad Tech",
      locale: locale === "ar" ? "ar_YE" : "en_US",
      alternateLocale: [locale === "ar" ? "en_US" : "ar_YE"],
      images,
      ...(article ? {
        type: "article" as const,
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: [article.author],
        tags: article.tags,
        section: article.section,
      } : { type: "website" as const }),
    },
    twitter: { card: "summary_large_image", title, description: cleanDescription, images },
    robots: {
      index: indexable,
      follow: true,
      googleBot: indexable ? {
        index: true, follow: true,
        "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1,
      } : { index: false, follow: true },
    },
  };
}
