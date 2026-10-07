export interface BlogAuthor {
  id?: string;
  name: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author?: BlogAuthor;
  category?: string;
  categorySlug?: string;
  tags?: string[];
  publishedAt?: string;
  readTime?: string;
  coverImage?: string;
  layoutVariant?: "default" | "featured";
  visualKey?: string;
  previewGradient?: string;
}

export interface BlogHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  homeLabel: string;
  blogLabel: string;
  breadcrumbLabel?: string;
  className?: string;
}

export interface ArticleCardProps {
  article: BlogArticle;
  className?: string;
}

export interface FeaturedArticleCardProps {
  article: BlogArticle;
  className?: string;
}

export interface BlogFilterState {
  search: string;
}

export interface BlogFilterProps {
  filterState: BlogFilterState;
  onFilterChange: (search: string) => void;
  onReset?: () => void;
  className?: string;
}

export interface BlogGridProps {
  articles: BlogArticle[];
  heading?: string;
  className?: string;
}

export interface BlogExplorerProps {
  articles: BlogArticle[];
  className?: string;
}

export interface BlogNewsletterProps {
  className?: string;
}
