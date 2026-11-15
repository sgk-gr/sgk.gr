import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Renigen Privacy Policy | SGK Software Development",
  description:
    "Privacy Policy for Renigen AI Video Studio (operated by SGK Software Development / sgk.gr), including Google Sign-In data usage and GDPR rights.",
  alternates: {
    canonical: "https://www.sgk.gr/renigen/privacy",
  },
};

export default function RenigenPrivacyPage() {
  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Renigen Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: November 15, 2026 &bull; Application: <strong>Renigen</strong> (sgk.gr/renigen)
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              1. Who We Are
            </h2>
            <p>
              <strong>Renigen</strong> is an AI Video Studio desktop and web application developed and operated by{" "}
              <strong>SGK Software Development</strong> (<code>https://www.sgk.gr</code>). This Privacy Policy explains how
              Renigen collects, uses, and protects information when you sign in and use the application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              2. Information We Collect (Google Sign-In &amp; Account Data)
            </h2>
            <p>
              When you choose to sign in to Renigen using Google OAuth, we request only basic authentication scopes (
              <code>openid</code>, <code>email</code>, and <code>profile</code>). Specifically, we receive:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Your email address (to create and identify your Renigen account).</li>
              <li>Your display name and profile picture (to display inside your Renigen workspace).</li>
              <li>Subscription plan and credit usage counters associated with your Renigen account.</li>
            </ul>
            <p>
              Renigen does <strong>not</strong> access your Gmail, Google Drive, Contacts, Calendar, or any other sensitive Google user data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              3. How We Use Your Data
            </h2>
            <p>Your account information is used strictly to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Authenticate your session securely via Supabase Auth.</li>
              <li>Manage your subscription tier, AI credits, and workspace settings.</li>
              <li>Provide customer support when you contact us.</li>
            </ul>
            <p>
              We do <strong>not</strong> sell, rent, or share your personal data or Google user data with third-party advertisers or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              4. Local Project Files
            </h2>
            <p>
              Video projects, scripts, generated images, and rendered MP4 files created in the Renigen desktop app are stored locally on your own computer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              5. Data Retention &amp; GDPR Deletion Rights
            </h2>
            <p>
              We retain your account record only for as long as your Renigen account remains active. You may request access to, correction of, or permanent deletion of your account and personal data at any time by emailing{" "}
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
            <Link href="/renigen/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
