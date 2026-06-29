-- ============================================================
-- 006 — per-locale page content.
-- Move `pages` from PK(slug) to composite PK(slug, locale). Existing rows
-- become the 'en' (default) translation. Other locales fall back to 'en' in
-- the app layer until a translation is saved from the admin.
-- SQLite can't ALTER a primary key in place → rebuild the table.
-- ============================================================
DROP TRIGGER IF EXISTS pages_updated_at;

CREATE TABLE pages_new (
  slug        TEXT NOT NULL,
  locale      TEXT NOT NULL DEFAULT 'en',
  data        TEXT NOT NULL,
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (slug, locale)
);

INSERT INTO pages_new (slug, locale, data, updated_at)
  SELECT slug, 'en', data, updated_at FROM pages;

DROP TABLE pages;
ALTER TABLE pages_new RENAME TO pages;

CREATE TRIGGER IF NOT EXISTS pages_updated_at
AFTER UPDATE ON pages
BEGIN
  UPDATE pages SET updated_at = unixepoch()
  WHERE slug = NEW.slug AND locale = NEW.locale;
END;
