-- ==============================================================================
-- Musnad Tech — Careers & Positions CMS Schema
-- ==============================================================================
-- Description: Schema for managing open job postings, engineering roles, application
-- requirements, and career culture values.
-- ==============================================================================

-- 1. Careers Open Positions
CREATE TABLE IF NOT EXISTS public.career_jobs (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'engineering', -- engineering, ai, design
  work_mode TEXT NOT NULL DEFAULT 'remote', -- remote, hybrid, onSite
  work_type_en TEXT NOT NULL DEFAULT 'Full-time',
  work_type_ar TEXT NOT NULL DEFAULT 'دوام كامل',
  location_en TEXT NOT NULL DEFAULT 'Riyadh / Remote',
  location_ar TEXT NOT NULL DEFAULT 'الرياض / عن بُعد',
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  requirements_en TEXT[] DEFAULT '{}',
  requirements_ar TEXT[] DEFAULT '{}',
  responsibilities_en TEXT[] DEFAULT '{}',
  responsibilities_ar TEXT[] DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Career Values
CREATE TABLE IF NOT EXISTS public.career_values (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'LuAward',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_career_jobs_slug ON public.career_jobs(slug);
CREATE INDEX IF NOT EXISTS idx_career_jobs_active ON public.career_jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_career_jobs_dept ON public.career_jobs(department);

-- Enable RLS
ALTER TABLE public.career_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_values ENABLE ROW LEVEL SECURITY;

-- Read policies for public
DROP POLICY IF EXISTS "Public can view active jobs" ON public.career_jobs;
CREATE POLICY "Public can view active jobs" ON public.career_jobs FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view active career values" ON public.career_values;
CREATE POLICY "Public can view active career values" ON public.career_values FOR SELECT USING (is_active = true);

-- Admin policies
DROP POLICY IF EXISTS "Admins full control on career_jobs" ON public.career_jobs;
CREATE POLICY "Admins full control on career_jobs" ON public.career_jobs FOR ALL TO authenticated
USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full control on career_values" ON public.career_values;
CREATE POLICY "Admins full control on career_values" ON public.career_values FOR ALL TO authenticated
USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'role') = 'admin');

-- Seed Data
INSERT INTO public.career_jobs (id, slug, title_en, title_ar, department, work_mode, work_type_en, work_type_ar, location_en, location_ar, description_en, description_ar, requirements_en, requirements_ar, responsibilities_en, responsibilities_ar, display_order, is_active)
VALUES
  (
    'senior-backend-engineer',
    'senior-backend-engineer',
    'Senior Backend Engineer',
    'مهندس نظم وخلفيات أول',
    'engineering',
    'hybrid',
    'Full-time',
    'دوام كامل',
    'Riyadh / Remote',
    'الرياض / عن بُعد',
    'Lead high-throughput distributed backend architectures with strong guarantees on data consistency and zero-downtime deployments.',
    'قيادة معمارية الأنظمة الخلفية الموزعة عالية الأداء، وضمان استقرار البيانات والنشر المستمر دون توقف.',
    ARRAY['5+ years in distributed systems (Go/Node/Postgres)', 'Deep SQL & database performance tuning', 'Strong understanding of event-driven architectures'],
    ARRAY['خبرة 5+ سنوات في الأنظمة الموزعة (Go / Node / Postgres)', 'معرفة متقدمة بتحسين استعلامات وقواعد البيانات', 'فهم متين للأنظمة المعتمدة على الأحداث Event-Driven'],
    ARRAY['Design resilient database schemas and caching layers', 'Mentor junior engineers and lead technical RFCs', 'Collaborate on bilingual API contracts'],
    ARRAY['تصميم قواعد بيانات متينة وطبقات التخزين المؤقت', 'توجيه المهندسين وقيادة وثائق الـ RFCs الفنية', 'تطوير واجهات برمجية ثنائية اللغة بمعايير صارمة'],
    1,
    true
  ),
  (
    'machine-learning-engineer',
    'machine-learning-engineer',
    'Machine Learning Engineer',
    'مهندس تعلم الآلة والذكاء الاصطناعي',
    'ai',
    'remote',
    'Full-time',
    'دوام كامل',
    'Remote',
    'عن بُعد',
    'Build reliable RAG architectures, custom domain evaluations, and production AI pipelines with strict truthfulness guarantees.',
    'بناء معمارية RAG متطورة وتقييمات مخصصة ونظم ذكاء اصطناعي إنتاجية بضمانات دقة وشفافية صارمة.',
    ARRAY['Experience building production RAG & Vector DB pipelines', 'Proficiency in Python, PyTorch, and LLM evaluation frameworks', 'Knowledge of prompt engineering & semantic retrieval'],
    ARRAY['خبرة في بناء مسارات RAG وقواعد البيانات المتجهية', 'إتقان بايثون وأطر تقييم النماذج اللغوية الكبيرة', 'معرفة عميقة بالاسترجاع الدلالي وهندسة الأوامر'],
    ARRAY['Design evaluation-first AI benchmarks', 'Integrate streaming LLM responses into production apps', 'Monitor and prevent model hallucinations'],
    ARRAY['تصميم مقاييس واختبارات لتقييم النماذج بدقة', 'دمج الردود المتدفقة للنماذج في بيئات الإنتاج', 'مراقبة وتقليل هلوسة النماذج والتحقق من المخرجات'],
    2,
    true
  ),
  (
    'design-engineer',
    'design-engineer',
    'Design Engineer',
    'مهندس تصميم وواجهات',
    'design',
    'onSite',
    'Full-time',
    'دوام كامل',
    'Riyadh',
    'الرياض',
    'Bridge the gap between product design and engineering with high-craft UI components, accessibility, and fluid animations.',
    'الربط بين تصميم المنتجات وهندسة الواجهات عبر مكونات برمجية فائقة الإتقان تدعم الوصولية والحركات الانسيابية.',
    ARRAY['Mastery of React, Tailwind CSS, TypeScript, and micro-interactions', 'Deep respect for bilingual typography and RTL nuances', 'Experience building and maintaining accessible design systems'],
    ARRAY['إتقان تام لـ React و Tailwind و TypeScript والتفاعلات الدقيقة', 'فهم عميق للخطوط العربية وخصوصية الاتجاه من اليمين لليسار (RTL)', 'خبرة في بناء وتطوير أنظمة التصميم الشاملة والوصولية'],
    ARRAY['Build accessible UI components matching rigorous tokens', 'Optimize layout shifts and interaction metrics (INP, CLS)', 'Partner with product designers on component specs'],
    ARRAY['برمجة مكونات واجهات تفاعلية متوافقة مع معايير الوصولية', 'تحسين مؤشرات تجربة المستخدم واستقرار التخطيط (INP, CLS)', 'التعاون مع المصممين في تحديد وتوثيق خصائص المكونات'],
    3,
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.career_values (id, title_en, title_ar, description_en, description_ar, icon, display_order, is_active)
VALUES
  ('senior', 'Senior by default', 'كبار المهندسين بالأصالة', 'Small, high-agency teams of senior practitioners who own problems end-to-end.', 'فِرق صغيرة ذات كفاءة واستقلالية عالية تتولى مسؤولية الحلول من البداية للنهاية.', 'LuAward', 1, true),
  ('bilingual', 'Bilingual first', 'ثنائية اللغة بالأصالة', 'We treat Arabic as a first-class citizen across documentation, code, and interfaces.', 'العربية لغة أصيلة من الدرجة الأولى في توثيقنا، أكوادنا، وواجهاتنا.', 'LuLanguages', 2, true),
  ('openSource', 'Open-source friendly', 'دعم البرمجيات مفتوحة المصدر', 'We give back to the tools we depend on and open-source our non-proprietary tooling.', 'نساهم في تطوير الأدوات التي نعتمد عليها ونشارك برمجياتنا غير الاحتكارية مع المجتمع.', 'LuCode', 3, true),
  ('remote', 'Remote & asynchronous', 'العمل المرن وغير المتزامن', 'Autonomous workflows that respect deep focus and clear, documented expectations.', 'سير عمل مرن ومستقل يحترم التركيز العميق والتوقعات الموثقة بدقة.', 'LuLaptop', 4, true)
ON CONFLICT (id) DO NOTHING;
