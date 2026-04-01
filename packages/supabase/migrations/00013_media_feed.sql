-- ══════════════════════════════════════════════════════════════════════════════
-- Migration 00013: Media Feed (Reels-Format)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS media_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  photo_url text,
  destination text NOT NULL,
  destination_slug text NOT NULL DEFAULT '',
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  caption text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  likes_count int NOT NULL DEFAULT 0,
  liked_by text[] NOT NULL DEFAULT '{}',
  comments_count int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media_feed ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "media_feed public read" ON media_feed;
DROP POLICY IF EXISTS "media_feed insert" ON media_feed;
DROP POLICY IF EXISTS "media_feed update" ON media_feed;
DROP POLICY IF EXISTS "media_feed delete" ON media_feed;
CREATE POLICY "media_feed public read" ON media_feed FOR SELECT USING (is_published = true);
CREATE POLICY "media_feed insert"      ON media_feed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "media_feed update"      ON media_feed FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "media_feed delete"      ON media_feed FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_media_feed_created ON media_feed(created_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_media_feed_destination ON media_feed(destination_slug, created_at DESC);

-- Seed demo posts (Unsplash images, no real user)
DO $$
DECLARE demo_uid uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM media_feed LIMIT 1) THEN
    INSERT INTO media_feed (user_id, display_name, destination, destination_slug, media_url, caption, tags) VALUES
      (demo_uid, 'Team Urlaubfinder', 'Santorini, Griechenland', 'santorini', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', 'Sonnenuntergang auf Santorini – einfach unvergesslich 🌅', ARRAY['griechenland','santorini','sonnenuntergang']),
      (demo_uid, 'Team Urlaubfinder', 'Bali, Indonesien', 'bali', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', 'Reisterrassen in Ubud – pure Natur 🌿', ARRAY['bali','indonesien','natur']),
      (demo_uid, 'Team Urlaubfinder', 'Marrakesch, Marokko', 'marrakesch', 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&q=80', 'Der Djemaa el-Fna bei Nacht 🎭', ARRAY['marokko','marrakesch','kultur']),
      (demo_uid, 'Team Urlaubfinder', 'Mallorca, Spanien', 'mallorca', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80', 'Traumstrand auf Mallorca ☀️', ARRAY['mallorca','spanien','strand']),
      (demo_uid, 'Team Urlaubfinder', 'Kappadokien, Türkei', 'kappadokien', 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80', 'Heißluftballons über Kappadokien 🎈', ARRAY['tuerkei','kappadokien','abenteuer']),
      (demo_uid, 'Team Urlaubfinder', 'Kyoto, Japan', 'kyoto', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', 'Goldener Pavillon in Kyoto ⛩️', ARRAY['japan','kyoto','kultur']),
      (demo_uid, 'Team Urlaubfinder', 'Malediven', 'malediven', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', 'Über dem Wasser schlafen — Luxus pur 💙', ARRAY['malediven','luxus','meer']),
      (demo_uid, 'Team Urlaubfinder', 'Antalya, Türkei', 'antalya', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 'Türkisblaues Wasser in Antalya 🐚', ARRAY['tuerkei','antalya','strand']);
  END IF;
END $$;
