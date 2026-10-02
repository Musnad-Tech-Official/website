export type ArticleStatus = "draft" | "published" | "archived";
export type ArticleLayout = "default" | "featured";

export interface Article {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentHtmlEn: string;
  contentHtmlAr: string;
  contentEn?: unknown;
  contentAr?: unknown;
  coverImage?: string;
  category: string;
  categorySlug: string;
  tags: string[];
  layoutVariant: ArticleLayout;
  status: ArticleStatus;
  readTimeEn: string;
  readTimeAr: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface ArticleFormData {
  id?: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentHtmlEn: string;
  contentHtmlAr: string;
  coverImage?: string;
  category: string;
  categorySlug?: string;
  tags: string[];
  layoutVariant: ArticleLayout;
  status: ArticleStatus;
  readTimeEn?: string;
  readTimeAr?: string;
  authorName?: string;
  authorRole?: string;
}
