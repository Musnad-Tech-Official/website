-- Run once against existing databases after verifying Clerk JWT authorization and backup.
-- Safe to re-run; only changes policies, not rows.
BEGIN;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;
-- Restrict public access to approved comments; never allow anonymous writes or moderation.
-- Policy changes are idempotent and also remove the legacy permissive policies.
DROP POLICY IF EXISTS "Allow select comments" ON public.article_comments;
DROP POLICY IF EXISTS "Allow insert comments" ON public.article_comments;
DROP POLICY IF EXISTS "Allow update comments" ON public.article_comments;
DROP POLICY IF EXISTS "Allow delete comments" ON public.article_comments;
DROP POLICY IF EXISTS "Users and admins can update comments" ON public.article_comments;
DROP POLICY IF EXISTS "Users and admins can delete comments" ON public.article_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.article_comments;
DROP POLICY IF EXISTS "Authenticated users can post comments" ON public.article_comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON public.article_comments;
DROP POLICY IF EXISTS "Comment owners and admins can read comments" ON public.article_comments;
DROP POLICY IF EXISTS "Authenticated users can post their own comments" ON public.article_comments;
DROP POLICY IF EXISTS "Admins can moderate comments" ON public.article_comments;
DROP POLICY IF EXISTS "Comment owners and admins can delete comments" ON public.article_comments;

CREATE POLICY "Public can view approved comments"
  ON public.article_comments FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Comment owners and admins can read comments"
  ON public.article_comments FOR SELECT
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub') OR
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Authenticated users can post their own comments"
  ON public.article_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'sub') IS NOT NULL AND
    user_id = (auth.jwt() ->> 'sub') AND
    status IN ('approved', 'pending')
  );

-- The application has no author-edit action; moderation changes are administrator-only.
CREATE POLICY "Admins can moderate comments"
  ON public.article_comments FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Comment owners and admins can delete comments"
  ON public.article_comments FOR DELETE
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub') OR
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

COMMIT;
