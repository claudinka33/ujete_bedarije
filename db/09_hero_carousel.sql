-- =============================================================
-- Hero carousel — slike + videji (max 5), auto-rotacija.
-- Videji so direktno upload-ani v Vercel Blob, da lahko auto-playajo
-- (Instagram embed tega ne omogoča).
-- =============================================================

CREATE TABLE IF NOT EXISTS hero_media (
  id              SERIAL PRIMARY KEY,
  media_type      TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url       TEXT NOT NULL,
  blob_pathname   TEXT,
  caption         TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  published       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_media_published
  ON hero_media(published, sort_order)
  WHERE published = true;
