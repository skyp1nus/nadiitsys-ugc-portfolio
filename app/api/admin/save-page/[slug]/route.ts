import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { TravelPageSchema } from "@/lib/schemas/travel-page";
import { BeautyPageSchema } from "@/lib/schemas/beauty-page";
import {
  upsertTravelPage,
  upsertBeautyPage,
  type PageSlug,
} from "@/lib/repos/pages";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/lib/i18n/config";

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

  // `locale=all` writes the same content to every locale row ("apply to all
  // languages"); otherwise a single locale.
  const localeParam = req.nextUrl.searchParams.get("locale") ?? DEFAULT_LOCALE;
  const applyAll = localeParam === "all";
  if (!applyAll && !isLocale(localeParam)) {
    return NextResponse.json(
      { ok: false, error: `Unknown locale: ${localeParam}` },
      { status: 400 }
    );
  }
  const targets: Locale[] = applyAll ? [...LOCALES] : [localeParam as Locale];

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
        logger.error("save-page/travel", "validation failed", parsed.error.flatten());
        return NextResponse.json(
          { ok: false, error: "Validation failed" },
          { status: 400 }
        );
      }
      const data = { ...parsed.data, updatedAt };
      for (const loc of targets) await upsertTravelPage(data, loc);
    } else {
      const parsed = BeautyPageSchema.safeParse(body);
      if (!parsed.success) {
        logger.error("save-page/beauty", "validation failed", parsed.error.flatten());
        return NextResponse.json(
          { ok: false, error: "Validation failed" },
          { status: 400 }
        );
      }
      const data = { ...parsed.data, updatedAt };
      for (const loc of targets) await upsertBeautyPage(data, loc);
    }
    return NextResponse.json({ ok: true, locales: targets });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
