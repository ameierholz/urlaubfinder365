-- ══════════════════════════════════════════════════════════════════════════════
-- Migration 00012: Daily Travel Quiz & Trivia
-- ══════════════════════════════════════════════════════════════════════════════

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
DROP POLICY IF EXISTS "own trivia_scores" ON trivia_scores;
CREATE POLICY "own trivia_scores" ON trivia_scores
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_trivia_scores_user ON trivia_scores(user_id, quiz_date DESC);

-- Leaderboard: top scores of last 7 days (public read for logged in users)
DROP POLICY IF EXISTS "trivia_scores leaderboard" ON trivia_scores;
CREATE POLICY "trivia_scores leaderboard" ON trivia_scores
  FOR SELECT USING (auth.uid() IS NOT NULL);
