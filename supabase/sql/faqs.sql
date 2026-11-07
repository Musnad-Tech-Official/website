-- ==============================================================================
-- Musnad Tech — FAQs CMS Schema
-- ==============================================================================
-- Description: Schema for managing frequently asked questions, categorized by topics,
-- supporting bilingual questions, answers, and display ordering.
-- ==============================================================================

-- 1. FAQ Topics / Categories
CREATE TABLE IF NOT EXISTS public.faq_topics (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. FAQ Questions
CREATE TABLE IF NOT EXISTS public.faq_questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES public.faq_topics(id) ON DELETE CASCADE,
  question_en TEXT NOT NULL,
  question_ar TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_faq_topics_slug ON public.faq_topics(slug);
CREATE INDEX IF NOT EXISTS idx_faq_questions_topic ON public.faq_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_faq_questions_active ON public.faq_questions(is_active);

-- Enable RLS
ALTER TABLE public.faq_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_questions ENABLE ROW LEVEL SECURITY;

-- Read policies for public
DROP POLICY IF EXISTS "Public can view active topics" ON public.faq_topics;
CREATE POLICY "Public can view active topics" ON public.faq_topics FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view active questions" ON public.faq_questions;
CREATE POLICY "Public can view active questions" ON public.faq_questions FOR SELECT USING (is_active = true);

-- Admin policies
DROP POLICY IF EXISTS "Admins full control on faq_topics" ON public.faq_topics;
CREATE POLICY "Admins full control on faq_topics" ON public.faq_topics FOR ALL TO authenticated
USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full control on faq_questions" ON public.faq_questions;
CREATE POLICY "Admins full control on faq_questions" ON public.faq_questions FOR ALL TO authenticated
USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin');

-- Seed Data
INSERT INTO public.faq_topics (id, slug, title_en, title_ar, display_order, is_active)
VALUES
  ('working-with-us', 'working-with-us', 'Working with Musnad Tech', 'التعاون مع مسند للتقنية', 1, true),
  ('company', 'company', 'Company & Engineering Model', 'الشركة والنموذج الهندسي', 2, true),
  ('accounts', 'accounts', 'Accounts & Verification', 'الحسابات والتحقق', 3, true),
  ('contact', 'contact', 'Inquiries & Communication', 'الاستفسارات والتواصل', 4, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.faq_questions (id, topic_id, question_en, question_ar, answer_en, answer_ar, display_order, is_active)
VALUES
  (
    'q-working-1',
    'working-with-us',
    'How does Musnad Tech approach new client engagements?',
    'كيف تبدأ مسند للتقنية المشاريع الجديدة مع العملاء؟',
    'We begin with a structured Discovery Sprint to define the architecture, risks, and technical milestones before writing code. This ensures zero surprises and strict timeline accountability.',
    'نبدأ بمرحلة استكشاف فني وتحليلي دقيقة لتحديد المعمارية البرمجية والمخاطر والمراحل الزمنية قبل البدء في كتابة الأكواد، مما يضمن الشفافية التامة والالتزام الدقيق.',
    1,
    true
  ),
  (
    'q-working-2',
    'working-with-us',
    'What delivery models do you support for enterprise teams?',
    'ما هي نماذج التسليم والتعاقد المتاحة للشركات؟',
    'We offer dedicated engineering pods, architecture advisory engagements, and end-to-end product development with full operational handover.',
    'نوفر فِرقاً برمجية متخصصة ومستقلة، واستشارات معمارية استراتيجية، وتطويراً شاملاً للمنتجات من الفكرة حتى التشغيل والتسليم المعرفي.',
    2,
    true
  ),
  (
    'q-company-1',
    'company',
    'Where is Musnad Tech headquartered?',
    'أين يقع المقر الرئيسي لمسند للتقنية؟',
    'We are headquartered in Riyadh, Saudi Arabia, serving high-growth startups and established enterprises across the GCC and internationally.',
    'يقع مقرنا الرئيسي في الرياض بالمملكة العربية السعودية، ونقدم خدماتنا للشركات الناشئة الواعدة والمؤسسات الكبرى في الخليج ودولياً.',
    1,
    true
  ),
  (
    'q-company-2',
    'company',
    'How do you guarantee data security and compliance?',
    'كيف تضمنون أمان البيانات والامتثال للمعايير التنظيمية؟',
    'Security is architected by design. All systems implement strict least-privilege policies, Row Level Security, end-to-end encryption, and full compliance with local Saudi data residency regulations.',
    'الأمان مدمج في أصل المعمارية. نطبق مبدأ الامتيازات الأقل وسياسات حماية البيانات على مستوى السجل RLS والتشفير الشامل والامتثال التام للوائح استضافة البيانات في السعودية.',
    2,
    true
  ),
  (
    'q-accounts-1',
    'accounts',
    'Do clients require an account to submit inquiries or collaborate?',
    'هل يتطلب إرسال الاستفسارات أو التعاون إنشاء حساب؟',
    'Initial project inquiries can be submitted directly via our public contact form. For active engineering engagements, dedicated client portal access with multi-factor authentication is provisioned.',
    'يمكن إرسال الاستفسارات الأولية مباشرة عبر نموذج التواصل. أما للمشاريع القائمة فيتم تزويد العملاء ببوابة مخصصة ومحمية بمصادقة متعددة العوامل.',
    1,
    true
  ),
  (
    'q-contact-1',
    'contact',
    'What is your expected response time for new inquiries?',
    'ما هو زمن الاستجابة المتوقع للاستفسارات الجديدة؟',
    'Our engineering leadership reviews and responds to every verified project inquiry within two business days — with genuine technical insights, not sales theatre.',
    'تقوم قيادتنا الهندسية بمراجعة والرد على كافة استفسارات المشاريع خلال يومي عمل — بتقديم تحليلات فنية واقعية بعيداً عن العروض التسويقية غير الدقيقة.',
    1,
    true
  )
ON CONFLICT (id) DO NOTHING;
