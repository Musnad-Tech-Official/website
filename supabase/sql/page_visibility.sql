-- ==============================================================================
-- Musnad Tech — Page Visibility & Route Control System
-- ==============================================================================
-- Description: Allows administrators to control the visibility, navigation presence,
-- and maintenance status of all pages across the website.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.page_settings (
  id TEXT PRIMARY KEY,                       -- Unique route slug (e.g. 'about', 'services', 'blog')
  path TEXT NOT NULL UNIQUE,                 -- Absolute site path (e.g. '/about', '/services', '/blog')
  title_en TEXT NOT NULL,                    -- English title
  title_ar TEXT NOT NULL,                    -- Arabic title
  family TEXT NOT NULL,                      -- Grouping ('marketing', 'services', 'projects', 'blog', 'careers', 'support', 'legal', 'account')
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'maintenance', 'hidden')),
  show_in_navbar BOOLEAN NOT NULL DEFAULT true,
  show_in_footer BOOLEAN NOT NULL DEFAULT true,
  maintenance_notice_en TEXT,                -- Custom maintenance message in English
  maintenance_notice_ar TEXT,                -- Custom maintenance message in Arabic
  is_protected BOOLEAN NOT NULL DEFAULT false, -- If true, page cannot be completely hidden (e.g. Home)
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT                            -- Clerk User ID of the administrator
);

-- Indexes for ultra-fast lookup by path and status
CREATE INDEX IF NOT EXISTS idx_page_settings_path ON public.page_settings (path);
CREATE INDEX IF NOT EXISTS idx_page_settings_status ON public.page_settings (status);
CREATE INDEX IF NOT EXISTS idx_page_settings_family ON public.page_settings (family);

-- Enable Row Level Security (RLS)
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy:
-- Any visitor or server component can read page status so the site can conditionally render or hide pages.
DROP POLICY IF EXISTS "Public can view page settings" ON public.page_settings;
CREATE POLICY "Public can view page settings"
  ON public.page_settings
  FOR SELECT
  USING (true);

-- 2. Admin Write Policy:
-- Only authenticated users with Clerk role 'admin' can insert, update, or delete page settings.
DROP POLICY IF EXISTS "Admins can update page settings" ON public.page_settings;
CREATE POLICY "Admins can update page settings"
  ON public.page_settings
  FOR ALL
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
-- Initial Seed Data: Populating from Master Page Inventory
-- ==============================================================================
INSERT INTO public.page_settings (id, path, title_en, title_ar, family, status, show_in_navbar, show_in_footer, is_protected, maintenance_notice_en, maintenance_notice_ar)
VALUES
  ('home', '/', 'Home', 'الرئيسية', 'marketing', 'live', true, true, true, 'Our home page is receiving routine system updates. Please check back shortly.', 'الصفحة الرئيسية تخضع لعمليات تحديث دورية. يرجى العودة قريباً.'),
  ('about', '/about', 'About Musnad', 'عن مسند للتقنية', 'marketing', 'live', true, true, false, 'We are currently updating our company profile and story.', 'نقوم حالياً بتحديث الملف التعريفي وقصة الشركة.'),
  ('team', '/team', 'Team & Leadership', 'فريق العمل والقيادة', 'marketing', 'live', true, true, false, 'Our team roster is currently being refreshed.', 'يتم تحديث قائمة فريق العمل حالياً.'),
  ('services', '/services', 'Services Hub', 'نظرة عامة على الخدمات', 'services', 'live', true, true, false, 'Our capabilities catalog is undergoing maintenance.', 'دليل الخدمات والقدرات يخضع للصيانة حالياً.'),
  ('service-product-engineering', '/services/product-engineering', 'Product Engineering', 'هندسة المنتجات', 'services', 'live', false, false, false, NULL, NULL),
  ('service-platform-infrastructure', '/services/platform-infrastructure', 'Platform & Infrastructure', 'المنصات والبنية التحتية', 'services', 'live', false, false, false, NULL, NULL),
  ('service-data-engineering', '/services/data-engineering', 'Data Engineering', 'هندسة البيانات', 'services', 'live', false, false, false, NULL, NULL),
  ('service-developer-tools', '/services/developer-tools', 'Developer Tools', 'أدوات المطورين', 'services', 'live', false, false, false, NULL, NULL),
  ('service-ai-integration', '/services/ai-integration', 'AI Integration', 'تكامل الذكاء الاصطناعي', 'services', 'live', false, false, false, NULL, NULL),
  ('service-design-engineering', '/services/design-engineering', 'Design Engineering', 'هندسة التصميم', 'services', 'live', false, false, false, NULL, NULL),
  ('projects', '/projects', 'Projects Portfolio', 'محفظة المشاريع', 'projects', 'live', true, true, false, 'Our project showcase is being refreshed with new client deliverables.', 'معرض المشاريع يخضع للتحديث بمشاريع جديدة.'),
  ('project-sahim-analytics', '/projects/sahim-analytics', 'Sahim Analytics', 'تحليلات سهم', 'projects', 'live', false, false, false, NULL, NULL),
  ('project-naft-deploy', '/projects/naft-deploy', 'Naft Deploy', 'نظام نفت ديبلوي', 'projects', 'live', false, false, false, NULL, NULL),
  ('project-rakeen-portal', '/projects/rakeen-portal', 'Rakeen Portal', 'بوابة ركين', 'projects', 'live', false, false, false, NULL, NULL),
  ('project-musnad-cli', '/projects/musnad-cli', 'Musnad CLI', 'أداة مسند للطرفية', 'projects', 'live', false, false, false, NULL, NULL),
  ('project-wathq-observability', '/projects/wathq-observability', 'Wathq Observability', 'منظومة وثق للرصد', 'projects', 'live', false, false, false, NULL, NULL),
  ('project-hudhud-chat', '/projects/hudhud-chat', 'Hudhud Chat', 'منصة هدهد للمحادثة', 'projects', 'live', false, false, false, NULL, NULL),
  ('blog', '/blog', 'Technical Blog', 'المدونة التقنية', 'blog', 'live', true, true, false, 'Our engineering publication is undergoing maintenance.', 'منصة التدوين الهندسي تخضع لأعمال الصيانة المجدولة.'),
  ('careers', '/careers', 'Careers & Jobs', 'الوظائف وفرص العمل', 'careers', 'live', false, true, false, 'Our job listings are being refreshed for the next hiring cycle.', 'يتم تحديث قائمة الوظائف الشاغرة لدورة التوظيف القادمة.'),
  ('contact', '/contact', 'Contact & Consultations', 'تواصل معنا والاستشارات', 'support', 'live', false, true, false, 'Our contact desk is undergoing maintenance. Please reach out via email directly.', 'بوابة التواصل تخضع للصيانة حالياً. يرجى التواصل عبر البريد الإلكتروني مباشرة.'),
  ('faq', '/faq', 'Frequently Asked Questions', 'الأسئلة الشائعة', 'support', 'live', false, true, false, 'FAQ knowledge base is being refreshed.', 'قاعدة بيانات الأسئلة الشائعة قيد التحديث.'),
  ('legal-privacy', '/legal/privacy-policy', 'Privacy Policy', 'سياسة الخصوصية', 'legal', 'live', false, true, false, NULL, NULL),
  ('legal-terms', '/legal/terms-of-service', 'Terms of Service', 'شروط الخدمة', 'legal', 'live', false, true, false, NULL, NULL),
  ('legal-cookies', '/legal/cookie-policy', 'Cookie Policy', 'سياسة ملفات تعريف الارتباط', 'legal', 'live', false, true, false, NULL, NULL),
  ('account', '/account', 'Account Portal', 'بوابة الحساب', 'account', 'live', false, false, false, 'Account services are temporarily undergoing scheduled system upgrades.', 'خدمات الحساب تخضع لترقية دورية مجدولة للأنظمة.')
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  family = EXCLUDED.family;
