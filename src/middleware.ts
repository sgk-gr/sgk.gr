import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lowerPath = pathname.toLowerCase();

  // 1. Permanent (301) Redirects for Legacy / Old URLs indexed by Google

  // E-shop & E-commerce legacy URLs
  if (
    lowerPath === "/eshop" ||
    lowerPath.startsWith("/eshop/") ||
    lowerPath.startsWith("/eshop-") ||
    lowerPath === "/eshops" ||
    lowerPath.startsWith("/eshops/") ||
    lowerPath === "/e-shop" ||
    lowerPath.startsWith("/e-shop/") ||
    lowerPath === "/kataskevi-eshop" ||
    lowerPath.startsWith("/kataskevi-eshop/") ||
    lowerPath.startsWith("/kataskevi-eshop-") ||
    lowerPath.startsWith("/pay-as-you-grow") ||
    lowerPath.startsWith("/payg") ||
    lowerPath.startsWith("/website-offer")
  ) {
    if (lowerPath.includes("demo")) {
      return NextResponse.redirect(new URL("/order-ai-agent", req.url), 301);
    }
    return NextResponse.redirect(new URL("/kataskevi-istoselidon", req.url), 301);
  }

  // Specific deleted E-shop blog posts
  const deletedEshopBlogSlugs = [
    "/blog/poso-kostizei-i-kataskevi-eshop-odigos-times-2026",
    "/blog/poso-kostizei-kataskevi-eshop-2025",
    "/blog/kataskevi-eshop-2026-taseis-poliseis",
    "/blog/kataskevi-eshop-ellada-2026-ti-proteinei-to-ai",
    "/blog/pay-as-you-grow-to-mellon-tou-ecommerce",
    "/blog/pay-as-you-grow-vs-shopify-vs-isocommerce-ellada",
    "/blog/pos-na-anoixo-eshop-me-liga-lefta-ellada-2026",
  ];
  if (deletedEshopBlogSlugs.includes(lowerPath)) {
    return NextResponse.redirect(new URL("/kataskevi-istoselidon", req.url), 301);
  }

  // IKE legacy URLs
  if (
    lowerPath === "/ike-offer" ||
    lowerPath.startsWith("/ike-offer/") ||
    lowerPath === "/kataskevi-selidas-ike" ||
    lowerPath.startsWith("/kataskevi-selidas-ike/")
  ) {
    return NextResponse.redirect(new URL("/kataskevi-istoselidas-ike", req.url), 301);
  }

  // AI Video Call / Live legacy URLs
  if (
    lowerPath === "/ai-video-call" ||
    lowerPath.startsWith("/ai-video-call/") ||
    lowerPath === "/live" ||
    lowerPath.startsWith("/live/")
  ) {
    return NextResponse.redirect(new URL("/order-ai-agent", req.url), 301);
  }

  // Case study root
  if (
    lowerPath === "/case-study" ||
    lowerPath === "/case-study/" ||
    lowerPath === "/case-studies" ||
    lowerPath === "/case-studies/"
  ) {
    return NextResponse.redirect(new URL("/portfolio", req.url), 301);
  }

  // Legacy promo / doc / blog-seo / WordPress artifacts
  if (
    lowerPath === "/promo" ||
    lowerPath === "/promo/" ||
    lowerPath === "/doc" ||
    lowerPath === "/doc/"
  ) {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }
  if (
    lowerPath.startsWith("/blog-seo") ||
    lowerPath.startsWith("/category") ||
    lowerPath.startsWith("/tag") ||
    lowerPath.startsWith("/feed") ||
    lowerPath.startsWith("/author")
  ) {
    return NextResponse.redirect(new URL("/blog", req.url), 301);
  }
  if (
    lowerPath.startsWith("/wp-") ||
    lowerPath.includes("wp-content") ||
    lowerPath.includes("wp-includes")
  ) {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }

  // Old contact / pricing aliases
  if (
    lowerPath === "/contact" ||
    lowerPath === "/contact-us" ||
    lowerPath === "/epikoinonia" ||
    lowerPath === "/about-us"
  ) {
    return NextResponse.redirect(new URL("/about", req.url), 301);
  }
  if (
    lowerPath === "/pricing" ||
    lowerPath === "/times" ||
    lowerPath === "/timokatalogos"
  ) {
    return NextResponse.redirect(new URL("/estimate", req.url), 301);
  }

  // 2. Hosting suspension check for managed client domains
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
