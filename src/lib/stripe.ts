import Stripe from "stripe";

let liveClient: Stripe | null = null;
let testClient: Stripe | null = null;

/**
 * Returns Stripe client instance for either Live or Test (Sandbox) mode.
 * Keys are read from environment variables only:
 *  - live: STRIPE_SECRET_KEY
 *  - test: STRIPE_TEST_SECRET_KEY
 */
export function getStripe(mode: "live" | "test" = "live"): Stripe {
  if (mode === "test") {
    if (!testClient) {
      const key = process.env.STRIPE_TEST_SECRET_KEY;
      if (!key) throw new Error("Missing STRIPE_TEST_SECRET_KEY in environment variables");
      testClient = new Stripe(key, { apiVersion: "2026-03-25.dahlia" as any });
    }
    return testClient;
  }

  if (!liveClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
    liveClient = new Stripe(key, { apiVersion: "2026-03-25.dahlia" as any });
  }
  return liveClient;
}
