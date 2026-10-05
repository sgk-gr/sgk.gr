"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  Mic, 
  FileText, 
  Compass, 
  BarChart3, 
  CheckCircle2, 
  ExternalLink, 
  Brain, 
  GraduationCap, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Code2, 
  Database,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const techStack = [
  "Next.js 15 (App Router)",
  "OpenAI Realtime WebRTC",
  "Whisper & TTS Engine",
  "Vision OCR Multi-modal",
  "Supabase (PostgreSQL & pgvector)",
  "TailwindCSS & Framer Motion",
  "Socratic Prompt Engineering",
  "Resend Email Automation",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function MendoraCaseStudyClient() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-200 selection:text-purple-900">
      
      {/* ───────────────── TOP NAVIGATION ───────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Πίσω στο Portfolio
          </Link>
          <Link
            href="/mendora"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600/10 text-purple-600 hover:bg-purple-600/20 text-xs font-bold transition-colors"
          >
            <span>Live Platform Demo (English)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ───────────────── HERO SECTION ───────────────── */}
      <section className="pt-32 pb-20 border-b border-border/50">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-heading text-xs tracking-[0.3em] uppercase font-bold text-purple-600">
                AI / EdTech / Voice Agents
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground font-medium">
                SGK Software Development Incubator
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[1.08] mb-6">
              Mendora Academy
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
              Το πρώτο <span className="text-foreground font-semibold">AI-Native Voice-First</span> ψηφιακό φροντιστήριο, κατασκευασμένο αποκλειστικά από την SGK Digital για λογαριασμό της Βρετανικής <strong>ELC</strong>. Πλήρης αρχιτεκτονική με Σωκρατική μέθοδο διδασκαλίας, αυτόματη διόρθωση χειρόγραφων ασκήσεων με Vision OCR και δυναμικό Knowledge Graph ύλης.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {techStack.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 rounded-full border border-purple-200/60 dark:border-purple-800/40"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/mendora"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02]"
              >
                <span>Δείτε Ζωντανά την Πλατφόρμα (Live Demo)</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href="/estimate"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
              >
                <span>Ανάπτυξη Δικής σας AI Πλατφόρμας</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── PREVIEW HERO BANNER ───────────────── */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-white p-6 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Προεπισκόπηση Συστήματος
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Σχεδιασμένο με έμπνευση από το Khanmigo & κορυφαία US EdTech
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                  Το Mendora Academy κατασκευάστηκε αποκλειστικά από την SGK Digital για λογαριασμό της <strong>ELC</strong> (κορυφαία Βρετανική εταιρεία εκπαίδευσης). Σχεδιάστηκε από το μηδέν με απαλό λιλά UI, παιχνιδοποιημένα stickers, άμεση απόκριση φωνής (&lt;600ms) και ασφάλεια δεδομένων για ανηλίκους μαθητές σύμφωνα με το GDPR.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="p-4 rounded-xl bg-[#FAF8FE] border border-purple-100">
                    <p className="text-2xl font-bold text-purple-700">&lt;600ms</p>
                    <p className="text-xs text-gray-600">Voice Latency WebRTC</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8FE] border border-purple-100">
                    <p className="text-2xl font-bold text-purple-700">98.4%</p>
                    <p className="text-xs text-gray-600">Ακρίβεια Vision OCR</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8FE] border border-purple-100">
                    <p className="text-2xl font-bold text-purple-700">24+ Έτη</p>
                    <p className="text-xs text-gray-600">Standardized Exam Bank</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8FE] border border-purple-100">
                    <p className="text-2xl font-bold text-purple-700">100%</p>
                    <p className="text-xs text-gray-600">Αυτοματοποιημένα Reports</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-[#EAE6F8] text-center flex flex-col">
                <Image
                  src="/mend.png"
                  alt="Mendora Academy Brand"
                  width={800}
                  height={450}
                  className="w-full h-auto object-cover border-b border-gray-200"
                />
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-medium">
                    Αποκλειστικό UI/UX & AI Engine αναπτυγμένο εξ ολοκλήρου από την ομάδα της <strong>SGK Digital</strong> για λογαριασμό της ELC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── THE CHALLENGE & THE SOLUTION ───────────────── */}
      <section className="py-20 border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* The Challenge */}
            <motion.div {...fadeUp} className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-4">Η Πρόκληση</h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                Οι οικογένειες δαπανούν χιλιάδες ευρώ ετησίως σε παραδοσιακά φροντιστήρια, όπου οι μαθητές στοιβάζονται σε πολυπληθή τμήματα και χάνουν πολύτιμο χρόνο σε μετακινήσεις. 
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                Από την άλλη, η χρήση απλών generative AI εργαλείων (όπως το default ChatGPT) αποτυγχάνει στην εκπαίδευση: <strong>το AI δίνει έτοιμες τις λύσεις</strong>, με αποτέλεσμα ο μαθητής να μην αποκτά κριτική σκέψη και να αποτυγχάνει στις επίσημες εξετάσεις.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> Υπερβολικό κόστος ιδιωτικής ενισχυτικής διδασκαλίας.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> Γνωστική αδράνεια (cognitive laziness) από έτοιμες λύσεις.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> Μηδενική πραγματική ενημέρωση γονέων για τα κενά του μαθητή.
                </li>
              </ul>
            </motion.div>

            {/* The Solution */}
            <motion.div {...fadeUp} className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-4">Η Λύση της SGK Digital</h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                Αναπτύξαμε μια ολοκληρωμένη AI-Native πλατφόρμα βασισμένη στη <strong>Σωκρατική Μέθοδο</strong>. Το σύστημα λειτουργεί ταυτόχρονα ως <em>Διευθυντής Σπουδών</em> (οργάνωση ημερήσιου προγράμματος μελέτης) και ως <em>Προσωπικός Μέντορας 24/7</em>.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                Ο μαθητής δεν λαμβάνει ποτέ έτοιμες απαντήσεις. Το AI τον καθοδηγεί βήμα-βήμα με διαδραστικό φωνητικό διάλογο, ερωτήσεις αναστοχασμού και άμεσο έλεγχο χειρόγραφων σημειώσεων.
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 
                  <span>Σωκρατική καθοδήγηση αντί για παθητικές απαντήσεις.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 
                  <span>Voice-First περιβάλλον με φυσική ελληνική ομιλία.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 
                  <span>Αυτόματη εβδομαδιαία ανάλυση προόδου προς τους γονείς.</span>
                </li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ───────────────── ARCHITECTURAL DEEP DIVE ───────────────── */}
      <section className="py-20 border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-purple-600 mb-3">
              Τεχνική Αρχιτεκτονική
            </h2>
            <h3 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Πώς Λειτουργεί Κάτω από το Καπό
            </h3>
            <p className="text-muted-foreground">
              Συνδυασμός cutting-edge τεχνολογιών AI, WebRTC, Vision OCR και Vector RAG για απαράμιλλη ταχύτητα και παιδαγωγική εγκυρότητα.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tech 1 */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2">WebRTC Conversational Audio</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Χρησιμοποιεί bidirectional streaming WebRTC πρωτόκολλο για φωνητικό διάλογο. Η καθυστέρηση (latency) κρατιέται κάτω από 600ms, προσφέροντας φυσική συζήτηση χωρίς ρομποτικές παύσεις.
              </p>
            </div>

            {/* Tech 2 */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2">Multi-modal Vision OCR</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Προηγμένο pipeline αναγνώρισης χειρόγραφου κειμένου και μαθηματικών συμβόλων. Αξιολογεί δομή παραγράφων, επιχειρηματολογία και υπολογιστικά βήματα βάσει επίσημων οδηγιών βαθμολόγησης.
              </p>
            </div>

            {/* Tech 3 */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2">Supabase pgvector & RAG</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Αποθήκευση ολόκληρης της σχολικής ύλης, των επίσημων θεμάτων και των λύσεων σε διανυσματική βάση (vector embeddings) για 100% ακριβή ανάκτηση δεδομένων χωρίς παραισθήσεις (hallucinations).
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ───────────────── RESULTS & IMPACT ───────────────── */}
      <section className="py-20 border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-purple-600 mb-3">
              Αποτέλεσμα
            </h2>
            <h3 className="text-3xl sm:text-4xl font-heading font-bold mb-6">
              Ένα Πλήρες Επιστέγασμα των AI Δυνατοτήτων της SGK Digital
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Το Mendora Academy αποτελεί ζωντανή απόδειξη ότι η <strong>SGK Digital</strong> δεν κατασκευάζει απλές ιστοσελίδες ή απλοϊκά chatbots, αλλά αναπτύσσει <strong>custom enterprise AI λογισμικό</strong> παγκόσμιας κλάσης με complex business logic, voice interfaces και multi-modal computer vision.
            </p>

            <div className="p-8 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  💡
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Θέλετε να αναπτύξετε τη δική σας AI Εκπαιδευτική Πλατφόρμα;</h4>
                  <p className="text-xs text-muted-foreground">Custom Web Apps, EdTech LMS & Voice AI Agents</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Η ομάδα μας αναλαμβάνει τον πλήρη σχεδιασμό, την αρχιτεκτονική και την υλοποίηση web εφαρμογών τεχνητής νοημοσύνης για εκπαιδευτικούς οργανισμούς, φροντιστήρια, εταιρικά training portals και startups.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/estimate"
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-colors"
                >
                  Υπολογισμός Κόστους & Προσφορά →
                </Link>
                <Link
                  href="/mendora"
                  className="px-5 py-3 rounded-xl border border-border text-black hover:bg-card text-sm font-semibold transition-colors"
                >
                  Περιήγηση στο Live Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SGK Software Development. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/portfolio" className="hover:text-foreground transition-colors">
              Portfolio
            </Link>
            <Link href="/services" className="hover:text-foreground transition-colors">
              Υπηρεσίες
            </Link>
            <Link href="/estimate" className="hover:text-foreground transition-colors">
              Εκτίμηση Κόστους
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
