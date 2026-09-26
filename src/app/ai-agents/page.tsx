import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
    ArrowRight, Bot, Workflow, MessageSquare, BarChart2, Layers, Cpu, 
    CheckCircle, Zap, ShieldCheck, Sparkles, Check, Database, Code2, 
    Phone, Video, Mic, Headphones, Users, TrendingUp, Clock, Settings2, 
    Globe, FileText, CheckCircle2, ChevronRight, Activity, Award
} from "lucide-react";

export const metadata: Metadata = {
    title: "Κατασκευή AI Agents & Custom AI για Επιχειρήσεις | Voice, Chat & Video AI | SGK Digital",
    description: "Η #1 AI Agency στην Ελλάδα. Κατασκευή custom AI agents & επιχειρηματικών αυτοματισμών που εκτελούν εργασίες αυτόνομα χωρίς υπαλλήλους. 24/7 εξυπηρέτηση πελατών με Voice AI (τηλέφωνο), Smart Chat & AI Video Avatars.",
    keywords: "κατασκευη ai agents, custom ai για επιχειρησεις, custom ai ελλαδα, ai agents χωρις υπαλληλους, αυτονομοι ai agents, voice ai agents ελλαδα, ai τηλεφωνικη εξυπηρετηση, ai chatbot ελλαδα, ai video avatars, εξυπηρετηση πελατων voice chat video, επιχειρηματικοι αυτοματισμοι ai, agentic ai greece, ai agency αθηνα, φωνητικοι πρακτορες ai, ai call center greece",
    alternates: {
        canonical: "https://sgk.gr/ai-agents",
    },
    openGraph: {
        title: "Κατασκευή AI Agents & Custom AI για Επιχειρήσεις | Voice, Chat, Video | SGK Digital",
        description: "Η κορυφαία AI Agency στην Ελλάδα. Ανάπτυξη Custom AI Agents & αυτοματισμών που εκτελούν εργασίες αυτόνομα χωρίς υπαλλήλους. Εξυπηρέτηση με Voice AI, Smart Chat & Video.",
        url: "https://sgk.gr/ai-agents",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Κατασκευή AI Agents & Custom AI για Επιχειρήσεις | SGK Digital",
        description: "Custom AI agents & αυτοματισμοί για ελληνικές επιχειρήσεις. Αυτόνομη εκτέλεση εργασιών, Voice AI τηλεφωνία, Smart Chat & Video Avatars.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

const agencySchema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "name": "SGK Digital - AI Agency & Custom AI Agents Greece",
    "url": "https://sgk.gr/ai-agents",
    "logo": "https://sgk.gr/logo.png",
    "image": "https://sgk.gr/social-preview.png",
    "telephone": "+302111140013",
    "email": "info@sgk.gr",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ermou 1 & Lykovryseos 14",
        "addressLocality": "Metamorfosi",
        "addressRegion": "Attica",
        "postalCode": "14452",
        "addressCountry": "GR"
    },
    "areaServed": "GR",
    "priceRange": "€€€",
    "serviceType": [
        "Κατασκευή Custom AI Agents",
        "Voice AI Telephony & Phone Call Agents",
        "Omnichannel Chat AI Agents",
        "AI Video Avatars & Customer Support",
        "Αυτόνομοι Πράκτορες Χωρίς Υπαλλήλους",
        "Custom Business Automations (n8n & LangGraph)",
        "ERP & CRM AI Integrations (Softone, Entersoft)"
    ],
    "description": "Ηγετική AI Agency στην Ελλάδα για σχεδιασμό και υλοποίηση αυτόνομων AI agents, φωνητικών πρακτόρων τηλεφωνίας (Voice AI), video avatars και επιχειρηματικών αυτοματισμών που αντικαθιστούν χειροκίνητες εργασίες."
};

const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Custom AI Agents Development & Business Automation",
    "provider": {
        "@type": "Organization",
        "name": "SGK Software Development"
    },
    "areaServed": {
        "@type": "Country",
        "name": "Greece"
    },
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI Agent Solutions & Automation",
        "itemListElement": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Smart Chat AI Agent (Web & Social)",
                    "description": "Αυτόνομος chat agent για WhatsApp, Instagram, Messenger & Website με διασύνδεση ERP και tracking courier."
                },
                "price": "1000",
                "priceCurrency": "EUR"
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Voice AI Telephony Agent (Τηλεφωνικό Κέντρο)",
                    "description": "Φωνητικός AI πράκτορας για τηλεφωνικά κέντρα PBX/VoIP με άπταιστα φυσικά Ελληνικά, διαχείριση εισερχόμενων/εξερχόμενων κλήσεων και κλείσιμο ραντεβού."
                },
                "price": "2500",
                "priceCurrency": "EUR"
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Autonomous Workforce & Video AI System",
                    "description": "Ολοκληρωμένο Multi-Agent οικοσύστημα με Video Avatars, αυτόνομη εκτέλεση εργασιών γραφείου χωρίς υπαλλήλους και πλήρη διασύνδεση ERP/CRM."
                },
                "price": "8000",
                "priceCurrency": "EUR"
            }
        ]
    }
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Πώς μπορούν οι AI agents να εκτελούν εργασίες μόνοι τους χωρίς υπαλλήλους;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Οι Αυτόνομοι AI Agents (Agentic AI) της SGK Digital δεν περιορίζονται στο να δίνουν απαντήσεις κειμένου. Διαθέτουν λειτουργία Tool Calling και Reasoning: μπορούν να συνδεθούν με τα λογισμικά της επιχείρησής σας (ERP Softone/Entersoft, CRM, databases, emails, courier APIs) και να εκτελέσουν αυτόνομα πολύπλοκα workflows — όπως ανάγνωση τιμολογίων PDF, καταχώρηση παραγγελιών, ενημέρωση αποθεμάτων, έκδοση voucher αποστολής και follow-up πωλήσεων 24 ώρες το 24ωρο χωρίς ανάγκη ανθρώπινης παρέμβασης."
            }
        },
        {
            "@type": "Question",
            "name": "Πώς λειτουργεί η εξυπηρέτηση πελατών με Voice AI (φωνή), Chat και Video;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Προσφέρουμε μια πλήρη τριπλή προσέγγιση (Tri-Modal Customer Experience): 1) Voice AI Agent: Συνδέεται απευθείας με το τηλεφωνικό κέντρο (PBX/VoIP) της εταιρείας σας, απαντά σε τηλεφωνικές κλήσεις σε 0.5s με απόλυτα φυσική ελληνική φωνή, κλείνει ραντεβού και επιλύει απορίες. 2) Smart Chat Agent: Ενοποιεί WhatsApp, Instagram DM, Facebook Messenger και Web Chat σε έναν ενιαίο εγκέφαλο με πρόσβαση στα δεδομένα των πελατών σας. 3) Interactive Video AI: Φωτορεαλιστικά AI avatars που υποδέχονται τους επισκέπτες στο site, παρουσιάζουν προϊόντα και κάνουν διαδραστικό video onboarding."
            }
        },
        {
            "@type": "Question",
            "name": "Γιατί να επιλέξω την SGK Digital ως AI Agency στην Ελλάδα;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Η SGK Digital είναι η πρώτη εξειδικευμένη AI Agency στην Ελλάδα που αναπτύσσει proprietary Custom AI pipelines και Voice Agents ειδικά βελτιστοποιημένους για την ελληνική γλώσσα (Greek NLP). Δεν πουλάμε έτοιμα wrappers τρίτων. Χτίζουμε custom αρχιτεκτονικές με LangGraph, n8n, OpenAI Realtime, ElevenLabs, Claude 3.5 Sonnet και διασύνδεση με ελληνικά ERP (Softone, Entersoft), τράπεζες και ελληνικές εταιρείες ταχυμεταφορών."
            }
        },
        {
            "@type": "Question",
            "name": "Πόσο κοστίζει η κατασκευή Custom AI Agent και ποιο είναι το κέρδος (ROI);",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Το κόστος ξεκινά από 1.000€ για Chat AI Agents, 2.500€ για Voice AI Τηλεφωνικούς Πράκτορες και από 8.000€ για πλήρη συστήματα Autonomous Multi-Agent & Video. Το Return on Investment (ROI) είναι άμεσο (εντός 2-4 μηνών), καθώς ένας και μόνο AI agent αντικαθιστά ή εξοικονομεί το κόστος 2 έως 4 θέσεων εργασίας σε τηλεφωνική υποστήριξη, back-office καταχώρηση και lead generation."
            }
        },
        {
            "@type": "Question",
            "name": "Είναι ασφαλή τα εταιρικά δεδομένα της επιχείρησής μου (GDPR);",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Απολύτως. Όλες οι λύσεις της SGK Digital συμμορφώνονται 100% με τον ευρωπαϊκό κανονισμό GDPR. Τα εταιρικά σας δεδομένα κρυπτογραφούνται σε ευρωπαϊκούς servers, δεν χρησιμοποιούνται ποτέ για εκπαίδευση δημόσιων μοντέλων, ενώ παρέχεται και δυνατότητα εγκατάστασης On-Premise / Private Cloud με open-source μοντέλα (Llama 3, DeepSeek)."
            }
        },
        {
            "@type": "Question",
            "name": "Μπορεί ο Voice AI Agent να καλεί και εξερχόμενες κλήσεις (Outbound Calls);",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι! Ο Voice AI πράκτορας μπορεί να πραγματοποιεί μαζικές εξερχόμενες τηλεφωνικές κλήσεις για επιβεβαίωση παραγγελιών, υπενθύμιση ραντεβού (π.χ. σε ιατρεία, συνεργεία, ινστιτούτα), ενημέρωση για προσφορές και follow-up ανεκτέλεστων καλαθιών, μιλώντας όπως ένας άριστα εκπαιδευμένος υπάλληλος."
            }
        }
    ]
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://sgk.gr" },
        { "@type": "ListItem", "position": 2, "name": "Κατασκευή AI Agents & Custom AI", "item": "https://sgk.gr/ai-agents" }
    ]
};

const modalities = [
    {
        icon: <Phone className="w-9 h-9 text-[#3b5bdb]" />,
        badge: "Voice AI • Τηλεφωνία",
        title: "Voice AI Agents (Τηλεφωνικό Κέντρο)",
        desc: "Φωνητικοί πράκτορες που απαντούν αυτόνομα στο τηλέφωνο σε 0.5s με φυσική ελληνική ομιλία. Διαχειρίζονται εισερχόμενες & εξερχόμενες κλήσεις, κλείνουν ραντεβού και συνδέονται απευθείας με το PBX/VoIP σας.",
        features: [
            "Απόλυτα φυσική ελληνική φωνή (human prosody)",
            "Σύνδεση με Asterisk, 3CX, VoIP & Cloud PBX",
            "Inbound υποστήριξη & Outbound follow-up κλήσεις",
            "Αυτόματη ταυτοποίηση πελάτη & άντληση στοιχείων"
        ],
        highlight: "Μηδέν χαμένες κλήσεις πελατών",
        color: "border-blue-500/30 bg-blue-50/40"
    },
    {
        icon: <MessageSquare className="w-9 h-9 text-emerald-600" />,
        badge: "Smart Chat • Omnichannel",
        title: "Smart Chat AI Agents (Web, WhatsApp, Social)",
        desc: "Ένας ενιαίος AI εγκέφαλος που εξυπηρετεί πελάτες ταυτόχρονα σε Live Web Chat, WhatsApp Business, Instagram DM και Facebook Messenger με άμεση επίλυση και εκτέλεση ενεργειών.",
        features: [
            "Σύνδεση με Softone, Entersoft & ERPs",
            "Courier API tracking (ACS, BoxNow, Speedex)",
            "Αυτόματη έκδοση voucher και τροποποίηση παραγγελίας",
            "Πλήρες εταιρικό RAG χωρίς ανακρίβειες"
        ],
        highlight: "Έως -75% φόρτος γραφείου υποστήριξης",
        color: "border-emerald-500/30 bg-emerald-50/40"
    },
    {
        icon: <Video className="w-9 h-9 text-purple-600" />,
        badge: "Video AI • Avatars",
        title: "Interactive Video AI Agents (Avatars)",
        desc: "Φωτορεαλιστικά AI avatars που υποδέχονται επισκέπτες στην ιστοσελίδα σας με ζωντανό video. Παρουσιάζουν προϊόντα, καθοδηγούν visual on-boarding και απαντούν σε ερωτήσεις πρόσωπο με πρόσωπο.",
        features: [
            "Φωτορεαλιστικά ψηφιακά avatars υψηλής πιστότητας",
            "Διαδραστική παρουσίαση προϊόντων & demos",
            "Visual Step-by-step Onboarding πελατών",
            "Αύξηση εμπιστοσύνης & Conversion Rate στο site"
        ],
        highlight: "+45% Αύξηση Engagement επισκεπτών",
        color: "border-purple-500/30 bg-purple-50/40"
    }
];

const autonomousTasks = [
    {
        icon: <Database className="w-6 h-6 text-[#3b5bdb]" />,
        title: "Αυτόματο Back-Office & Καταχώρηση ERP",
        desc: "Ο AI agent διαβάζει τιμολόγια PDF από emails (OCR), ελέγχει γραμμές παραγγελίας και τα καταχωρεί απευθείας στο Softone/Entersoft χωρίς ανθρώπινο χέρι."
    },
    {
        icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
        title: "Αυτόνομο Sales & Lead Qualification",
        desc: "Συλλέγει επισκέπτες από web & social, κάνει screening αναγκών με βάση προκαθορισμένα κριτήρια και κλείνει αυτόματα ραντεβού στο calendar των πωλήσεών σας."
    },
    {
        icon: <Activity className="w-6 h-6 text-amber-600" />,
        title: "E-Commerce Operations & Inventory AI",
        desc: "Παρακολουθεί τιμές ανταγωνισμού στο Skroutz, συγχρονίζει αποθέματα, εντοπίζει ελλείψεις και συντάσσει αυτόματες παραγγελίες προς προμηθευτές."
    },
    {
        icon: <Users className="w-6 h-6 text-indigo-600" />,
        title: "HR Screening & Συνεντεύξεις Υποψηφίων",
        desc: "Αξιολογεί εκατοντάδες βιογραφικά σε δευτερόλεπτα, βαθμολογεί σύμφωνα με το job post και διεξάγει την πρώτη interactive συνέντευξη μέσω chat ή video."
    }
];

export default function AIAgentsPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agencySchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="min-h-screen bg-white flex flex-col font-sans text-black">
                <Navbar />

                <main className="flex-grow pt-24 bg-[#f4f2ea] pb-24">
                    {/* Breadcrumbs */}
                    <div className="container mx-auto px-6 pt-4 pb-2">
                        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
                            <ol className="flex items-center gap-2">
                                <li><Link href="/" className="hover:text-black transition-colors">Αρχική</Link></li>
                                <li className="text-gray-400">/</li>
                                <li className="text-black font-medium">Κατασκευή AI Agents & Custom AI</li>
                            </ol>
                        </nav>
                    </div>

                    {/* HERO SECTION */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-300 text-[#2546b8] font-bold text-xs tracking-wider uppercase mb-6 shadow-sm">
                                <Sparkles className="w-4 h-4 text-[#3b5bdb]" />
                                #1 AI Agency στην Ελλάδα • Custom AI Agents & Αυτοματισμοί
                            </div>
                            
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.1] text-black mb-6">
                                Κατασκευή AI Agents & Custom AI <br />
                                <span className="font-normal text-[#3b5bdb]">Που Εργάζονται Χωρίς Υπαλλήλους</span>
                            </h1>

                            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed mb-6 max-w-3xl font-light">
                                Στην <strong>SGK Digital</strong> κατασκευάζουμε αυτόνομους <strong>AI Agents</strong> και custom συστήματα τεχνητής νοημοσύνης που εκτελούν εργασίες <strong>μόνοι τους</strong> — χωρίς ανθρώπινα λάθη, 24 ώρες το 24ωρο, 365 ημέρες τον χρόνο.
                            </p>

                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-10 max-w-3xl">
                                Πλήρης εξυπηρέτηση πελατών επόμενης γενιάς με <strong>Voice AI</strong> (τηλεφωνικές κλήσεις σε φυσικά ελληνικά), <strong>Smart Chat</strong> (WhatsApp & Web) και <strong>Video AI Avatars</strong>, με άμεση διασύνδεση στο ERP και τα εργαλεία σας.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link 
                                    href="/estimate" 
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-xl shadow-blue-500/20 hover:scale-105"
                                >
                                    Ζητήστε Custom AI Demo <ArrowRight className="w-5 h-5" />
                                </Link>
                                <a 
                                    href="tel:2111140013" 
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-all duration-300 text-lg shadow-sm"
                                >
                                    <Phone className="w-5 h-5 text-[#3b5bdb]" /> 211 114 0013
                                </a>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-gray-600 font-medium">
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Φυσική Ελληνική Γλώσσα</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Διασύνδεση Softone / Entersoft / ERP</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% GDPR & Private Data</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 24/7/365 Αδιάλειπτη Λειτουργία</span>
                            </div>
                        </div>
                    </section>

                    {/* STATS HIGHLIGHT */}
                    <section className="border-y border-gray-250 py-10 bg-white/80">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <p className="text-4xl sm:text-5xl font-black text-[#3b5bdb] mb-1">0.3s</p>
                                    <p className="text-xs sm:text-sm text-gray-700 font-bold">Ταχύτητα Απόκρισης Voice & Chat</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl sm:text-5xl font-black text-[#3b5bdb] mb-1">-70%</p>
                                    <p className="text-xs sm:text-sm text-gray-700 font-bold">Μείωση Κόστους Λειτουργίας</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl sm:text-5xl font-black text-[#3b5bdb] mb-1">24/7</p>
                                    <p className="text-xs sm:text-sm text-gray-700 font-bold">Εξυπηρέτηση Χωρίς Υπαλλήλους</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl sm:text-5xl font-black text-[#3b5bdb] mb-1">100%</p>
                                    <p className="text-xs sm:text-sm text-gray-700 font-bold">Αυτοματοποιημένες Διαδικασίες</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* THE 3 MODALITIES OF NEXT-GEN CUSTOMER SERVICE (VOICE, CHAT, VIDEO) */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-xs font-black uppercase tracking-widest text-[#3b5bdb] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                Τριπλη Υπεροχη AI Εξυπηρετησης
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-light text-black mt-3 mb-4">
                                Εξυπηρέτηση Πελατών με <br />
                                <span className="font-normal text-[#3b5bdb]">Voice (Φωνή), Chat & Video AI</span>
                            </h2>
                            <p className="text-gray-600 font-light text-base sm:text-lg">
                                Οι πελάτες σας επιλέγουν πώς θέλουν να επικοινωνήσουν. Οι AI Agents της SGK Digital απαντούν παντού με ενιαία νοημοσύνη, ταχύτητα φωτός και μηδενική αναμονή.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {modalities.map((m, i) => (
                                <div 
                                    key={i} 
                                    className={`p-8 sm:p-10 rounded-2xl border ${m.color} bg-white shadow-lg shadow-slate-200/50 flex flex-col relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">{m.icon}</div>
                                        <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-white">
                                            {m.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-black mb-3">{m.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6">{m.desc}</p>
                                    
                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#3b5bdb] shrink-0" />
                                        <span>{m.highlight}</span>
                                    </div>

                                    <ul className="space-y-2.5 mb-8 flex-1 border-t border-gray-100 pt-4">
                                        {m.features.map((feat, fIdx) => (
                                            <li key={fIdx} className="text-xs text-gray-700 flex items-start gap-2">
                                                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link 
                                        href="/estimate" 
                                        className="w-full py-3.5 bg-slate-900 hover:bg-[#3b5bdb] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2"
                                    >
                                        <span>Δοκιμαστε το σε Demo</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* AUTONOMOUS AGENTS WITHOUT EMPLOYEES (AUTONOMOUS DIGITAL WORKFORCE) */}
                    <section className="bg-slate-950 text-white py-24 border-y border-slate-800">
                        <div className="container mx-auto px-6 max-w-6xl">
                            <div className="grid lg:grid-cols-12 gap-12 items-center">
                                <div className="lg:col-span-6 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                                        <Bot className="w-3.5 h-3.5" />
                                        Autonomous Digital Workforce
                                    </div>
                                    
                                    <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight italic">
                                        Agents που κανουν εργασιες μονοι τους <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b5bdb] via-cyan-400 to-emerald-400">
                                            Χωρις Υπαλληλους
                                        </span>
                                    </h2>

                                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                                        Γιατί να επιβαρύνετε την επιχείρησή σας με επαναλαμβανόμενες χειροκίνητες εργασίες, καθυστερήσεις και λάθη καταχώρησης; 
                                    </p>

                                    <p className="text-slate-300 text-base leading-relaxed font-light">
                                        Οι Custom AI Agents της <strong>SGK Digital</strong> λειτουργούν ως αυτόνομοι ψηφιακοί υπάλληλοι: διαβάζουν emails, αντλούν έγγραφα, συνομιλούν με πελάτες, ενημερώνουν το ERP σας, εκδίδουν vouchers και ολοκληρώνουν εργασίες <strong>σε δευτερόλεπτα αντί για ημέρες</strong>.
                                    </p>

                                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                        <Link 
                                            href="/estimate" 
                                            className="px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold rounded-xl transition-all text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                        >
                                            <span>Σχεδιασμος Custom AI για την Εταιρεια σας</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
                                    {autonomousTasks.map((t, i) => (
                                        <div key={i} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                                            <div>
                                                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center mb-4">
                                                    {t.icon}
                                                </div>
                                                <h3 className="text-base font-bold text-white mb-2">{t.title}</h3>
                                                <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Αυτόνομη Εκτέλεση
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* COMPARISON TABLE: TRADITIONAL EMPLOYEE VS SGK AI AGENT */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <span className="text-xs font-black uppercase tracking-widest text-[#3b5bdb] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                    Μετρησιμο Αποτελεσμα & ROI
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-light text-black mt-3 mb-3">
                                    Παραδοσιακός Υπάλληλος vs Αυτόνομος AI Agent (SGK)
                                </h2>
                                <p className="text-gray-600 font-light text-sm sm:text-base">
                                    Δείτε γιατί οι πιο κερδοφόρες επιχειρήσεις αυτοματοποιούν τα operations τους με Custom AI:
                                </p>
                            </div>

                            <div className="bg-white border border-gray-250 rounded-2xl shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50/80">
                                                <th className="py-4 px-5 font-bold text-gray-700">Παράμετρος</th>
                                                <th className="py-4 px-5 font-bold text-gray-500">Παραδοσιακός Υπάλληλος</th>
                                                <th className="py-4 px-5 font-bold text-[#3b5bdb] bg-blue-50/50">Custom AI Agent SGK Digital</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="py-3.5 px-5 font-medium text-black">Ωράριο & Διαθεσιμότητα</td>
                                                <td className="py-3.5 px-5 text-gray-500">8 ώρες / ημέρα (Άδειες, ασθένειες)</td>
                                                <td className="py-3.5 px-5 text-emerald-700 font-bold bg-blue-50/30">24/7/365 Αδιάλειπτα Χωρίς Διακοπή</td>
                                            </tr>
                                            <tr className="bg-gray-50/40">
                                                <td className="py-3.5 px-5 font-medium text-black">Χρόνος Απόκρισης σε Πελάτες</td>
                                                <td className="py-3.5 px-5 text-gray-500">5 έως 45 λεπτά αναμονή</td>
                                                <td className="py-3.5 px-5 text-emerald-700 font-bold bg-blue-50/30">&lt; 0.5 δευτερόλεπτο (Ακαριαία)</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3.5 px-5 font-medium text-black">Ταυτόχρονες Συνομιλίες / Κλήσεις</td>
                                                <td className="py-3.5 px-5 text-gray-500">1 κλήση ή chat τη φορά</td>
                                                <td className="py-3.5 px-5 text-emerald-700 font-bold bg-blue-50/30">Απεριόριστες ταυτόχρονες κλήσεις & chats</td>
                                            </tr>
                                            <tr className="bg-gray-50/40">
                                                <td className="py-3.5 px-5 font-medium text-black">Σφάλματα Καταχώρησης (Data Entry)</td>
                                                <td className="py-3.5 px-5 text-gray-500">Ανθρώπινα λάθη, κόπωση</td>
                                                <td className="py-3.5 px-5 text-emerald-700 font-bold bg-blue-50/30">0% Σφάλματα (Απευθείας API validation)</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3.5 px-5 font-medium text-black">Κόστος / Μήνα</td>
                                                <td className="py-3.5 px-5 text-gray-500">Μισθός + Ασφαλιστικές Εισφορές</td>
                                                <td className="py-3.5 px-5 text-emerald-700 font-bold bg-blue-50/30">Εφάπαξ επένδυση & ελάχιστο κόστος API</td>
                                            </tr>
                                            <tr className="bg-gray-50/40">
                                                <td className="py-3.5 px-5 font-medium text-black">Εκπαίδευση σε Νέα Δεδομένα</td>
                                                <td className="py-3.5 px-5 text-gray-500">Εβδομάδες σεμιναρίων</td>
                                                <td className="py-3.5 px-5 text-emerald-700 font-bold bg-blue-50/30">Άμεση ενημέρωση RAG σε 5 λεπτά</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ERP, CRM & TELEPHONY INTEGRATIONS */}
                    <section className="container mx-auto px-6 py-16 bg-white/70 border-y border-gray-250">
                        <div className="max-w-5xl mx-auto text-center space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-[#3b5bdb]">
                                Απροσκοπτη Διασυνδεση με τα Συστηματα σας
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-light text-black">
                                Σύνδεση με Ελληνικά ERP, CRM, Τηλεφωνία & Courier APIs
                            </h2>
                            <p className="text-gray-600 font-light max-w-3xl mx-auto text-sm sm:text-base">
                                Οι AI agents δεν λειτουργούν απομονωμένοι. Συνδέονται απευθείας με τις υπάρχουσες υποδομές της επιχείρησής σας:
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-6">
                                {[
                                    { name: "Softone ERP", type: "ERP & Billing" },
                                    { name: "Entersoft", type: "Enterprise ERP" },
                                    { name: "WooCommerce", type: "E-Commerce" },
                                    { name: "Shopify", type: "E-Commerce" },
                                    { name: "Asterisk / 3CX", type: "PBX Telephony" },
                                    { name: "Twilio / SIP", type: "Voice Infrastructure" },
                                    { name: "WhatsApp API", type: "Messaging" },
                                    { name: "ACS Courier", type: "Voucher Tracking" },
                                    { name: "BoxNow API", type: "Locker Tracking" },
                                    { name: "Speedex", type: "Courier API" },
                                    { name: "HubSpot / Zoho", type: "CRM Systems" },
                                    { name: "LangGraph / n8n", type: "Automation Core" }
                                ].map((sys, idx) => (
                                    <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm text-center">
                                        <div className="font-bold text-xs text-black">{sys.name}</div>
                                        <div className="text-[10px] text-gray-500">{sys.type}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CASE STUDIES */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">
                                Πραγματικά AI Projects της SGK Digital
                            </h2>
                            <p className="text-gray-500 text-center mb-12 font-light">
                                Case studies εφαρμογών τεχνητής νοημοσύνης σε πραγματικές επιχειρήσεις
                            </p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Link href="/case-study/sigmalabs-ai" className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb] transition-all shadow-sm group">
                                    <span className="text-xs font-bold text-[#3b5bdb] uppercase tracking-wider">eCommerce AI Operations</span>
                                    <h3 className="text-2xl font-bold text-black mt-2 mb-3 group-hover:text-[#3b5bdb] transition-colors">Sigmalabs AI</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        Αυτόνομος AI πράκτορας που διαχειρίζεται παραγγελίες Skroutz & WooCommerce, αναλύει πωλήσεις και εντοπίζει anomalies. Εξοικονόμηση 15+ ωρών/εβδομάδα.
                                    </p>
                                    <span className="text-sm font-semibold text-[#3b5bdb] inline-flex items-center gap-1">Διαβάστε το Case Study →</span>
                                </Link>
                                <Link href="/case-study/rekrua" className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb] transition-all shadow-sm group">
                                    <span className="text-xs font-bold text-[#3b5bdb] uppercase tracking-wider">HR & Candidate Screening</span>
                                    <h3 className="text-2xl font-bold text-black mt-2 mb-3 group-hover:text-[#3b5bdb] transition-colors">Rekrua AI</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        Έξυπνο recruitment platform με αυτόματη βαθμολόγηση βιογραφικών και initial screening interviews. Μείωση χρόνου πρόσληψης κατά 60%.
                                    </p>
                                    <span className="text-sm font-semibold text-[#3b5bdb] inline-flex items-center gap-1">Διαβάστε το Case Study →</span>
                                </Link>
                                <Link href="/case-study/km-fiber" className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb] transition-all shadow-sm group">
                                    <span className="text-xs font-bold text-[#3b5bdb] uppercase tracking-wider">Computer Vision & Field AI</span>
                                    <h3 className="text-2xl font-bold text-black mt-2 mb-3 group-hover:text-[#3b5bdb] transition-colors">KM-FIBER (Cosmote Partner)</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        Πλατφόρμα διαχείρισης οπτικών ινών με AI αναγνώριση φωτογραφιών εγκαταστάσεων και αυτοματοποιημένο ποιοτικό έλεγχο.
                                    </p>
                                    <span className="text-sm font-semibold text-[#3b5bdb] inline-flex items-center gap-1">Διαβάστε το Case Study →</span>
                                </Link>
                                <Link href="/case-study/evolis-ai" className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb] transition-all shadow-sm group">
                                    <span className="text-xs font-bold text-[#3b5bdb] uppercase tracking-wider">Enterprise Intelligence</span>
                                    <h3 className="text-2xl font-bold text-black mt-2 mb-3 group-hover:text-[#3b5bdb] transition-colors">Evolis AI</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        Εξειδικευμένο RAG σύστημα για corporate knowledge base, instant multi-document synthesis και αυτοματοποιημένη σύνταξη προτάσεων.
                                    </p>
                                    <span className="text-sm font-semibold text-[#3b5bdb] inline-flex items-center gap-1">Διαβάστε το Case Study →</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* PRICING & TIERS */}
                    <section className="container mx-auto px-6 py-20 bg-white/40 border-t border-gray-250">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Πακέτα Custom AI Agents & Αυτοματισμών</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Επιλέξτε τη λύση που ανταποκρίνεται στο μέγεθος της επιχείρησής σας</p>
                            
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { 
                                        name: "Smart Chat AI Agent", 
                                        price: "από 1.000€", 
                                        features: [
                                            "1 Omnichannel AI Chat Agent", 
                                            "Εκπαίδευση σε εταιρικά αρχεία (RAG)", 
                                            "Ενσωμάτωση σε Web Widget & WhatsApp", 
                                            "Αποστολή email ειδοποιήσεων", 
                                            "3 μήνες τεχνική υποστήριξη"
                                        ], 
                                        highlight: false 
                                    },
                                    { 
                                        name: "Voice AI & Telephony", 
                                        price: "από 2.500€", 
                                        features: [
                                            "Πλήρης Voice AI Agent (Φωνητικό Κέντρο)", 
                                            "Σύνδεση με PBX / VoIP / Τηλεφωνία", 
                                            "Διασύνδεση με CRM / ERP / E-shop", 
                                            "Inbound & Outbound Calling", 
                                            "Courier API tracking (ACS, BoxNow)", 
                                            "Analytics Dashboard & Voice Recording", 
                                            "6 μήνες υποστήριξη & prompt tuning"
                                        ], 
                                        highlight: true 
                                    },
                                    { 
                                        name: "Autonomous Workforce & Video", 
                                        price: "από 8.000€", 
                                        features: [
                                            "Multi-Agent Architecture (LangGraph)", 
                                            "Interactive Video AI Avatars", 
                                            "Αυτόνομη εκτέλεση χωρίς υπαλλήλους", 
                                            "Πλήρεις Custom Αυτοματισμοί n8n & ERP", 
                                            "Δυνατότητα On-Premise / Private Cloud", 
                                            "Αυστηρό SLA & 12 μήνες υποστήριξη"
                                        ], 
                                        highlight: false 
                                    },
                                ].map((pkg) => (
                                    <div key={pkg.name} className={`p-8 rounded-2xl border ${pkg.highlight ? 'border-[#3b5bdb] bg-[#3b5bdb] text-white shadow-xl shadow-blue-200 scale-105' : 'border-gray-250 bg-white text-black shadow-sm'} flex flex-col`}>
                                        {pkg.highlight && <span className="text-[10px] font-bold uppercase tracking-wider text-white mb-2 self-start bg-blue-700 px-2.5 py-0.5 rounded-full">Κορυφαια Επιλογη</span>}
                                        <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                        <p className={`text-3xl font-black mb-8 ${pkg.highlight ? 'text-white' : 'text-[#3b5bdb]'}`}>{pkg.price}</p>
                                        <ul className="space-y-3 mb-8 flex-1">
                                            {pkg.features.map((f) => (
                                                <li key={f} className={`flex items-start gap-3 text-xs sm:text-sm ${pkg.highlight ? 'text-white/95' : 'text-gray-600'}`}>
                                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${pkg.highlight ? 'text-[#4ade80]' : 'text-[#3b5bdb]'}`} />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/estimate" className={`w-full text-center py-3.5 px-6 font-bold rounded-xl transition-all duration-300 text-sm ${pkg.highlight ? 'bg-[#4ade80] text-black hover:bg-[#22c55e] shadow-md' : 'bg-slate-900 hover:bg-[#3b5bdb] text-white shadow-sm'}`}>
                                            Ζητήστε Custom Προσφορά
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="bg-white border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Συχνές Ερωτήσεις (FAQ) — Κατασκευή AI Agents</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Όλα όσα πρέπει να γνωρίζετε για τους φωνητικούς, chat και αυτόνομους AI agents</p>
                            
                            <div className="space-y-6">
                                {faqSchema.mainEntity.map((faq, idx) => (
                                    <div key={idx} className="p-8 rounded-2xl border border-gray-250 bg-[#faf9f5] shadow-sm">
                                        <h3 className="text-lg font-bold text-black mb-3">{faq.name}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* INTERNAL LINKS & GUIDES */}
                    <section className="container mx-auto px-6 py-16">
                        <h2 className="text-xl font-light text-gray-800 mb-8 text-center">Σχετικές Υπηρεσίες & AI Guides</h2>
                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <Link href="/blog/ti-einai-ai-agents-epicheiriseis" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb] transition-all shadow-sm group">
                                <h3 className="font-bold text-base text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">AI Agent: Τι είναι; →</h3>
                                <p className="text-xs text-gray-500">Πλήρης οδηγός λειτουργίας και παραδείγματα για επιχειρήσεις.</p>
                            </Link>
                            <Link href="/kataskevi-eshop" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb] transition-all shadow-sm group">
                                <h3 className="font-bold text-base text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">AI & E-Shop Development →</h3>
                                <p className="text-xs text-gray-500">Κατασκευή σύγχρονων e-shops με ενσωματωμένους AI αυτοματισμούς.</p>
                            </Link>
                            <Link href="/web-development" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb] transition-all shadow-sm group">
                                <h3 className="font-bold text-base text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Custom Web Development →</h3>
                                <p className="text-xs text-gray-500">Ανάπτυξη web portals και SaaS πλατφορμών σε Next.js & React.</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6">
                        <div className="rounded-3xl bg-[#3b5bdb] p-12 md:p-20 text-center text-white shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                            
                            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight relative z-10">
                                Έτοιμοι να Αναπτύξετε τον Δικό σας AI Agent;
                            </h2>
                            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed relative z-10">
                                Κλείστε μια δωρεάν συνάντηση 30 λεπτών με τους AI Engineers της SGK Digital. Θα αναλύσουμε τις διαδικασίες σας και θα σχεδιάσουμε ζωντανά το Voice, Chat ή Autonomous AI pipeline της επιχείρησής σας.
                            </p>
                            <Link href="/estimate" className="inline-flex items-center gap-3 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-black text-lg rounded-xl transition-all duration-300 shadow-xl hover:scale-105 relative z-10">
                                Κλείστε Δωρεάν AI Demo <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
