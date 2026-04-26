import { getDB } from "@/lib/db";
import { TravelPageSchema, type TravelPageInput } from "@/lib/schemas/travel-page";

export type PageSlug = "travel" | "beauty";

interface PageRow {
  slug: string;
  data: string;
  updated_at: number;
}

export async function getPage(slug: PageSlug): Promise<TravelPageInput | null> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT slug, data, updated_at FROM pages WHERE slug = ?")
    .bind(slug)
    .first<PageRow>();

  if (!row) return null;

  const parsed = JSON.parse(row.data);
  return TravelPageSchema.parse(parsed);
}

export async function upsertPage(slug: PageSlug, data: TravelPageInput): Promise<void> {
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
