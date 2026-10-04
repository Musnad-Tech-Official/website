-- ==============================================================================
-- Musnad Tech — Team Members Schema & Storage
-- ==============================================================================
-- Description: Complete schema for team members management, public profiles,
-- and author relationships with articles and projects.
-- ==============================================================================

-- 1. Create Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,                         -- URL-safe slug e.g. 'sabri-alshaibani'
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  role_en TEXT NOT NULL,                             -- e.g. 'Engineering / Technical Lead'
  role_ar TEXT NOT NULL,                             -- e.g. 'القائد الهندسي / التقني'
  bio_en TEXT,                                       -- Full biography (English)
  bio_ar TEXT,                                       -- Full biography (Arabic)
  image TEXT,                                        -- Portrait photo URL
  initials TEXT NOT NULL DEFAULT 'SA',
  department TEXT NOT NULL DEFAULT 'Engineering',    -- 'Leadership', 'Engineering', 'Design', etc.
  skills TEXT[] DEFAULT '{}',                        -- e.g. ['System Architecture', 'Next.js']
  social_links JSONB DEFAULT '{}'::jsonb,            -- { github, linkedin, x, website, email }
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for Fast Lookup
CREATE INDEX IF NOT EXISTS idx_team_members_slug ON public.team_members(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON public.team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON public.team_members(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_team_members_department ON public.team_members(department);

-- 3. Row Level Security (RLS)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active team members" ON public.team_members;
CREATE POLICY "Public can view active team members"
  ON public.team_members FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins full control on team members" ON public.team_members;
CREATE POLICY "Admins full control on team members"
  ON public.team_members FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

-- 4. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_team_members_updated_at ON public.team_members;
CREATE TRIGGER set_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Seed Initial Core Team Members (Preserving Existing Roster)
INSERT INTO public.team_members (slug, name_en, name_ar, role_en, role_ar, bio_en, bio_ar, initials, department, skills, display_order, is_active)
VALUES
  (
    'shaher-alward',
    'Shaher Alward',
    'شاهر الورد',
    'Team Lead / Product Lead',
    'قائد الفريق / قائد المنتجات',
    'Team Lead and Product Lead at Musnad Tech with deep focus on product strategy and software engineering leadership.',
    'قائد الفريق وقائد المنتجات في مسند للتقنية مع تركيز عميق على استراتيجية المنتجات والقيادة الهندسية.',
    'SA',
    'Leadership',
    ARRAY['Product Leadership', 'Product Strategy', 'System Architecture'],
    1,
    true
  ),
  (
    'sabri-alshaibani',
    'Sabri Alshaibani',
    'صبري الشيباني',
    'Engineering / Technical Lead',
    'القائد الهندسي / التقني',
    'Engineering and Technical Lead at Musnad Tech specializing in distributed systems, modern web platforms, and cloud architecture.',
    'القائد الهندسي والتقني في مسند للتقنية، متخصص في الأنظمة الموزعة، منصات الويب الحديثة، والمعمارية السحابية.',
    'SS',
    'Engineering',
    ARRAY['Technical Leadership', 'Cloud Architecture', 'Next.js', 'PostgreSQL'],
    2,
    true
  ),
  (
    'islam-adel',
    'Islam Adel',
    'إسلام عادل',
    'Software Engineer / Frontend Lead',
    'مهندس برمجيات / قائد الواجهات',
    'Software Engineer and Frontend Lead at Musnad Tech driving responsive, accessible, and high-performance user interfaces.',
    'مهندس برمجيات وقائد الواجهات في مسند للتقنية، يقود تطوير واجهات مستخدم عالية الأداء، متجاوبة وشاملة.',
    'IA',
    'Engineering',
    ARRAY['Software Engineering', 'Frontend Architecture', 'Design Systems', 'TypeScript'],
    3,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  role_en = EXCLUDED.role_en,
  role_ar = EXCLUDED.role_ar,
  bio_en = EXCLUDED.bio_en,
  bio_ar = EXCLUDED.bio_ar,
  department = EXCLUDED.department,
  skills = EXCLUDED.skills,
  display_order = EXCLUDED.display_order;
