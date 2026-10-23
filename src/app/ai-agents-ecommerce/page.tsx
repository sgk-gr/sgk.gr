import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import Link from "next/link";
import { 
  ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, Zap, 
  MessageSquare, Truck, RotateCcw, TrendingUp, Check, Phone
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agents για E-Commerce & E-Shop | Αυτοματισμός Παραγγελιών & Support | SGK Digital",
  description: "Ολοκληρωμένοι AI Agents για E-Shops: Αυτοματοποιήστε το customer support σε Website Chat, WhatsApp & Instagram DM, δώστε Live Tracking δέματος (ACS, BoxNow, Speedex) και αυξήστε τις πωλήσεις σας 24/7.",
  keywords: "ai customer support eshop, ai agents ecommerce ελλαδα, αυτοματοποιηση παραγγελιων ai, ai chatbot eshop, live tracking courier ai, acs boxnow ai tracking, sgk digital, σπυρος τσαβος",
  alternates: {
    canonical: "https://www.sgk.gr/ai-agents-ecommerce",
  },
  openGraph: {
    title: "AI Agents για E-Commerce & E-Shop | SGK Digital",
    description: "Αυτοματοποιήστε το customer support και τις παραγγελίες του E-shop σας με AI πράκτορες. Live courier tracking & omnichannel υποστήριξη 24/7.",
    url: "https://www.sgk.gr/ai-agents-ecommerce",
    siteName: "SGK Digital",
    locale: "el_GR",
    type: "website",
    images: [{ url: "https://www.sgk.gr/social-preview.png", width: 1200, height: 630, alt: "AI E-Commerce - SGK Digital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents για E-Commerce & E-Shop | SGK Digital",
    description: "Omnichannel AI εξυπηρέτηση πελατών για eshop με live courier tracking.",
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.sgk.gr/ai-agents-ecommerce#service",
  "name": "AI Agents για E-Commerce, E-Shop Customer Support & Courier Tracking",
  "serviceType": "E-Commerce AI Automation & Omnichannel Customer Support",
  "description": "Υπηρεσία ανάπτυξης έξυπνων AI πρακτόρων για ηλεκτρονικά καταστήματα (E-shops). Omnichannel υποστήριξη σε Website Live Chat, WhatsApp Business, Instagram DM και Messenger, ζωντανή διασύνδεση με APIs εταιρειών courier (ACS, BoxNow, Speedex, ΕΛΤΑ Courier) για live tracking, διαχείριση αλλαγών και ανάκτηση εγκαταλελειμμένων καλαθιών.",
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
      "name": "Σε ποιες πλατφόρμες E-shop μπορεί να συνδεθεί ο AI Agent;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Συνδέεται άμεσα με WooCommerce (WordPress), Shopify, Magento, PrestaShop, OpenCart, καθώς και με custom Next.js / React e-commerce πλατφόρμες. Η επικοινωνία γίνεται μέσω ασφαλών REST APIs."
      }
    },
    {
      "@type": "Question",
      "name": "Πώς λειτουργεί το Live Tracking αποστολών με τις εταιρείες Courier;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ο πελάτης ρωτάει στο chat: «Πού είναι το δέμα μου;» ή δίνει το email/αριθμό τηλεφώνου του. Ο AI Agent ανακτά τον αριθμό voucher από την παραγγελία, καλεί σε πραγματικό χρόνο το API της ACS, BoxNow, Speedex ή Γενικής Ταχυδρομικής και απαντά άμεσα με την ακριβή τοποθεσία του δέματος."
      }
    },
    {
      "@type": "Question",
      "name": "Μπορεί ο AI Agent να κάνει πωλήσεις και προτάσεις προϊόντων (Upsell / Cross-sell);",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ναι. Ο πράκτορας εκπαιδεύεται σε ολόκληρο τον κατάλογο των προϊόντων σας. Κατανοεί τις ανάγκες του πελάτη (π.χ. «Ψάχνω κρέμα για ξηρό δέρμα κάτω των 30€») και προτείνει τα ιδανικά προϊόντα με άμεσα links για προσθήκη στο καλάθι."
      }
    },
    {
      "@type": "Question",
      "name": "Πόσο κοστίζει η εγκατάσταση ενός AI Agent για E-shop;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Το setup ξεκινά από 650€ (συμπεριλαμβανομένης της σύνδεσης με το E-shop και το Courier API), με μηνιαία συντήρηση και διαχείριση συνομιλιών από 150€/μήνα. Η SGK Digital προσφέρει δωρεάν μελέτη αναγκών και demo."
      }
    }
  ]
};

export default function AiAgentsEcommercePage() {
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
                  E-COMMERCE AI
                </span>
                <span className="bg-[#111111] text-white font-black text-xs uppercase tracking-wider px-3 py-1 shadow-sm">
                  OMNICHANNEL SUPPORT 24/7
                </span>
                <span className="bg-[#4ade80] text-black font-bold text-xs uppercase tracking-wider px-2.5 py-1 shadow-sm">
                  LIVE COURIER TRACKING
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.08] text-black mb-6">
                AI Agents για E-Shop: <br />
                <span className="text-[#3b5bdb]">Αυτοματοποιήστε Παραγγελίες &amp; Support</span>
              </h1>

              <p className="text-lg text-gray-700 leading-relaxed mb-8 font-normal max-w-2xl">
                Ένας ενιαίος AI εγκέφαλος για Website Chat, WhatsApp, Instagram DM &amp; Messenger. Απαντάει σε πελάτες σε 1 δευτερόλεπτο, εντοπίζει ζωντανά αποστολές courier (ACS, BoxNow, Speedex), διαχειρίζεται αλλαγές και αυξάνει τις πωλήσεις σας.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link 
                  href="/estimate" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold text-base rounded-xl transition-all shadow-lg active:scale-[0.98]"
                >
                  Ζητήστε Δωρεάν E-Shop Demo <ArrowRight size={18} />
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
                  <span>Live Tracking (ACS, BoxNow, Speedex)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-[#f4f2ea] p-3 rounded-lg border border-black/5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span>Εξυπηρέτηση σε WhatsApp &amp; Instagram</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-[#f4f2ea] p-3 rounded-lg border border-black/5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span>Προτάσεις προϊόντων &amp; Upsell</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#4ade80]" />

        {/* 4 Core E-Commerce Features */}
        <section className="py-20 bg-[#f4f2ea]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="bg-[#3b5bdb] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
                ΚΟΡΥΦΑΙΕΣ ΔΥΝΑΤΟΤΗΤΕΣ
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
                Πώς Βοηθάει το E-Shop σας ο AI Agent;
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#3b5bdb] text-white flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <Truck size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">1. Ζωντανό Courier Tracking (BoxNow, ACS κ.α.)</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Το 60% των ερωτημάτων στο customer support είναι <em>«Πού είναι το δέμα μου;»</em>. Ο AI Agent καλεί απευθείας τα APIs των courier και δίνει άμεση απάντηση με το ιστορικό διαδρομής, μηδενίζοντας τα τηλεφωνήματα.
                </p>
                <div className="text-xs font-bold text-[#3b5bdb] bg-blue-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ 70% μείωση εισερχόμενων κλήσεων υποστήριξης
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#4ade80] text-black flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">2. Omnichannel Εξυπηρέτηση 24/7</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Είτε ο πελάτης σας στείλει μήνυμα στο WhatsApp, στο Instagram Direct, στο Facebook Messenger ή στο live chat της σελίδας, ο ίδιος εκπαιδευμένος AI εγκέφαλος απαντά αυτόματα σε άπταιστα ελληνικά.
                </p>
                <div className="text-xs font-bold text-[#22c55e] bg-green-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ Απόκριση σε κάτω από 2 δευτερόλεπτα
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#facc15] text-black flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <RotateCcw size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">3. Αυτοματοποίηση Αλλαγών &amp; Επιστροφών</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Ο πράκτορας καθοδηγεί τον πελάτη στη διαδικασία αλλαγής μεγέθους ή επιστροφής προϊόντος σύμφωνα με την πολιτική του καταστήματός σας, δημιουργεί το αίτημα στο σύστημα και ενημερώνει την αποθήκη.
                </p>
                <div className="text-xs font-bold text-gray-800 bg-yellow-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ Απρόσκοπτη εμπειρία επιστροφών
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">4. Έξυπνες Προτάσεις &amp; Αύξηση Καλαθιού</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Κατανοεί τι ψάχνει ο επισκέπτης και προτείνει συμπληρωματικά προϊόντα (Cross-sell), αυξάνοντας τη μέση αξία παραγγελίας (AOV). Ανιχνεύει πρόθεση εγκατάλειψης και προσφέρει βοήθεια πριν ο χρήστης φύγει.
                </p>
                <div className="text-xs font-bold text-gray-800 bg-slate-100 px-3 py-2 rounded-lg inline-block">
                  ⚡ +22% αύξηση στο conversion rate
                </div>
              </div>

            </div>

          </div>
        </section>

        <SectionDivider leftColor="bg-[#4ade80]" rightColor="bg-[#111111]" />

        {/* Direct Answers AEO FAQs */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="bg-[#3b5bdb] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
                AEO DIRECT ANSWERS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
                Συχνές Ερωτήσεις για AI σε E-Shop
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
              Αναβαθμίστε το E-Shop σας με AI Σήμερα
            </h2>
            <p className="text-blue-100 text-base max-w-xl mx-auto mb-8 font-normal">
              Επικοινωνήστε μαζί μας για να συνδέσουμε έναν δοκιμαστικό AI agent στο κατάστημά σας.
            </p>
            <Link 
              href="/estimate" 
              className="inline-flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-black font-black px-10 py-4 rounded-xl text-sm uppercase tracking-wider shadow-2xl transition-all"
            >
              ΖΗΤΗΣΤΕ DEMO ΓΙΑ E-SHOP ➔
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
