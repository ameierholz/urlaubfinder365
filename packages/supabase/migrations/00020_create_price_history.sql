-- ── price_history: normalisiertes Preisarchiv (append-only) ─────────────────
-- Ein Datensatz pro Destination × Datum × Profil.
-- Der Cron schreibt täglich per UPSERT.
-- RLS: öffentlich lesbar (anon key), Schreiben nur über Service Role.

CREATE TABLE IF NOT EXISTS price_history (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug  text          NOT NULL,
  destination_name  text          NOT NULL,
  profile           text          NOT NULL
    CHECK (profile IN ('pauschal', 'hotel', 'ai', 'last_minute')),
  date              date          NOT NULL,
  min_price         numeric(10,2) NOT NULL,
  avg_price         numeric(10,2) NOT NULL,
  deal_count        int           NOT NULL DEFAULT 0,
  created_at        timestamptz   DEFAULT now(),

  UNIQUE (destination_slug, date, profile)
);

-- Primärer Zugriffspfad: Destination + Profil + Zeitraum
CREATE INDEX idx_ph_dest_profile_date
  ON price_history (destination_slug, profile, date DESC);

-- Volltextsuche für Destination-Autocomplete
CREATE INDEX idx_ph_dest_name_fts
  ON price_history USING gin (to_tsvector('german', destination_name));

-- Für Monatsaggregation (Best-Time-to-Book)
CREATE INDEX idx_ph_date
  ON price_history (date DESC);

ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "price_history public read"
  ON price_history FOR SELECT USING (true);

CREATE POLICY "price_history service insert"
  ON price_history FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "price_history service update"
  ON price_history FOR UPDATE TO service_role USING (true);
