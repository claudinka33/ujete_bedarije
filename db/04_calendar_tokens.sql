-- =============================================================
-- Google Calendar sync — store OAuth tokens per user so we can
-- create calendar events on their behalf after they've granted
-- the calendar scope.
-- =============================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS google_access_token      TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_refresh_token     TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_token_expires_at  TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_calendar_id       TEXT DEFAULT 'primary';
ALTER TABLE users ADD COLUMN IF NOT EXISTS calendar_sync_enabled    BOOLEAN NOT NULL DEFAULT true;

-- Only staff (role != 'customer', if we ever have customers) should sync
CREATE INDEX IF NOT EXISTS idx_users_calendar_sync
  ON users(calendar_sync_enabled)
  WHERE calendar_sync_enabled = true;
