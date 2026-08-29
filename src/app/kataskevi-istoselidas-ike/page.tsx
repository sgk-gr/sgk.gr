import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  CheckCircle2, ShieldCheck, Clock, Zap, ArrowRight, 
  HelpCircle, AlertTriangle, FileText, Globe, Mail, Lock, Sparkles, Building2, PhoneCall
} from "lucide-react";

export const metadata: Metadata = {
  title: "Κατασκευή Ιστοσελίδας ΙΚΕ | 100% Συμβατή με ΓΕΜΗ σε 24 Ώρες | SGK Digital",
  description: "Επαγγελματική κατασκευή ιστοσελίδας για νεοσύστατες & υπάρχουσες Ι.Κ.Ε. Πλήρης συμμόρφωση με το Άρθρο 47 §2 του Ν.4072/2012 και το ΓΕΜΗ. Παράδοση σε 24 ώρες με μόνο 124€ (με ΦΠΑ).",
  keywords: "κατασκευή ιστοσελίδας ικε, ιστοσελιδα ικε γεμη, υποχρεωτικη ιστοσελιδα ικε, κατασκευη site ικε, κοστος ιστοσελιδας ικε, ιστοσελιδα γεμη ικε 24 ωρες, νεα ικε ιστοσελιδα",
  alternates: {
    canonical: "https://sgk.gr/kataskevi-istoselidas-ike",
  },
  openGraph: {
    title: "Κατασκευή Ιστοσελίδας ΙΚΕ σε 24 Ώρες | SGK Digital",
    description: "Πλήρης νομική συμμόρφωση με ΓΕΜΗ (Ν.4072/2012). Domain .gr + Hosting + SSL + Email + Design όλα σε 24 ώρες με 124€ με ΦΠΑ.",
    url: "https://sgk.gr/kataskevi-istoselidas-ike",
    siteName: "SGK Digital",
    images: [{ url: "https://sgk.gr/social-preview.png", width: 1200, height: 630, alt: "Κατασκευή Ιστοσελίδας ΙΚΕ" }],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Κατασκευή Ιστοσελίδας ΙΚΕ σε 24 Ώρες | SGK Digital",
    description: "Νόμιμη εταιρική ιστοσελίδα ΙΚΕ για το ΓΕΜΗ σε 24 ώρες μόνο με 124€.",
    images: ["https://sgk.gr/social-preview.png"],
  },
};

const ikeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Είναι υποχρεωτική η κατασκευή ιστοσελίδας για κάθε νέα Ι.Κ.Ε.;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ναι. Σύμφωνα με το Άρθρο 47 §2 του Ν. 4072/2012 και τη σχετική νομοθεσία του ΓΕΜΗ (ΚΥΑ 46982/2025), κάθε Ιδιωτική Κεφαλαιουχική Εταιρεία (Ι.Κ.Ε.) υποχρεούται εντός ενός (1) μηνός από τη σύστασή της να διαθέτει ενεργή εταιρική ιστοσελίδα όπου δημοσιεύονται τα στοιχεία της εταιρείας."
      }
    },
    {
      "@type": "Question",
      "name": "Πόσο κοστίζει η κατασκευή ιστοσελίδας για ΙΚΕ;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Το τελικό κόστος στην SGK Digital είναι μόλις 124€ (συμπεριλαμβανομένου ΦΠΑ 24%). Περιλαμβάνει τα πάντα: Domain Name .gr για 2 έτη, Φιλοξενία (Hosting) για 1 έτος, Πιστοποιητικό Ασφαλείας SSL, Εταιρικό Email και πλήρη σχεδιασμό."
      }
    },
    {
      "@type": "Question",
      "name": "Σε πόσο χρόνο παραδίδεται η ιστοσελίδα της ΙΚΕ;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Η ιστοσελίδα παραδίδεται και τίθεται σε πλήρη λειτουργία εντός 24 ωρών από την παραγγελία σας, έτοιμη να δηλωθεί απευθείας στο ΓΕΜΗ από εσάς ή τον λογιστή σας."
      }
    },
    {
      "@type": "Question",
      "name": "Τι στοιχεία πρέπει να περιλαμβάνει υποχρεωτικά η ιστοσελίδα ΙΚΕ;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Η ιστοσελίδα πρέπει να αναγράφει την Εταιρική Επωνυμία, τον Αριθμό Γ.Ε.ΜΗ., το Α.Φ.Μ. και τη Δ.Ο.Υ., το Εταιρικό Κεφάλαιο & τις εγγυητικές εισφορές, τα ονόματα των Διαχειριστών και Εταίρων, καθώς και τη νόμιμη Έδρα της εταιρείας."
      }
    }
  ]
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Κατασκευή Ιστοσελίδας ΙΚΕ (ΓΕΜΗ)",
  "provider": {
    "@type": "LocalBusiness",
    "name": "SGK Software Development",
    "url": "https://sgk.gr",
    "telephone": "+302111140013"
  },
  "offers": {
    "@type": "Offer",
    "price": "124.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://sgk.gr/kataskevi-istoselidas-ike"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Greece"
  }
};

export default function KataskeviIstoselidasIkePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ikeFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-[#3b5bdb] selection:text-white">
        
        {/* HERO SECTION */}
        <section className="relative pt-36 pb-20 px-6 overflow-hidden border-b border-slate-800/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,91,219,0.25),rgba(255,255,255,0))] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
            
            {/* Legal compliance badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#3b5bdb] text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Νομικη Υποχρεωση Γ.Ε.ΜΗ. (Αρθρο 47 §2 Ν.4072/2012)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight uppercase italic">
              Κατασκευη Ιστοσελιδας Ι.Κ.Ε. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b5bdb] via-blue-400 to-indigo-300">
                Live σε 24 Ωρες με 124€
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Αποκτήστε άμεσα τη νόμιμη εταιρική ιστοσελίδα της νέας σας Ι.Κ.Ε. Πλήρης συμμόρφωση με όλες τις απαιτήσεις του ΓΕΜΗ, Domain Name .gr, Hosting 1 έτους, SSL ασφαλείας και εταιρικό email.
            </p>

            {/* Key benefits bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 text-left">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Παράδοση 24h</div>
                  <div className="text-xs text-slate-400">Live την επόμενη μέρα</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">100% ΓΕΜΗ Ready</div>
                  <div className="text-xs text-slate-400">Όλα τα νόμιμα πεδία</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#3b5bdb] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Όλα σε 1 Τιμή</div>
                  <div className="text-xs text-slate-400">124€ (με ΦΠΑ 24%)</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <Zap className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Μηδέν Κόπος</div>
                  <div className="text-xs text-slate-400">Αναλαμβάνουμε τα πάντα</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="/ike-offer"
                className="w-full sm:w-auto px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Παραγγελια Ιστοσελιδας ΙΚΕ (124€)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:2111140013"
                className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#3b5bdb]" />
                <span>Τηλεφωνική Εξυπηρέτηση: 211 114 0013</span>
              </a>
            </div>

          </div>
        </section>

        {/* LEGAL REQUIREMENTS & GEMI CHECKLIST */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#3b5bdb]">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Τι ορίζει ο νόμος για τις Ι.Κ.Ε.</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight leading-tight">
                Γιατι καθε νεα ΙΚΕ χρειαζεται ιστοσελιδα εντος 1 μηνος;
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                Σύμφωνα με το <strong>Άρθρο 47 §2 του Νόμου 4072/2012</strong> και τη σχετική υπουργική απόφαση για το Γ.Ε.ΜΗ., κάθε Ιδιωτική Κεφαλαιουχική Εταιρεία οφείλει να διατηρεί εταιρική ιστοσελίδα στην οποία δηλώνονται υποχρεωτικά όλα τα στοιχεία δημοσιότητας.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Αριθμός Γ.Ε.ΜΗ. και Α.Φ.Μ. της εταιρείας",
                  "Εταιρικό Κεφάλαιο και ποσό εγγυητικών εισφορών",
                  "Ονόματα & στοιχεία Διαχειριστών και Εταίρων",
                  "Νόμιμη Καταστατική Έδρα της επιχείρησης",
                  "Δήλωση ότι η εταιρεία τελεί υπό εκκαθάριση (εάν συντρέχει λόγος)"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WHAT IS INCLUDED CARD */}
            <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b5bdb]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-6">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Πληρες Πακετο</span>
                  <h3 className="text-2xl font-black text-white italic uppercase">Ιστοσελιδα ΙΚΕ All-Inclusive</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-[#3b5bdb] italic">124€</div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Τελικη Τιμη με ΦΠΑ 24%</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Κατοχύρωση Domain Name .gr (2 Έτη)", desc: "Το επίσημο όνομα της εταιρείας σας (.gr) πληρωμένο για 2 ολόκληρα χρόνια." },
                  { title: "Ταχύτατη Φιλοξενία VPS (Hosting 1 Έτος)", desc: "Σε σύγχρονο cloud server με 99.9% uptime και καθημερινά backups." },
                  { title: "Πιστοποιητικό Ασφαλείας SSL", desc: "Πλήρης κρυπτογράφηση HTTPS για ασφάλεια και αναγνώριση από Google." },
                  { title: "Εταιρικό Email (info@εταιρεία.gr)", desc: "Επαγγελματικό email με Webmail πρόσβαση και υποστήριξη σε κινητό/Outlook." },
                  { title: "Πλήρης Σχεδιασμός & Responsive Design", desc: "Άψογη εμφάνιση σε κινητά, tablets και υπολογιστές με λογότυπο & στοιχεία." },
                  { title: "Έτοιμο Link για Δήλωση στο ΓΕΜΗ", desc: "Σας παραδίδουμε το επίσημο URL έτοιμο προς καταχώρηση στο businessportal." }
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-[#3b5bdb] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                    <div>
                      <div className="text-xs font-bold text-white">{f.title}</div>
                      <div className="text-[11px] text-slate-400">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Link
                  href="/ike-offer"
                  className="w-full py-3.5 bg-[#3b5bdb] hover:bg-[#2b4bba] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                >
                  <span>Ξεκινηστε Τωρα — Παραδοση Αυριο</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* 3-STEP PROCESS */}
        <section className="py-16 px-6 bg-slate-900/40 border-y border-slate-850">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#3b5bdb]">Απλη Διαδικασια</span>
              <h2 className="text-3xl font-black uppercase italic tracking-tight mt-2">
                Πως αποκτατε την ιστοσελιδα σας σε 3 βηματα
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
                <div className="w-8 h-8 rounded-full bg-[#3b5bdb] text-slate-950 font-black flex items-center justify-center text-sm mb-4">1</div>
                <h3 className="font-bold text-base text-white mb-2">Συμπληρώνετε τα Στοιχεία</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Στη φόρμα παραγγελίας βάζετε απλά το ΑΦΜ ή την Επωνυμία της νέας σας Ι.Κ.Ε. και το επιθυμητό όνομα domain (.gr).
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
                <div className="w-8 h-8 rounded-full bg-[#3b5bdb] text-slate-950 font-black flex items-center justify-center text-sm mb-4">2</div>
                <h3 className="font-bold text-base text-white mb-2">Στήνουμε & Ελέγχουμε</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Η ομάδα της SGK Digital σχεδιάζει τη σελίδα, ρυθμίζει το hosting, το SSL και τα υποχρεωτικά νομικά πεδία του ΓΕΜΗ.
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm mb-4">3</div>
                <h3 className="font-bold text-base text-white mb-2">Live σε 24 Ώρες</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Σας στέλνουμε το link της ιστοσελίδας και το τιμολόγιο για να το δηλώσετε κατευθείαν στο ΓΕΜΗ και να είστε 100% νόμιμοι!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#3b5bdb]">Συχνες Ερωτησεις</span>
            <h2 className="text-3xl font-black uppercase italic tracking-tight">
              Ολα οσα πρεπει να γνωριζετε για την Ιστοσελιδα ΙΚΕ
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Είναι υποχρεωτική η κατασκευή ιστοσελίδας για κάθε νέα Ι.Κ.Ε.;",
                a: "Ναι. Βάσει του Άρθρου 47 §2 του Ν. 4072/2012, κάθε ΙΚΕ υποχρεούται εντός ενός μηνός από τη σύστασή της να διαθέτει εταιρική ιστοσελίδα και να τη δηλώσει στη μερίδα της στο ΓΕΜΗ."
              },
              {
                q: "Υπάρχουν πρόστιμα αν δεν φτιάξω ιστοσελίδα ΙΚΕ;",
                a: "Ναι, η μη ανάρτηση ιστοσελίδας στο ΓΕΜΗ μπορεί να οδηγήσει σε διοικητικές κυρώσεις, πρόστιμα από το Επιμελητήριο και κώλυμα στην έκδοση φορολογικών ή τραπεζικών πιστοποιητικών."
              },
              {
                q: "Τι περιλαμβάνεται στα 124€ και υπάρχουν κρυφές χρεώσεις;",
                a: "Καμία κρυφή χρέωση. Στα 124€ (με ΦΠΑ 24%) περιλαμβάνονται: Domain Name .gr (2 έτη), Hosting σε server (1 έτος), SSL, εταιρικό email, σχεδιασμός σελίδας και έκδοση νόμιμου τιμολογίου εξόδων."
              },
              {
                q: "Τι γίνεται μετά τον 1ο χρόνο;",
                a: "Μετά το 1ο έτος, η ανανέωση του server και του domain κοστίζει μόλις 124€/έτος για πλήρη φιλοξενία, backups και τεχνική υποστήριξη, χωρίς καμία απολύτως δέσμευση συμβολαίου."
              },
              {
                q: "Μπορώ αργότερα να προσθέσω περισσότερες σελίδες ή e-shop;",
                a: "Φυσικά! Η ιστοσελίδα χτίζεται με μοντέρνες τεχνολογίες και μπορεί οποιαδήποτε στιγμή να επεκταθεί σε πλήρες portal, portfolio ή ηλεκτρονικό κατάστημα (E-shop)."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 open:border-[#3b5bdb]/50">
                <summary className="font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#3b5bdb]" />
                    {faq.q}
                  </span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <p className="mt-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="text-center pt-12">
            <Link
              href="/ike-offer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-blue-500/20"
            >
              <span>Παραγγειλτε την Ιστοσελιδα σας Τωρα</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
