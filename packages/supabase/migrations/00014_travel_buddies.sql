-- ══════════════════════════════════════════════════════════════════════════════
-- Migration 00014: Travel Buddies (Matchmaking)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS travel_buddies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  photo_url text,
  age_range text NOT NULL DEFAULT '25-35' CHECK (age_range IN ('18-24','25-35','36-45','46-55','56+')),
  gender text NOT NULL DEFAULT 'keine Angabe',
  languages text[] NOT NULL DEFAULT '{}',
  destinations text[] NOT NULL DEFAULT '{}',
  travel_style text[] NOT NULL DEFAULT '{}',
  bio text NOT NULL DEFAULT '',
  departure_from text NOT NULL DEFAULT '',
  travel_months text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE travel_buddies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "travel_buddies read" ON travel_buddies;
DROP POLICY IF EXISTS "travel_buddies write" ON travel_buddies;
CREATE POLICY "travel_buddies read"  ON travel_buddies FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);
CREATE POLICY "travel_buddies write" ON travel_buddies FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_travel_buddies_active ON travel_buddies(created_at DESC) WHERE is_active = true;

-- Buddy requests / contacts
CREATE TABLE IF NOT EXISTS buddy_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);
ALTER TABLE buddy_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "buddy_requests own" ON buddy_requests;
CREATE POLICY "buddy_requests own" ON buddy_requests
  FOR ALL USING (auth.uid() = from_user_id OR auth.uid() = to_user_id)
  WITH CHECK (auth.uid() = from_user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_to ON buddy_requests(to_user_id, created_at DESC);
