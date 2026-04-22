import { NextResponse, type NextRequest } from "next/server";

const ROOT = "nadiitsys.com";

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "");
  const url = req.nextUrl.clone();

  const isAdmin = host === `admin.${ROOT}` || host === "admin.localhost";

  // Forward pathname so Server Components can read it without usePathname()
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-pathname", url.pathname);

  if (isAdmin) {
    if (url.pathname.startsWith("/admin")) {
      return NextResponse.next({ request: { headers: reqHeaders } });
    }
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url, { request: { headers: reqHeaders } });
  }

  // Block direct access to /admin/* on the public domain
  if (url.pathname.startsWith("/admin")) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next({ request: { headers: reqHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
