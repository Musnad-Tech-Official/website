-- ==============================================================================
-- Musnad Tech — Projects & Portfolio Schema
-- ==============================================================================
-- Description: Complete schema for engineering projects, case studies with
-- rich text content (Tiptap), metrics, gallery, and Supabase storage bucket
-- for project media (architecture diagrams, screenshots, covers).
-- ==============================================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,                         -- URL-safe slug e.g. 'sahim-analytics'
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  subtitle_en TEXT,
  subtitle_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  content_en JSONB,                                 -- Tiptap ProseMirror JSON (English)
  content_ar JSONB,                                 -- Tiptap ProseMirror JSON (Arabic)
  content_html_en TEXT,                             -- Rendered HTML cache for fast SSR
  content_html_ar TEXT,                             -- Rendered HTML cache for fast SSR
  cover_image TEXT,                                 -- Featured cover image URL
  category TEXT NOT NULL DEFAULT 'Fintech Platform',
  category_slug TEXT NOT NULL DEFAULT 'fintech-platform',
  year TEXT NOT NULL DEFAULT '2024',
  technologies TEXT[] DEFAULT '{}',                 -- Array of tech e.g. ['TypeScript', 'Go', 'PostgreSQL']
  featured BOOLEAN NOT NULL DEFAULT false,
  live_demo_url TEXT,
  github_url TEXT,
  rating NUMERIC(2,1) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  gradient TEXT DEFAULT 'from-zinc-900 via-neutral-900 to-zinc-950',
  metrics JSONB DEFAULT '[]'::jsonb,                -- Array of key metrics: [{"label": "Latency", "value": "<50ms"}]
  gallery JSONB DEFAULT '[]'::jsonb,                -- Array of gallery items: [{"url": "...", "caption": "..."}]
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT                                   -- Clerk Admin User ID
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies for Projects Table
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects" 
  ON public.projects FOR SELECT 
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins full control on projects" ON public.projects;
CREATE POLICY "Admins full control on projects" 
  ON public.projects FOR ALL 
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
-- 3. Supabase Storage Bucket for Project Media ('project-media')
-- ==============================================================================

-- Create the public bucket if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-media',
  'project-media',
  true,
  10485760, -- 10MB limit per image
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Storage RLS: Admins can view and list project media
DROP POLICY IF EXISTS "Admins can view and list project media" ON storage.objects;
CREATE POLICY "Admins can view and list project media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'project-media' AND (
      (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
      (auth.jwt() ->> 'role') = 'admin'
    )
  );

-- Storage RLS: Admins can upload images
DROP POLICY IF EXISTS "Admins can upload project media" ON storage.objects;
CREATE POLICY "Admins can upload project media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project-media' AND (
      (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
      (auth.jwt() ->> 'role') = 'admin'
    )
  );

-- Storage RLS: Admins can delete project media
DROP POLICY IF EXISTS "Admins can delete project media" ON storage.objects;
CREATE POLICY "Admins can delete project media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-media' AND (
      (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
      (auth.jwt() ->> 'role') = 'admin'
    )
  );

-- ==============================================================================
-- 4. Seed Approved Initial Production Projects
-- ==============================================================================

INSERT INTO public.projects (
  slug,
  title_en,
  title_ar,
  subtitle_en,
  subtitle_ar,
  description_en,
  description_ar,
  content_html_en,
  content_html_ar,
  category,
  category_slug,
  year,
  technologies,
  featured,
  live_demo_url,
  rating,
  review_count,
  gradient,
  metrics,
  status,
  display_order
)
VALUES
  (
    'sahim-analytics',
    'Sahim Analytics',
    'سهم للتحليلات',
    'Streaming market intelligence & real-time analytics engine',
    'منصة تحليلات فورية متدفقة لمعالجة إشارات السوق',
    'A streaming analytics platform that aggregates market signals and turns them into actionable insight with sub-second latency.',
    'منصة تحليلات فورية متدفقة لمعالجة إشارات السوق وتحويلها إلى رؤى استثمارية بزمن استجابة أقل من الثانية.',
    '<h2>High-Throughput Financial Stream Processing</h2><p>Sahim Analytics was architected to handle tens of thousands of volatile market events every second. By combining Go microservices with Kafka event pipelines and sub-second TimescaleDB aggregates, market analysts receive real-time data visualizations with guaranteed delivery and zero UI lag.</p><h3>Architecture Highlights</h3><ul><li><strong>Event Streaming:</strong> Distributed ingestion cluster in Go.</li><li><strong>Time-Series Engine:</strong> Partitioned PostgreSQL & TimescaleDB.</li><li><strong>Real-Time Subscriptions:</strong> WebSocket fan-out supporting up to 50k concurrent listeners.</li></ul>',
    '<h2>معالجة متدفقة فائقة السرعة للبيانات المالية</h2><p>صُممت منصة سهم للتحليلات للتعامل مع آلاف إشارات السوق المتغيرة كل ثانية. من خلال دمج خدمات Go المصغرة مع قنوات أحداث Kafka والتجميع الفوري، يحصل المحللون الماليون على رسوم بيانية وتنبيهات فورية بأعلى موثوقية وبزمن استجابة لحظي.</p>',
    'Fintech Platform',
    'fintech-platform',
    '2024',
    ARRAY['TypeScript', 'Go', 'PostgreSQL', 'Redis', 'Kafka'],
    true,
    'https://sahim.musnad.tech',
    4.7,
    38,
    'from-zinc-900 via-neutral-900 to-zinc-950',
    '[{"label": "Data Latency", "value": "<45ms"}, {"label": "Events/sec", "value": "25,000+"}, {"label": "Uptime", "value": "99.99%"}]'::jsonb,
    'published',
    1
  ),
  (
    'naft-deploy',
    'Naft Deploy',
    'نفط ديبلوي',
    'Lightweight container orchestrator & git-push deployment pipeline',
    'أداة نشر وتشغيل مفتوحة المصدر تتيح للفرق نشر التطبيقات تلقائياً',
    'An open-source deployment tool that gives small teams push-to-deploy without operating a full Kubernetes cluster.',
    'أداة نشر وتشغيل مفتوحة المصدر تتيح للفرق الصغيرة نشر تطبيقاتها تلقائياً دون تعقيد تشغيل عنقود كوبرنيتس كامل.',
    '<h2>Developer-First Push-to-Deploy</h2><p>Naft Deploy simplifies zero-downtime application deployments on bare-metal and private cloud servers. Developers simply git push to their designated branches, while Naft automatically builds, tests, runs blue-green container updates, and configures TLS certificates via Let''s Encrypt.</p>',
    '<h2>نشر برمجي سلس ومباشر للمطورين</h2><p>تعمل أداة نفط ديبلوي على تبسيط النشر الآمن بدون أي توقف للنظام على الخوادم الخاصة والسحابية. يقوم المطورون بمجرد دفع التعديلات عبر Git، وتقوم الأداة آلياً بالبناء والفحص والتبديل السلس للحاويات وتوليد شهادات الأمان تلقائياً.</p>',
    'Developer Tool',
    'developer-tool',
    '2024',
    ARRAY['Go', 'Rust', 'Docker', 'TypeScript'],
    true,
    'https://github.com/Musnad-Tech-Official/naft',
    4.9,
    124,
    'from-stone-900 via-zinc-900 to-neutral-950',
    '[{"label": "Deploy Speed", "value": "12s"}, {"label": "Overhead", "value": "45MB RAM"}, {"label": "Uptime", "value": "100%"}]'::jsonb,
    'published',
    2
  ),
  (
    'rakeen-portal',
    'Rakeen Portal',
    'بوابة ركين',
    'Enterprise bilingual client portal with zero-trust document security',
    'بوابة عملاء ثنائية اللغة فائقة الأمان لتبادل الوثائق الحساسة',
    'A secure, bilingual client portal for document exchange, case tracking, and confidential communication.',
    'بوابة عملاء ثنائية اللغة فائقة الأمان لتبادل الوثائق الحساسة ومتابعة القضايا والتواصل المؤسسي المشفر.',
    '<h2>Zero-Trust Enterprise Document Collaboration</h2><p>Rakeen Portal guarantees client confidentiality through end-to-end audit logging, dynamic watermarking, and role-based permissions designed natively for both Arabic (RTL) and English (LTR) corporate governance.</p>',
    '<h2>منظومة إدارة وثائق وتعاون مؤسسي فائقة الأمان</h2><p>تضمن بوابة ركين سرية بيانات العملاء من خلال سجلات التدقيق الصارمة والعلامات المائية الديناميكية والصلاحيات الدقيقة المصممة باللغتين العربية والإنجليزية لدعم الحوكمة المؤسسية.</p>',
    'Client Portal',
    'client-portal',
    '2023',
    ARRAY['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
    true,
    'https://rakeen.musnad.tech',
    4.6,
    22,
    'from-neutral-900 via-zinc-900 to-stone-950',
    '[{"label": "Security Score", "value": "A+"}, {"label": "Active Users", "value": "12,000"}, {"label": "RTL Fidelity", "value": "100%"}]'::jsonb,
    'published',
    3
  ),
  (
    'musnad-cli',
    'Musnad CLI',
    'مسند للطرفية',
    'Engineering productivity CLI for rapid scaffolding & continuous delivery',
    'واجهة سطر أوامر عالية الأداء للمطورين لإعداد وهيكلة المشاريع',
    'High-performance developer command-line interface for project scaffolding, linting, and cloud deployments.',
    'واجهة سطر أوامر عالية الأداء للمطورين لإعداد وهيكلة المشاريع والتدقيق البرمجي والنشر السحابي.',
    '<h2>Streamlining Team Engineering Standards</h2><p>Musnad CLI gives our engineering teams unified scaffolding commands, standardized linter presets, and automated cloud environment configuration right from their local shells.</p>',
    '<h2>توحيد معايير التطوير البرمجي للفرق الهندسية</h2><p>تمنح مسند للطرفية فرق التطوير أوامر موحدة لبناء الهياكل الأساسية للمشاريع وضمان مطابقة معايير التدقيق البرمجي والنشر السحابي بسرعة فائقة.</p>',
    'CLI & Tooling',
    'cli-and-tooling',
    '2024',
    ARRAY['Go', 'Cobra', 'gRPC', 'Docker'],
    false,
    NULL,
    4.8,
    45,
    'from-zinc-900 via-slate-900 to-neutral-950',
    '[{"label": "Commands", "value": "40+"}, {"label": "Time Saved", "value": "6 hrs/wk"}]'::jsonb,
    'published',
    4
  ),
  (
    'wathq-observability',
    'Wathq Observability',
    'واثق للرصد والمتابعة',
    'Self-hosted distributed telemetry, alerting & APM stack',
    'منظومة قياس عن بعد ورصد موزع مستضافة ذاتياً',
    'Distributed telemetry and observability stack replacing costly vendor SaaS with self-hosted telemetry.',
    'منظومة قياس عن بعد ورصد موزع مستضافة ذاتياً تستبدل الحلول التجارية وتقلل زمن الاستجابة للحوادث.',
    '<h2>Deep Telemetry Without SaaS Tax</h2><p>Wathq aggregates distributed traces, server metrics, and structured logs into ClickHouse, giving engineering leads sub-second query speeds across billions of telemetry spans.</p>',
    '<h2>رصد ومتابعة متعمقة للأداء والأنظمة السحابية</h2><p>تجمع منظومة واثق التتبعات الموزعة وسجلات الخوادم والمقاييس التشغيلية في قاعدة بيانات ClickHouse، مما يمنح القادة الهندسيين سرعة استعلام لحظية وتحليلاً دقيقاً للحوادث.</p>',
    'Observability',
    'observability',
    '2023',
    ARRAY['OpenTelemetry', 'ClickHouse', 'Go', 'Grafana'],
    false,
    NULL,
    4.9,
    67,
    'from-slate-900 via-zinc-900 to-black',
    '[{"label": "Query Latency", "value": "<100ms"}, {"label": "Spans Ingested", "value": "1B+/mo"}]'::jsonb,
    'published',
    5
  ),
  (
    'hudhud-chat',
    'Hudhud Chat',
    'محادثة هدهد',
    'Enterprise real-time conversational agent with audio and RAG search',
    'منظومة محادثة ذكية للمؤسسات تدعم الصوت ثنائي الاتجاه والبحث الموثق',
    'Enterprise real-time conversational agent with bidirectional audio, RAG search, and bilingual support.',
    'منظومة محادثة ذكية للمؤسسات تدعم الصوت ثنائي الاتجاه والبحث الموثق RAG مع دعم أصيل للغتين.',
    '<h2>Real-Time Multimodal AI Assistant</h2><p>Hudhud integrates bidirectional WebSocket streaming with enterprise knowledge bases, enabling instant conversational voice and text interactions across Arabic dialects and English.</p>',
    '<h2>مساعد ذكاء اصطناعي متعدد الوسائط بالزمن الحقيقي</h2><p>يدمج هدهد تقنيات التدفق ثنائي الاتجاه عبر WebSockets مع قواعد المعرفة المؤسسية، مما يتيح التفاعل الصوتي والكتابي الذكي باللهجات العربية واللغة الإنجليزية.</p>',
    'AI & Realtime',
    'ai-and-realtime',
    '2024',
    ARRAY['Python', 'FastAPI', 'WebSockets', 'React', 'pgvector'],
    false,
    NULL,
    4.8,
    53,
    'from-neutral-900 via-stone-900 to-zinc-950',
    '[{"label": "TTFT (Audio)", "value": "320ms"}, {"label": "Accuracy", "value": "98.4%"}]'::jsonb,
    'published',
    6
  )
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  subtitle_en = EXCLUDED.subtitle_en,
  subtitle_ar = EXCLUDED.subtitle_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  content_html_en = EXCLUDED.content_html_en,
  content_html_ar = EXCLUDED.content_html_ar,
  category = EXCLUDED.category,
  category_slug = EXCLUDED.category_slug,
  year = EXCLUDED.year,
  technologies = EXCLUDED.technologies,
  featured = EXCLUDED.featured,
  live_demo_url = EXCLUDED.live_demo_url,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  gradient = EXCLUDED.gradient,
  metrics = EXCLUDED.metrics,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();
