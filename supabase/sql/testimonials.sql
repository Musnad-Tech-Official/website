-- ==============================================================================
-- Musnad Tech — Testimonials (Client Reviews) Schema
-- ==============================================================================
-- Description: Schema for managing client quotes, roles, bilingual statements,
-- and avatars displayed on the Home page testimonials carousel.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  author_name_en TEXT NOT NULL,
  author_name_ar TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_ar TEXT NOT NULL,
  quote_en TEXT NOT NULL,
  quote_ar TEXT NOT NULL,
  initial TEXT NOT NULL DEFAULT 'A',
  avatar_url TEXT,
  company_name TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials(display_order ASC);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active testimonials" ON public.testimonials;
CREATE POLICY "Public can view active testimonials"
  ON public.testimonials FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins full control on testimonials" ON public.testimonials;
CREATE POLICY "Admins full control on testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Seed initial official testimonials
INSERT INTO public.testimonials (id, author_name_en, author_name_ar, role_en, role_ar, quote_en, quote_ar, initial, display_order, is_active)
VALUES
  (
    'ahmed',
    'Ahmed Al-Dossari',
    'أحمد الدوسري',
    'Head of Product · Regional Investment Firm',
    'رئيس قطاع المنتجات · شركة استثمارية إقليمية',
    'Musnad Tech didn''t just build software — they raised our standard for what reliable looks like. The Sahim platform became the tool our analysts actually trust.',
    'لم تبنِ مسند للتقنية مجرد برمجيات — بل رفعت معاييرنا لما يجب أن تكون عليه الموثوقية. أصبحت منصة سهم الأداة التي يثق بها محللونا فعلياً.',
    'A',
    1,
    true
  ),
  (
    'reem',
    'Reem Al-Sayed',
    'ريم السيد',
    'Managing Partner · Legal Services Firm',
    'شريك مدير · شركة خدمات قانونية',
    'The Rakeen portal transformed how our clients interact with us. Bilingual, accessible, and genuinely secure — delivered on time.',
    'غيّرت بوابة ركين أسلوب تفاعل عملائنا معنا بالكامل. ثنائية اللغة، وسهلة الوصول، وآمنة تماماً — وتم تسليمها بدقة في الموعد المحدد.',
    'R',
    2,
    true
  ),
  (
    'faisal',
    'Faisal Al-Nasser',
    'فيصل الناصر',
    'CTO · Logistics Operator',
    'الرئيس التنفيذي للتقنية · شركة حلول لوجستية',
    'They replaced a costly vendor SaaS with a self-hosted observability stack and cut our incident response time by more than half. Calm, competent engineering.',
    'استبدلوا خدمة SaaS تجارية باهظة الثمن بمنظومة مراقبة مستضافة ذاتياً، وخفّضوا وقت استجابتنا للحوادث بأكثر من النصف. هندسة هادئة ومتقنة.',
    'F',
    3,
    true
  ),
  (
    'tariq',
    'Tariq Al-Hamdani',
    'طارق الحمداني',
    'VP of Engineering · FinTech Solutions',
    'نائب الرئيس للهندسة · حلول التقنية المالية',
    'The architectural clarity Musnad Tech brought to our financial infrastructure gave us complete confidence during our highest-volume transaction periods.',
    'الدقة التقنية والوضوح المعماري الذي أضافته مسند لبنيتنا التحتية للمدفوعات منحنا ثقة تامة واستقراراً غير مسبوق في مواسم الذروة التشغيلية.',
    'T',
    4,
    true
  ),
  (
    'mona',
    'Mona Al-Khatib',
    'منى الخطيب',
    'Head of Digital Transformation · Healthcare Network',
    'رئيسة التحول الرقمي · شبكة الرعاية الصحية',
    'Delivering a bilingual enterprise portal with zero accessibility compromises was critical for our institution. Musnad''s engineering discipline was exemplary.',
    'كان بناء بوابة مؤسسية ثنائية اللغة بمعايير إتاحة عالمية وأمان تام أمراً حاسماً لمنظمتنا. انضباط مسند الهندسي استثنائي ونموذجي.',
    'M',
    5,
    true
  ),
  (
    'khalid',
    'Khalid Al-Ariqi',
    'خالد العريقي',
    'Founder & CEO · Cloud Logistics',
    'المؤسس والرئيس التنفيذي · الخدمات اللوجستية السحابية',
    'From day one, Musnad operated like an elite in-house team. The resilient distributed systems they designed scaled effortlessly as our operations expanded.',
    'منذ اليوم الأول، عمل فريق مسند كجزء أصيل من فريقنا التقني. الأنظمة الموزعة التي صمموها توسعت بكل سلاسة مع تضاعف مستخدمينا وعملياتنا.',
    'K',
    6,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  author_name_en = EXCLUDED.author_name_en,
  author_name_ar = EXCLUDED.author_name_ar,
  role_en = EXCLUDED.role_en,
  role_ar = EXCLUDED.role_ar,
  quote_en = EXCLUDED.quote_en,
  quote_ar = EXCLUDED.quote_ar,
  initial = EXCLUDED.initial,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
