-- ==============================================================================
-- Musnad Tech — Client Inquiries & Lead Management Schema
-- ==============================================================================
-- Description: Schema for storing and managing client contact submissions,
-- project proposals, service inquiries, and recruitment messages.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  inquiry_type TEXT NOT NULL DEFAULT 'project',      -- 'project', 'general', 'partnership', 'careers'
  project_type TEXT,
  budget TEXT,
  timeline TEXT,
  current_product TEXT,
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  attachment_size INTEGER,
  status TEXT NOT NULL DEFAULT 'new',                -- 'new', 'in_review', 'responded', 'closed'
  admin_notes TEXT,
  user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON public.inquiries(inquiry_type);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (public/anon) can submit an inquiry from the website
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.inquiries;
CREATE POLICY "Anyone can insert inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- Authenticated users can view their own inquiries
DROP POLICY IF EXISTS "Users can view own inquiries" ON public.inquiries;
CREATE POLICY "Users can view own inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- Admins have full access to view, update, and manage all inquiries
DROP POLICY IF EXISTS "Admins full control on inquiries" ON public.inquiries;
CREATE POLICY "Admins full control on inquiries"
  ON public.inquiries FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Seed initial representative inquiries
INSERT INTO public.inquiries (id, name, email, company, phone, inquiry_type, project_type, budget, timeline, current_product, message, status, admin_notes)
VALUES
  (
    'inq-01',
    'Sarah Al-Ghamdi',
    's.ghamdi@fintech-ventures.sa',
    'FinTech Ventures Riyadh',
    '+966 50 123 4567',
    'project',
    'Full-Stack Web & Mobile App',
    '$50k - $100k',
    '3-6 months',
    'Legacy monolithic PHP app needing modernization',
    'We need an elite engineering team to redesign and rebuild our investment portal into a distributed Next.js + Go microservices architecture with bank-grade security and full Arabic/English localization.',
    'new',
    'High-priority financial client. Lead architect should review RFC.'
  ),
  (
    'inq-02',
    'Dr. Omar Basaeed',
    'o.basaeed@medilink.org',
    'MediLink Healthcare Network',
    '+966 55 987 6543',
    'project',
    'AI & RAG Knowledge Engine',
    '$25k - $50k',
    '1-3 months',
    'Internal electronic medical documentation database',
    'Interested in Musnad''s AI integration capabilities for internal clinical guideline retrieval using private LLMs on dedicated cloud infrastructure.',
    'in_review',
    'Scheduled introductory discovery call for Thursday.'
  ),
  (
    'inq-03',
    'Marcus Vance',
    'm.vance@apexlogistics.ae',
    'Apex Global Logistics',
    '+971 4 555 0192',
    'partnership',
    'Cloud Platform & Telemetry',
    '>$100k',
    '6+ months',
    NULL,
    'Looking for long-term technical partnership to maintain and scale our real-time GPS telemetry pipelines and driver assignment algorithms across the GCC region.',
    'responded',
    'Sent proposal draft on Monday. Waiting on procurement feedback.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  company = EXCLUDED.company,
  phone = EXCLUDED.phone,
  inquiry_type = EXCLUDED.inquiry_type,
  message = EXCLUDED.message,
  status = EXCLUDED.status;
