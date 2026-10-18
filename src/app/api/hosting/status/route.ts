import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { calculateRenewalDate } from "../../admin/cron-hosting-renewals/route";

export const dynamic = "force-dynamic";

/**
 * Authentic Vercel Error Page (404: NOT_FOUND / DEPLOYMENT_NOT_FOUND)
 */
export function getVercelSuspendedHtml(domain: string = "website"): string {
  // Generate realistic Vercel edge node trace ID (e.g. fra1, lhr1, cdg1)
  const edgeNodes = ["fra1", "lhr1", "cdg1", "ams1"];
  const randomNode = edgeNodes[Math.floor(Math.random() * edgeNodes.length)];
  const randomHex = Math.random().toString(36).substring(2, 10);
  const traceId = `${randomNode}::dpl_${randomHex}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404: NOT_FOUND</title>
  <link rel="icon" href="https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #000000;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 580px;
      width: 90%;
      text-align: center;
      padding: 20px;
    }
    .hero {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }
    .code {
      font-size: 28px;
      font-weight: 700;
      padding-right: 22px;
      border-right: 1px solid #333333;
      line-height: 32px;
      letter-spacing: -0.5px;
    }
    .desc {
      font-size: 15px;
      font-weight: 400;
      padding-left: 22px;
      color: #888888;
      line-height: 32px;
      text-align: left;
    }
    .card {
      background-color: #0a0a0a;
      border: 1px solid #222222;
      border-radius: 8px;
      padding: 16px 20px;
      text-align: left;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 12.5px;
      color: #666666;
      line-height: 1.7;
      margin-top: 16px;
    }
    .card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 0;
    }
    .card-label {
      color: #777777;
    }
    .card-value {
      color: #ededed;
      font-weight: 600;
    }
    .card-value.warn {
      color: #f87171;
    }
    .footer {
      margin-top: 32px;
      font-size: 12px;
      color: #444444;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .footer a {
      color: #666666;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .footer a:hover {
      color: #999999;
      text-decoration: underline;
    }
    .triangle {
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 12px solid #ffffff;
      vertical-align: middle;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="hero">
      <div class="code">404</div>
      <div class="desc">The deployment could not be found on Vercel.</div>
    </div>

    <div class="card">
      <div class="card-row">
        <span class="card-label">Code:</span>
        <span class="card-value">DEPLOYMENT_NOT_FOUND</span>
      </div>
      <div class="card-row">
        <span class="card-label">Domain:</span>
        <span class="card-value">${domain}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Deployment Status:</span>
        <span class="card-value warn">INACTIVE_OR_SUSPENDED</span>
      </div>
      <div class="card-row">
        <span class="card-label">Ray ID / Trace:</span>
        <span class="card-value">${traceId}</span>
      </div>
    </div>

    <div class="footer">
      <span><span class="triangle"></span>Vercel Edge Network</span>
      <span>&bull;</span>
      <a href="https://vercel.com/docs/errors/deployment-not-found" target="_blank" rel="noopener noreferrer">Learn More</a>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domainQuery = searchParams.get("domain") || searchParams.get("host") || "";
    const preview = searchParams.get("preview");
    const testMode = searchParams.get("test");

    // Clean domain
    const cleanDomain = domainQuery
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/:\d+$/, "");

    // Direct preview for user inspection
    if (preview === "1" || testMode === "suspended") {
      return new NextResponse(getVercelSuspendedHtml(cleanDomain || "yolo8.eu"), {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    if (!cleanDomain) {
      return NextResponse.json(
        { active: true, error: "Missing domain query parameter" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Look up client by domain in sgk_mails
    const { data: clients, error } = await supabase
      .from("sgk_mails")
      .select("id, email, company, created_at, converted, first_email_body")
      .eq("converted", true);

    if (error || !clients) {
      // In case of DB hiccup, return active: true to prevent false downtime
      return NextResponse.json({ active: true, fallback: true });
    }

    // Match client by domain in first_email_body or company
    let matchedClient: any = null;
    let matchedHosting: any = null;

    for (const c of clients) {
      let meta: any = {};
      try {
        if (c.first_email_body && c.first_email_body.startsWith("{")) {
          meta = JSON.parse(c.first_email_body);
        }
      } catch (e) {}

      const h = meta.hosting || {};
      const clientDomain = (h.domainName || "").toLowerCase().trim();

      if (
        clientDomain === cleanDomain ||
        cleanDomain.includes(clientDomain) ||
        (clientDomain && cleanDomain.endsWith(clientDomain))
      ) {
        matchedClient = c;
        matchedHosting = h;
        break;
      }
    }

    // If domain is not managed in sgk_mails, allow it
    if (!matchedClient) {
      return NextResponse.json({
        active: true,
        message: "Domain not registered under hosting management",
      });
    }

    // Check if client is paid
    if (matchedHosting?.paid === true) {
      return NextResponse.json({
        active: true,
        status: "active",
        paid: true,
        domain: cleanDomain,
        renewalDate: matchedHosting.customExpiresAt,
      });
    }

    // Calculate renewal date
    const { renewalDate, daysRemaining } = calculateRenewalDate(
      matchedClient.created_at,
      matchedHosting?.customExpiresAt
    );

    // If active and daysRemaining > 0, website stays active
    if (daysRemaining > 0) {
      return NextResponse.json({
        active: true,
        status: "active",
        daysRemaining,
        renewalDate,
        domain: cleanDomain,
      });
    }

    // If expired and NOT paid: SUSPEND!
    const suspendedHtml = getVercelSuspendedHtml(cleanDomain);

    return NextResponse.json({
      active: false,
      status: "suspended",
      reason: "expired_unpaid",
      daysRemaining,
      renewalDate,
      domain: cleanDomain,
      suspendedHtml,
    });
  } catch (err: any) {
    // Fail safe to active: true
    return NextResponse.json({ active: true, error: err.message });
  }
}
