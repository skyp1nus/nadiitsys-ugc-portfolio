import { getDB } from "@/lib/db";
import { getR2, publicUrl } from "@/lib/r2";

export type PageSlug = "travel" | "beauty";
export type MediaKind = "photo" | "reel";

export interface MediaItem {
  key: string;
  pageSlug: PageSlug;
  kind: MediaKind;
  position: number;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number;
  mime: string;
  createdAt: number;
  url: string;
}

interface MediaRow {
  key: string;
  page_slug: string;
  kind: string;
  position: number;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number;
  mime: string;
  created_at: number;
}

function rowToItem(row: MediaRow): MediaItem {
  return {
    key: row.key,
    pageSlug: row.page_slug as PageSlug,
    kind: row.kind as MediaKind,
    position: row.position,
    alt: row.alt,
    caption: row.caption,
    width: row.width,
    height: row.height,
    sizeBytes: row.size_bytes,
    mime: row.mime,
    createdAt: row.created_at,
    url: publicUrl(row.key),
  };
}

export async function listMedia(
  pageSlug: PageSlug,
  kind: MediaKind,
): Promise<MediaItem[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(
      `SELECT key, page_slug, kind, position, alt, caption, width, height,
              size_bytes, mime, created_at
       FROM media
       WHERE page_slug = ? AND kind = ?
       ORDER BY position ASC, created_at ASC`,
    )
    .bind(pageSlug, kind)
    .all<MediaRow>();
  return results.map(rowToItem);
}

export interface UploadInput {
  pageSlug: PageSlug;
  kind: MediaKind;
  file: File;
  fileName: string;
  mime: string;
  alt?: string;
  width?: number;
  height?: number;
}

export async function uploadMedia(input: UploadInput): Promise<MediaItem> {
  const db = await getDB();
  const r2 = await getR2();

  const safeName = input.fileName.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
  const ext = safeName.split(".").pop() || "bin";
  const id = crypto.randomUUID();
  const key = `${input.pageSlug}/${input.kind}s/${id}.${ext}`;

  await r2.put(key, await input.file.arrayBuffer(), {
    httpMetadata: {
      contentType: input.mime,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const posRow = await db
    .prepare(
      `SELECT COALESCE(MAX(position), -1) + 1 AS next_pos
       FROM media WHERE page_slug = ? AND kind = ?`,
    )
    .bind(input.pageSlug, input.kind)
    .first<{ next_pos: number }>();
  const position = posRow?.next_pos ?? 0;

  const sizeBytes = input.file.size;
  await db
    .prepare(
      `INSERT INTO media (key, page_slug, kind, position, alt, width, height, size_bytes, mime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      key,
      input.pageSlug,
      input.kind,
      position,
      input.alt ?? null,
      input.width ?? null,
      input.height ?? null,
      sizeBytes,
      input.mime,
    )
    .run();

  return {
    key,
    pageSlug: input.pageSlug,
    kind: input.kind,
    position,
    alt: input.alt ?? null,
    caption: null,
    width: input.width ?? null,
    height: input.height ?? null,
    sizeBytes,
    mime: input.mime,
    createdAt: Math.floor(Date.now() / 1000),
    url: publicUrl(key),
  };
}

export async function deleteMedia(key: string): Promise<void> {
  const db = await getDB();
  const r2 = await getR2();
  await r2.delete(key);
  await db.prepare("DELETE FROM media WHERE key = ?").bind(key).run();
}

export async function reorderMedia(
  pageSlug: PageSlug,
  kind: MediaKind,
  orderedKeys: string[],
): Promise<void> {
  const db = await getDB();
  const stmts = orderedKeys.map((key, idx) =>
    db
      .prepare(
        `UPDATE media SET position = ? WHERE key = ? AND page_slug = ? AND kind = ?`,
      )
      .bind(idx, key, pageSlug, kind),
  );
  if (stmts.length === 0) return;
  await db.batch(stmts);
}

export async function updateMediaMeta(
  key: string,
  patch: { alt?: string; caption?: string },
): Promise<void> {
  const db = await getDB();
  const fields: string[] = [];
  const binds: unknown[] = [];
  if (patch.alt !== undefined) {
    fields.push("alt = ?");
    binds.push(patch.alt);
  }
  if (patch.caption !== undefined) {
    fields.push("caption = ?");
    binds.push(patch.caption);
  }
  if (fields.length === 0) return;
  binds.push(key);
  await db
    .prepare(`UPDATE media SET ${fields.join(", ")} WHERE key = ?`)
    .bind(...binds)
    .run();
}
