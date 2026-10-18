import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  try {
    const res = await fetch(`https://www.sgk.gr/api/hosting/status?domain=${encodeURIComponent(host)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.active === false && data.suspendedHtml) {
        return new NextResponse(data.suspendedHtml, {
          status: 404,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    }
  } catch (err) {
    // Fail-safe: Always proceed so site is never blocked on network hiccup
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API endpoints - vital so /api/hosting/status & cron routes never deadlock)
     * - admin (Admin panel - vital so administration is always accessible)
     * - _next/static, _next/image, favicon.ico
     */
    "/((?!api|admin|_next/static|_next/image|favicon.ico).*)",
  ],
};
