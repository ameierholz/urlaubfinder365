-- ══════════════════════════════════════════════════════════════════════════════
-- Migration 00016: price_alerts — Schema neu aufsetzen
-- Die alte Tabelle (00007) hatte destination_id/max_price_cents/is_active.
-- Der Code erwartet destination(text)/max_price(numeric)/adults/nights/enabled.
-- ══════════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS price_alerts CASCADE;

CREATE TABLE price_alerts (
  id                 uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination        text          NOT NULL,
  destination_name   text          NOT NULL,
  max_price          numeric(10,2) NOT NULL,
  adults             int           NOT NULL DEFAULT 2,
  nights             int           NOT NULL DEFAULT 7,
  enabled            boolean       NOT NULL DEFAULT true,
  matched_price      numeric(10,2),
  matched_at         timestamptz,
  matched_deal_count int,
  created_at         timestamptz   DEFAULT now()
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "price_alerts_own" ON price_alerts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user    ON price_alerts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_alerts_enabled ON price_alerts(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_price_alerts_dest    ON price_alerts(destination);
