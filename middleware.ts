import { NextResponse, type NextRequest } from "next/server";
import {
  COUNTRY_TO_LOCALE,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  PREFIXED_LOCALES,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";

// NOTE: Next 16 renamed `middleware` → `proxy`, but `proxy` runs on the Node.js
// runtime, which @opennextjs/cloudflare does not support. We deliberately keep
// the (deprecated-but-functional) edge `middleware` convention so this geo/i18n
// logic deploys to Cloudflare Workers. Revisit once opennext supports proxy.

const ROOT = (() => {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return "nadiitsys.com";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "nadiitsys.com";
  }
})();

const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

function applySecurityHeaders(response: NextResponse, isAdmin: boolean): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  if (isAdmin) {
    response.headers.set("X-Frame-Options", "DENY");
  }
  return response;
}

const PREFIX_SET = new Set<string>(PREFIXED_LOCALES);

/** Geo → locale from Cloudflare's `cf-ipcountry` header (null if unmapped). */
function localeFromGeo(req: NextRequest): Locale | null {
  const country = (req.headers.get("cf-ipcountry") ?? "").toUpperCase();
  return COUNTRY_TO_LOCALE[country] ?? null;
}

// Crawlers shouldn't be geo-redirected: hreflang/canonical urls must resolve
// 200 directly. They still get prefixed locales when they crawl /de/... etc.
const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|pinterest|whatsapp|telegram|google-inspectiontool|lighthouse|headlesschrome/i;

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "");
  const url = req.nextUrl.clone();
  const reqHeaders = new Headers(req.headers);
  // Never trust client-supplied internal headers; we set them per branch.
  reqHeaders.delete("x-locale");
  reqHeaders.delete("x-pathname");

  const isAdmin = host === `admin.${ROOT}` || host === "admin.localhost";

  // ── Admin subdomain (unchanged): never localized ───────────────────────
  if (isAdmin) {
    if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/")) {
      reqHeaders.set("x-pathname", url.pathname);
      return applySecurityHeaders(
        NextResponse.next({ request: { headers: reqHeaders } }),
        isAdmin
      );
    }
    url.pathname = `/admin${url.pathname}`;
    reqHeaders.set("x-pathname", url.pathname);
    return applySecurityHeaders(
      NextResponse.rewrite(url, { request: { headers: reqHeaders } }),
      isAdmin
    );
  }

  // Block direct access to /admin/* on the public domain.
  if (url.pathname.startsWith("/admin")) {
    return applySecurityHeaders(new NextResponse("Not found", { status: 404 }), false);
  }

  const { pathname } = url;

  // API routes and static asset files pass through untouched (no locale routing).
  const isApi = pathname.startsWith("/api");
  const isAsset = /\.[^/]+$/.test(pathname);
  if (isApi || isAsset) {
    reqHeaders.set("x-pathname", pathname);
    return applySecurityHeaders(
      NextResponse.next({ request: { headers: reqHeaders } }),
      false
    );
  }

  // ── Locale routing: "hidden default locale" ────────────────────────────
  const segments = pathname.split("/"); // "/de/travel" → ["", "de", "travel"]
  const rawPrefix = segments[1] ?? "";
  const maybePrefix = rawPrefix.toLowerCase();
  const cleanPath = "/" + segments.slice(2).join("/"); // strip the prefix

  // The default locale is hidden (no prefix): redirect /en/... → clean path and
  // pin NEXT_LOCALE=en so the clean request is served as English (not geo).
  if (maybePrefix === DEFAULT_LOCALE) {
    url.pathname = cleanPath;
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, { path: "/", maxAge: 31536000 });
    return applySecurityHeaders(res, false);
  }

  // A prefixed, non-default locale → rewrite to the clean path + inject locale.
  if (PREFIX_SET.has(maybePrefix)) {
    // Normalize mixed-case prefixes (/DE/…) to the canonical lowercase url.
    if (rawPrefix !== maybePrefix) {
      url.pathname = `/${maybePrefix}${cleanPath === "/" ? "" : cleanPath}`;
      return applySecurityHeaders(NextResponse.redirect(url), false);
    }
    const locale = maybePrefix as Locale;
    url.pathname = cleanPath;
    reqHeaders.set("x-locale", locale);
    reqHeaders.set("x-pathname", cleanPath);
    return applySecurityHeaders(
      NextResponse.rewrite(url, { request: { headers: reqHeaders } }),
      false
    );
  }

  // Clean path → an explicit cookie choice wins, otherwise geo, otherwise en.
  // Crawlers are never redirected so hreflang/canonical urls resolve directly.
  const cookieValue = req.cookies.get(LOCALE_COOKIE)?.value;
  const isBot = BOT_UA.test(req.headers.get("user-agent") ?? "");
  let target: Locale | null = null;
  if (isLocale(cookieValue)) {
    if (cookieValue !== DEFAULT_LOCALE) target = cookieValue;
  } else if (!isBot) {
    const geo = localeFromGeo(req);
    if (geo && geo !== DEFAULT_LOCALE) target = geo;
  }

  if (target) {
    url.pathname = pathname === "/" ? `/${target}` : `/${target}${pathname}`;
    return applySecurityHeaders(NextResponse.redirect(url), false);
  }

  // Default locale: serve the clean URL as English.
  reqHeaders.set("x-locale", DEFAULT_LOCALE);
  reqHeaders.set("x-pathname", pathname);
  return applySecurityHeaders(
    NextResponse.next({ request: { headers: reqHeaders } }),
    false
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
