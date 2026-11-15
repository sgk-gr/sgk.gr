import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Renigen Terms of Service | SGK Software Development",
  description:
    "Terms of Service for Renigen AI Video Studio, operated by SGK Software Development (sgk.gr).",
  alternates: {
    canonical: "https://www.sgk.gr/renigen/terms",
  },
};

export default function RenigenTermsPage() {
  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Renigen Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: November 15, 2026 &bull; Application: <strong>Renigen</strong> (sgk.gr/renigen)
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using <strong>Renigen</strong> (operated by <strong>SGK Software Development</strong>,{" "}
              <code>https://www.sgk.gr</code>), you agree to these Terms of Service and our{" "}
              <Link href="/renigen/privacy" className="text-foreground underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              2. Description of Service
            </h2>
            <p>
              Renigen provides AI-assisted video scripting, image and video generation orchestration, voiceover synthesis, and audio/video mastering tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              3. User Accounts &amp; Acceptable Use
            </h2>
            <p>
              You are responsible for maintaining the security of your account credentials and API keys, and for ensuring that content you generate complies with applicable laws and third-party rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              4. Contact
            </h2>
            <p>
              For questions regarding these Terms, contact{" "}
              <a href="mailto:info@sgk.gr" className="text-foreground underline">
                info@sgk.gr
              </a>
              .
            </p>
          </section>

          <div className="pt-6 border-t border-white/10 flex gap-6 text-sm">
            <Link href="/renigen" className="underline hover:text-foreground">
              &larr; Back to Renigen
            </Link>
            <Link href="/renigen/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
