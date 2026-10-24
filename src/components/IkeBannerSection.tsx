"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Clock, ArrowRight, FileCheck } from "lucide-react";

export default function IkeBannerSection() {
  return (
    <section className="w-full bg-[#0a0f1d] text-white py-16 md:py-24 border-y border-blue-500/20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column: Heading, Value Prop, Features */}
          <div className="w-full lg:w-7/12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-blue-400 mb-6 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Νόμος 4072/2012 (Άρθρο 47) &amp; ΚΥΑ 46982/2025</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Κατασκευή Σελίδας για ΙΚΕ σε <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">24 Ώρες</span>
            </h2>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              Αποκτήστε την <strong>υποχρεωτική εταιρική ιστοσελίδα για την Ι.Κ.Ε. σας</strong> και δηλώστε την άμεσα στο Γ.Ε.ΜΗ. (businessportal.gr). Μόνο <strong>80€ τελική τιμή με ΦΠΑ</strong> (περιλαμβάνει .gr Domain, 1 έτος Cloud Hosting, SSL &amp; Εταιρικό Email) — χωρίς κρυφές χρεώσεις και με αυτόματη άντληση στοιχείων μέσω ΑΦΜ.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">Παράδοση σε 24 ώρες με επίσημο link</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">80€ Τελική Τιμή με ΦΠΑ (όχι +ΦΠΑ)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">Αυτόματη άντληση από API ΓΕΜΗ</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">Αποφυγή προστίμων έως 100.000€</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/kataskevi-istoselidas-ike"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-blue-600/30 transition-all text-sm md:text-base group"
              >
                <span>Παραγγελία Ιστοσελίδας ΙΚΕ (80€)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/blog/ypoxreotiki-istoselida-ike-nomos-4072-2012-prostima-gemi"
                className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold py-3.5 px-6 rounded-lg border border-slate-700 transition-all text-sm md:text-base"
              >
                <FileCheck className="w-4 h-4 text-slate-400" />
                <span>Οδηγός &amp; Πρόστιμα ΓΕΜΗ 2026</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Pricing & Guarantee Card */}
          <div className="w-full lg:w-5/12">
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-black text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                100% Νόμιμη Συμμόρφωση
              </div>

              <div className="mb-6">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">
                  Ολοκληρωμένο Πακέτο ΙΚΕ ΓΕΜΗ
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">80€</span>
                  <span className="text-emerald-400 text-sm font-bold">τελική τιμή με ΦΠΑ 24%</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  (Χωρίς αστερίσκους • Περιλαμβάνει το τιμολόγιο εξόδου της εταιρείας)
                </div>
              </div>

              <div className="space-y-3.5 border-t border-slate-800 pt-6 mb-8 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Κατοχύρωση .gr Domain:</span>
                  <span className="font-semibold text-white">Περιλαμβάνεται (1 έτος)</span>
                </div>
                <div className="flex items-between justify-between text-slate-300">
                  <span>Cloud Hosting &amp; SSL:</span>
                  <span className="font-semibold text-white">Περιλαμβάνεται (1 έτος)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Εταιρικό Email (info@...):</span>
                  <span className="font-semibold text-white">Περιλαμβάνεται</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Τα 10 Υποχρεωτικά Στοιχεία:</span>
                  <span className="font-semibold text-emerald-400">100% Συμβατά Ν.4072/12</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Χρόνος Παράδοσης:</span>
                  <span className="font-semibold text-cyan-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Εντός 24 ωρών
                  </span>
                </div>
              </div>

              <Link
                href="/kataskevi-istoselidas-ike"
                className="w-full block text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm md:text-base"
              >
                Άμεση Έναρξη Κατασκευής &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
