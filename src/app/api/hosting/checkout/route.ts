import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Calculates total renewal price in Euro cents (80€ final price with VAT included)
 */
function calculateAmountCents(priceStr?: string): number {
  if (!priceStr) return 8000; // 80.00€ τελική τιμή με ΦΠΑ

  const clean = priceStr.toLowerCase().replace(/\s+/g, "");
  const numMatch = clean.match(/(\d+[\.,]?\d*)/);
  if (!numMatch) return 8000;

  const num = parseFloat(numMatch[1].replace(",", "."));
  if (isNaN(num) || num <= 0) return 8000;

  return Math.round(num * 100);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("client") || searchParams.get("clientId") || "";
    const domainQuery = searchParams.get("domain") || "";
    const emailQuery = searchParams.get("email") || "";
    const returnJson = searchParams.get("json") === "1" || req.headers.get("accept")?.includes("application/json");

    const supabase = getServiceSupabase();

    // Query client
    let query = supabase.from("sgk_mails").select("id, email, company, first_email_body, created_at");

    if (clientId) {
      query = query.eq("id", clientId);
    } else if (emailQuery) {
      query = query.ilike("email", emailQuery.trim());
    } else if (domainQuery) {
      // Find converted clients
      query = query.eq("converted", true);
    } else {
      return NextResponse.json({ success: false, error: "Missing client identifier (client, domain, or email)" }, { status: 400 });
    }

    const { data: clients, error: fetchErr } = await query;
    if (fetchErr || !clients || clients.length === 0) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    let targetClient = clients[0];
    if (domainQuery && !clientId) {
      const cleanDomain = domainQuery.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const matched = clients.find((c) => {
        try {
          const meta = c.first_email_body ? JSON.parse(c.first_email_body) : {};
          const d = (meta.hosting?.domainName || "").toLowerCase().trim();
          return d === cleanDomain || cleanDomain.includes(d);
        } catch {
          return false;
        }
      });
      if (matched) targetClient = matched;
    }

    let meta: any = {};
    try {
      if (targetClient.first_email_body && targetClient.first_email_body.startsWith("{")) {
        meta = JSON.parse(targetClient.first_email_body);
      }
    } catch (e) {}

    const hosting = meta.hosting || {};
    const companyName = targetClient.company || "Εταιρεία";
    const domainName = hosting.domainName || (companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".gr");
    const amountCents = calculateAmountCents(hosting.renewalPrice);

    const stripe = getStripe();

    // Create Stripe Checkout Session (Dynamic Payment Methods enabled)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: amountCents,
            product_data: {
              name: `Ετήσια Ανανέωση Hosting & Domain (${domainName})`,
              description: `Ετήσια Φιλοξενία Cloud Υψηλής Ταχύτητας, Πιστοποιητικό SSL, Domain Name & Συμμόρφωση Γ.Ε.ΜΗ. για το ${domainName}`,
              images: ["https://www.sgk.gr/images/sgk-hosting-badge.png"],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: targetClient.email || undefined,
      client_reference_id: targetClient.id,
      metadata: {
        clientId: targetClient.id,
        domain: domainName,
        company: companyName,
        type: "hosting_renewal",
      },
      success_url: `https://www.sgk.gr/payment-success?session_id={CHECKOUT_SESSION_ID}&domain=${encodeURIComponent(domainName)}`,
      cancel_url: `https://www.sgk.gr/`,
    });

    if (returnJson) {
      return NextResponse.json({
        success: true,
        url: session.url,
        sessionId: session.id,
        amountEur: (amountCents / 100).toFixed(2),
        domain: domainName,
      });
    }

    if (!session.url) {
      return NextResponse.json({ success: false, error: "Stripe did not return a session URL" }, { status: 500 });
    }

    // Direct redirect from email click
    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    console.error("Stripe Checkout Session Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
