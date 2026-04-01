-- ══════════════════════════════════════════════════════════════════════════════
-- SCHRITT 1 von 2: TABELLEN ANLEGEN
-- Diesen Block zuerst ausführen, dann seed_demo_data.sql
-- ══════════════════════════════════════════════════════════════════════════════

-- user_streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak int NOT NULL DEFAULT 0,
  longest_streak int NOT NULL DEFAULT 0,
  total_coins int NOT NULL DEFAULT 0,
  last_checkin_date date,
  checkin_history date[] NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_streaks' AND policyname='own streaks') THEN
    CREATE POLICY "own streaks" ON user_streaks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- coin_transactions
CREATE TABLE IF NOT EXISTS coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount int NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='coin_transactions' AND policyname='own coin_transactions') THEN
    CREATE POLICY "own coin_transactions" ON coin_transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- trivia_scores
CREATE TABLE IF NOT EXISTS trivia_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_date date NOT NULL,
  score int NOT NULL DEFAULT 0,
  max_score int NOT NULL DEFAULT 0,
  time_seconds int,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quiz_date)
);
ALTER TABLE trivia_scores ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='trivia_scores' AND policyname='trivia_scores leaderboard') THEN
    CREATE POLICY "trivia_scores leaderboard" ON trivia_scores FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='trivia_scores' AND policyname='own trivia_scores') THEN
    CREATE POLICY "own trivia_scores" ON trivia_scores FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- media_feed
CREATE TABLE IF NOT EXISTS media_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  photo_url text,
  destination text NOT NULL,
  destination_slug text NOT NULL DEFAULT '',
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image','video')),
  caption text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  likes_count int NOT NULL DEFAULT 0,
  liked_by text[] NOT NULL DEFAULT '{}',
  comments_count int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media_feed ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='media_feed' AND policyname='media_feed public read') THEN
    CREATE POLICY "media_feed public read" ON media_feed FOR SELECT USING (is_published = true);
    CREATE POLICY "media_feed insert"      ON media_feed FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "media_feed update"      ON media_feed FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "media_feed delete"      ON media_feed FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- travel_buddies
CREATE TABLE IF NOT EXISTS travel_buddies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  photo_url text,
  age_range text NOT NULL DEFAULT '25-35',
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
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='travel_buddies' AND policyname='travel_buddies read') THEN
    CREATE POLICY "travel_buddies read"  ON travel_buddies FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);
    CREATE POLICY "travel_buddies write" ON travel_buddies FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- buddy_requests
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
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='buddy_requests' AND policyname='buddy_requests own') THEN
    CREATE POLICY "buddy_requests own" ON buddy_requests
      FOR ALL USING (auth.uid() = from_user_id OR auth.uid() = to_user_id)
      WITH CHECK (auth.uid() = from_user_id);
  END IF;
END $$;

-- trip_plans: neue Spalten für Routen-Sharing
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS clone_count int NOT NULL DEFAULT 0;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS cloned_from uuid REFERENCES trip_plans(id) ON DELETE SET NULL;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS cover_image_url text;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='trip_plans' AND policyname='trip_plans public read') THEN
    CREATE POLICY "trip_plans public read" ON trip_plans FOR SELECT USING (is_public = true OR auth.uid() = user_id);
  END IF;
END $$;

-- users: neue Spalten aus Migration 00010
ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_destinations text[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS saved_trip_codes text[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS checklist jsonb DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notes text DEFAULT NULL;

SELECT 'Tabellen erfolgreich angelegt ✓' AS status;
