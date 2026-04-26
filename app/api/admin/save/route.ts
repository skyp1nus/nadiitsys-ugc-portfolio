import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { VideosFileSchema } from "@/lib/schemas/video";
import { commitFile, ghConfigured } from "@/lib/github";

const PATH = "content/videos.json";

export async function POST(req: Request): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = VideosFileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = {
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  const content = JSON.stringify(data, null, 2) + "\n";

  if (!ghConfigured()) {
    return NextResponse.json(
      { ok: false, error: "GH_OWNER / GH_REPO not configured" },
      { status: 500 }
    );
  }

  try {
    const commitSha = await commitFile({
      path: PATH,
      content,
      message: `content: update videos.json (${data.videos.length} entries)`,
    });
    return NextResponse.json({ ok: true, sha: commitSha });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
