-- ── Destinations: öffentlich lesbar ────────────────────────────
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "destinations_public_read" ON destinations
  FOR SELECT USING (true);

-- ── Users: eigenes Profil voll, öffentliche Profile lesbar ────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_public" ON users
  FOR SELECT USING (is_public = true OR id = auth.uid());
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

-- ── Offers: öffentlich lesbar ─────────────────────────────────
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers_public_read" ON offers
  FOR SELECT USING (is_active = true);

-- ── Reports: veröffentlichte lesbar, eigene CRUD ──────────────
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_read_published" ON reports
  FOR SELECT USING (is_published = true OR user_id = auth.uid());
CREATE POLICY "reports_insert_own" ON reports
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reports_update_own" ON reports
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "reports_delete_own" ON reports
  FOR DELETE USING (user_id = auth.uid());

-- ── Favorites: nur eigene ─────────────────────────────────────
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_own" ON favorites
  FOR ALL USING (user_id = auth.uid());

-- ── Price Alerts: nur eigene ──────────────────────────────────
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "price_alerts_own" ON price_alerts
  FOR ALL USING (user_id = auth.uid());

-- ── User Achievements: eigene lesen ───────────────────────────
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_achievements_read_own" ON user_achievements
  FOR SELECT USING (user_id = auth.uid());

-- ── Achievements: öffentlich lesbar ───────────────────────────
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements_public_read" ON achievements
  FOR SELECT USING (true);
