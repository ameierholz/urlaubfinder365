-- ── Admin-Rollen ─────────────────────────────────────────────────────────────
-- Fügt eine `role`-Spalte zur users-Tabelle hinzu.
-- Mögliche Werte: 'user' | 'admin' | 'moderator' | 'support'
-- Standard: 'user' für alle neuen Accounts

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin', 'moderator', 'support'));

-- ── Helper-Funktion: is_admin() ───────────────────────────────────────────────
-- Kann in RLS-Policies und Server-Code genutzt werden.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── Helper-Funktion: has_role(text) ──────────────────────────────────────────
-- Flexibel für Moderator- und Support-Checks.
CREATE OR REPLACE FUNCTION has_role(check_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = check_role
  );
$$;

-- ── RLS: Admins dürfen alle User-Profile lesen ───────────────────────────────
CREATE POLICY "users_admin_read_all" ON users
  FOR SELECT USING (is_admin());

-- ── RLS: Admins dürfen alle User-Profile aktualisieren ───────────────────────
CREATE POLICY "users_admin_update_all" ON users
  FOR UPDATE USING (is_admin());
