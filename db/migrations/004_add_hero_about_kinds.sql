-- Розширити media.kind: додати 'hero' (single image) і 'about-video' (single video).
-- SQLite не вміє ALTER CHECK — потрібен table rebuild.

PRAGMA foreign_keys=OFF;

CREATE TABLE media_new (
  key         TEXT PRIMARY KEY,
  page_slug   TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('photo', 'reel', 'hero', 'about-video')),
  position    INTEGER NOT NULL DEFAULT 0,
  alt         TEXT,
  caption     TEXT,
  width       INTEGER,
  height      INTEGER,
  size_bytes  INTEGER NOT NULL,
  mime        TEXT NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  location    TEXT,
  tags        TEXT,
  views       TEXT
);

INSERT INTO media_new (
  key, page_slug, kind, position, alt, caption, width, height,
  size_bytes, mime, created_at, location, tags, views
)
SELECT
  key, page_slug, kind, position, alt, caption, width, height,
  size_bytes, mime, created_at, location, tags, views
FROM media;

DROP TABLE media;
ALTER TABLE media_new RENAME TO media;

CREATE INDEX IF NOT EXISTS idx_media_page_kind_pos
  ON media(page_slug, kind, position);

-- Singleton enforcement: 1 row per (page_slug, kind) для hero / about-video.
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_singleton
  ON media(page_slug, kind)
  WHERE kind IN ('hero', 'about-video');

PRAGMA foreign_keys=ON;
