-- Destination-Bewertungen: pro Reiseziel, via slug (entkoppelt von reports.destination_id).
-- Wird für AggregateRating JSON-LD auf urlaubsziele/[destination]-Seiten genutzt.

CREATE TABLE IF NOT EXISTS destination_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  destination_slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT,
  traveled_at DATE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dest_reviews_slug      ON destination_reviews(destination_slug);
CREATE INDEX IF NOT EXISTS idx_dest_reviews_published ON destination_reviews(destination_slug, is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_dest_reviews_user      ON destination_reviews(user_id);

-- Eine Bewertung pro User pro Destination
CREATE UNIQUE INDEX IF NOT EXISTS uniq_dest_reviews_user_slug
  ON destination_reviews(user_id, destination_slug)
  WHERE user_id IS NOT NULL;

-- RLS: veröffentlichte Reviews öffentlich lesbar, Schreiben nur eingeloggt
ALTER TABLE destination_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "destination_reviews_read_public"
  ON destination_reviews FOR SELECT
  USING (is_published = true);

CREATE POLICY "destination_reviews_insert_own"
  ON destination_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "destination_reviews_update_own"
  ON destination_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "destination_reviews_delete_own"
  ON destination_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- updated_at Trigger
CREATE OR REPLACE FUNCTION touch_destination_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_destination_reviews_touch ON destination_reviews;
CREATE TRIGGER trg_destination_reviews_touch
  BEFORE UPDATE ON destination_reviews
  FOR EACH ROW EXECUTE FUNCTION touch_destination_reviews_updated_at();
