-- ==============================================================================
-- Musnad Tech — Trusted Companies (Clients & Partners) Schema & Storage
-- ==============================================================================
-- Description: Schema for managing trusted companies displayed on the home page,
-- with bilingual names, logo upload URLs, active status, and order control.
-- ==============================================================================

-- 1. Create Trusted Companies Table
CREATE TABLE IF NOT EXISTS public.trusted_companies (
  id TEXT PRIMARY KEY,                              -- Slug e.g. 'yemen-mobile', 'cac-bank'
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  logo_url TEXT NOT NULL,                            -- SVG or image URL
  website_url TEXT,                                 -- Optional external partner website
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,          -- Visibility toggle for Home page
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for Fast Lookup
CREATE INDEX IF NOT EXISTS idx_trusted_companies_active ON public.trusted_companies(is_active);
CREATE INDEX IF NOT EXISTS idx_trusted_companies_order ON public.trusted_companies(display_order ASC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.trusted_companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active trusted companies" ON public.trusted_companies;
CREATE POLICY "Public can view active trusted companies"
  ON public.trusted_companies FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins full control on trusted companies" ON public.trusted_companies;
CREATE POLICY "Admins full control on trusted companies"
  ON public.trusted_companies FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

-- 4. Initial Seed Data (Matching existing Home page companies)
INSERT INTO public.trusted_companies (id, name_en, name_ar, logo_url, website_url, display_order, is_active)
VALUES
  ('yemen-mobile', 'Yemen Mobile', 'يمن موبايل', '/companies/yemen-mobile.svg', 'https://www.yemenmobile.com.ye', 1, true),
  ('kuraimi-bank', 'Al Kuraimi Bank', 'بنك الكريمي', '/companies/kuraimi-bank.svg', 'https://kuraimibank.com', 2, true),
  ('tadhamon-bank', 'Tadhamon Bank', 'بنك التضامن', '/companies/tadhamon-bank.svg', 'https://www.tadhamonbank.com', 3, true),
  ('hsa-group', 'HSA Group', 'مجموعة هائل سعيد أنعم', '/companies/hsa-group.svg', 'https://www.hsagroup.com', 4, true),
  ('cac-bank', 'CAC Bank', 'بنك التسليف التعاوني الزراعي', '/companies/cac-bank.svg', 'https://cacbank.com.ye', 5, true),
  ('ykb', 'Yemen Kuwait Bank', 'بنك اليمن والكويت', '/companies/ykb.svg', 'https://yk-bank.com', 6, true)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  logo_url = EXCLUDED.logo_url,
  website_url = EXCLUDED.website_url,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
