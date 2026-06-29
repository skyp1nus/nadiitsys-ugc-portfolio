import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getTravelPage, getBeautyPage, type PageSlug } from "@/lib/repos/pages";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

const ALLOWED_SLUGS: PageSlug[] = ["travel", "beauty"];

// Loads a page for a specific locale WITHOUT en-fallback, so the admin editor
// can tell whether a translation already exists (`exists`) or needs creating.
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  let slug: string;
  try {
    ({ slug } = await ctx.params);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid params" }, { status: 400 });
  }
  if (!ALLOWED_SLUGS.includes(slug as PageSlug)) {
    return NextResponse.json(
      { ok: false, error: `Unknown page slug: ${slug}` },
      { status: 404 }
    );
  }

  const localeParam = req.nextUrl.searchParams.get("locale") ?? DEFAULT_LOCALE;
  if (!isLocale(localeParam)) {
    return NextResponse.json(
      { ok: false, error: `Unknown locale: ${localeParam}` },
      { status: 400 }
    );
  }

  try {
    const data =
      slug === "travel"
        ? await getTravelPage(localeParam, { fallback: false })
        : await getBeautyPage(localeParam, { fallback: false });
    return NextResponse.json({
      ok: true,
      locale: localeParam,
      exists: data !== null,
      data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
