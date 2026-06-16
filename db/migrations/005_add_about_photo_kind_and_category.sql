-- 005: додати 'about-photo' до media.kind CHECK (фікс upload 500 у секції About)
-- + новий nullable стовпець `category` (категорія reel для фільтра на сайті).
-- SQLite не вміє ALTER CHECK / ALTER додати CHECK — потрібен table rebuild (як 004).

PRAGMA foreign_keys=OFF;

CREATE TABLE media_new (
  key         TEXT PRIMARY KEY,
  page_slug   TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('photo', 'reel', 'hero', 'about-video', 'about-photo')),
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
  views       TEXT,
  category    TEXT
);

-- `category` навмисно НЕ в списку колонок — старі рядки отримують NULL.
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

-- Singleton enforcement лишається тільки для hero / about-video.
-- about-photo — звичайний список (не singleton), тому в цей індекс не додаємо.
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_singleton
  ON media(page_slug, kind)
  WHERE kind IN ('hero', 'about-video');

PRAGMA foreign_keys=ON;
