import type { Metadata } from "next";
import Link from "next/link";
import { Film, Sparkles, ShieldCheck, Mic, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Renigen | Autonomous AI Video Studio by SGK",
  description:
    "Renigen is an autonomous AI Video Studio for commercials, TikTok/Reels, and UGC video production with voiceovers, sound design, and broadcast mastering.",
  alternates: {
    canonical: "https://www.sgk.gr/renigen",
  },
};

export default function RenigenPage() {
  return (
    <main className="pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center">
            <img
              src="/renigen-logo.png"
              alt="Renigen"
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-contain shadow-lg"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Autonomous AI Video Studio by SGK</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground">
            Renigen
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Renigen is a desktop and web AI Video Studio developed by SGK Software Development (sgk.gr)
            for creating studio-grade commercials, TikTok/Reels shorts, presenter explainers, and UGC video ads.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-medium text-sm">
              <span>Soon for download</span>
            </span>
            <Link
              href="/renigen/privacy"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-medium text-sm hover:bg-neutral-200 transition-colors"
            >
              <span>Privacy Policy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/renigen/terms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-foreground font-medium text-sm hover:bg-white/10 transition-colors"
            >
              <span>Terms of Service</span>
            </Link>
          </div>
        </section>

        {/* App Screenshot */}
        <section className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-black/60 p-2 md:p-3 shadow-2xl overflow-hidden">
            <img
              src="/renigen-app-preview.jpg"
              alt="Renigen Autonomous AI Video Studio Interface"
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </section>

        {/* Capabilities */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
            <Film className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-heading font-semibold text-foreground">
              AI Video Direction
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Multi-shot commercials, 9:16 vertical shorts, and 16:9 explainers with consistent character sheets and automated visual QA.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
            <Mic className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-heading font-semibold text-foreground">
              Voiceovers &amp; Broadcast Audio
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Natural multilingual voiceovers, sound effects, background music scoring, word-by-word captions, and EBU R128 loudness normalization.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-heading font-semibold text-foreground">
              Secure Account &amp; Google Sign-In
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google Sign-In is used solely to authenticate your Renigen account using your basic profile (name, email, and avatar).
            </p>
          </div>
        </section>

        {/* Footer links for verification */}
        <section className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Operated by <strong className="text-foreground">SGK Software Development</strong> (sgk.gr) &bull; Support:{" "}
            <a href="mailto:info@sgk.gr" className="underline hover:text-foreground">
              info@sgk.gr
            </a>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/renigen/privacy" className="underline hover:text-foreground">
              Renigen Privacy Policy
            </Link>
            <Link href="/renigen/terms" className="underline hover:text-foreground">
              Renigen Terms of Service
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
