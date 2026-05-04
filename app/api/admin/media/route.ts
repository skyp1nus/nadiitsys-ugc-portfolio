import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logger } from "@/lib/logger";
import {
  listMedia,
  uploadMedia,
  replaceSingleMedia,
  uploadPoster,
  isSingletonKind,
  type PageSlug,
  type MediaKind,
} from "@/lib/repos/media";

const ALLOWED_PAGE: PageSlug[] = ["travel", "beauty"];
const ALLOWED_KIND: MediaKind[] = ["photo", "reel", "hero", "about-video", "about-photo"];

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_REEL_BYTES = 50 * 1024 * 1024;
const ALLOWED_PHOTO_MIME = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_REEL_MIME = ["video/mp4", "video/quicktime", "video/webm"];

function isImageKind(kind: MediaKind): boolean {
  return kind === "photo" || kind === "hero" || kind === "about-photo";
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const { searchParams } = new URL(req.url);
  const pageSlug = searchParams.get("page");
  const kind = searchParams.get("kind");

  if (!ALLOWED_PAGE.includes(pageSlug as PageSlug)) {
    return NextResponse.json(
      { ok: false, error: "Invalid page slug" },
      { status: 400 },
    );
  }
  if (!ALLOWED_KIND.includes(kind as MediaKind)) {
    return NextResponse.json(
      { ok: false, error: "Invalid media kind" },
      { status: 400 },
    );
  }

  try {
    const items = await listMedia(pageSlug as PageSlug, kind as MediaKind);
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("media GET", msg);
    return NextResponse.json(
      { ok: false, error: "List failed" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid multipart form" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const pageSlug = formData.get("page");
  const kind = formData.get("kind");
  const altRaw = formData.get("alt");
  const alt = typeof altRaw === "string" && altRaw.length > 0 ? altRaw : undefined;

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid file" },
      { status: 400 },
    );
  }
  if (typeof pageSlug !== "string" || !ALLOWED_PAGE.includes(pageSlug as PageSlug)) {
    return NextResponse.json(
      { ok: false, error: "Invalid page slug" },
      { status: 400 },
    );
  }
  if (typeof kind !== "string" || !ALLOWED_KIND.includes(kind as MediaKind)) {
    return NextResponse.json(
      { ok: false, error: "Invalid media kind" },
      { status: 400 },
    );
  }

  const typedKind = kind as MediaKind;
  const isImage = isImageKind(typedKind);
  const maxBytes = isImage ? MAX_PHOTO_BYTES : MAX_REEL_BYTES;
  const allowedMime = isImage ? ALLOWED_PHOTO_MIME : ALLOWED_REEL_MIME;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { ok: false, error: `File too large (max ${maxBytes / 1024 / 1024} MB)` },
      { status: 413 },
    );
  }
  if (!allowedMime.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: `MIME ${file.type} not allowed for ${kind}` },
      { status: 415 },
    );
  }

  try {
    const uploadFn = isSingletonKind(typedKind) ? replaceSingleMedia : uploadMedia;
    const item = await uploadFn({
      pageSlug: pageSlug as PageSlug,
      kind: typedKind,
      file,
      fileName: file.name,
      mime: file.type,
      alt,
    });

    if (typedKind === "reel") {
      const posterFile = formData.get("posterFile");
      if (posterFile instanceof File && posterFile.size > 0) {
        try {
          await uploadPoster(item.key, posterFile);
        } catch (err) {
          logger.warn("media POST", "poster upload failed", err);
        }
      }
    }

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("media POST", msg);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
