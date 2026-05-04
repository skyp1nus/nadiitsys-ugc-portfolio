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
