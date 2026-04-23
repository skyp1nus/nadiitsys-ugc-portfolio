import { NextResponse, type NextRequest } from "next/server";

const ROOT = "nadiitsys.com";

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "");
  const url = req.nextUrl.clone();
  const reqHeaders = new Headers(req.headers);

  const isAdmin = host === `admin.${ROOT}` || host === "admin.localhost";

  if (isAdmin) {
    if (url.pathname.startsWith("/admin")) {
      reqHeaders.set("x-pathname", url.pathname);
      return NextResponse.next({ request: { headers: reqHeaders } });
    }
    url.pathname = `/admin${url.pathname}`;
    reqHeaders.set("x-pathname", url.pathname);
    return NextResponse.rewrite(url, { request: { headers: reqHeaders } });
  }

  // Block direct access to /admin/* on the public domain
  if (url.pathname.startsWith("/admin")) {
    return new NextResponse("Not found", { status: 404 });
  }

  reqHeaders.set("x-pathname", url.pathname);
  return NextResponse.next({ request: { headers: reqHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
