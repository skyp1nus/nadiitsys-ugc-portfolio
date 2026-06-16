import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteMedia, updateMediaMeta } from "@/lib/repos/media";
import { isReelCategory } from "@/lib/categories";

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ key: string[] }> },
): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const { key } = await ctx.params;
  const fullKey = key.join("/");

  try {
    await deleteMedia(fullKey);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[media DELETE]", msg);
    return NextResponse.json(
      { ok: false, error: "Delete failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ key: string[] }> },
): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const { key } = await ctx.params;
  const fullKey = key.join("/");

  let body: {
    alt?: string;
    caption?: string;
    location?: string;
    tags?: string;
    views?: string;
    category?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  // "" дозволяємо як «очистити категорію»; будь-що інше має бути валідним slug.
  if (
    body.category !== undefined &&
    body.category !== "" &&
    !isReelCategory(body.category)
  ) {
    return NextResponse.json(
      { ok: false, error: "Invalid category" },
      { status: 400 },
    );
  }

  try {
    await updateMediaMeta(fullKey, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[media PATCH]", msg);
    return NextResponse.json(
      { ok: false, error: "Update failed" },
      { status: 500 },
    );
  }
}
