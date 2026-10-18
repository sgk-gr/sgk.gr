import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Επιτυχής Πληρωμή | SGK Digital",
  description: "Η ανανέωση της συνδρομής φιλοξενίας και domain ολοκληρώθηκε με επιτυχία.",
};

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { domain?: string; session_id?: string };
}) {
  const domain = searchParams?.domain || "";

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-between selection:bg-[#3b5bdb]/30">
      {/* Top Navbar */}
      <header className="border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b5bdb] to-blue-400 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/20">
            S
          </div>
          <span className="font-black text-lg tracking-tight group-hover:text-blue-400 transition-colors">
            SGK DIGITAL
          </span>
        </Link>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Stripe Verified Payment
        </span>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-xl w-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
          
          {/* Subtle Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10 mb-6">
            <CheckCircle2 size={44} className="stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
            Η Πληρωμή Ολοκληρώθηκε Επιτυχώς!
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
            Σας ευχαριστούμε για την εμπιστοσύνη σας. Η ετήσια ανανέωση της φιλοξενίας (hosting) και του domain name σας έχει καταχωρηθεί αυτόματα στο σύστημα.
          </p>

          {/* Details Pill */}
          <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-5 mb-8 text-left space-y-2.5">
            {domain && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Domain:</span>
                <span className="text-white font-bold font-mono">{domain}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Κατάσταση Υπηρεσίας:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck size={14} /> Πλήρως Ενεργή &amp; Συμμορφωμένη
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Διάρκεια:</span>
              <span className="text-white font-semibold">+1 Έτος (12 Μήνες)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Παραστατικό / Τιμολόγιο:</span>
              <span className="text-slate-300 font-medium">Θα αποσταλεί στο email σας</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {domain ? (
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-gradient-to-r from-[#3b5bdb] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Μετάβαση στην Ιστοσελίδα σας <ExternalLink size={15} />
              </a>
            ) : null}

            <Link
              href="/"
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              Επιστροφή στο SGK.gr <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SGK Digital. Όλα τα δικαιώματα διατηρούνται.
      </footer>
    </div>
  );
}
