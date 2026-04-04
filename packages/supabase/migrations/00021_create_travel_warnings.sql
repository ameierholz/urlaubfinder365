-- ── travel_warnings: Aktuelle Reisewarnungen des Auswärtigen Amts ────────────
-- Wird täglich per Cron von der offiziellen AA-API befüllt.
-- RLS: öffentlich lesbar, Schreiben nur Service Role.

CREATE TABLE IF NOT EXISTS travel_warnings (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  iso3_country_code   text        NOT NULL,
  iso2_country_code   text,
  country_name        text        NOT NULL,
  warning_level       text        NOT NULL DEFAULT 'none'
    CHECK (warning_level IN ('warning', 'partial', 'note', 'none')),
  situation_short     text,        -- erste ~500 Zeichen der Situationsbeschreibung
  source_url          text,
  aa_last_updated     timestamptz,
  fetched_at          timestamptz DEFAULT now(),

  UNIQUE (iso3_country_code)
);

CREATE INDEX idx_tw_level   ON travel_warnings (warning_level);
CREATE INDEX idx_tw_country ON travel_warnings (lower(country_name));

ALTER TABLE travel_warnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "travel_warnings public read"
  ON travel_warnings FOR SELECT USING (true);

CREATE POLICY "travel_warnings service write"
  ON travel_warnings FOR ALL TO service_role USING (true);
