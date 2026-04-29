import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  reorderMedia,
  type PageSlug,
  type MediaKind,
} from "@/lib/repos/media";

const ALLOWED_PAGE: PageSlug[] = ["travel", "beauty"];
const ALLOWED_KIND: MediaKind[] = ["photo", "reel"];

export async function POST(req: NextRequest): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  let body: { pageSlug?: unknown; kind?: unknown; keys?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  if (!ALLOWED_PAGE.includes(body.pageSlug as PageSlug)) {
    return NextResponse.json(
      { ok: false, error: "Invalid page slug" },
      { status: 400 },
    );
  }
  if (!ALLOWED_KIND.includes(body.kind as MediaKind)) {
    return NextResponse.json(
      { ok: false, error: "Invalid media kind" },
      { status: 400 },
    );
  }
  if (
    !Array.isArray(body.keys) ||
    !body.keys.every((k): k is string => typeof k === "string")
  ) {
    return NextResponse.json(
      { ok: false, error: "keys must be string array" },
      { status: 400 },
    );
  }

  try {
    await reorderMedia(
      body.pageSlug as PageSlug,
      body.kind as MediaKind,
      body.keys,
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[media reorder]", msg);
    return NextResponse.json(
      { ok: false, error: "Reorder failed" },
      { status: 500 },
    );
  }
}
