-- ==============================================================================
-- Musnad Tech — About Us CMS Schema
-- ==============================================================================
-- Description: Schema for managing About page content: Mission & Vision, Core Values,
-- Milestones timeline, and Delivery Approach steps.
-- ==============================================================================

-- 1. Main About Content (Mission & Vision, Story, Intro)
CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  mission_title_en TEXT NOT NULL DEFAULT 'Our mission',
  mission_title_ar TEXT NOT NULL DEFAULT 'مهمتنا',
  mission_desc_en TEXT NOT NULL DEFAULT 'Help teams ship software that is reliable, maintainable, and worth trusting — and show our work so others can verify it.',
  mission_desc_ar TEXT NOT NULL DEFAULT 'مساعدة الفِرق على بناء برمجيات موثوقة وقابلة للصيانة وجديرة بالثقة — وتوثيق عملنا بشفافية لتمكين الجميع من التحقق منه.',
  vision_title_en TEXT NOT NULL DEFAULT 'Our vision',
  vision_title_ar TEXT NOT NULL DEFAULT 'رؤيتنا',
  vision_desc_en TEXT NOT NULL DEFAULT 'A regional engineering culture where quality is the default, not a premium.',
  vision_desc_ar TEXT NOT NULL DEFAULT 'ترسيخ ثقافة هندسية إقليمية تكون فيها الجودة هي المعيار الأساسي وليست ميزة استثنائية.',
  story_title_en TEXT NOT NULL DEFAULT 'How we got here',
  story_title_ar TEXT NOT NULL DEFAULT 'كيف بدأنا مسيرتنا',
  story_p1_en TEXT NOT NULL DEFAULT 'Musnad Tech was founded in Riyadh in 2021 by a small group of senior engineers who had spent a decade building software at scale.',
  story_p1_ar TEXT NOT NULL DEFAULT 'تأسست مسند للتقنية في الرياض عام 2021 على يد نخبة من كبار المهندسين أصحاب الخبرة الطويلة في بناء الأنظمة المعقدة.',
  story_p2_en TEXT NOT NULL DEFAULT 'From the first commit, we made a deliberate choice: bilingual-first, by default. Arabic and English are first-class.',
  story_p2_ar TEXT NOT NULL DEFAULT 'منذ السطر الأول البرمجي، اخترنا أن تكون أنظمتنا ثنائية اللغة أصالةً وبشكل افتراضي.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. About Values
CREATE TABLE IF NOT EXISTS public.about_values (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'LuTarget',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Milestones Timeline
CREATE TABLE IF NOT EXISTS public.about_milestones (
  id TEXT PRIMARY KEY,
  year TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Approach Steps
CREATE TABLE IF NOT EXISTS public.about_approach_steps (
  id TEXT PRIMARY KEY,
  step_number TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_approach_steps ENABLE ROW LEVEL SECURITY;

-- Read policies for public
DROP POLICY IF EXISTS "Public can view about content" ON public.about_content;
CREATE POLICY "Public can view about content" ON public.about_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active about values" ON public.about_values;
CREATE POLICY "Public can view active about values" ON public.about_values FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view active milestones" ON public.about_milestones;
CREATE POLICY "Public can view active milestones" ON public.about_milestones FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view active approach steps" ON public.about_approach_steps;
CREATE POLICY "Public can view active approach steps" ON public.about_approach_steps FOR SELECT USING (is_active = true);

-- Admin policies
DROP POLICY IF EXISTS "Admins full control on about_content" ON public.about_content;
CREATE POLICY "Admins full control on about_content" ON public.about_content FOR ALL TO authenticated
USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full control on about_values" ON public.about_values;
CREATE POLICY "Admins full control on about_values" ON public.about_values FOR ALL TO authenticated
USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full control on about_milestones" ON public.about_milestones;
CREATE POLICY "Admins full control on about_milestones" ON public.about_milestones FOR ALL TO authenticated
USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full control on about_approach_steps" ON public.about_approach_steps;
CREATE POLICY "Admins full control on about_approach_steps" ON public.about_approach_steps FOR ALL TO authenticated
USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin');

-- Seed Data
INSERT INTO public.about_content (id, mission_title_en, mission_title_ar, mission_desc_en, mission_desc_ar, vision_title_en, vision_title_ar, vision_desc_en, vision_desc_ar)
VALUES (
  'main',
  'Our mission',
  'مهمتنا',
  'Help teams ship software that is reliable, maintainable, and worth trusting — and show our work so others can verify it.',
  'مساعدة الفِرق على بناء برمجيات موثوقة وقابلة للصيانة وجديرة بالثقة — وتوثيق عملنا بشفافية لتمكين الجميع من التحقق منه.',
  'Our vision',
  'رؤيتنا',
  'A regional engineering culture where quality is the default, not a premium.',
  'ترسيخ ثقافة هندسية إقليمية تكون فيها الجودة هي المعيار الأساسي وليست ميزة استثنائية.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about_values (id, title_en, title_ar, description_en, description_ar, icon, display_order, is_active)
VALUES
  ('proof', 'Proof over claims', 'البرهان قبل الادعاء', 'We show our work. Case studies, evals, open source — verify us.', 'نوثق نتائج أعمالنا فعلياً عبر دراسات الحالة والتقييم والبرمجيات المفتوحة.', 'LuTarget', 1, true),
  ('flexibility', 'Structured flexibility', 'مرونة مهيكلة ومدروسة', 'Deliberate structure with room for the right exceptions — not a rigid template.', 'هيكلة منظمة تستوعب المتغيرات دون قوالب جامدة تعيق الإنتاجية.', 'LuSlidersHorizontal', 2, true),
  ('security', 'Security by design', 'الأمان بالتصميم المعماري', 'Threat modeling and least privilege are defaults, not add-ons.', 'نمذجة التهديدات ومبدأ الامتيازات الأقل هي معاييرنا الافتراضية دائماً.', 'LuShieldCheck', 3, true),
  ('bilingual', 'Bilingual first', 'ثنائية اللغة بالأصالة', 'Arabic and English are first-class. RTL and LTR, end to end.', 'العربية والإنجليزية من الدرجة الأولى دعماً وتجربة وتصميماً متكاملاً.', 'LuLanguages', 4, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about_milestones (id, year, title_en, title_ar, description_en, description_ar, display_order, is_active)
VALUES
  ('2021', '2021', 'Musnad Tech founded', 'تأسيس مسند للتقنية', 'Started as a two-person studio in Riyadh.', 'انطلقت كاستوديو هندسي من مهندسَين اثنين في الرياض.', 1, true),
  ('2022', '2022', 'First regulated client portal', 'أول بوابة عملاء متوافقة تنظيمياً', 'Shipped Rakeen — our first bilingual, compliant product.', 'إطلاق بوابة ركين — أول منتج ثنائي اللغة ومعتمد ومطابق للمعايير التنظيمية.', 2, true),
  ('2023', '2023', 'Open-source Naft', 'إطلاق أداة نفط مفتوحة المصدر', 'Released Naft Deploy, our deployment tool for small teams.', 'إطلاق أداة Naft Deploy لتسهيل النشر السحابي للفِرق البرمجية الصغيرة.', 3, true),
  ('2024', '2024', 'Streaming analytics at scale', 'تحليلات التدفق اللحظي على نطاق واسع', 'Delivered Sahim — 48k events/min with sub-200ms queries.', 'تسليم منصة سهم — معالجة 48 ألف حدث في الدقيقة باستعلامات أقل من 200 مللي ثانية.', 4, true),
  ('2025', '2025', 'AI practice & eval-first RAG', 'تطوير ممارسة الذكاء الاصطناعي وRAG', 'Formalized our AI integration practice around evals and honesty.', 'تأسيس ممارسة تكامل الذكاء الاصطناعي القائمة على التقييم الصارم والشفافية.', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about_approach_steps (id, step_number, title_en, title_ar, description_en, description_ar, display_order, is_active)
VALUES
  ('discovery', '01', 'Discovery', 'الاستكشاف والتحليل', 'A paid engagement to align on the problem, constraints, and success metrics before committing to build.', 'مرحلة استكشافية دقيقة لمواءمة التحديات والمحددات ومؤشرات النجاح قبل البدء في التنفيذ.', 1, true),
  ('architecture', '02', 'Architecture & RFCs', 'المعمارية ووثائق RFCs', 'We write down the hard decisions — architecture, trade-offs, risks — and review them openly.', 'توثيق القرارات الهندسية المفصلية والمفاضلات الفنية وتحليل المخاطر بشفافية تامة.', 2, true),
  ('cadence', '03', 'Build with cadence', 'البناء بإيقاع منتظم', 'Weekly demos, continuous review, and honest progress. No black boxes, no surprises at the end.', 'استعراض أسبوعي ومراجعة مستمرة وتقدم واقعي، بلا صناديق مغلقة أو مفاجآت.', 3, true),
  ('operate', '04', 'Ship & operate', 'الإطلاق والتشغيل', 'We deploy to production with observability and own the first weeks of operation. Then we hand over, or stay on.', 'النشر السحابي بأعلى معايير المراقبة وإدارة أسابيع التشغيل الأولى حتى التسليم الكامل أو الشراكة المستمرة.', 4, true)
ON CONFLICT (id) DO NOTHING;
