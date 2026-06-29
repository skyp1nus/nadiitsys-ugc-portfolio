import { getDB } from "@/lib/db";
import { TravelPageSchema, type TravelPageInput } from "@/lib/schemas/travel-page";
import { BeautyPageSchema, type BeautyPageInput } from "@/lib/schemas/beauty-page";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

export type PageSlug = "travel" | "beauty";

interface PageRow {
  slug: string;
  data: string;
  locale: string;
  updated_at: number;
}

async function getRawPage(slug: PageSlug, locale: Locale): Promise<unknown | null> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT slug, data, locale, updated_at FROM pages WHERE slug = ? AND locale = ?")
    .bind(slug, locale)
    .first<PageRow>();

  if (!row) return null;

  try {
    return JSON.parse(row.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Corrupt JSON in pages row "${slug}/${locale}": ${msg}`);
  }
}

/**
 * Get a page for a locale. By default missing translations fall back to the
 * English row (set `fallback: false` for admin, to detect untranslated locales).
 */
export async function getTravelPage(
  locale: Locale = DEFAULT_LOCALE,
  { fallback = true }: { fallback?: boolean } = {}
): Promise<TravelPageInput | null> {
  const parsed = await getRawPage("travel", locale);
  if (parsed) return TravelPageSchema.parse(parsed);
  if (fallback && locale !== DEFAULT_LOCALE) {
    const en = await getRawPage("travel", DEFAULT_LOCALE);
    if (en) return TravelPageSchema.parse(en);
  }
  return null;
}

export async function getBeautyPage(
  locale: Locale = DEFAULT_LOCALE,
  { fallback = true }: { fallback?: boolean } = {}
): Promise<BeautyPageInput | null> {
  const parsed = await getRawPage("beauty", locale);
  if (parsed) return BeautyPageSchema.parse(parsed);
  if (fallback && locale !== DEFAULT_LOCALE) {
    const en = await getRawPage("beauty", DEFAULT_LOCALE);
    if (en) return BeautyPageSchema.parse(en);
  }
  return null;
}

async function upsertRaw(slug: PageSlug, locale: Locale, data: unknown): Promise<void> {
  const db = await getDB();
  const json = JSON.stringify(data);
  await db
    .prepare(
      `INSERT INTO pages (slug, locale, data) VALUES (?, ?, ?)
       ON CONFLICT(slug, locale) DO UPDATE SET data = excluded.data`
    )
    .bind(slug, locale, json)
    .run();
}

export async function upsertTravelPage(
  data: TravelPageInput,
  locale: Locale = DEFAULT_LOCALE
): Promise<void> {
  await upsertRaw("travel", locale, data);
}

export async function upsertBeautyPage(
  data: BeautyPageInput,
  locale: Locale = DEFAULT_LOCALE
): Promise<void> {
  await upsertRaw("beauty", locale, data);
}
