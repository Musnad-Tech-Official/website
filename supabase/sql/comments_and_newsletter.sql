-- ==============================================================================
-- Musnad Tech — Article Comments & Newsletter Subscriptions Schema
-- ==============================================================================
-- Description: Database schema for article discussion comments and email newsletter
-- subscriptions, complete with indexes and Row Level Security (RLS) policies.
-- ==============================================================================

-- 1. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'article_sidebar',
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for newsletter lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
  ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status 
  ON public.newsletter_subscribers(status);

-- Enable RLS for newsletter subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Newsletter RLS: Anyone can subscribe
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Newsletter RLS: Admins have full access
DROP POLICY IF EXISTS "Admins full control on newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins full control on newsletter subscribers"
  ON public.newsletter_subscribers FOR ALL
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
-- 2. Create Article Comments Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  article_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,                         -- Clerk User ID
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  user_role TEXT NOT NULL DEFAULT 'member',
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'flagged', 'deleted')),
  parent_id UUID REFERENCES public.article_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for comment lookups and ordering
CREATE INDEX IF NOT EXISTS idx_article_comments_article_slug 
  ON public.article_comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_article_comments_article_id 
  ON public.article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_parent_id 
  ON public.article_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_created_at 
  ON public.article_comments(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_article_comments_status 
  ON public.article_comments(status);

-- Enable RLS for article comments
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Comments RLS: Public can view approved comments
DROP POLICY IF EXISTS "Public can view approved comments" ON public.article_comments;
CREATE POLICY "Public can view approved comments"
  ON public.article_comments FOR SELECT
  USING (status = 'approved');

-- Comments RLS: Authenticated users can post comments
DROP POLICY IF EXISTS "Authenticated users can post comments" ON public.article_comments;
CREATE POLICY "Authenticated users can post comments"
  ON public.article_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() IS NOT NULL
  );

-- Comments RLS: Users can delete/update their own comments or admins can manage all
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.article_comments;
CREATE POLICY "Users can delete their own comments"
  ON public.article_comments FOR UPDATE
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub') OR
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );
