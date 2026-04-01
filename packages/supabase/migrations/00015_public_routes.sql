-- ══════════════════════════════════════════════════════════════════════════════
-- Migration 00015: Öffentliche Reiserouten (teilen & klonen)
-- ══════════════════════════════════════════════════════════════════════════════

-- Add is_public + clone_count to trip_plans
ALTER TABLE trip_plans
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS clone_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cloned_from uuid REFERENCES trip_plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Index for public routes listing
CREATE INDEX IF NOT EXISTS idx_trip_plans_public ON trip_plans(created_at DESC) WHERE is_public = true;

-- Allow all logged-in users to read public routes
DROP POLICY IF EXISTS "trip_plans public read" ON trip_plans;
CREATE POLICY "trip_plans public read" ON trip_plans
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
