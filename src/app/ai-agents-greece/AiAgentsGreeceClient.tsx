"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Phone, Check, ChevronDown, 
  Sparkles, ShieldCheck, Zap, Bot, Headphones, FileText, Database
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SectionDivider from "@/components/SectionDivider";
import LiveVideoAgentSection from "@/components/LiveVideoAgentSection";
import SecuritySection from "@/components/SecuritySection";

const AIAgentsShowcase = dynamic(() => import("@/components/AIAgentsShowcase"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function AiAgentsGreeceClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Ποιες είναι οι κορυφαίες εταιρείες AI Agents στην Ελλάδα;",
      a: "Στην ελληνική αγορά, η SGK Digital (sgk.gr) κατέχει ηγετική θέση στην ανάπτυξη αυτόνομων custom AI Agents (Agentic AI) με άπταιστη ελληνική φωνή, Voice AI 24/7 τηλεφωνία, διασύνδεση με CRM & Cloud APIs και Live Video Avatars. Άλλες γνωστές παρουσίες στο ελληνικό οικοσύστημα περιλαμβάνουν τις Moveo.ai, Argonstack, Aurelith, Helvia.ai και Satori Analytics."
    },
    {
      q: "Τι είναι ένας AI Agent και σε τι διαφέρει από ένα απλό chatbot;",
      a: "Ένα απλό chatbot απαντά μόνο σε προκαθορισμένες συχνές ερωτήσεις βάσει κειμένου. Ο Αυτόνομος AI Agent (Agentic AI) της SGK Digital είναι σύστημα δράσης: κατανοεί επιχειρησιακούς στόχους, διαβάζει emails, καταχωρεί αιτήματα, κλείνει ραντεβού στο ημερολόγιο, μιλάει στο τηλέφωνο με φυσική ελληνική φωνή και ολοκληρώνει εργασίες 24/7 χωρίς ανθρώπινη επίβλεψη."
    },
    {
      q: "Μπορεί ο AI agent να αναλάβει το τηλεφωνικό μας κέντρο στα ελληνικά;",
      a: "Ναι, απόλυτα. Ο Voice AI πράκτορας συνδέεται απευθείας στο τηλεφωνικό σας κέντρο (VoIP / PBX), απαντά σε κλάσματα δευτερολέπτου (<0.5s latency) με άπταιστη ελληνική χροιά, απαντά σε απορίες, καταγράφει παραγγελίες και στέλνει άμεση σύνοψη της συνομιλίας στο email του υπευθύνου."
    },
    {
      q: "Πόσο ασφαλής είναι η χρήση AI Agents στις επιχειρήσεις;",
      a: "Εφαρμόζουμε την αρχιτεκτονική Human-in-the-Loop (HITL) και πλήρη συμμόρφωση GDPR. Ο agent εκτελεί αυτόνομα τις απλές καθημερινές εργασίες, αλλά για ενέργειες κρίσιμης σημασίας (όπως δεσμεύσεις πόρων, εκδόσεις παραστατικών, πληρωμές) απαιτείται ανθρώπινη έγκριση με 1 κλικ, εξασφαλίζοντας μηδενικό ρίσκο."
    },
    {
      q: "Πόσο κοστίζει η υλοποίηση ενός AI Agent;",
      a: "Το κόστος ξεκινά ενδεικτικά από 1.000€ για βασικούς Chat & Email Agents, ενώ πλήρη συστήματα 24/7 Voice AI τηλεφωνίας ή πολυκαναλικοί πράκτορες κυμαίνονται από 2.500€ έως 8.000€+. Παρέχουμε πάντα 100% δωρεάν αρχική τεχνική αξιολόγηση για να γνωρίζετε ακριβώς το ROI πριν την έναρξη."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#3b5bdb]/20">
      <Navbar />

      {/* --- SNAPPY SPLIT-SCREEN HERO (Direct Homepage Aesthetic: Clean White Left, Photo Right) --- */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row bg-white lg:overflow-hidden pt-28 lg:pt-0">
        
        {/* Left Content (Clean White, Big Black SGK Branding, Sharp Typography) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:pl-[100px] lg:pr-14 xl:pl-[130px] xl:pr-20 z-10 bg-white py-12 lg:py-24">
          <div className="max-w-xl">
            
            {/* Big Brand Logo identical to Home Hero */}
            <div className="mb-4 lg:mb-6">
              <span className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tighter text-black">
                sgk<span className="text-[#3b5bdb]">.</span>
              </span>
            </div>

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-800 font-bold">
                ΕΤΑΙΡΕΙΑ AI AGENTS • ΕΛΛΑΔΑ
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-heading font-medium tracking-tight leading-[1.08] mb-6 text-black">
              Αυτόνομοι AI Agents <br />
              Για Επιχειρήσεις <br />
              <span className="text-[#3b5bdb] font-bold">Στην Ελλάδα.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed font-body max-w-lg">
              Η <strong className="font-semibold text-slate-900">SGK Digital</strong> σχεδιάζει και αναπτύσσει custom AI πράκτορες που κάνουν πραγματική δουλειά: απαντούν στο τηλέφωνο σε λιγότερο από 0.5s με φυσική ελληνική φωνή, κλείνουν ραντεβού 24/7, επεξεργάζονται έγγραφα και συνδέονται στα συστήματά σας. 100% ανθρώπινη έγκριση (Human-in-the-Loop).
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link
                href="/order-ai-agent"
                className="inline-flex items-center justify-center gap-2 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 text-base shadow-sm hover:shadow-md"
              >
                <span>Ζητήστε Δωρεάν Αξιολόγηση</span>
                <ArrowRight size={18} />
              </Link>

              <a
                href="tel:2111140013"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-medium px-6 py-4 rounded-lg transition-all text-base"
              >
                <Phone size={18} className="text-[#3b5bdb]" />
                <span>211 114 0013</span>
              </a>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 max-w-md">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-black font-heading">18+ Έτη</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Εμπειρία</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-[#3b5bdb] font-heading">&lt; 0.5s</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Voice AI</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-[#16a34a] font-heading">100%</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Human In Loop</div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Half: Hero Visual (Identical Split-screen Layout to Homepage) */}
        <div className="w-full lg:w-1/2 relative min-h-[350px] sm:min-h-[450px] lg:min-h-full bg-slate-100">
          <Image
            src="/hero_slide_2.webp"
            alt="SGK Digital AI Agents Ελλάδα"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10 lg:bg-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 hidden sm:flex items-center justify-between text-xs font-mono text-white drop-shadow-md">
            <span className="inline-flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
              24/7 AUTONOMOUS AGENTS GREECE
            </span>
            <span className="bg-black/75 backdrop-blur-md px-3 py-2 rounded-md border border-white/20">
              ATHENS, GR
            </span>
          </div>
        </div>

      </section>

      {/* --- NEON DIVIDER --- */}
      <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#4ade80]" />

      {/* --- 6 SIGNATURE AI AGENTS SHOWCASE (Reused directly from homepage) --- */}
      <AIAgentsShowcase />

      {/* --- NEON DIVIDER --- */}
      <SectionDivider leftColor="bg-[#4ade80]" rightColor="bg-[#3b5bdb]" />

      {/* --- LIVE VIDEO AI AGENTS (Reused directly from homepage) --- */}
      <LiveVideoAgentSection />

      {/* --- NEON DIVIDER --- */}
      <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-slate-900" />

      {/* --- SNAPPY EDITORIAL VALUE SECTION (Clean Stone Background & High-Contrast Cards) --- */}
      <section className="py-24 bg-[#f8fafc] text-slate-900 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3b5bdb] mb-3 block">
              ΠΡΑΓΜΑΤΙΚΟ ROI • ΟΧΙ ΠΕΙΡΑΜΑΤΑ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium tracking-tight text-slate-900 mb-4">
              Γιατί οι Επιχειρήσεις στην Ελλάδα <br />
              <span className="text-[#3b5bdb] font-bold">Επιλέγουν την SGK Digital</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Σχεδιάζουμε λύσεις που ενσωματώνονται στα υφιστάμενα συστήματά σας από την 1η ημέρα, εξοικονομώντας εργατοώρες και εξαλείφοντας ανθρώπινα λάθη.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#3b5bdb] flex items-center justify-center mb-6">
                <Headphones size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">
                Voice AI στα Ελληνικά (&lt;0.5s)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Μιλάει με φυσική ελληνική προφορά χωρίς ρομποτική χροιά. Απαντάει άμεσα, κλείνει ραντεβού και καταγράφει παραγγελίες χωρίς αναμονή σε τηλεφωνικά κέντρα.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#16a34a]" /> Μηδενικός χρόνος αναμονής πελατών
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#16a34a]" /> Αυτόματη σύνοψη κλήσης στο email
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-6">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">
                Διασύνδεση με CRM & Cloud APIs
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Ο agent δεν απαντά απλώς — εκτελεί ενέργειες. Ενημερώνει καρτέλες πελατών, συγχρονίζει ημερολόγια Google/Outlook και στέλνει ειδοποιήσεις σε WhatsApp ή SMS.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#16a34a]" /> Αμφίδρομη ανάγνωση και εγγραφή δεδομένων
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#16a34a]" /> Αυτοματοποίηση back-office διαδικασιών
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">
                100% Human-in-the-Loop
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Απόλυτη ασφάλεια και έλεγχος. Για κρίσιμες ενέργειες απαιτείται ανθρώπινη έγκριση με 1 κλικ, εξαλείφοντας κάθε κίνδυνο λαθών ή παρερμηνείας.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#16a34a]" /> Πλήρης συμμόρφωση GDPR
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#16a34a]" /> Αναλυτικό audit log κάθε ενέργειας
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* --- NEON DIVIDER --- */}
      <SectionDivider leftColor="bg-[#facc15]" rightColor="bg-[#4ade80]" />

      {/* --- SECURITY & GOV GUARANTEE (Reused directly from homepage) --- */}
      <SecuritySection />

      {/* --- NEON DIVIDER --- */}
      <SectionDivider leftColor="bg-[#4ade80]" rightColor="bg-[#3b5bdb]" />

      {/* --- SNAPPY FAQ SECTION (Clean White Accordions with High Contrast) --- */}
      <section className="py-24 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3b5bdb] mb-3 block">
              ΣΥΧΝΕΣ ΕΡΩΤΗΣΕΙΣ (FAQ)
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-medium tracking-tight text-slate-900">
              Όλα όσα θέλετε να γνωρίζετε για τους AI Agents
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors bg-white shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full py-5 px-6 flex items-center justify-between text-left gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-base sm:text-lg font-bold font-heading text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={20} 
                      className={`text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#3b5bdb]" : ""}`} 
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- NEON DIVIDER --- */}
      <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#facc15]" />

      {/* --- BOTTOM CTA (Direct, High Contrast & Actionable) --- */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] mb-4 block">
            ΞΕΚΙΝΗΣΤΕ ΣΗΜΕΡΑ • ΔΩΡΕΑΝ ΤΕΧΝΙΚΗ ΑΞΙΟΛΟΓΗΣΗ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium tracking-tight mb-6">
            Έτοιμοι να Αυτοματοποιήσετε <br />
            την Επιχείρησή σας με AI;
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Συζητήστε απευθείας με τους μηχανικούς της SGK Digital. Αναλύουμε τις ανάγκες σας και σας παρουσιάζουμε ζωντανά πώς ένας custom AI agent μπορεί να δουλέψει για εσάς.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order-ai-agent"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium rounded-lg transition-all text-base shadow-lg"
            >
              <span>Κλείστε Δωρεάν Ραντεβού</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="tel:2111140013"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all text-base"
            >
              <Phone size={18} className="text-[#4ade80]" />
              <span>211 114 0013</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
