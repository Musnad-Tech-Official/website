-- ==============================================================================
-- Musnad Tech — Articles & Media Storage Schema
-- ==============================================================================
-- Description: Complete schema for blog articles, rich content, and Supabase
-- storage bucket for article media (images, embeds).
-- ==============================================================================

-- 1. Create Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,                         -- URL-safe slug e.g. 'nextjs-architecture-guide'
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  excerpt_en TEXT,
  excerpt_ar TEXT,
  content_en JSONB,                                 -- Tiptap ProseMirror JSON (English)
  content_ar JSONB,                                 -- Tiptap ProseMirror JSON (Arabic)
  content_html_en TEXT,                             -- Rendered HTML cache for fast SSR
  content_html_ar TEXT,                             -- Rendered HTML cache for fast SSR
  cover_image TEXT,                                 -- Featured cover image URL
  category TEXT NOT NULL DEFAULT 'Engineering',     -- Display category
  category_slug TEXT NOT NULL DEFAULT 'engineering',
  tags TEXT[] DEFAULT '{}',                         -- Array of tags e.g. ['nextjs', 'architecture']
  layout_variant TEXT NOT NULL DEFAULT 'default' CHECK (layout_variant IN ('default', 'featured')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  read_time_en TEXT DEFAULT '5 min read',
  read_time_ar TEXT DEFAULT '5 دقائق للقراءة',
  author_name TEXT NOT NULL DEFAULT 'Musnad Engineering',
  author_role TEXT DEFAULT 'Core Team',
  author_avatar TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT                                   -- Clerk Admin User ID
);

-- Indexes for ultra-fast lookup
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies for Articles Table
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles" 
  ON public.articles FOR SELECT 
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins full control on articles" ON public.articles;
CREATE POLICY "Admins full control on articles" 
  ON public.articles FOR ALL 
  TO authenticated 
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

-- ==============================================================================
-- 3. Supabase Storage Bucket for Article Images ('article-media')
-- ==============================================================================

-- Create the public bucket if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-media',
  'article-media',
  true,
  10485760, -- 10MB limit per image
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Storage RLS: Admins can view and list article media
-- (Public image downloads via URL work automatically because bucket is marked 'public')
DROP POLICY IF EXISTS "Public can view article media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view and list article media" ON storage.objects;
CREATE POLICY "Admins can view and list article media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'article-media' AND (
      (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
      (auth.jwt() ->> 'role') = 'admin'
    )
  );

-- Storage RLS: Admins can upload images
DROP POLICY IF EXISTS "Admins can upload article media" ON storage.objects;
CREATE POLICY "Admins can upload article media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'article-media' AND (
      (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
      (auth.jwt() ->> 'role') = 'admin'
    )
  );

-- Storage RLS: Admins can delete article media
DROP POLICY IF EXISTS "Admins can delete article media" ON storage.objects;
CREATE POLICY "Admins can delete article media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'article-media' AND (
      (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
      (auth.jwt() ->> 'role') = 'admin'
    )
  );
