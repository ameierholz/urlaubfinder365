CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  max_price_cents INTEGER NOT NULL,
  offer_type TEXT DEFAULT 'pauschal',
  departure_airports TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;
