import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { TravelPageSchema } from "@/lib/schemas/travel-page";
import { commitFile, ghConfigured } from "@/lib/github";

type SaveResult =
  | { ok: true; commitMessage: string; path: string; payload: unknown }
  | { ok: false; status: number; error: unknown };

function buildSave(slug: string, body: unknown): SaveResult {
  if (slug === "travel") {
    const parsed = TravelPageSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, status: 400, error: parsed.error.flatten() };
    }
    const data = { ...parsed.data, updatedAt: new Date().toISOString() };
    return {
      ok: true,
      path: "content/pages/travel.json",
      commitMessage: "content: update travel page",
      payload: data,
    };
  }
  return { ok: false, status: 404, error: `Unknown page slug: ${slug}` };
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/save-page/[slug]">
): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const { slug } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const result = buildSave(slug, body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  if (!ghConfigured()) {
    return NextResponse.json(
      { ok: false, error: "GH_OWNER / GH_REPO not configured" },
      { status: 500 }
    );
  }

  const content = JSON.stringify(result.payload, null, 2) + "\n";

  try {
    const sha = await commitFile({
      path: result.path,
      content,
      message: result.commitMessage,
    });
    return NextResponse.json({ ok: true, sha });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
