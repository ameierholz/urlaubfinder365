-- SEO-Metadaten für Destination-SEO-Texte
-- Meta Titel, Meta Description, Fokus-Keyword und weitere Keywords
ALTER TABLE destination_seo_texts
  ADD COLUMN IF NOT EXISTS meta_title        TEXT,
  ADD COLUMN IF NOT EXISTS meta_description  TEXT,
  ADD COLUMN IF NOT EXISTS focus_keyword     TEXT,
  ADD COLUMN IF NOT EXISTS keywords          TEXT;

COMMENT ON COLUMN destination_seo_texts.meta_title       IS 'SEO Meta-Titel (max. 60 Zeichen)';
COMMENT ON COLUMN destination_seo_texts.meta_description IS 'SEO Meta-Description (max. 160 Zeichen)';
COMMENT ON COLUMN destination_seo_texts.focus_keyword    IS 'Haupt-Fokuskeyword (z. B. "Türkei Urlaub")';
COMMENT ON COLUMN destination_seo_texts.keywords         IS 'Weitere Keywords, kommagetrennt';
