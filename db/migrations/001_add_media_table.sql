-- Media — фото та reel-відео для Travel/Beauty сторінок
CREATE TABLE IF NOT EXISTS media (
  key         TEXT PRIMARY KEY,
  page_slug   TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('photo', 'reel')),
  position    INTEGER NOT NULL DEFAULT 0,
  alt         TEXT,
  caption     TEXT,
  width       INTEGER,
  height      INTEGER,
  size_bytes  INTEGER NOT NULL,
  mime        TEXT NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_media_page_kind_pos
  ON media(page_slug, kind, position);
