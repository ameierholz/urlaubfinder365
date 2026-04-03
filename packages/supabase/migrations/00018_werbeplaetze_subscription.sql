-- Migration 00018: werbeplaetze_buchungen auf Subscription-Flow upgraden
-- Fügt Stripe-Subscription-Felder + Anbieter-Kontaktdaten + Inhaltsprüfungs-Status hinzu

-- Tabelle anlegen falls noch nicht vorhanden (Safety-Check)
CREATE TABLE IF NOT EXISTS werbeplaetze_buchungen (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                timestamptz NOT NULL DEFAULT now(),
  anbieter_id               uuid REFERENCES anbieter_profile(id) ON DELETE SET NULL,
  paket                     text NOT NULL,
  zielseite                 text,
  laufzeit_monate           int NOT NULL DEFAULT 1,
  preis_monatlich           numeric(10,2) NOT NULL,
  preis_gesamt              numeric(10,2) NOT NULL,
  status                    text NOT NULL DEFAULT 'angefragt',
  admin_notiz               text,
  placement_info            text,
  starts_at                 timestamptz,
  ends_at                   timestamptz,
  bezahlt_at                timestamptz,
  stripe_checkout_session_id text,
  stripe_payment_intent_id  text
);

-- Neue Felder für Subscription-Flow
ALTER TABLE werbeplaetze_buchungen
  ADD COLUMN IF NOT EXISTS stripe_subscription_id  text,
  ADD COLUMN IF NOT EXISTS stripe_customer_id      text,
  ADD COLUMN IF NOT EXISTS stripe_price_id         text,
  -- Kontaktdaten für Nicht-Anbieter (direkt von Homepage-Modal)
  ADD COLUMN IF NOT EXISTS kontakt_name            text,
  ADD COLUMN IF NOT EXISTS kontakt_firma           text,
  ADD COLUMN IF NOT EXISTS kontakt_email           text,
  ADD COLUMN IF NOT EXISTS angebot_url             text,
  -- Inhaltsprüfung: eingereichte Werbemittel
  ADD COLUMN IF NOT EXISTS werbeinhalt_text        text,
  ADD COLUMN IF NOT EXISTS werbeinhalt_bild_url    text,
  -- Stripe-Subscription-Status (gespiegelt von Stripe)
  ADD COLUMN IF NOT EXISTS sub_status              text, -- active | past_due | canceled | unpaid
  ADD COLUMN IF NOT EXISTS naechste_zahlung_at     timestamptz,
  ADD COLUMN IF NOT EXISTS gekuendigt_at           timestamptz;

-- Status-Werte:
--   angefragt          → Zahlung eingegangen, wartet auf Inhaltsprüfung
--   aktiv              → Admin freigegeben, Spot ist live
--   storniert          → Admin abgelehnt ODER Anbieter selbst gekündigt
--   abgelaufen         → Subscription vom Anbieter nicht verlängert
--   zahlungsproblem    → invoice.payment_failed

-- Index für schnelle Abfragen nach Status
CREATE INDEX IF NOT EXISTS idx_werbeplaetze_status ON werbeplaetze_buchungen(status);
CREATE INDEX IF NOT EXISTS idx_werbeplaetze_sub    ON werbeplaetze_buchungen(stripe_subscription_id);
