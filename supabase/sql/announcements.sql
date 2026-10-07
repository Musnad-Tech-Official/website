-- ==============================================================================
-- Musnad Tech — Global Announcement Banners Schema
-- ==============================================================================
-- Description: Schema for managing global top announcement banners (broadcasts)
-- pushed by administrators for new projects, services, tools, and updates.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,                              -- Slug / ID e.g. 'banner-1718293'
  category TEXT NOT NULL DEFAULT 'general',         -- 'projects' | 'services' | 'tools' | 'general'
  text_en TEXT NOT NULL,
  text_ar TEXT NOT NULL,
  tag_en TEXT NOT NULL DEFAULT 'New',
  tag_ar TEXT NOT NULL DEFAULT 'جديد',
  link_text_en TEXT NOT NULL DEFAULT 'Explore Now',
  link_text_ar TEXT NOT NULL DEFAULT 'استكشف الآن',
  href TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_dismissible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active announcements" ON public.announcements;
CREATE POLICY "Public can view active announcements"
  ON public.announcements FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins full control on announcements" ON public.announcements;
CREATE POLICY "Admins full control on announcements"
  ON public.announcements FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Seed initial announcement banners matching official website state
INSERT INTO public.announcements (id, category, text_en, text_ar, tag_en, tag_ar, link_text_en, link_text_ar, href, is_active, is_dismissible)
VALUES
  (
    'default-tools-library',
    'tools',
    'Musnad UI Design System & Component Library is officially live!',
    'تم إطلاق مكتبة مكونات ونظام تصميم مسند للتقنية للجيل القادم!',
    'New',
    'جديد',
    'Explore components',
    'استكشف الآن',
    '/services/developer-tools',
    true,
    true
  ),
  (
    'project-sahim-launch',
    'projects',
    'Discover our latest case study: Sahim Advanced Fleet Analytics & Telemetry!',
    'اكتشف أحدث مشاريعنا الهندسية: منصة سهم للتحليلات المتقدمة والتتبع اللحظي!',
    'Featured',
    'مشروع جديد',
    'View Project',
    'عرض المشروع',
    '/projects/sahim-analytics',
    false,
    true
  ),
  (
    'service-ai-integration',
    'services',
    'Announcing Enterprise Generative AI & Autonomous Agent Architecture Solutions.',
    'نعلن عن إطلاق حلول الذكاء الاصطناعي التوليدي والأنظمة الوكيلة للمؤسسات.',
    'Solutions',
    'خدمة جديدة',
    'Learn More',
    'تعرف على الحلول',
    '/services/ai-integration',
    false,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  tag_en = EXCLUDED.tag_en,
  tag_ar = EXCLUDED.tag_ar,
  link_text_en = EXCLUDED.link_text_en,
  link_text_ar = EXCLUDED.link_text_ar,
  href = EXCLUDED.href,
  is_active = EXCLUDED.is_active,
  is_dismissible = EXCLUDED.is_dismissible;
