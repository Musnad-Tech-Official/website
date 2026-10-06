-- ==============================================================================
-- Musnad Tech — Engineering Services & Capabilities Schema
-- ==============================================================================
-- Description: Schema for managing core engineering services, bilingual descriptions,
-- capability tags, Home page capabilities display, and routing.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'LuCode',
  tags_en TEXT[] DEFAULT '{}',
  tags_ar TEXT[] DEFAULT '{}',
  href TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled_home BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_home ON public.services(enabled_home);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(display_order ASC);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins full control on services" ON public.services;
CREATE POLICY "Admins full control on services"
  ON public.services FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Seed initial 6 official capabilities
INSERT INTO public.services (id, slug, title_en, title_ar, description_en, description_ar, icon, tags_en, tags_ar, href, display_order, enabled_home, is_active)
VALUES
  (
    'product-engineering',
    'product-engineering',
    'Product Engineering',
    'هندسة المنتجات الرقمية',
    'From discovery to launch — full-lifecycle digital product development with strict engineering accountability.',
    'من مرحلة الاستكشاف حتى الإطلاق — نبني منتجات متكاملة بمسؤولية هندسية صارمة.',
    'LuCode',
    ARRAY['Architecture & system design', 'Full-stack implementation', 'Technical discovery & RFCs'],
    ARRAY['معمارية وتصميم الأنظمة', 'تطوير شامل للواجهات والخلفيات', 'الاستكشاف التقني ووثائق RFCs'],
    '/services/product-engineering',
    1,
    true,
    true
  ),
  (
    'platform-infrastructure',
    'platform-infrastructure',
    'Platform & Cloud Infrastructure',
    'البنية التحتية والمنصات السحابية',
    'Resilient, scalable cloud foundations built for multi-region reliability and operational autonomy.',
    'بنى تحتية سحابية مرنة وقابلة للتوسع مصممة للاستقرار في بيئات متعددة المناطق والاستقلالية التشغيلية.',
    'LuCloud',
    ARRAY['Cloud architecture (AWS / GCP)', 'Kubernetes & container orchestration', 'CI/CD pipeline design'],
    ARRAY['الهيكلة السحابية (AWS / GCP)', 'منظومات الحاويات وكوبرنيتس', 'تصميم مسارات CI/CD المؤتمتة'],
    '/services/platform-infrastructure',
    2,
    true,
    true
  ),
  (
    'data-engineering',
    'data-engineering',
    'Data Engineering & Analytics',
    'هندسة البيانات والتحليلات',
    'Robust pipelines and warehouse architectures turning high-volume data streams into actionable intelligence.',
    'مسارات متينة وهندسة مستودعات بيانات تحوّل تدفقات البيانات الضخمة إلى رؤى استراتيجية موثوقة.',
    'LuDatabase',
    ARRAY['ETL / ELT pipelines', 'Warehouse modeling (dbt)', 'Real-time streaming'],
    ARRAY['مسارات ETL / ELT المتقدمة', 'نمذجة المستودعات عبر dbt', 'معالجة التدفقات اللحظية'],
    '/services/data-engineering',
    3,
    true,
    true
  ),
  (
    'developer-tools',
    'developer-tools',
    'Developer Tools & SDKs',
    'أدوات المطورين والأنظمة البرمجية',
    'Design systems, internal CLI tools, and battle-tested SDKs that accelerate developer velocity.',
    'أنظمة التصميم، أدوات سطر الأوامر (CLI)، وحزم SDK الموثوقة التي تضاعف سرعة وإنتاجية المطورين.',
    'LuTerminal',
    ARRAY['CLI & SDK design', 'API design (REST & gRPC)', 'Developer documentation'],
    ARRAY['تصميم حزم SDK وأدوات CLI', 'تصميم واجهات REST و gRPC', 'التوثيق التقني للمطورين'],
    '/services/developer-tools',
    4,
    true,
    true
  ),
  (
    'ai-integration',
    'ai-integration',
    'AI Integration & Autonomous Systems',
    'تكامل الذكاء الاصطناعي والأنظمة الوكيلة',
    'Private LLM application architectures, evaluation harnesses, and deterministic production workflows.',
    'معماريات تطبيقات النماذج اللغوية الخاصة، أطر التقييم الدقيقة، ومسارات العمل الموثوقة بيئياً.',
    'LuSparkles',
    ARRAY['RAG pipelines & evaluation', 'LLM application architecture', 'Prompt engineering & evals'],
    ARRAY['مسارات استرجاع RAG والتقييم', 'معمارية تطبيقات LLM للمؤسسات', 'هندسة الأوامر والتقييم الآلي'],
    '/services/ai-integration',
    5,
    true,
    true
  ),
  (
    'design-engineering',
    'design-engineering',
    'Design Engineering & Systems',
    'هندسة التصميم وتطوير الواجهات',
    'Bridge the gap between design and production code with accessible, tokenized component architectures.',
    'جسر متين بين التصميم والكود البرمجي مع مكتبات مكونات مبنية على المتغيرات ومعايير الإتاحة.',
    'LuLayoutGrid',
    ARRAY['Design systems & tokens', 'Component libraries', 'Accessibility (WCAG 2.2 AA)'],
    ARRAY['أنظمة التصميم والمتغيرات البرمجية', 'مكتبات المكونات المتوافقة', 'معايير الإتاحة (WCAG 2.2 AA)'],
    '/services/design-engineering',
    6,
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  icon = EXCLUDED.icon,
  tags_en = EXCLUDED.tags_en,
  tags_ar = EXCLUDED.tags_ar,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order,
  enabled_home = EXCLUDED.enabled_home,
  is_active = EXCLUDED.is_active;
