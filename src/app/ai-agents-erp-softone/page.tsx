import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import Link from "next/link";
import { 
  Database, ArrowRight, CheckCircle2, ShieldCheck, Zap, 
  Cpu, Workflow, RefreshCw, FileText, Check, Lock, ChevronRight, Phone
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agents για SoftOne & Entersoft ERP | Αυτοματισμοί Επιχειρήσεων | SGK Digital",
  description: "Σχεδιασμός και υλοποίηση αυτόνομων AI Agents με αμφίδρομη διασύνδεση σε SoftOne ERP και Entersoft CRM. Αυτοματοποιήστε τιμολόγηση προμηθευτών (OCR), αποθήκη, παραγγελίες B2B και έλεγχο υπολοίπων με 100% ανθρώπινη έγκριση (Human-in-the-Loop).",
  keywords: "ai agent softone, ai erp integration ελλαδα, αυτοματισμοι erp softone entersoft, ai αυτοματοποιηση τιμολογιων, agentic ai softone, διασυνδεση ai με erp, sgk digital, σπυρος τσαβος, ai backoffice greece",
  alternates: {
    canonical: "https://www.sgk.gr/ai-agents-erp-softone",
  },
  openGraph: {
    title: "AI Agents για SoftOne & Entersoft ERP | SGK Digital",
    description: "Αυτόνομοι AI Agents συνδεδεμένοι στο SoftOne & Entersoft ERP σας. Αυτόματη τιμολόγηση, OCR και διαχείριση αποθήκης με ασφάλεια.",
    url: "https://www.sgk.gr/ai-agents-erp-softone",
    siteName: "SGK Digital",
    locale: "el_GR",
    type: "website",
    images: [{ url: "https://www.sgk.gr/social-preview.png", width: 1200, height: 630, alt: "AI Agents ERP SoftOne - SGK Digital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents για SoftOne & Entersoft ERP | SGK Digital",
    description: "Αυτόνομοι AI Agents συνδεδεμένοι στο SoftOne ERP. Αυτοματοποιήστε τιμολόγηση και αποθήκη.",
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.sgk.gr/ai-agents-erp-softone#service",
  "name": "AI Agents & Αυτοματισμοί Επιχειρήσεων για SoftOne ERP & Entersoft",
  "serviceType": "Enterprise AI Agent Development & ERP/CRM Integration",
  "description": "Υπηρεσία ανάπτυξης προηγμένων AI Agents με αμφίδρομη διασύνδεση σε ελληνικά ERPs (SoftOne, Entersoft, SAP). Αυτόματη αναγνώριση τιμολογίων (OCR), αυτόματη καταχώριση παραγγελιών, έλεγχος αποθήκης και συστήματα Human-in-the-Loop για απόλυτη ασφάλεια.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://www.sgk.gr/#organization",
    "name": "SGK Digital (SGK Software Development)",
    "founder": {
      "@type": "Person",
      "name": "Σπύρος Τσάβος (Spyros Tsavos)"
    },
    "telephone": "+302111140013",
    "email": "info@sgk.gr",
    "url": "https://www.sgk.gr"
  },
  "areaServed": "GR",
  "inLanguage": "el"
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Πώς συνδέεται ένας AI Agent με το SoftOne ή το Entersoft ERP;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Η διασύνδεση πραγματοποιείται μέσω των επίσημων REST APIs / Web Services του SoftOne και του Entersoft. Ο AI Agent διαβάζει και γράφει δεδομένα σε πραγματικό χρόνο (π.χ. δημιουργία παραστατικού, έλεγχος αποθέματος, καταχώριση πελάτη) ακολουθώντας αυστηρά τα δικαιώματα χρήστη και τους κανόνες ασφαλείας του ERP."
      }
    },
    {
      "@type": "Question",
      "name": "Τι είναι το Human-in-the-Loop και πώς διασφαλίζει ότι δεν θα γίνουν λάθη στο ERP;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Το Human-in-the-Loop είναι η δικλείδα ασφαλείας της SGK Digital. Για κρίσιμες ενέργειες (όπως καταχώριση τιμολογίων άνω ενός ορίου, τροποποίηση τιμών ή ακυρώσεις), ο AI Agent ετοιμάζει την εγγραφή και στέλνει ειδοποίηση 1 κλικ στον υπεύθυνο της επιχείρησης για τελική έγκριση πριν αυτή οριστικοποιηθεί στο SoftOne."
      }
    },
    {
      "@type": "Question",
      "name": "Πόσο κοστίζει η υλοποίηση ενός AI Agent για SoftOne / Entersoft;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Το κόστος ξεκινά ενδεικτικά από 1.200€ setup για συγκεκριμένο use case (π.χ. αυτόματο OCR τιμολογίων και καταχώριση στο SoftOne), με μηνιαία συντήρηση και cloud AI ισχύ από 250€/μήνα. Η SGK Digital παρέχει 100% δωρεάν αρχική αξιολόγηση και αρχιτεκτονική μελέτη."
      }
    },
    {
      "@type": "Question",
      "name": "Πόσος χρόνος απαιτείται για να τεθεί σε παραγωγική λειτουργία;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Μια τυπική υλοποίηση AI διασύνδεσης με SoftOne ή Entersoft ολοκληρώνεται σε 2 έως 4 εβδομάδες, συμπεριλαμβανομένου του περιβάλλοντος δοκιμών (staging) και της εκπαίδευσης της ομάδας σας."
      }
    }
  ]
};

export default function AiAgentsErpSoftonePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-white font-sans text-black selection:bg-[#4ade80] selection:text-black">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-36 md:pb-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="bg-[#facc15] text-black font-black text-xs uppercase tracking-widest px-3 py-1 shadow-sm">
                  ENTERPRISE AUTOMATION
                </span>
                <span className="bg-[#111111] text-white font-black text-xs uppercase tracking-wider px-3 py-1 shadow-sm">
                  SOFTONE &amp; ENTERSOFT ERP
                </span>
                <span className="bg-[#4ade80] text-black font-bold text-xs uppercase tracking-wider px-2.5 py-1 shadow-sm">
                  HUMAN-IN-THE-LOOP
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.08] text-black mb-6">
                Αυτόνομοι AI Agents <br />
                <span className="text-[#3b5bdb]">Συνδεδεμένοι στο SoftOne ERP</span>
              </h1>

              <p className="text-lg text-gray-700 leading-relaxed mb-8 font-normal max-w-2xl">
                Αυτοματοποιήστε την καθημερινότητα του back-office: αυτόματη αναγνώριση τιμολογίων (OCR), έλεγχος αποθήκης σε πραγματικό χρόνο, διαχείριση παραγγελιών B2B και ενημέρωση πελατών με AI πράκτορες που επικοινωνούν αμφίδρομα με το SoftOne &amp; Entersoft.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link 
                  href="/estimate" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold text-base rounded-xl transition-all shadow-lg active:scale-[0.98]"
                >
                  Ζητήστε Δωρεάν Μελέτη ERP <ArrowRight size={18} />
                </Link>
                <a 
                  href="tel:+302111140013" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f4f2ea] hover:bg-gray-200 text-black font-bold text-base rounded-xl transition-all border border-black/10"
                >
                  <Phone size={18} /> 211 114 0013
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-[#f4f2ea] p-3 rounded-lg border border-black/5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span>Αμφίδρομο REST API / Webhooks</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-[#f4f2ea] p-3 rounded-lg border border-black/5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span>Μηδενικά λάθη πληκτρολόγησης</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-[#f4f2ea] p-3 rounded-lg border border-black/5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span>Έγκριση 1 κλικ για κρίσιμα data</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#4ade80]" />

        {/* 4 Core Use Cases */}
        <section className="py-20 bg-[#f4f2ea]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="bg-[#3b5bdb] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
                ΠΡΑΓΜΑΤΙΚΑ USE CASES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
                Τι Μπορεί να Κάνει ο AI Agent στο ERP σας;
              </h2>
              <p className="text-gray-600 text-base">
                Από την πρώτη ημέρα λειτουργίας, ο πράκτορας αναλαμβάνει τις χρονοβόρες εργασίες ρουτίνας που στερούν παραγωγικό χρόνο.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#3b5bdb] text-white flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">1. Αυτόματο OCR &amp; Καταχώριση Τιμολογίων</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Ο πράκτορας παρακολουθεί το inbox των λογαριασμών (τιμολόγια PDF, σαρωμένα scans). Αναγνωρίζει με Vision AI γραμμή-προς-γραμμή ΑΦΜ, ποσά, ΦΠΑ και κωδικούς ειδών και καταχωρεί το παραστατικό απευθείας στο SoftOne.
                </p>
                <div className="text-xs font-bold text-[#3b5bdb] bg-blue-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ Μείωση χρόνου εισαγωγής κατά 90%
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#4ade80] text-black flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <Workflow size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">2. Διαχείριση Παραγγελιών B2B &amp; Αποθέματα</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Όταν έρχεται παραγγελία μέσω email, WhatsApp ή portal, ο AI Agent ελέγχει τη διαθεσιμότητα των κωδικών στο SoftOne, δεσμεύει το απόθεμα, υπολογίζει τις ειδικές εκπτώσεις πελάτη και δημιουργεί την εντολή παραγγελίας.
                </p>
                <div className="text-xs font-bold text-[#22c55e] bg-green-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ Άμεση καταχώριση 24/7 χωρίς αναμονή
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#facc15] text-black flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <Database size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">3. AI Οικονομικός Βοηθός &amp; Έλεγχος Καρτέλας</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Οι πωλητές και η διοίκηση ρωτούν με φυσικό λόγο στο κινητό ή το Slack: <em>«Ποιο είναι το υπόλοιπο του πελάτη Χ;»</em> ή <em>«Ποιες εισπράξεις εκκρεμούν σήμερα;»</em>. Ο πράκτορας απαντά σε 1 δευτερόλεπτο αντλώντας ζωντανά δεδομένα από το ERP.
                </p>
                <div className="text-xs font-bold text-gray-800 bg-yellow-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ Πλήρης ορατότητα δεδομένων χωρίς login στο ERP
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">4. Human-in-the-Loop Δικλείδες Ασφαλείας</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Απόλυτος ανθρώπινος έλεγχος. Εσείς ορίζετε τους κανόνες: για παραγγελίες άνω των 500€ ή νέους πελάτες, ο πράκτορας συντάσσει την πρόταση και ζητά έγκριση μέσω email ή Push notification πριν γράψει οριστικά στη βάση.
                </p>
                <div className="text-xs font-bold text-gray-800 bg-slate-100 px-3 py-2 rounded-lg inline-block">
                  ⚡ 100% ασφάλεια και έλεγχος
                </div>
              </div>

            </div>

          </div>
        </section>

        <SectionDivider leftColor="bg-[#4ade80]" rightColor="bg-[#111111]" />

        {/* Technical Architecture */}
        <section className="py-20 bg-[#111111] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <span className="bg-[#facc15] text-black text-xs font-black uppercase tracking-widest px-3 py-1 shadow-sm inline-block mb-3">
                ΤΕΧΝΙΚΗ ΑΡΧΙΤΕΚΤΟΝΙΚΗ
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mb-4">
                Πώς Λειτουργεί το Pipeline της SGK Digital
              </h2>
              <p className="text-gray-400 text-base">
                Εγγυημένη ασφάλεια επιπέδου Enterprise. Τα εταιρικά σας δεδομένα δεν χρησιμοποιούνται για εκπαίδευση δημόσιων μοντέλων.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="text-xs font-black text-[#4ade80] uppercase tracking-wider mb-2">ΒΗΜΑ 01</div>
                <h4 className="text-lg font-bold mb-2">Είσοδος Δεδομένων</h4>
                <p className="text-xs text-gray-400">Emails, PDFs τιμολογίων, φόρμες παραγγελιών, μηνύματα πελατών.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="text-xs font-black text-[#4ade80] uppercase tracking-wider mb-2">ΒΗΜΑ 02</div>
                <h4 className="text-lg font-bold mb-2">AI Reasoning &amp; OCR</h4>
                <p className="text-xs text-gray-400">Εξαγωγή δομημένων πεδίων, έλεγχος ακεραιότητας, κανονικοποίηση ΑΦΜ/ειδών.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="text-xs font-black text-[#4ade80] uppercase tracking-wider mb-2">ΒΗΜΑ 03</div>
                <h4 className="text-lg font-bold mb-2">Human Validation</h4>
                <p className="text-xs text-gray-400">1-click έγκριση από τον αρμόδιο υπάλληλο εάν απαιτείται από τους κανόνες.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="text-xs font-black text-[#4ade80] uppercase tracking-wider mb-2">ΒΗΜΑ 04</div>
                <h4 className="text-lg font-bold mb-2">Ενημέρωση SoftOne</h4>
                <p className="text-xs text-gray-400">Αμφίδρομη εκτέλεση στο ERP μέσω Web Services API σε πραγματικό χρόνο.</p>
              </div>
            </div>

          </div>
        </section>

        <SectionDivider leftColor="bg-[#111111]" rightColor="bg-[#facc15]" />

        {/* Direct Answers AEO FAQs */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="bg-[#3b5bdb] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
                AEO DIRECT ANSWERS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
                Συχνές Ερωτήσεις για AI &amp; SoftOne ERP
              </h2>
            </div>

            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#f4f2ea] border border-black/5">
                  <h3 className="font-heading font-black text-lg text-black mb-2">{faq.name}</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-[#3b5bdb] text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mb-4">
              Θέλετε να Δείτε Demo Συνδεδεμένο στο ERP σας;
            </h2>
            <p className="text-blue-100 text-base max-w-xl mx-auto mb-8 font-normal">
              Κλείστε μια δωρεάν 30λεπτη τεχνική συνάντηση με τους AI Engineers της SGK Digital. Σχεδιάζουμε ζωντανά την αρχιτεκτονική του project σας.
            </p>
            <Link 
              href="/estimate" 
              className="inline-flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-black font-black px-10 py-4 rounded-xl text-sm uppercase tracking-wider shadow-2xl transition-all"
            >
              ΚΛΕΙΣΤΕ ΔΩΡΕΑΝ ΤΕΧΝΙΚΗ ΣΥΝΑΝΤΗΣΗ ➔
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
