import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import Link from "next/link";
import { 
  Phone, ArrowRight, CheckCircle2, ShieldCheck, Zap, 
  Mic, Headphones, Volume2, Calendar, Clock, Check, Users
} from "lucide-react";

export const metadata: Metadata = {
  title: "Voice AI Τηλεφωνικά Κέντρα στα Ελληνικά | Φωνητικοί AI Agents 24/7 | SGK Digital",
  description: "Αυτόνομοι φωνητικοί AI Agents με άπταιστη ελληνική ομιλία και απόκριση κάτω από 800ms. Απαντούν σε τηλεφωνικές κλήσεις 24/7, κλείνουν ραντεβού & κρατήσεις, συνδέονται με PBX (Asterisk, 3CX, FreePBX, Twilio) και ενημερώνουν αυτόματα το CRM σας.",
  keywords: "voice ai ελλαδα, ai τηλεφωνικο κεντρο, φωνητικοι ai agents στα ελληνικα, τηλεφωνικη εξυπηρετηση ai, voice bot ελληνικα, pbx ai asterisk 3cx, sgk digital, σπυρος τσαβος, ai τηλεφωνητης",
  alternates: {
    canonical: "https://www.sgk.gr/voice-ai-telefonia",
  },
  openGraph: {
    title: "Voice AI Τηλεφωνικά Κέντρα στα Ελληνικά | SGK Digital",
    description: "Φωνητικοί AI Agents για τηλεφωνικά κέντρα σε άπταιστα ελληνικά. 24/7 εξυπηρέτηση, κρατήσεις, ραντεβού και σύνδεση με PBX & CRM.",
    url: "https://www.sgk.gr/voice-ai-telefonia",
    siteName: "SGK Digital",
    locale: "el_GR",
    type: "website",
    images: [{ url: "https://www.sgk.gr/social-preview.png", width: 1200, height: 630, alt: "Voice AI Ελλάδα - SGK Digital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice AI Τηλεφωνικά Κέντρα στα Ελληνικά | SGK Digital",
    description: "Αυτόνομοι φωνητικοί πράκτορες με φυσική ελληνική προφορά για 24/7 τηλεφωνική εξυπηρέτηση.",
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.sgk.gr/voice-ai-telefonia#service",
  "name": "Voice AI Τηλεφωνικά Κέντρα & Φωνητικοί AI Agents στα Ελληνικά",
  "serviceType": "Conversational Voice AI & Telephony Automation",
  "description": "Υπηρεσία σχεδιασμού και ανάπτυξης φωνητικών AI πρακτόρων (Voice AI) για ελληνικές επιχειρήσεις. Υπο-δευτερόλεπτη απόκριση (<800ms) με φυσική ανθρώπινη προφορά στα ελληνικά, σύνδεση με Asterisk, 3CX, FreePBX, Twilio SIP trunking, αυτόματο κλείσιμο ραντεβού και κρατήσεων.",
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
      "name": "Πόσο φυσική είναι η ελληνική φωνή του Voice AI Agent;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Χρησιμοποιούμε κορυφαία μοντέλα Text-to-Speech και Speech-to-Text εκπαιδευμένα ειδικά για την ελληνική γλώσσα, με φυσικό επιτονισμό, ανάσες και άπταιστη προφορά ελληνικών ονομάτων, διευθύνσεων και όρων. Ο χρόνος απόκρισης είναι κάτω από 800ms, εξαλείφοντας τις άβολες ρομποτικές σιωπές."
      }
    },
    {
      "@type": "Question",
      "name": "Μπορεί ο φωνητικός πράκτορας να συνδεθεί με το υπάρχον τηλεφωνικό μας κέντρο;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ναι, υποστηρίζουμε SIP Trunking και άμεση σύνδεση με όλα τα δημοφιλή τηλεφωνικά κέντρα της αγοράς, όπως Asterisk, FreePBX, 3CX, Yeastar, Cisco CallManager και cloud παρόχους όπως Twilio. Ο πράκτορας λειτουργεί ως εσωτερικό του τηλεφωνικού σας κέντρου ή αναλαμβάνει απευθείας τις εισερχόμενες γραμμές."
      }
    },
    {
      "@type": "Question",
      "name": "Τι συμβαίνει αν ο πελάτης ζητήσει να μιλήσει με άνθρωπο;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ο Voice AI Agent υποστηρίζει Warm Transfer (ομαλή μεταβίβαση). Μεταφέρει άμεσα την κλήση στον κατάλληλο εκπρόσωπο ή τμήμα, παρέχοντας ταυτόχρονα σύνοψη των όσων ειπώθηκαν στην οθόνη του υπαλλήλου."
      }
    },
    {
      "@type": "Question",
      "name": "Πόσο κοστίζει ένα Voice AI τηλεφωνικό κέντρο στην SGK Digital;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Το αρχικό setup για τη διαμόρφωση του σεναρίου διαλόγου και τη σύνδεση με το PBX/CRM ξεκινά ενδεικτικά από 800€, ενώ η χρήση χρεώνεται με βάση τα λεπτά ομιλίας και τα μηνιαία πακέτα υποστήριξης από 180€/μήνα. Η SGK Digital προσφέρει δωρεάν δοκιμαστικό live demo."
      }
    }
  ]
};

export default function VoiceAiTelefoniaPage() {
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
                <span className="bg-[#4ade80] text-black font-black text-xs uppercase tracking-widest px-3 py-1 shadow-sm">
                  VOICE AI ΤΗΛΕΦΩΝΙΑ
                </span>
                <span className="bg-[#111111] text-white font-black text-xs uppercase tracking-wider px-3 py-1 shadow-sm">
                  ΑΠΟΚΡΙΣΗ &lt;800MS
                </span>
                <span className="bg-[#facc15] text-black font-bold text-xs uppercase tracking-wider px-2.5 py-1 shadow-sm">
                  ΦΥΣΙΚΑ ΕΛΛΗΝΙΚΑ
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.08] text-black mb-6">
                Voice AI Τηλεφωνικά Κέντρα: <br />
                <span className="text-[#3b5bdb]">Εξυπηρέτηση 24/7 Χωρίς Αναμονή</span>
              </h1>

              <p className="text-lg text-gray-700 leading-relaxed mb-8 font-normal max-w-2xl">
                Αυτόνομοι φωνητικοί πράκτορες που απαντούν στο τηλέφωνο σαν έμπειροι υπάλληλοι. Κλείνουν ραντεβού και κρατήσεις, απαντούν σε συχνές ερωτήσεις, συνδέονται με το PBX σας (Asterisk, 3CX, Twilio) και ενημερώνουν αυτόματα το CRM σας σε πραγματικό χρόνο.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link 
                  href="/estimate" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold text-base rounded-xl transition-all shadow-lg active:scale-[0.98]"
                >
                  Ακούστε Live Voice Demo <ArrowRight size={18} />
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
                  <span>Άμεση απόκριση &lt;800ms</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-[#f4f2ea] p-3 rounded-lg border border-black/5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span>Σύνδεση με Google Calendar / CRM</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-[#f4f2ea] p-3 rounded-lg border border-black/5">
                  <CheckCircle2 size={16} className="text-[#4ade80] shrink-0" />
                  <span>Warm transfer σε άνθρωπο</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#4ade80]" />

        {/* 4 Industry Use Cases */}
        <section className="py-20 bg-[#f4f2ea]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="bg-[#3b5bdb] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
                ΕΦΑΡΜΟΓΕΣ ΣΕ ΚΛΑΔΟΥΣ
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
                Πού Απογειώνει τα Αποτελέσματα το Voice AI;
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#3b5bdb] text-white flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">1. Κρατήσεις Rent-a-Car &amp; Τουρισμός</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Ο πράκτορας απαντά σε κλήσεις τουριστών και πελατών, ελέγχει ζωντανά τη διαθεσιμότητα του στόλου οχημάτων, καταχωρεί ημερομηνίες παραλαβής/παράδοσης και στέλνει άμεσα SMS/WhatsApp επιβεβαίωσης.
                </p>
                <div className="text-xs font-bold text-[#3b5bdb] bg-blue-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ Μηδέν χαμένες κρατήσεις εκτός ωραρίου
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#4ade80] text-black flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <Headphones size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">2. Ιατρεία, Κλινικές &amp; Διαγνωστικά</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Διαχείριση όγκου κλήσεων για ραντεβού. Ο AI πράκτορας συνομιλεί με τον ασθενή, βρίσκει το επόμενο διαθέσιμο κενό στο ημερολόγιο του γιατρού, καταχωρεί τα στοιχεία και στέλνει υπενθύμιση.
                </p>
                <div className="text-xs font-bold text-[#22c55e] bg-green-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ Αποσυμφόρηση γραμματείας κατά 85%
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#facc15] text-black flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">3. Εστίαση, Barbershop &amp; Υπηρεσίες</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Απαντά σε ώρες αιχμής όταν όλοι είναι απασχολημένοι. Κλείνει τραπέζια, ενημερώνει για το μενού και καταχωρεί κρατήσεις στο σύστημα κρατήσεων χωρίς καμία απώλεια πελάτη.
                </p>
                <div className="text-xs font-bold text-gray-800 bg-yellow-50 px-3 py-2 rounded-lg inline-block">
                  ⚡ 100% εξυπηρέτηση σε ώρες αιχμής
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center rounded-xl mb-5 shadow-sm">
                  <Volume2 size={24} />
                </div>
                <h3 className="text-xl font-heading font-black mb-3">4. Τεχνικές Εταιρείες &amp; Βλάβες 24/7</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Καταγραφή αναφορών βλαβών, διευθύνσεων και στοιχείων επαφής. Ο πράκτορας κατηγοριοποιεί τη βαρύτητα και ενημερώνει άμεσα τον τεχνικό επιφυλακής μέσω push notification.
                </p>
                <div className="text-xs font-bold text-gray-800 bg-slate-100 px-3 py-2 rounded-lg inline-block">
                  ⚡ 24/7 άμεση απόκριση σε επείγοντα
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
                ΤΗΛΕΦΩΝΙΚΗ ΑΡΧΙΤΕΚΤΟΝΙΚΗ
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mb-4">
                Πώς Συνδέεται με το Τηλεφωνικό σας Κέντρο
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="text-xs font-black text-[#4ade80] uppercase tracking-wider mb-2">01. SIP TRUNKING</div>
                <h4 className="text-lg font-bold mb-2">Σύνδεση στο PBX</h4>
                <p className="text-xs text-gray-400">Διασύνδεση με Asterisk, 3CX, FreePBX ή Twilio SIP Trunking σε λίγες ώρες.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="text-xs font-black text-[#4ade80] uppercase tracking-wider mb-2">02. ULTRA LOW LATENCY</div>
                <h4 className="text-lg font-bold mb-2">Απόκριση &lt;800ms</h4>
                <p className="text-xs text-gray-400">Streaming ASR &amp; TTS pipeline για διάλογο που ρέει όπως ανάμεσα σε δύο ανθρώπους.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="text-xs font-black text-[#4ade80] uppercase tracking-wider mb-2">03. LIVE CRM SYNC</div>
                <h4 className="text-lg font-bold mb-2">Αυτόματη Ενημέρωση</h4>
                <p className="text-xs text-gray-400">Άμεση καταχώριση στοιχείων κλήσης, ηχογράφησης και απομαγνητοφώνησης στο CRM.</p>
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
                Συχνές Ερωτήσεις για το Voice AI
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
              Ακούστε τον Voice AI Agent να Μιλάει στα Ελληνικά
            </h2>
            <p className="text-blue-100 text-base max-w-xl mx-auto mb-8 font-normal">
              Καλέστε μας τώρα στο 211 114 0013 ή ζητήστε να σας στείλουμε ζωντανό ηχητικό δείγμα προσαρμοσμένο στον δικό σας κλάδο.
            </p>
            <Link 
              href="/estimate" 
              className="inline-flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-black font-black px-10 py-4 rounded-xl text-sm uppercase tracking-wider shadow-2xl transition-all"
            >
              ΖΗΤΗΣΤΕ LIVE VOICE DEMO ➔
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
