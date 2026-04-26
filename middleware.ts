import { NextResponse, type NextRequest } from "next/server";

const ROOT = "nadiitsys.com";

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

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "");
  const url = req.nextUrl.clone();
  const reqHeaders = new Headers(req.headers);

  const isAdmin = host === `admin.${ROOT}` || host === "admin.localhost";

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

  // Block direct access to /admin/* on the public domain
  if (url.pathname.startsWith("/admin")) {
    return applySecurityHeaders(
      new NextResponse("Not found", { status: 404 }),
      false
    );
  }

  reqHeaders.set("x-pathname", url.pathname);
  return applySecurityHeaders(
    NextResponse.next({ request: { headers: reqHeaders } }),
    isAdmin
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
