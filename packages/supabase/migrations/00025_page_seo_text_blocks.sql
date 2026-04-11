-- SEO-Textblöcke für Seiten (wie bei Destinations)
-- Ergänzt page_seo_meta um strukturierte Inhaltsblöcke
ALTER TABLE page_seo_meta
  ADD COLUMN IF NOT EXISTS seo_intro      TEXT,
  ADD COLUMN IF NOT EXISTS seo_h2_middle  TEXT,
  ADD COLUMN IF NOT EXISTS seo_middle     TEXT,
  ADD COLUMN IF NOT EXISTS seo_h2_bottom  TEXT,
  ADD COLUMN IF NOT EXISTS seo_bottom     TEXT;

COMMENT ON COLUMN page_seo_meta.seo_intro     IS 'Kurzer emotionaler Einleitungstext direkt unter Hero (max. 80 Wörter)';
COMMENT ON COLUMN page_seo_meta.seo_h2_middle IS 'H2-Überschrift Mitte (vor Aktivitäten/Hauptinhalt)';
COMMENT ON COLUMN page_seo_meta.seo_middle    IS 'Mittlerer SEO-Text (150-200 Wörter, vor Hauptinhalt)';
COMMENT ON COLUMN page_seo_meta.seo_h2_bottom IS 'H2-Überschrift unten (Reiseführer/Ratgeber-Charakter)';
COMMENT ON COLUMN page_seo_meta.seo_bottom    IS 'Langer Ratgeber-Text ganz unten (500-600 Wörter, Hauptteil für SEO)';
