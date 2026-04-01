-- ══════════════════════════════════════════════════════════════════════════════
-- Migration 00010: User-Datentabellen (ersetzt Firestore)
-- Alle User-spezifischen Daten die zuvor in Firebase Firestore lagen.
-- ══════════════════════════════════════════════════════════════════════════════

-- Zusätzliche Spalten in der users-Tabelle
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS favorite_destinations text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS saved_trip_codes text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS checklist jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS notes text DEFAULT NULL;

-- ── Gespeicherte Reisen ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer jsonb NOT NULL,
  notes text,
  deleted boolean DEFAULT false,
  saved_at timestamptz DEFAULT now()
);
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own saved_trips" ON saved_trips
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_saved_trips_user ON saved_trips(user_id) WHERE deleted = false;

-- ── Gespeicherte Aktivitäten ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity jsonb NOT NULL,
  deleted boolean DEFAULT false,
  saved_at timestamptz DEFAULT now()
);
ALTER TABLE saved_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own saved_activities" ON saved_activities
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_saved_activities_user ON saved_activities(user_id) WHERE deleted = false;

-- ── Reisepläne ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trip_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  destination text NOT NULL,
  destination_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  adults int NOT NULL DEFAULT 2,
  children int NOT NULL DEFAULT 0,
  budget numeric(10,2) DEFAULT 0,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','confirmed','completed')),
  linked_trip_ids text[] DEFAULT '{}',
  linked_activity_ids text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE trip_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own trip_plans" ON trip_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_trip_plans_user ON trip_plans(user_id);

-- ── Reisedokumente ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS travel_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('passport','insurance','visa','vaccination','emergency')),
  label text,
  passport_number text,
  expiry_date date,
  issued_date date,
  nationality text,
  insurance_provider text,
  policy_number text,
  insurance_expiry_date date,
  emergency_phone text,
  visa_country text,
  visa_expiry_date date,
  vaccination_type text,
  vaccination_date date,
  contact_name text,
  contact_phone text,
  contact_email text,
  contact_relationship text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE travel_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own travel_documents" ON travel_documents
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_travel_documents_user ON travel_documents(user_id);

-- ── Reisenden-Karte: Travel Tips ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS travel_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('geheimtipp','sehenswuerdigkeit','gastronomie','negativ')),
  location_name text NOT NULL,
  lat numeric(10,7) NOT NULL,
  lng numeric(10,7) NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE travel_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "travel_tips read" ON travel_tips FOR SELECT USING (true);
CREATE POLICY "travel_tips insert" ON travel_tips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "travel_tips modify" ON travel_tips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "travel_tips delete" ON travel_tips FOR DELETE USING (auth.uid() = user_id);

-- ── Bereiste Länder ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visited_countries (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  countries text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE visited_countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own visited_countries" ON visited_countries
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Preisverläufe (öffentlich, nur vom Cron-Job beschreibbar) ────────────────
CREATE TABLE IF NOT EXISTS price_trends (
  slug text PRIMARY KEY,
  destination_name text NOT NULL,
  last_updated timestamptz DEFAULT now(),
  current_min_price numeric(10,2) DEFAULT 0,
  current_deal_count int DEFAULT 0,
  snapshots jsonb DEFAULT '[]',
  pauschal jsonb DEFAULT NULL,
  hotel jsonb DEFAULT NULL,
  ai jsonb DEFAULT NULL
);
ALTER TABLE price_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "price_trends read" ON price_trends FOR SELECT USING (true);
-- Write nur per Service-Role-Key (Cron-Job)

-- ── Community: Reiseberichte ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS travel_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  destination text NOT NULL,
  country text NOT NULL,
  title text NOT NULL,
  highlights text NOT NULL DEFAULT '',
  lowlights text NOT NULL DEFAULT '',
  tips text NOT NULL DEFAULT '',
  price_range text NOT NULL DEFAULT 'mittel',
  rating int NOT NULL DEFAULT 3 CHECK (rating BETWEEN 1 AND 5),
  recommendation boolean NOT NULL DEFAULT true,
  cover_image_url text,
  visited_at text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  likes_count int NOT NULL DEFAULT 0,
  liked_by text[] NOT NULL DEFAULT '{}',
  comments_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE travel_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "travel_reports public read" ON travel_reports
  FOR SELECT USING (is_published = true OR auth.uid() = user_id);
CREATE POLICY "travel_reports insert" ON travel_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "travel_reports update" ON travel_reports
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "travel_reports delete" ON travel_reports
  FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_travel_reports_published ON travel_reports(created_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_travel_reports_user ON travel_reports(user_id, created_at DESC);

-- ── Community: Kommentare ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS travel_report_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES travel_reports(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE travel_report_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments read" ON travel_report_comments FOR SELECT USING (true);
CREATE POLICY "comments insert" ON travel_report_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments delete" ON travel_report_comments
  FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_comments_report ON travel_report_comments(report_id, created_at ASC);

-- ── Community: Profile ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_profiles (
  uid uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  photo_url text,
  bio text,
  location text,
  nationality text,
  visited_countries text[] DEFAULT '{}',
  followers_count int NOT NULL DEFAULT 0,
  following_count int NOT NULL DEFAULT 0,
  reports_count int NOT NULL DEFAULT 0,
  tips_count int NOT NULL DEFAULT 0,
  groups_count int NOT NULL DEFAULT 0,
  travel_frequency text,
  traveler_type text,
  languages text[] DEFAULT '{}',
  travel_interests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE community_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "community_profiles read" ON community_profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "community_profiles own write" ON community_profiles
  FOR ALL USING (auth.uid() = uid) WITH CHECK (auth.uid() = uid);

-- ── Follower-System ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows read" ON user_follows FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "follows write" ON user_follows
  FOR ALL USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

-- ── Community: Gruppen ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS travel_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  destination text NOT NULL DEFAULT '',
  tags text[] DEFAULT '{}',
  is_public boolean NOT NULL DEFAULT true,
  members_count int NOT NULL DEFAULT 1,
  member_ids text[] NOT NULL DEFAULT '{}',
  posts_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE travel_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "travel_groups read" ON travel_groups FOR SELECT USING (is_public = true OR auth.uid()::text = ANY(member_ids));
CREATE POLICY "travel_groups insert" ON travel_groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "travel_groups update" ON travel_groups FOR UPDATE USING (auth.uid() = creator_id OR auth.uid()::text = ANY(member_ids));
CREATE POLICY "travel_groups delete" ON travel_groups FOR DELETE USING (auth.uid() = creator_id);

-- ── Gruppen-Posts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES travel_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  text text NOT NULL,
  likes_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "group_posts read" ON group_posts FOR SELECT USING (true);
CREATE POLICY "group_posts insert" ON group_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "group_posts delete" ON group_posts FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group ON group_posts(group_id, created_at DESC);
