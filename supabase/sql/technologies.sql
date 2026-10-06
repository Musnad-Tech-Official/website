-- ==============================================================================
-- Musnad Tech — Technologies Catalog Schema
-- ==============================================================================
-- Description: Central technology stack catalog managed from the dashboard,
-- powering the Home Page technologies section and the Project editor picker.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.technologies (
  id TEXT PRIMARY KEY,                              -- Slug e.g. 'nextjs', 'go', 'redis'
  name TEXT NOT NULL,                               -- Display name e.g. 'Next.js'
  category TEXT NOT NULL DEFAULT 'Frontend',        -- 'Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'AI & Realtime'
  enabled_home BOOLEAN NOT NULL DEFAULT true,       -- Render on Home Page
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ordering and filtering
CREATE INDEX IF NOT EXISTS idx_technologies_display_order ON public.technologies(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_technologies_enabled_home ON public.technologies(enabled_home);

-- Enable RLS
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

-- Public can view technologies
DROP POLICY IF EXISTS "Public can view technologies" ON public.technologies;
CREATE POLICY "Public can view technologies"
  ON public.technologies FOR SELECT
  USING (true);

-- Admins have full control
DROP POLICY IF EXISTS "Admins full control on technologies" ON public.technologies;
CREATE POLICY "Admins full control on technologies"
  ON public.technologies FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Seed initial official technologies
INSERT INTO public.technologies (id, name, category, enabled_home, display_order)
VALUES
  ('vite', 'Vite', 'Frontend', true, 1),
  ('nextjs', 'Next.js', 'Frontend', true, 2),
  ('react', 'React', 'Frontend', true, 3),
  ('react-native', 'React Native', 'Mobile & Desktop', true, 4),
  ('expo', 'Expo', 'Mobile & Desktop', true, 5),
  ('figma', 'Figma', 'Frontend', true, 6),
  ('typescript', 'TypeScript', 'Frontend', true, 7),
  ('javascript', 'JavaScript', 'Frontend', true, 8),
  ('tailwind', 'Tailwind CSS', 'Frontend', true, 9),
  ('nodejs', 'Node.js', 'Backend', true, 10),
  ('nestjs', 'NestJS', 'Backend', true, 11),
  ('springboot', 'Spring Boot', 'Backend', true, 12),
  ('java', 'Java', 'Backend', true, 13),
  ('electron', 'Electron', 'Mobile & Desktop', true, 14),
  ('graphql', 'GraphQL', 'Backend', true, 15),
  ('clerk', 'Clerk', 'Backend', true, 16),
  ('firebase', 'Firebase', 'Database', true, 17),
  ('supabase', 'Supabase', 'Database', true, 18),
  ('postgresql', 'PostgreSQL', 'Database', true, 19),
  ('mysql', 'MySQL', 'Database', true, 20),
  ('mongodb', 'MongoDB', 'Database', true, 21),
  ('php', 'PHP', 'Backend', true, 22),
  ('docker', 'Docker', 'DevOps & Cloud', true, 23),
  ('python', 'Python', 'AI & Realtime', true, 24),
  ('go', 'Go', 'Backend', true, 25),
  ('rust', 'Rust', 'Backend', true, 26),
  ('redis', 'Redis', 'Database', true, 27),
  ('clickhouse', 'ClickHouse', 'Database', true, 28),
  ('fastapi', 'FastAPI', 'Backend', true, 29)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  enabled_home = EXCLUDED.enabled_home,
  display_order = EXCLUDED.display_order;
