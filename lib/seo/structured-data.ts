import type { Article } from "@/lib/articles/types";
import type { Project } from "@/lib/projects/types";
import type { ServiceItem } from "@/lib/services/types";
import type { TeamMember } from "@/lib/team/types";
import { absoluteImageUrl, getSiteUrl, localizedUrl } from "./config";

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd() {
  const origin = getSiteUrl().origin;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: "Musnad Tech",
    alternateName: "مسند للتقنية",
    url: origin,
    logo: new URL("/brand/logo-light.png", origin).href,
    sameAs: [
      "https://github.com/musnad-tech",
      "https://x.com/musnadtech",
      "https://linkedin.com/company/musnad-tech",
    ],
  };
}

export function websiteJsonLd(locale: string) {
  const origin = getSiteUrl().origin;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: origin,
    name: "Musnad Tech",
    alternateName: "مسند للتقنية",
    inLanguage: locale,
    publisher: { "@id": `${origin}/#organization` },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbsJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(article: Article, locale: string) {
  const url = localizedUrl(locale, `/blog/${encodeURIComponent(article.slug)}`);
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: isAr ? article.titleAr || article.titleEn : article.titleEn || article.titleAr,
    description: isAr ? article.excerptAr || article.excerptEn : article.excerptEn || article.excerptAr,
    image: absoluteImageUrl(article.coverImage),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: locale,
    author: { "@type": "Person", name: article.authorName },
    publisher: { "@id": `${getSiteUrl().origin}/#organization` },
  };
}

export function projectJsonLd(project: Project, locale: string) {
  const url = localizedUrl(locale, `/projects/${encodeURIComponent(project.slug)}`);
  const isAr = locale === "ar";
  const origin = getSiteUrl().origin;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#project`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    name: isAr ? project.titleAr || project.titleEn : project.titleEn || project.titleAr,
    description: isAr ? project.descriptionAr || project.descriptionEn : project.descriptionEn || project.descriptionAr,
    image: absoluteImageUrl(project.image || project.coverImage),
    applicationCategory: "BusinessApplication",
    inLanguage: locale,
    author: { "@id": `${origin}/#organization` },
    publisher: { "@id": `${origin}/#organization` },
    ...(project.liveDemoUrl ? { installUrl: project.liveDemoUrl } : {}),
  };
}

export function serviceJsonLd(service: ServiceItem, locale: string) {
  const url = localizedUrl(locale, `/services/${encodeURIComponent(service.slug)}`);
  const isAr = locale === "ar";
  const origin = getSiteUrl().origin;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    name: isAr ? service.titleAr || service.titleEn : service.titleEn || service.titleAr,
    description: isAr ? service.descriptionAr || service.descriptionEn : service.descriptionEn || service.descriptionAr,
    provider: { "@id": `${origin}/#organization` },
    inLanguage: locale,
  };
}

export function personJsonLd(member: TeamMember, locale: string) {
  const url = localizedUrl(locale, `/team/${encodeURIComponent(member.slug)}`);
  const isAr = locale === "ar";
  const origin = getSiteUrl().origin;
  const sameAs: string[] = [];
  if (member.socialLinks) {
    if (member.socialLinks.linkedin) sameAs.push(member.socialLinks.linkedin);
    if (member.socialLinks.github) sameAs.push(member.socialLinks.github);
    if (member.socialLinks.x) sameAs.push(member.socialLinks.x);
    if (member.socialLinks.website) sameAs.push(member.socialLinks.website);
  }
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: locale,
    mainEntity: {
      "@type": "Person",
      name: isAr ? member.nameAr : member.nameEn,
      jobTitle: isAr ? member.roleAr : member.roleEn,
      description: isAr ? member.bioAr : member.bioEn,
      image: absoluteImageUrl(member.image),
      worksFor: { "@id": `${origin}/#organization` },
      ...(sameAs.length > 0 ? { sameAs } : {}),
    },
  };
}

export interface FaqQuestionAnswer {
  question: string;
  answer: string;
}

export function faqJsonLd(items: FaqQuestionAnswer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface JobPostingData {
  title: string;
  description: string;
  department?: string;
  employmentType?: string;
  location?: string;
  datePosted?: string;
  validThrough?: string;
}

export function jobPostingJsonLd(job: JobPostingData, locale: string) {
  const origin = getSiteUrl().origin;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted || "2026-01-01",
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: job.employmentType || "FULL_TIME",
    hiringOrganization: { "@id": `${origin}/#organization` },
    inLanguage: locale,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Sana'a / Remote",
        addressCountry: "YE",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Yemen",
    },
    jobLocationType: "TELECOMMUTE",
  };
}

export function aboutPageJsonLd(locale: string) {
  const url = localizedUrl(locale, "/about");
  const origin = getSiteUrl().origin;
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#about`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: locale,
    mainEntity: { "@id": `${origin}/#organization` },
  };
}

export function contactPageJsonLd(locale: string) {
  const url = localizedUrl(locale, "/contact");
  const origin = getSiteUrl().origin;
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#contact`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: locale,
    mainEntity: { "@id": `${origin}/#organization` },
  };
}
