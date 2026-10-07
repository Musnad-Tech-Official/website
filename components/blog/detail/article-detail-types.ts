import type { BlogArticle } from "../blog-types";

export type ArticleContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id?: string }
  | { type: "quote"; text: string; attribution?: string }
  | {
      type: "callout";
      title?: string;
      text: string;
      variant?: "info" | "warning" | "success";
    }
  | { type: "code"; language?: string; code: string; filename?: string }
  | { type: "list"; style: "ordered" | "unordered"; items: string[] }
  | {
      type: "media";
      visualKey?: string;
      caption?: string;
      previewGradient?: string;
    };

export interface ArticleTocItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

export interface ArticleAuthorData {
  id?: string;
  slug?: string;
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
  initials?: string;
  topics?: string[];
}

export interface ArticleCitationData {
  apa: string;
  mla: string;
  chicago: string;
  bibtex: string;
}

export interface ArticleHeroData {
  visualKey?: string;
  caption?: string;
  previewGradient?: string;
}

export interface ArticleDetailData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  categorySlug?: string;
  publishedAt?: string;
  readTime?: string;
  coverImage?: string;
  author?: ArticleAuthorData;
  hero?: ArticleHeroData;
  toc?: ArticleTocItem[];
  tableOfContents?: ArticleTocItem[];
  intro?: string[];
  content?: ArticleContentBlock[];
  blocks?: ArticleContentBlock[];
  contentHtml?: string;
  tags?: string[];
  citation?: ArticleCitationData;
}

export type { BlogArticle };

export interface ArticleDetailHeaderProps {
  title: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
  author?: ArticleAuthorData;
  publishedAt?: string;
  readTime?: string;
  homeLabel: string;
  blogLabel: string;
  breadcrumbLabel?: string;
  className?: string;
}

export interface ArticleContentRendererProps {
  blocks?: ArticleContentBlock[];
  className?: string;
}

export interface ArticleTableOfContentsProps {
  items?: ArticleTocItem[];
  title?: string;
  className?: string;
}

export type ArticleFontSize = "sm" | "base" | "lg";

export interface ArticleFontSizeControlProps {
  fontSize: ArticleFontSize;
  onFontSizeChange: (size: ArticleFontSize) => void;
  className?: string;
}

export interface ArticleCitationProps {
  title?: string;
  slug?: string;
  citation?: ArticleCitationData;
  className?: string;
}

export interface ArticleSidebarShareProps {
  title: string;
  slug: string;
  className?: string;
}

export interface ArticleSidebarNewsletterProps {
  className?: string;
}

export interface ArticleAuthorBioProps {
  author?: ArticleAuthorData;
  className?: string;
}

export interface ArticleShareBoxProps {
  title: string;
  slug: string;
  className?: string;
}

export interface ArticleDetailRelatedProps {
  articles: BlogArticle[];
  title?: string;
  viewAllLabel?: string;
  className?: string;
}

import type { ArticleComment } from "@/lib/comments/types";

export interface ArticleDetailCommentsProps {
  articleId?: string;
  articleSlug: string;
  initialComments?: ArticleComment[];
  authorName?: string;
  className?: string;
}

export interface ArticleBackToTopProps {
  label?: string;
  className?: string;
}

export interface ArticleDetailBodyProps {
  article: ArticleDetailData;
  className?: string;
}
