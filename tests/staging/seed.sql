-- STAGING BRANCH ONLY: NEVER EXECUTE AGAINST zlqfoymxladqwkfliuko.
-- Deliberately does not copy production users, clients, projects, or inquiries.
-- The app requires at least one persisted page_settings row after fallback removal.

INSERT INTO public.page_settings
  (id, path, title_en, title_ar, family, status, is_protected,
   show_in_navbar, show_in_footer)
VALUES
  ('home', '/', 'Home', 'الرئيسية', 'marketing', 'live', true, true, true)
ON CONFLICT (id) DO NOTHING;

-- A single disposable, non-protected route lets the CI verify visibility rules.
-- It is NOT production content and is never copied to a hosted database.
INSERT INTO public.page_settings
  (id, path, title_en, title_ar, family, status, is_protected,
   show_in_navbar, show_in_footer)
VALUES
  ('contact', '/contact', 'Contact CI Route', 'صفحة تواصل اختبارية', 'support', 'live', false, false, false)
ON CONFLICT (id) DO NOTHING;


-- Local Storage only: generated private repository schema must NOT create
-- public user-upload buckets in the hosted Supabase project by accident.
-- Both buckets are disposable with the Docker-backed CI database.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('article-media', 'article-media', true),
  ('project-media', 'project-media', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "CI synthetic admins upload media" ON storage.objects;
CREATE POLICY "CI synthetic admins upload media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('article-media', 'project-media')
    AND (auth.jwt() -> 'metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "CI public can view media" ON storage.objects;
CREATE POLICY "CI public can view media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('article-media', 'project-media'));

SELECT count(*) AS staging_page_settings_count FROM public.page_settings;
