-- Migration 00023: Push-Subscriptions für Web Push Notifications (Preisalarm)

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint     text NOT NULL,
  p256dh       text NOT NULL,
  auth         text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),

  -- Eindeutig pro User+Endpoint (ein User, mehrere Geräte möglich)
  UNIQUE(user_id, endpoint)
);

-- Index für schnelle Lookups nach user_id (Push nach Alert-Match)
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);

-- RLS: User sieht und verwaltet nur eigene Subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_push_subscription"
  ON push_subscriptions
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service Role darf alle lesen (für Cron-Job Push-Sending)
CREATE POLICY "service_role_read_push"
  ON push_subscriptions
  FOR SELECT
  USING (auth.role() = 'service_role');
