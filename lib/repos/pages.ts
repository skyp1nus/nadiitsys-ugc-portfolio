import { getDB } from "@/lib/db";
import { TravelPageSchema, type TravelPageInput } from "@/lib/schemas/travel-page";
import { BeautyPageSchema, type BeautyPageInput } from "@/lib/schemas/beauty-page";

export type PageSlug = "travel" | "beauty";

interface PageRow {
  slug: string;
  data: string;
  updated_at: number;
}

async function getRawPage(slug: PageSlug): Promise<unknown | null> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT slug, data, updated_at FROM pages WHERE slug = ?")
    .bind(slug)
    .first<PageRow>();

  if (!row) return null;

  try {
    return JSON.parse(row.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Corrupt JSON in pages row "${slug}": ${msg}`);
  }
}

export async function getTravelPage(): Promise<TravelPageInput | null> {
  const parsed = await getRawPage("travel");
  if (!parsed) return null;
  return TravelPageSchema.parse(parsed);
}

export async function getBeautyPage(): Promise<BeautyPageInput | null> {
  const parsed = await getRawPage("beauty");
  if (!parsed) return null;
  return BeautyPageSchema.parse(parsed);
}

async function upsertRaw(slug: PageSlug, data: unknown): Promise<void> {
  const db = await getDB();
  const json = JSON.stringify(data);
  await db
    .prepare(
      `INSERT INTO pages (slug, data) VALUES (?, ?)
       ON CONFLICT(slug) DO UPDATE SET data = excluded.data`
    )
    .bind(slug, json)
    .run();
}

export async function upsertTravelPage(data: TravelPageInput): Promise<void> {
  await upsertRaw("travel", data);
}

export async function upsertBeautyPage(data: BeautyPageInput): Promise<void> {
  await upsertRaw("beauty", data);
}
