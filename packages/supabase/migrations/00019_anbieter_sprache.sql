-- Add language preference to anbieter_profile
ALTER TABLE anbieter_profile
  ADD COLUMN IF NOT EXISTS sprache TEXT NOT NULL DEFAULT 'de'
    CHECK (sprache IN ('de', 'en', 'tr', 'es', 'fr', 'it', 'pl', 'ru', 'ar'));
