\set ON_ERROR_STOP on
-- Only synthetic data, in ephemeral CI Postgres.
-- Broad grants intentionally let actual RLS policies decide access.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON
 public.inquiries, public.services, public.page_settings TO anon, authenticated;

INSERT INTO public.services
 (id, slug, title_en, title_ar, description_en, description_ar, href, is_active)
VALUES
 ('local-active', 'local-active', 'Active', 'نشط', 'fixture', 'اختبار', '/services/local-active', true),
 ('local-hidden', 'local-hidden', 'Hidden', 'مخفي', 'fixture', 'اختبار', '/services/local-hidden', false);

INSERT INTO public.page_settings (id, path, title_en, title_ar, family, status, is_protected)
VALUES ('home', '/', 'Home', 'الرئيسية', 'marketing', 'live', true);

SET ROLE anon;
SELECT set_config('request.jwt.claims', '{}', false);
INSERT INTO public.inquiries (id, name, email, message)
VALUES ('local-anon', 'Synthetic Visitor', 'visitor@example.invalid', 'Synthetic RLS inquiry');

DO $check$
BEGIN
 IF (SELECT count(*) FROM public.inquiries) <> 0 THEN
  RAISE EXCEPTION 'FAIL: anon can read private inquiries';
 END IF;
 IF (SELECT count(*) FROM public.services) <> 1 THEN
  RAISE EXCEPTION 'FAIL: anon can see inactive services';
 END IF;
 IF (SELECT count(*) FROM public.page_settings WHERE id='home') <> 1 THEN
  RAISE EXCEPTION 'FAIL: public page status is not readable';
 END IF;
END $check$;

UPDATE public.services SET title_en='Tampered' WHERE id='local-active';
UPDATE public.page_settings SET status='hidden' WHERE id='home';

RESET ROLE;
DO $check$
BEGIN
 IF (SELECT title_en FROM public.services WHERE id='local-active') <> 'Active' THEN
  RAISE EXCEPTION 'FAIL: anon modified service';
 END IF;
 IF (SELECT status FROM public.page_settings WHERE id='home') <> 'live' THEN
  RAISE EXCEPTION 'FAIL: anon modified page status';
 END IF;
END $check$;

INSERT INTO public.inquiries (id, name, email, message, user_id)
VALUES ('local-member', 'Synthetic Member', 'member@example.invalid',
 'Synthetic owned inquiry', 'user_local_member');

SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"user_local_member"}', false);
DO $check$
BEGIN
 IF (SELECT count(*) FROM public.inquiries) <> 1 THEN
  RAISE EXCEPTION 'FAIL: member not restricted to own inquiry';
 END IF;
 IF (SELECT count(*) FROM public.inquiries WHERE id='local-anon') <> 0 THEN
  RAISE EXCEPTION 'FAIL: member sees other clients';
 END IF;
END $check$;
UPDATE public.inquiries SET status='closed' WHERE id='local-anon';

RESET ROLE;
DO $check$
BEGIN
 IF (SELECT status FROM public.inquiries WHERE id='local-anon') <> 'new' THEN
  RAISE EXCEPTION 'FAIL: member modified another client inquiry';
 END IF;
END $check$;

SET ROLE authenticated;
SELECT set_config('request.jwt.claims',
 '{"sub":"user_local_admin","metadata":{"role":"admin"}}', false);
DO $check$
BEGIN
 IF (SELECT count(*) FROM public.inquiries) <> 2 THEN
  RAISE EXCEPTION 'FAIL: admin cannot list inquiries';
 END IF;
 IF (SELECT count(*) FROM public.services) <> 2 THEN
  RAISE EXCEPTION 'FAIL: admin cannot read hidden services';
 END IF;
END $check$;
UPDATE public.inquiries SET status='in_review' WHERE id='local-anon';
UPDATE public.page_settings SET status='maintenance' WHERE id='home';
UPDATE public.services SET title_en='Admin Edited' WHERE id='local-hidden';

RESET ROLE;
DO $check$
BEGIN
 IF (SELECT status FROM public.inquiries WHERE id='local-anon') <> 'in_review' THEN
  RAISE EXCEPTION 'FAIL: admin inquiry update not persisted';
 END IF;
 IF (SELECT status FROM public.page_settings WHERE id='home') <> 'maintenance' THEN
  RAISE EXCEPTION 'FAIL: admin page update not persisted';
 END IF;
 IF (SELECT title_en FROM public.services WHERE id='local-hidden') <> 'Admin Edited' THEN
  RAISE EXCEPTION 'FAIL: admin service update not persisted';
 END IF;
END $check$;
SELECT 'PASS: local RLS policy smoke tests' AS result;
