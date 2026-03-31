CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pauschal','hotel','flug','lastminute','kreuzfahrt')),
  title TEXT NOT NULL,
  provider TEXT,
  price_cents INTEGER NOT NULL,
  original_price_cents INTEGER,
  currency TEXT DEFAULT 'EUR',
  departure_airport TEXT,
  departure_date DATE,
  return_date DATE,
  duration_nights INTEGER,
  board_type TEXT,
  hotel_stars INTEGER,
  hotel_name TEXT,
  image_url TEXT,
  affiliate_url TEXT NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT,
  is_active BOOLEAN DEFAULT true,
  collected_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_offers_destination ON offers(destination_id);
CREATE INDEX idx_offers_type ON offers(type);
CREATE INDEX idx_offers_price ON offers(price_cents);
CREATE INDEX idx_offers_active ON offers(is_active) WHERE is_active = true;
