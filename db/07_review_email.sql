-- =============================================================
-- Add reviewer_email so admins can trace who submitted a review
-- when moderating. Never surfaced on the public site.
-- =============================================================

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS reviewer_email TEXT;

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS submission_source TEXT NOT NULL DEFAULT 'admin';
-- Values: 'admin' (created via CMS), 'public' (submitted via public form).

-- Backfill all existing reviews as admin-created (they were)
UPDATE reviews SET submission_source = 'admin' WHERE submission_source IS NULL;

-- Index for the pending-moderation query
CREATE INDEX IF NOT EXISTS idx_reviews_pending_moderation
  ON reviews(created_at DESC)
  WHERE published = false AND submission_source = 'public';
