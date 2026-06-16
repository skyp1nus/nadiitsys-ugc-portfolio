-- ============================================================
-- PAGES — універсальна таблиця для всіх сторінок (Travel, Beauty, ...)
-- Кожна сторінка зберігається як JSON-blob у полі `data`.
-- Структура JSON валідується на рівні API через Zod-схеми.
-- ============================================================
CREATE TABLE IF NOT EXISTS pages (
  slug        TEXT PRIMARY KEY,
  data        TEXT NOT NULL,
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TRIGGER IF NOT EXISTS pages_updated_at
AFTER UPDATE ON pages
BEGIN
  UPDATE pages SET updated_at = unixepoch() WHERE slug = NEW.slug;
END;

-- ============================================================
-- MEDIA — фото / reel / hero / about-video / about-photo для кожної сторінки.
-- Файли в R2, метадані тут. Канонічна (фінальна) форма після міграцій 001–005.
-- IF NOT EXISTS → безпечно для вже наявних БД (no-op), потрібно для fresh-seed.
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
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

CREATE INDEX IF NOT EXISTS idx_media_page_kind_pos
  ON media(page_slug, kind, position);

CREATE UNIQUE INDEX IF NOT EXISTS idx_media_singleton
  ON media(page_slug, kind)
  WHERE kind IN ('hero', 'about-video');
