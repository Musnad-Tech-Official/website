import type {
  ArticleDetailData,
  ArticleContentBlock,
  ArticleTocItem,
  ArticleAuthorData,
  ArticleCitationData,
  ArticleHeroData,
} from "@/data/article-details";
import type { BlogArticle } from "@/data/blog";

export type {
  ArticleDetailData,
  ArticleContentBlock,
  ArticleTocItem,
  ArticleAuthorData,
  ArticleCitationData,
  ArticleHeroData,
};

export interface ArticleDetailHeaderProps {
  title: string;
  excerpt: string;
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

export interface ArticleDetailCommentsProps {
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
