import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { TravelPageSchema } from "@/lib/schemas/travel-page";
import { BeautyPageSchema } from "@/lib/schemas/beauty-page";
import {
  upsertTravelPage,
  upsertBeautyPage,
  type PageSlug,
} from "@/lib/repos/pages";

const ALLOWED_SLUGS: PageSlug[] = ["travel", "beauty"];

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const { slug } = await ctx.params;
  if (!ALLOWED_SLUGS.includes(slug as PageSlug)) {
    return NextResponse.json(
      { ok: false, error: `Unknown page slug: ${slug}` },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const updatedAt = new Date().toISOString();

  try {
    if (slug === "travel") {
      const parsed = TravelPageSchema.safeParse(body);
      if (!parsed.success) {
        console.error("[save-page/travel] validation failed:", parsed.error.flatten());
        return NextResponse.json(
          { ok: false, error: "Validation failed" },
          { status: 400 }
        );
      }
      await upsertTravelPage({ ...parsed.data, updatedAt });
    } else {
      const parsed = BeautyPageSchema.safeParse(body);
      if (!parsed.success) {
        console.error("[save-page/beauty] validation failed:", parsed.error.flatten());
        return NextResponse.json(
          { ok: false, error: "Validation failed" },
          { status: 400 }
        );
      }
      await upsertBeautyPage({ ...parsed.data, updatedAt });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
