-- ── Travel Tips: Moderation + Bilder ─────────────────────────────────────────
-- Fügt status (pending/approved/rejected) und image_url zu travel_tips hinzu.
-- Nur freigegebene Tipps werden öffentlich angezeigt.

-- Status-Spalte
ALTER TABLE travel_tips
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Bild-URL (Supabase Storage)
ALTER TABLE travel_tips
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Admin-Hinweis (optional, für Ablehnung)
ALTER TABLE travel_tips
  ADD COLUMN IF NOT EXISTS admin_note TEXT;

-- Index für schnelle Admin-Abfragen
CREATE INDEX IF NOT EXISTS travel_tips_status_idx ON travel_tips (status);

-- ── Storage Bucket ────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'travel-tip-images',
  'travel-tip-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ── RLS: Öffentlich lesen ─────────────────────────────────────────────────────
CREATE POLICY "travel_tips_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'travel-tip-images');

-- ── RLS: Authentifizierte User dürfen hochladen ───────────────────────────────
CREATE POLICY "travel_tips_images_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'travel-tip-images'
    AND auth.role() = 'authenticated'
  );

-- ── RLS: User darf eigene Bilder löschen ─────────────────────────────────────
CREATE POLICY "travel_tips_images_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'travel-tip-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── RLS: travel_tips – nur approved sichtbar (außer für den Eigentümer + Admin)
DROP POLICY IF EXISTS "travel_tips_public_read" ON travel_tips;
CREATE POLICY "travel_tips_public_read" ON travel_tips
  FOR SELECT USING (
    status = 'approved'
    OR user_id = auth.uid()
    OR is_admin()
  );

-- ── RLS: Admin darf Status und Note setzen ────────────────────────────────────
CREATE POLICY "travel_tips_admin_update" ON travel_tips
  FOR UPDATE USING (is_admin());
