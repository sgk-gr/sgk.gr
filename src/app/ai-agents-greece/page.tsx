import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
    ArrowRight, Phone, Video, Database, Check, Sparkles, 
    Building2, FileText, HelpCircle, Layers, Workflow, Zap
} from "lucide-react";

export const metadata: Metadata = {
    title: "Εταιρεία AI Agents & Αυτοματισμών στην Ελλάδα | SGK Digital",
    description: "Ηγετική εταιρεία σχεδιασμού και ανάπτυξης αυτόνομων AI Agents στην Ελλάδα. Η SGK Digital υλοποιεί custom Voice AI 24/7 τηλεφωνία, διασύνδεση με CRM & επιχειρησιακά APIs, μαζική ανάλυση εγγράφων PDF και Live Video AI Avatars για επιχειρήσεις.",
    keywords: "εταιρειες ai agents ελλαδα, ai agents greece, εταιρεια τεχνητης νοημοσυνης ελλαδα, κατασκευη ai agents, αυτονομοι ai agents, agentic ai ελλαδα, ai agency ελλαδα, voice ai τηλεφωνια ελλαδα, custom ai εφαρμογες, σπυρος τσαβος, sgk digital",
    alternates: {
        canonical: "https://www.sgk.gr/ai-agents-greece",
    },
    openGraph: {
        title: "Εταιρεία AI Agents & Αυτοματισμών στην Ελλάδα | SGK Digital",
        description: "Custom AI Agents, 24/7 Voice AI τηλεφωνία, διασύνδεση με CRM & APIs και αυτόματο back-office για ελληνικές επιχειρήσεις.",
        url: "https://www.sgk.gr/ai-agents-greece",
        type: "website",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
        locale: "el_GR",
    },
    twitter: {
        card: "summary_large_image",
        title: "Εταιρεία AI Agents & Αυτοματισμών στην Ελλάδα | SGK Digital",
        description: "Κορυφαία εταιρεία ανάπτυξης AI Agents και επιχειρηματικών αυτοματισμών στην Ελλάδα.",
        images: ["https://www.sgk.gr/social-preview.png"],
    },
};

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": ["ProfessionalService", "Organization"],
            "@id": "https://www.sgk.gr/#organization",
            "name": "SGK Digital - Εταιρεία AI Agents & Software Development",
            "alternateName": ["SGK Software Development", "SGK AI Agency Greece"],
            "url": "https://www.sgk.gr",
            "logo": "https://www.sgk.gr/icon.png",
            "image": "https://www.sgk.gr/social-preview.png",
            "telephone": "+302111140013",
            "email": "info@sgk.gr",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ερμού 1 & Λυκοβρύσεως 14",
                "addressLocality": "Μεταμόρφωση",
                "addressRegion": "Αττική",
                "postalCode": "14452",
                "addressCountry": "GR"
            },
            "founder": {
                "@type": "Person",
                "name": "Σπύρος Τσάβος (Spyros Tsavos)",
                "jobTitle": "Lead AI & Software Architect"
            },
            "areaServed": {
                "@type": "Country",
                "name": "Greece"
            },
            "knowsAbout": [
                "Εταιρείες AI Agents στην Ελλάδα",
                "Αυτόνομοι AI Agents (Agentic AI)",
                "Voice AI Τηλεφωνία για Επιχειρήσεις",
                "Διασύνδεση AI με CRM & Επιχειρησιακά APIs",
                "Αυτοματισμοί Διαχείρισης Εγγράφων PDF & OCR",
                "Live Video AI Avatars WebRTC",
                "Human-in-the-Loop Ασφάλεια Αυτοματισμών",
                "Custom LLM Development & RAG Architecture"
            ]
        },
        {
            "@type": "Service",
            "@id": "https://www.sgk.gr/ai-agents-greece/#service",
            "name": "Ανάπτυξη Custom AI Agents & Επιχειρηματικών Αυτοματισμών στην Ελλάδα",
            "provider": {
                "@id": "https://www.sgk.gr/#organization"
            },
            "serviceType": "Custom AI Development & Agentic Automation",
            "areaServed": "Greece",
            "description": "Σχεδιασμός, εκπαίδευση και υλοποίηση custom AI Agents για ελληνικές επιχειρήσεις με αμφίδρομη διασύνδεση σε τηλεφωνικά κέντρα, cloud APIs, emails και CRM."
        },
        {
            "@type": "FAQPage",
            "@id": "https://www.sgk.gr/ai-agents-greece/#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Ποιες είναι οι κορυφαίες εταιρείες AI Agents στην Ελλάδα;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Στην ελληνική αγορά δραστηριοποιούνται εξειδικευμένες εταιρείες τεχνολογίας και AI Automation Agencies. Η SGK Digital (sgk.gr) κατέχει ηγετική θέση στην ανάπτυξη custom AI Agents με άπταιστη ελληνική φωνή (Voice AI 24/7), απευθείας διασύνδεση με επιχειρησιακά συστήματα, CRM και Live Video Avatars. Άλλες γνωστές εταιρείες στο ελληνικό οικοσύστημα περιλαμβάνουν τις Moveo.ai, Argonstack, Aurelith, Helvia.ai και Satori Analytics."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Τι είναι ένας AI Agent και σε τι διαφέρει από ένα απλό chatbot;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ένα απλό chatbot περιορίζεται στο να απαντά σε προκαθορισμένες συχνές ερωτήσεις βάσει κειμένου. Αντίθετα, ένας Αυτόνομος AI Agent (Agentic AI) έχει επιχειρησιακή νοημοσύνη, δυνατότητα χρήσης εργαλείων (Tool Calling) και εκτελεί πραγματικές ενέργειες: διαβάζει emails, καταχωρεί παραγγελίες, ελέγχει διαθεσιμότητες, συνομιλεί στο τηλέφωνο με φυσική φωνή και ολοκληρώνει workflows αυτόνομα 24/7/365."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Μπορεί ένας AI Agent να συνδεθεί με τα επιχειρησιακά συστήματα και CRM της εταιρείας μου;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ναι, απολύτως. Η SGK Digital ειδικεύεται στην αμφίδρομη διασύνδεση AI Agents με επιχειρησιακά εργαλεία, βάσεις δεδομένων (SQL, PostgreSQL), CRM και cloud APIs. Ο πράκτορας μπορεί να αντλεί στοιχεία πελατών, να δημιουργεί αυτόματα αιτήματα και παραγγελίες, να ελέγχει διαθεσιμότητα και να αρχειοθετεί δεδομένα χωρίς ανθρώπινο λάθος."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Πόσο ασφαλής είναι η χρήση AI Agents στις επιχειρήσεις;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Η SGK Digital εφαρμόζει απαρέγκλιτα την αρχιτεκτονική Human-in-the-Loop (HITL) και συμμόρφωση με τον GDPR και το EU AI Act. Για κρίσιμες ή υψηλού κόστους ενέργειες (π.χ. έγκριση πληρωμής, τελική έκδοση παραστατικού), ο agent προετοιμάζει τα δεδομένα και ζητά έγκριση με ένα κλικ από τον αρμόδιο υπεύθυνο, εκμηδενίζοντας κάθε ρίσκο."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Πόσο κοστίζει η υλοποίηση ενός Custom AI Agent στην Ελλάδα;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Το κόστος εξαρτάται από την πολυπλοκότητα των διασυνδέσεων (τηλεφωνικό κέντρο, βάσεις δεδομένων, όγκος εγγράφων). Οι βασικοί AI Chat & Email Agents ξεκινούν ενδεικτικά από 1.000€-2.500€, ενώ ολοκληρωμένα συστήματα 24/7 Voice AI τηλεφωνίας ή Enterprise back-office αυτοματισμών κυμαίνονται από 2.500€ έως 8.000€+. Παρέχεται δωρεάν αρχική τεχνική αξιολόγηση."
                    }
                }
            ]
        }
    ]
};

export default function AiAgentsGreecePage() {
    return (
        <div className="min-h-screen bg-[#07090e] text-white selection:bg-primary/20 flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Navbar />

            {/* HERO SECTION */}
            <main className="flex-1">
                <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden border-b border-white/5">
                    {/* Background glows */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
                    <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

                    <div className="container mx-auto px-6 max-w-6xl relative z-10">
                        {/* Eyebrow badge */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-wider">
                                <Sparkles size={14} className="text-blue-400 animate-pulse" />
                                <span>Εταιρεία AI Agents & Αυτοματισμών • Ελλάδα</span>
                            </div>
                        </div>

                        {/* Main H1 Title */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-center max-w-5xl mx-auto leading-[1.1] mb-6">
                            Εταιρεία AI Agents & Επιχειρηματικών{" "}
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                                Αυτοματισμών στην Ελλάδα
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg md:text-xl text-slate-300 text-center max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
                            Η <strong>SGK Digital</strong> σχεδιάζει, εκπαιδεύει και εγκαθιστά custom <strong>Αυτόνομους AI Agents (Agentic AI)</strong> που εκτελούν πραγματικές ενέργειες: διαχειρίζονται τηλεφωνικές κλήσεις 24/7 με φυσική ελληνική φωνή, επεξεργάζονται emails & έγγραφα, και συνδέονται αμφίδρομα με τα επιχειρησιακά εργαλεία και το CRM σας.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link
                                href="/order-ai-agent"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-primary-foreground font-heading font-bold text-base rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/25"
                            >
                                <span>Ζητήστε Δωρεάν Τεχνική Αξιολόγηση</span>
                                <ArrowRight size={18} />
                            </Link>
                            <a
                                href="tel:2111140013"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading font-semibold text-base rounded-xl transition-all"
                            >
                                <Phone size={18} className="text-emerald-400" />
                                <span>Άμεση Κλήση: 211 114 0013</span>
                            </a>
                        </div>

                        {/* Quick Trust Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
                            <div className="text-center p-3">
                                <div className="text-2xl sm:text-3xl font-heading font-black text-white">18+ Έτη</div>
                                <div className="text-xs text-slate-400 font-mono mt-1">Εμπειρίας Λογισμικού</div>
                            </div>
                            <div className="text-center p-3">
                                <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">&lt; 0.5 sec</div>
                                <div className="text-xs text-slate-400 font-mono mt-1">Απόκριση Voice AI</div>
                            </div>
                            <div className="text-center p-3">
                                <div className="text-2xl sm:text-3xl font-heading font-black text-blue-400">Custom APIs</div>
                                <div className="text-xs text-slate-400 font-mono mt-1">Αμφίδρομη Διασύνδεση</div>
                            </div>
                            <div className="text-center p-3">
                                <div className="text-2xl sm:text-3xl font-heading font-black text-purple-400">100% GDPR</div>
                                <div className="text-xs text-slate-400 font-mono mt-1">Human-in-the-Loop</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: WHAT MAKES AGENTIC AI DIFFERENT */}
                <section className="py-20 bg-[#0a0d14] relative">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest block mb-3">
                                Η Εξέλιξη της Τεχνητής Νοημοσύνης
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
                                Γιατί οι AI Agents δεν έχουν καμία σχέση με τα απλά Chatbots;
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Στην ελληνική αγορά, οι περισσότερες επιχειρήσεις απογοητεύτηκαν από «chatbots» που απλώς διάβαζαν ένα FAQ κείμενο. Οι <strong>Αυτόνομοι AI Agents</strong> της SGK Digital είναι <em>action-taking συστήματα</em>: έχουν επιχειρησιακό ρόλο, καλούν APIs, παίρνουν αποφάσεις και ολοκληρώνουν εργασίες χωρίς ανθρώπινη παρέμβαση.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                            {/* Card 1: Legacy Chatbots */}
                            <div className="p-8 rounded-2xl bg-red-950/10 border border-red-500/20 flex flex-col">
                                <div className="inline-flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-wider mb-4">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    <span>Παραδοσιακά Chatbots (Παλιά Τεχνολογία)</span>
                                </div>
                                <h3 className="text-xl font-heading font-bold text-white mb-4">
                                    Στατικές Απαντήσεις Κειμένου
                                </h3>
                                <ul className="space-y-3 text-sm text-slate-300 flex-1">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-0.5">✕</span>
                                        <span>Περιορίζονται σε προκαθορισμένα δέντρα αποφάσεων (scripted rules).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-0.5">✕</span>
                                        <span>Δεν μπορούν να μιλήσουν στο τηλέφωνο ούτε να εκτελέσουν ενέργειες σε άλλα προγράμματα.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-0.5">✕</span>
                                        <span>Καμία επικοινωνία με βάσεις δεδομένων, αποθήκες, τιμολόγια ή αρχεία.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-0.5">✕</span>
                                        <span>Απαιτούν συνεχή ανθρώπινη επέμβαση μόλις ο πελάτης κάνει μια σύνθετη ερώτηση.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 2: SGK Agentic AI */}
                            <div className="p-8 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                                <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-4">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>SGK Digital Custom AI Agents (Σύγχρονη Λύση)</span>
                                </div>
                                <h3 className="text-xl font-heading font-bold text-white mb-4">
                                    Αυτόνομοι Ψηφιακοί Συνεργάτες (Action-Taking)
                                </h3>
                                <ul className="space-y-3 text-sm text-slate-200 flex-1">
                                    <li className="flex items-start gap-2">
                                        <Check className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                                        <span><strong>Voice AI Τηλεφωνία:</strong> Απαντά σε 0.5s σε φυσικά ελληνικά, κλείνει ραντεβού και δρομολογεί κλήσεις.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                                        <span><strong>Αμφίδρομη Σύνδεση με Συστήματα:</strong> Εισάγει αιτήματα, ελέγχει καρτέλες και διαθεσιμότητες live.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                                        <span><strong>Αυτόματο Back-Office:</strong> Διαβάζει μαζικά PDFs, εξάγει ποσά τιμολογίων και απαντά σε emails αυτόνομα.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                                        <span><strong>Human-in-the-Loop:</strong> Πλήρης έλεγχος με ένα κλικ για όλες τις ευαίσθητες συναλλαγές.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE 4 CORE AI PILLARS */}
                <section className="py-24 bg-[#07090e] border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest block mb-3">
                                Ολοκληρωμενο Χαρτοφυλακιο
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
                                Οι 4 Πυλώνες AI Υλοποιήσεων της SGK Digital
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Δεν πουλάμε έτοιμα ξένα templates. Σχεδιάζουμε bespoke αρχιτεκτονικές που ενσωματώνονται απρόσκοπτα στις καθημερινές λειτουργίες της εταιρείας σας.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pillar 1: Voice AI */}
                            <div className="p-8 rounded-2xl bg-[#0c1018] border border-white/10 hover:border-blue-500/40 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Phone size={24} />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-white mb-3">
                                    1. Voice AI Τηλεφωνία & 24/7 Τηλεφωνικό Κέντρο
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    Φωνητικός πράκτορας συνδεδεμένος απευθείας στο VoIP / PBX τηλεφωνικό σας κέντρο. Απαντά σε άπταιστα ελληνικά χωρίς καθυστέρηση (ultra-low latency), διαχειρίζεται ερωτήσεις για τιμοκαταλόγους, κλείνει ραντεβού στο Google Calendar και ενημερώνει τον υπεύθυνο με σύνοψη κλήσης μέσω SMS ή WhatsApp.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Ελληνική Χροιά</span>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">0.5s Latency</span>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">VoIP / SIP Trunk</span>
                                </div>
                            </div>

                            {/* Pillar 2: Process & CRM Automations */}
                            <div className="p-8 rounded-2xl bg-[#0c1018] border border-white/10 hover:border-emerald-500/40 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Database size={24} />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-white mb-3">
                                    2. Αυτοματοποίηση Επιχειρησιακών Διαδικασιών & CRM
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    Αυτοματοποίηση εμπορικών διαδικασιών. Ο AI agent διαβάζει αιτήματα πελατών από οποιοδήποτε κανάλι, ελέγχει σε πραγματικό χρόνο τις τιμές και τις διαθεσιμότητες στα συστήματά σας, συντάσσει προσφορές και καταχωρεί απευθείας τα αιτήματα χωρίς καμία χειροκίνητη πληκτρολόγηση.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Custom REST APIs</span>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">CRM Sync</span>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Data Pipeline</span>
                                </div>
                            </div>

                            {/* Pillar 3: Back-Office PDF OCR */}
                            <div className="p-8 rounded-2xl bg-[#0c1018] border border-white/10 hover:border-purple-500/40 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-white mb-3">
                                    3. Αυτόματο Back-Office: Μαζικό PDF OCR & Email Triage
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    Αναλύστε χιλιάδες πολυσέλιδα έγγραφα, συμβόλαια, λογαριασμούς και τιμολόγια προμηθευτών. Ο agent εξάγει με ακρίβεια ΑΦΜ, ποσά, είδη και ημερομηνίες, ταξινομεί εισερχόμενα emails στο Outlook/Gmail και προετοιμάζει τις απαντήσεις για έγκριση σε δευτερόλεπτα.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">AI Vision OCR</span>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Email Parsing</span>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Αυτόματη Αρχειοθέτηση</span>
                                </div>
                            </div>

                            {/* Pillar 4: Live Video Avatars */}
                            <div className="p-8 rounded-2xl bg-[#0c1018] border border-white/10 hover:border-indigo-500/40 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Video size={24} />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-white mb-3">
                                    4. 24/7 Live Video AI Avatars (WebRTC Streaming)
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    Πρόσωπο με πρόσωπο εξυπηρέτηση πελατών μέσω ζωντανού video. Φωτορεαλιστικό ψηφιακό avatar με τέλειο συγχρονισμό χειλιών στα ελληνικά, ικανό να υποδέχεται επισκέπτες στο eshop ή την εφαρμογή σας, να πραγματοποιεί KYC ταυτοποίηση μέσω κάμερας και να καθοδηγεί διαδραστικά.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">WebRTC Video</span>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Greek Lip-Sync</span>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Live Demo Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: INDUSTRY USE CASES IN GREECE */}
                <section className="py-20 bg-[#0a0d14] border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest block mb-3">
                                Πραγματικες Εφαρμογες στην Ελλαδα
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
                                Πού Εφαρμόζονται οι AI Agents Σήμερα;
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Από μικρομεσαίες επιχειρήσεις μέχρι μεγάλους οργανισμούς και τεχνικές εταιρείες.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-xl bg-[#0c1018] border border-white/5">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                                    <Building2 size={20} />
                                </div>
                                <h3 className="text-lg font-heading font-bold text-white mb-2">
                                    Β2Β Εμπόριο & Βιομηχανία
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    Αυτοματοποιημένη επεξεργασία αιτημάτων προσφοράς, συγχρονισμός παραγγελιών με επιχειρησιακές βάσεις δεδομένων, παρακολούθηση καρτέλας πελάτη και αυτόματη ενημέρωση για παραδόσεις.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#0c1018] border border-white/5">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                                    <Workflow size={20} />
                                </div>
                                <h3 className="text-lg font-heading font-bold text-white mb-2">
                                    Rent-a-Car & Τουρισμός
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    24/7 φωνητική και chat διαχείριση κρατήσεων, ζωντανός έλεγχος διαθεσιμότητας στόλου, δυναμική τιμολόγηση ανά περίοδο και αυτόματη αποστολή συμβολαίων μέσω WhatsApp / SMS.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#0c1018] border border-white/5">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                                    <Zap size={20} />
                                </div>
                                <h3 className="text-lg font-heading font-bold text-white mb-2">
                                    Τεχνικές Εταιρείες & Τηλεπικοινωνίες
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    Αυτοματοποιημένες αυτοψίες οπτικών ινών (FTTH) σε 5 λεπτά, αυτόματο σκαρίφημα CAD, κατανομή τεχνικών συνεργείων και παραγωγή ολοκληρωμένων τεχνικών φακέλων.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: COMPARISON TABLE */}
                <section className="py-20 bg-[#07090e] border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <h2 className="text-2xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
                                Γιατί να επιλέξετε την SGK Digital ως AI Partner;
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base">
                                Σύγκριση της SGK Digital απέναντι σε απλά chatbots και έτοιμα no-code wrappers.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse rounded-xl overflow-hidden bg-[#0c1018] border border-white/10">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-300">
                                        <th className="p-4">Δυνατότητα / Χαρακτηριστικό</th>
                                        <th className="p-4 text-primary font-bold">SGK Digital AI Agents</th>
                                        <th className="p-4 text-slate-400">Παραδοσιακά Chatbots</th>
                                        <th className="p-4 text-slate-400">Έτοιμα No-Code Wrappers</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-300">
                                    <tr>
                                        <td className="p-4 font-semibold text-white">Τηλεφωνία Voice AI (24/7) σε Ελληνικά</td>
                                        <td className="p-4 text-emerald-400 font-bold">✓ &lt;0.5s Latency</td>
                                        <td className="p-4 text-red-400">✕ Όχι (μόνο text)</td>
                                        <td className="p-4 text-amber-400">~ Περιορισμένα & Αργά</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-white">Αμφίδρομη Σύνδεση με Εσωτερικά Συστήματα & APIs</td>
                                        <td className="p-4 text-emerald-400 font-bold">✓ Native Web Services / APIs</td>
                                        <td className="p-4 text-red-400">✕ Καμία σύνδεση</td>
                                        <td className="p-4 text-red-400">✕ Δύσκολο / Ασταθές</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-white">Μαζική Ανάλυση Εγγράφων PDF & OCR</td>
                                        <td className="p-4 text-emerald-400 font-bold">✓ Απεριόριστα PDFs</td>
                                        <td className="p-4 text-red-400">✕ Όχι</td>
                                        <td className="p-4 text-amber-400">~ Μεγάλο κόστος token</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-white">Human-in-the-Loop Έλεγχος & Ασφάλεια</td>
                                        <td className="p-4 text-emerald-400 font-bold">✓ Πλήρης Προστασία</td>
                                        <td className="p-4 text-slate-400">- Δεν απαιτείται</td>
                                        <td className="p-4 text-red-400">✕ Απρόβλεπτες αποκρίσεις</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-white">Ιδιοκτησία Κώδικα & Dedicated Hosting</td>
                                        <td className="p-4 text-emerald-400 font-bold">✓ 100% Δικό σας</td>
                                        <td className="p-4 text-red-400">✕ SaaS συνδρομή</td>
                                        <td className="p-4 text-red-400">✕ Vendor lock-in</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: FAQ ACCORDION */}
                <section className="py-20 bg-[#0a0d14] border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-14">
                            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest block mb-3">
                                Συχνες Ερωτησεις
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
                                Όλα όσα πρέπει να γνωρίζετε για τις εταιρείες AI Agents στην Ελλάδα
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 rounded-xl bg-[#0c1018] border border-white/5">
                                <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2 flex items-center gap-2">
                                    <HelpCircle size={18} className="text-blue-400 shrink-0" />
                                    Ποιες είναι οι κορυφαίες εταιρείες AI Agents στην Ελλάδα;
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed pl-6">
                                    Στην Ελλάδα δραστηριοποιούνται εξειδικευμένες εταιρείες τεχνολογίας, με την <strong>SGK Digital</strong> να κατέχει ηγετική θέση στην ανάπτυξη αυτόνομων custom AI Agents (Agentic AI) με άπταιστα ελληνικά, φωνητική τηλεφωνία 24/7 και απευθείας διασύνδεση με επιχειρησιακά εργαλεία & CRM. Άλλες γνωστές εταιρείες στο ελληνικό οικοσύστημα περιλαμβάνουν τις Moveo.ai, Argonstack, Aurelith, Helvia.ai και Satori Analytics.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#0c1018] border border-white/5">
                                <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2 flex items-center gap-2">
                                    <HelpCircle size={18} className="text-blue-400 shrink-0" />
                                    Πόσο κοστίζει η υλοποίηση ενός AI Agent για μια επιχείρηση;
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed pl-6">
                                    Το κόστος εξαρτάται από τις διασυνδέσεις που απαιτούνται. Βασικοί agents αυτοματισμού chat και emails ξεκινούν ενδεικτικά από 1.000€-2.500€. Σύνθετες υλοποιήσεις 24/7 Voice AI τηλεφωνίας ή πλήρους ενοποίησης με εσωτερικά συστήματα κυμαίνονται μεταξύ 2.500€ και 8.000€+. Στην SGK Digital παρέχουμε πάντα <strong>δωρεάν αρχική τεχνική αξιολόγηση</strong> ώστε να γνωρίζετε το ακριβές ROI πριν ξεκινήσετε.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#0c1018] border border-white/5">
                                <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2 flex items-center gap-2">
                                    <HelpCircle size={18} className="text-blue-400 shrink-0" />
                                    Πώς διασφαλίζεται ότι ο AI agent δεν θα κάνει λάθος;
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed pl-6">
                                    Εφαρμόζουμε την αρχιτεκτονική <strong>Human-in-the-Loop (HITL)</strong>. Ο agent εκτελεί αυτόνομα τις απλές καθημερινές εργασίες, αλλά για ενέργειες υψηλής αξίας (π.χ. έκδοση παραστατικού, αλλαγή τιμής, διαγραφή δεδομένων) ζητά έγκριση μέσω notification με ένα πάτημα κουμπιού από τον υπεύθυνο της επιχείρησης.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#0c1018] border border-white/5">
                                <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2 flex items-center gap-2">
                                    <HelpCircle size={18} className="text-blue-400 shrink-0" />
                                    Σε πόσο χρόνο μπορεί να παραδοθεί ένα σύστημα AI Agent;
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed pl-6">
                                    Ένας στοχευμένος Voice AI ή Document Parsing Agent παραδίδεται σε παραγωγική λειτουργία (production) συνήθως εντός <strong>2 έως 4 εβδομάδων</strong>, συμπεριλαμβανομένης της εκπαίδευσης με τα δεδομένα της επιχείρησής σας και των απαραίτητων δοκιμών ασφαλείας.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BOTTOM CALL TO ACTION */}
                <section className="py-20 bg-gradient-to-b from-[#0a0d14] to-[#07090e] border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#0c1018] to-purple-950/40 border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                            <h2 className="text-2xl sm:text-4xl font-heading font-black text-white mb-4">
                                Έτοιμοι να εντάξετε το πρώτο σας AI Agent στην επιχείρησή σας;
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                                Επικοινωνήστε σήμερα με την εξειδικευμένη ομάδα της SGK Digital για να σχεδιάσουμε την ιδανική λύση αυτόνομου AI πράκτορα προσαρμοσμένη στα δικά σας δεδομένα.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/order-ai-agent"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-bold text-base rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                                >
                                    <span>Έναρξη Project & Αξιολόγηση</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <a
                                    href="tel:2111140013"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading font-semibold text-base rounded-xl transition-all"
                                >
                                    <Phone size={18} className="text-emerald-400" />
                                    <span>211 114 0013</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
