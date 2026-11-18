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

SELECT count(*) AS staging_page_settings_count FROM public.page_settings;
