import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Bot, Workflow, MessageSquare, BarChart2, Layers, Cpu, CheckCircle, Zap, ShieldCheck, Sparkles, Check, Database, Code2 } from "lucide-react";

export const metadata: Metadata = {
    title: "AI Agency Ελλάδα | AI Agents για Επιχειρήσεις & Custom Αυτοματισμοί | SGK Digital",
    description: "Η κορυφαία AI Agency στην Ελλάδα. Ανάπτυξη Custom AI Agents (πράκτορες τεχνητής νοημοσύνης) & επιχειρηματικοί αυτοματισμοί. Customer service 24/7, ERP integration, GPT-4o, Claude & Gemini.",
    keywords: "ai agency, ai agency ελλαδα, ai agents ελλαδα, ai agent τι ειναι, custom αυτοματισμοι ελλαδα, ε αγεντσ, e agents, agents, τεχνητη νοημοσυνη επιχειρησεις, agentic ai greece, ai automation greece, generative ai solutions, ai chatbot ελλαδα",
    alternates: {
        canonical: "https://sgk.gr/ai-agents",
    },
    openGraph: {
        title: "AI Agency Ελλάδα | AI Agents για Επιχειρήσεις & Custom Αυτοματισμοί | SGK Digital",
        description: "Η κορυφαία AI Agency στην Ελλάδα. Ανάπτυξη Custom AI Agents & αυτοματισμοί επιχειρήσεων. Customer service 24/7, ERP integration, GPT-4o, Claude & Gemini.",
        url: "https://sgk.gr/ai-agents",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Agency Ελλάδα | AI Agents & Custom Αυτοματισμοί | SGK Digital",
        description: "Custom AI agents για ελληνικές επιχειρήσεις. Αυτοματισμοί διαδικασιών, chatbots, ERP & e-commerce integrations.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

const agencySchema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "name": "SGK Digital - AI Agency & AI Agents Greece",
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
        "AI Agency",
        "AI Agents Development",
        "Custom Business Automations",
        "Agentic AI Workflows",
        "AI Customer Service Chatbots",
        "Generative AI Consulting"
    ],
    "description": "Εξειδικευμένη AI Agency στην Ελλάδα για σχεδιασμό και υλοποίηση αυτόνομων AI agents, επιχειρηματικών αυτοματισμών και λύσεων τεχνητής νοημοσύνης."
};

const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Agents & Business Automation Development",
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
        "name": "AI Agent Solutions",
        "itemListElement": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Starter AI Agent"
                },
                "price": "1000",
                "priceCurrency": "EUR"
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Business AI Agent"
                },
                "price": "2500",
                "priceCurrency": "EUR"
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Enterprise Multi-Agent System"
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
            "name": "Τι είναι ένας AI Agent (AI Agent τι είναι);",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ένας AI Agent (πράκτορας τεχνητής νοημοσύνης) είναι ένα αυτόνομο λογισμικό που αξιοποιεί Μεγάλα Γλωσσικά Μοντέλα (LLMs) για να κατανοεί στόχους, να σχεδιάζει βήματα, να εκτελεί εργασίες και να αλληλεπιδρά με εξωτερικά εργαλεία (APIs, CRM, ERP, databases) χωρίς ανθρώπινη παρέμβαση. Σε αντίθεση με ένα απλό chatbot που δίνει μόνο τυποποιημένες απαντήσεις, ο AI agent αναλαμβάνει δράση αυτόνομα."
            }
        },
        {
            "@type": "Question",
            "name": "Τι είναι μια AI Agency και τι υπηρεσίες προσφέρει στην Ελλάδα;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Μια AI Agency (όπως η SGK Digital στην Αθήνα) είναι εξειδικευμένη εταιρεία τεχνολογίας που βοηθά επιχειρήσεις να ενσωματώσουν παραγωγική τεχνητή νοημοσύνη (Generative AI) και αυτόνομους πράκτορες στις καθημερινές τους διαδικασίες. Οι υπηρεσίες περιλαμβάνουν σχεδιασμό AI agents για 24/7 εξυπηρέτηση πελατών, διασύνδεση με ERP (Softone, Entersoft κ.α.), custom αυτοματισμούς workflows, data extraction, και στρατηγική AI συμβουλευτική."
            }
        },
        {
            "@type": "Question",
            "name": "Πώς βοηθούν οι custom αυτοματισμοί μια ελληνική επιχείρηση;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Οι custom αυτοματισμοί εξαλείφουν τη χειροκίνητη εργασία και τα ανθρώπινα λάθη. Ενδεικτικά παραδείγματα: αυτόματη ενημέρωση αποθεμάτων σε eshop και marketplaces (Skroutz), αυτόματη έκδοση voucher courier (ACS, BoxNow, Speedex), αυτόματη καταχώρηση τιμολογίων και παραγγελιών στο ERP, και άμεση παρακολούθηση leads από social media και ιστοσελίδα."
            }
        },
        {
            "@type": "Question",
            "name": "Ποια είναι η διαφορά μεταξύ ενός απλού Chatbot και ενός Αυτόνομου AI Agent;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Το παραδοσιακό chatbot ακολουθεί προκαθορισμένα κουμπιά και σενάρια (if-then logic) και κολλάει σε οτιδήποτε απρόβλεπτο. Ο Αυτόνομος AI Agent διαθέτει συλλογιστική ικανότητα (reasoning), κατανοεί τη φυσική γλώσσα (Greek NLP), έχει πρόσβαση στα εταιρικά σας αρχεία και βάσεις δεδομένων (RAG), και μπορεί να ολοκληρώσει ενέργειες (π.χ. να ακυρώσει παραγγελία, να εκδώσει voucher ή να κλείσει ραντεβού)."
            }
        },
        {
            "@type": "Question",
            "name": "Πόσο κοστίζει η ανάπτυξη AI agent και ποιο είναι το ROI;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Στην SGK Digital, ένα βασικό Starter AI Agent ξεκινά από 1.000€, ένας ολοκληρωμένος Business Agent με ERP/CRM integrations κυμαίνεται από 2.500€, ενώ enterprise λύσεις multi-agent ξεκινούν από 8.000€. Το Return on Investment (ROI) επιτυγχάνεται συνήθως εντός 3-6 μηνών, καθώς μειώνει το κόστος εξυπηρέτησης και διαχείρισης έως και 70%."
            }
        },
        {
            "@type": "Question",
            "name": "Με ποιες τεχνολογίες αναπτύσσει AI agents η SGK Digital;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Χρησιμοποιούμε τα κορυφαία μοντέλα της αγοράς: OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini Pro, καθώς και open-source μοντέλα (Llama 3, DeepSeek) για on-premise ανάγκες. Για orchestration και ροές εργασίας χρησιμοποιούμε LangGraph, LangChain, n8n και Supabase Vector με πλήρη ασφάλεια και συμμόρφωση GDPR."
            }
        }
    ]
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://sgk.gr" },
        { "@type": "ListItem", "position": 2, "name": "AI Agency & AI Agents", "item": "https://sgk.gr/ai-agents" }
    ]
};

const useCases = [
    {
        icon: <MessageSquare className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI Customer Service Agent",
        desc: "24/7 εξυπηρέτηση στα ελληνικά. Απαντά σε απορίες, εντοπίζει παραγγελίες μέσω courier APIs (ACS, BoxNow, Speedex), διαχειρίζεται επιστροφές και συνδέεται με WhatsApp & Web Chat.",
        stats: "Έως -70% κόστος support",
        industries: ["eCommerce", "Ξενοδοχεία", "Υπηρεσίες", "Real Estate"],
    },
    {
        icon: <Workflow className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI Sales & Lead Qualification Agent",
        desc: "Αξιολογεί leads σε πραγματικό χρόνο, συλλέγει απαιτήσεις πελατών, απαντά σε τεχνικές απορίες και κλείνει αυτόματα ραντεβού στο calendar της ομάδας πωλήσεων.",
        stats: "+40% Conversion Rate",
        industries: ["B2B", "SaaS", "Ασφάλειες", "Real Estate"],
    },
    {
        icon: <BarChart2 className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI E-Commerce Operations Agent",
        desc: "Παρακολουθεί Skroutz & eshop, διαχειρίζεται αποθέματα, εντοπίζει έλλειψη κερδοφορίας και δημιουργεί αυτόματα reports management με φυσική γλώσσα.",
        stats: "15+ ώρες εξοικονόμηση/εβδομάδα",
        industries: ["eCommerce", "Χονδρική", "F&B", "Retail"],
    },
    {
        icon: <Layers className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI HR & Recruitment Agent",
        desc: "Αυτόματη ανάλυση βιογραφικών (CV parsing), αξιολόγηση υποψηφίων βάσει job description και διεξαγωγή πρώτης AI συνέντευξης (όπως το project REKRUA).",
        stats: "-60% χρόνος πρόσληψης",
        industries: ["HR Agencies", "Μεγάλες Εταιρείες", "Startups"],
    },
    {
        icon: <Zap className="w-8 h-8 text-[#3b5bdb]" />,
        title: "Custom Αυτοματισμοί Διαδικασιών (n8n / LangGraph)",
        desc: "Αυτόματη εξαγωγή δεδομένων από τιμολόγια PDF, καταχώρηση στο ERP (Softone/Entersoft), ενημέρωση CRM και αυτόματη αποστολή ειδοποιήσεων σε πελάτες.",
        stats: "Μηδενικά ανθρώπινα λάθη",
        industries: ["Λογιστήρια", "Logistics", "Ναυτιλία", "Βιομηχανία"],
    },
    {
        icon: <Cpu className="w-8 h-8 text-[#3b5bdb]" />,
        title: "Computer Vision & Visual AI Agents",
        desc: "Αναγνώριση εικόνων, πιστοποίηση εργασιών τεχνικών στο πεδίο (όπως το σύστημα KM-FIBER για συνεργάτες Cosmote) και αυτόματη ταξινόμηση εγγράφων.",
        stats: "Real-time ποιοτικός έλεγχος",
        industries: ["Τηλεπικοινωνίες", "Κατασκευές", "Ιατρικά", "Security"],
    },
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
                                <li className="text-black font-medium">AI Agency & AI Agents</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                #1 AI Agency στην Ελλάδα • Agentic AI & Custom Αυτοματισμοί
                            </div>
                            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-black mb-6">
                                AI Agency & Custom<br />
                                <span className="font-normal text-[#3b5bdb]">AI Agents για Επιχειρήσεις</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl font-light">
                                Στην <strong>SGK Digital</strong> αναπτύσσουμε αυτόνομους <strong className="font-medium text-black">AI Agents</strong> και προηγμένους <strong className="font-medium text-black">επιχειρηματικούς αυτοματισμούς</strong>. Όχι απλά chatbots — έξυπνους πράκτορες που εκτελούν εργασίες, συνδέονται με ERP/CRM, εξυπηρετούν πελάτες 24/7 και μειώνουν το κόστος λειτουργίας έως <strong>70%</strong>.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/estimate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium rounded-lg transition-all duration-300 text-lg shadow-sm">
                                    Ζητήστε Custom AI Demo <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/blog/ti-einai-ai-agents-epicheiriseis" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-300 text-lg shadow-sm">
                                    AI Agent: Τι είναι & πώς λειτουργεί;
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Stats Bar */}
                    <section className="border-y border-gray-250 py-12 bg-white/70">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { value: "70%", label: "Μείωση κόστους εξυπηρέτησης" },
                                    { value: "24/7", label: "Αδιάλειπτη λειτουργία σε WhatsApp & Web" },
                                    { value: "0.8s", label: "Μέσος χρόνος απόκρισης AI" },
                                    { value: "100%", label: "Ελληνική γλώσσα & GDPR Compliance" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className="text-4xl font-bold text-[#3b5bdb] mb-2">{stat.value}</p>
                                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Definitive Guide / Knowledge Block for SEO & LLM Queries */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto space-y-12">
                            
                            {/* What is AI Agent Card */}
                            <div className="bg-white border border-gray-250 p-8 md:p-12 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3 mb-4 text-[#3b5bdb]">
                                    <Bot className="w-8 h-8" />
                                    <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">Εκπαιδευτικός Οδηγός</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-light text-black mb-6">
                                    AI Agent: Τι είναι και πώς λειτουργεί;
                                </h2>
                                <div className="prose prose-lg max-w-none text-gray-600 space-y-4 font-light leading-relaxed">
                                    <p>
                                        Ο όρος <strong>AI Agent (πράκτορας τεχνητής νοημοσύνης)</strong> περιγράφει ένα αυτόνομο σύστημα λογισμικού που χρησιμοποιεί Μεγάλα Γλωσσικά Μοντέλα (Large Language Models όπως GPT-4o, Claude 3.5 Sonnet, Gemini Pro) ώστε να αναλαμβάνει <strong>στόχους (goals)</strong> αντί για απλές εντολές.
                                    </p>
                                    <p>
                                        Σε αντίθεση με τα παραδοσιακά chatbots που εμφανίζουν προκαθορισμένα κείμενα, ένας σύγχρονος <strong>AI Agent</strong> διαθέτει:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Συλλογιστική Ικανότητα (Reasoning):</strong> Αναλύει το αίτημα του χρήστη και σχεδιάζει ποια βήματα απαιτούνται για να το εκτελέσει.</li>
                                        <li><strong>Εργαλεία & APIs (Tool Calling):</strong> Μπορεί να καλέσει εξωτερικές υπηρεσίες — να αναζητήσει ένα tracking number στην ACS ή στο BoxNow, να ελέγξει απόθεμα στο ERP, ή να δημιουργήσει παραγγελία.</li>
                                        <li><strong>Μνήμη & Εταιρικό RAG (Retrieval-Augmented Generation):</strong> Διαβάζει τα δικά σας εταιρικά έγγραφα, PDFs και βάσεις δεδομένων, απαντώντας με ακρίβεια 100% χωρίς "παραισθήσεις" (hallucinations).</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Comparison Table: Chatbot vs AI Agent */}
                            <div className="bg-white border border-gray-250 p-8 md:p-12 rounded-xl shadow-sm">
                                <h2 className="text-3xl font-light text-black mb-4">
                                    Σύγκριση: Παραδοσιακό Chatbot vs Αυτόνομος AI Agent
                                </h2>
                                <p className="text-gray-500 mb-8 font-light">
                                    Γιατί οι επιχειρήσεις εγκαταλείπουν τα απλά chatbots και στρέφονται στο <strong>Agentic AI</strong> της SGK Digital:
                                </p>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-300 bg-gray-50">
                                                <th className="py-3 px-4 font-semibold text-gray-700">Χαρακτηριστικό</th>
                                                <th className="py-3 px-4 font-semibold text-gray-500">Παραδοσιακό Chatbot</th>
                                                <th className="py-3 px-4 font-semibold text-[#3b5bdb]">Αυτόνομος AI Agent (SGK)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="py-3 px-4 font-medium text-black">Τρόπος Λειτουργίας</td>
                                                <td className="py-3 px-4 text-gray-500">Προκαθορισμένα κουμπιά & if/else scripts</td>
                                                <td className="py-3 px-4 text-black font-medium">Αυτόνομη συλλογιστική (LLM Reasoning)</td>
                                            </tr>
                                            <tr className="bg-gray-50/50">
                                                <td className="py-3 px-4 font-medium text-black">Κατανόηση Ελληνικών</td>
                                                <td className="py-3 px-4 text-gray-500">Περιορισμένη σε ακριβείς λέξεις-κλειδιά</td>
                                                <td className="py-3 px-4 text-black font-medium">Άπταιστα φυσικά Ελληνικά & Greeklish</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 font-medium text-black">Εκτέλεση Ενεργειών (Actions)</td>
                                                <td className="py-3 px-4 text-gray-500">Καμία (μόνο εμφάνιση κειμένου)</td>
                                                <td className="py-3 px-4 text-black font-medium">Πλήρης (έκδοση voucher, CRM updates, APIs)</td>
                                            </tr>
                                            <tr className="bg-gray-50/50">
                                                <td className="py-3 px-4 font-medium text-black">Διασύνδεση με ERP / E-shop</td>
                                                <td className="py-3 px-4 text-gray-500">Δύσκολη ή αδύνατη</td>
                                                <td className="py-3 px-4 text-black font-medium">Real-time sync με Softone, WooCommerce κ.α.</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 font-medium text-black">Επίλυση Αιτημάτων</td>
                                                <td className="py-3 px-4 text-gray-500">Κάτω από 25%</td>
                                                <td className="py-3 px-4 text-black font-medium">Έως και 75% αυτόνομη ολοκλήρωση</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Custom Automations Section */}
                            <div className="bg-white border border-gray-250 p-8 md:p-12 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3 mb-4 text-[#3b5bdb]">
                                    <Workflow className="w-8 h-8" />
                                    <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">Business Automations</span>
                                </div>
                                <h2 className="text-3xl font-light text-black mb-6">
                                    Custom Αυτοματισμοί Επιχειρήσεων στην Ελλάδα
                                </h2>
                                <p className="text-gray-600 mb-6 leading-relaxed font-light">
                                    Κάθε επιχείρηση σπαταλά εκατοντάδες ώρες κάθε μήνα σε επαναλαμβανόμενες χειροκίνητες εργασίες: αντιγραφή στοιχείων από emails σε Excel, καταχώρηση παραγγελιών, αναζήτηση τιμολογίων, επικοινωνία με προμηθευτές.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/60">
                                        <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                                            <Database className="w-4 h-4 text-[#3b5bdb]" /> Αυτοματοποίηση ERP & Τιμολόγησης
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Αυτόματη ανάγνωση τιμολογίων προμηθευτών (PDF OCR), έλεγχος συμφωνίας και καταχώρηση στο Softone/Entersoft χωρίς ανθρώπινο λάθος.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/60">
                                        <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                                            <Bot className="w-4 h-4 text-[#3b5bdb]" /> Omnichannel WhatsApp & Social AI
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Ενοποίηση μηνυμάτων από WhatsApp Business, Instagram DM και Facebook Messenger με έναν ενιαίο AI agent που απαντά ακαριαία.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/60">
                                        <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-[#3b5bdb]" /> LangGraph & n8n Workflows
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Σύνθετα multi-agent pipelines όπου ένας πράκτορας ερευνά, ο δεύτερος συντάσσει και ο τρίτος ελέγχει τα δεδομένα πριν την αποστολή.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/60">
                                        <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-[#3b5bdb]" /> 100% GDPR & Data Privacy
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Τα εταιρικά σας δεδομένα παραμένουν απόλυτα ασφαλή και δεν χρησιμοποιούνται ποτέ για εκπαίδευση δημόσιων μοντέλων. Δυνατότητα On-Premise AI.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* Use Cases */}
                    <section className="bg-white/50 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <h2 className="text-3xl md:text-5xl font-light text-black mb-4">Εφαρμογές AI Agents (Use Cases)</h2>
                                <p className="text-gray-500 font-light text-lg">
                                    Πραγματικές λύσεις που λειτουργούν σήμερα και παράγουν μετρήσιμα αποτελέσματα
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {useCases.map((uc) => (
                                    <div key={uc.title} className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/40 hover:shadow-md transition-all duration-300 shadow-sm flex flex-col">
                                        <div className="w-12 h-12 mb-6 flex items-center justify-center bg-blue-50 rounded-lg">{uc.icon}</div>
                                        <div className="text-xs font-bold text-[#3b5bdb] uppercase tracking-wider mb-2">{uc.stats}</div>
                                        <h3 className="text-xl font-bold text-black mb-3">{uc.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{uc.desc}</p>
                                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                                            {uc.industries.map((ind) => (
                                                <span key={ind} className="text-[10px] px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 font-medium">{ind}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Real Case Studies Section */}
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
                                    <span className="text-xs font-bold text-[#3b5bdb] uppercase tracking-wider">eCommerce AI Agent</span>
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

                    {/* Pricing */}
                    <section className="container mx-auto px-6 py-20 bg-white/40 border-t border-gray-250">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Πακέτα Ανάπτυξης AI Agents & Αυτοματισμών</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Επιλέξτε τη λύση που ανταποκρίνεται στο μέγεθος της επιχείρησής σας</p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { name: "Starter AI Agent", price: "από 1.000€", features: ["1 Εξειδικευμένος AI Agent", "Εκπαίδευση σε δικά σας αρχεία (RAG)", "Ενσωμάτωση σε Website Widget", "Αποστολή email ειδοποιήσεων", "3 μήνες τεχνική υποστήριξη"], highlight: false },
                                    { name: "Business AI Agent", price: "από 2.500€", features: ["Multi-step Αυτόνομος Agent", "Διασύνδεση με CRM / ERP / E-shop", "Σύνδεση με WhatsApp & Social", "Courier API tracking (ACS, BoxNow)", "Analytics Dashboard & Reports", "6 μήνες υποστήριξη & tuning"], highlight: true },
                                    { name: "Enterprise Multi-Agent", price: "από 8.000€", features: ["Multi-Agent Architecture (LangGraph)", "Πλήρεις Custom Αυτοματισμοί n8n", "Δυνατότητα On-Premise / Private Cloud", "Fine-Tuning σε ιδιωτικά μοντέλα", "Αυστηρό SLA & 12 μήνες υποστήριξη"], highlight: false },
                                ].map((pkg) => (
                                    <div key={pkg.name} className={`p-8 rounded-xl border ${pkg.highlight ? 'border-[#3b5bdb] bg-[#3b5bdb] text-white shadow-xl shadow-blue-100 scale-105' : 'border-gray-250 bg-white text-black shadow-sm'} flex flex-col`}>
                                        {pkg.highlight && <span className="text-[10px] font-bold uppercase tracking-wider text-white mb-2 self-start bg-blue-700 px-2 py-0.5 rounded-full">Δημοφιλέστερο</span>}
                                        <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                        <p className={`text-3xl font-bold mb-8 ${pkg.highlight ? 'text-white' : 'text-[#3b5bdb]'}`}>{pkg.price}</p>
                                        <ul className="space-y-3 mb-8 flex-1">
                                            {pkg.features.map((f) => (
                                                <li key={f} className={`flex items-center gap-3 text-sm ${pkg.highlight ? 'text-white/95' : 'text-gray-600'}`}>
                                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${pkg.highlight ? 'text-[#4ade80]' : 'text-[#3b5bdb]'}`} />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/estimate" className={`w-full text-center py-3 px-6 font-medium rounded-lg transition-all duration-300 text-sm ${pkg.highlight ? 'bg-[#4ade80] text-black hover:bg-[#22c55e] font-bold shadow-md' : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 shadow-sm'}`}>
                                            Ζητήστε Προσφορά
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="bg-white border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Συχνές Ερωτήσεις (FAQ) — AI Agency & Agents</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Όλα όσα πρέπει να γνωρίζετε πριν ξεκινήσετε με το AI στην επιχείρησή σας</p>
                            <div className="space-y-6">
                                {faqSchema.mainEntity.map((faq, idx) => (
                                    <div key={idx} className="p-8 rounded-xl border border-gray-250 bg-[#faf9f5] shadow-sm">
                                        <h3 className="text-lg font-bold text-black mb-3">{faq.name}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Internal Links */}
                    <section className="container mx-auto px-6 py-16">
                        <h2 className="text-xl font-light text-gray-800 mb-8 text-center">Σχετικές Υπηρεσίες & Οδηγοί</h2>
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
                        <div className="rounded-2xl bg-[#3b5bdb] p-12 md:p-20 text-center text-white shadow-xl max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">
                                Έτοιμοι να Αυτοματοποιήσετε την Επιχείρησή σας;
                            </h2>
                            <p className="text-white/85 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                                Κλείστε μια δωρεάν συνάντηση 30 λεπτών με τους AI Engineers της SGK Digital. Θα αναλύσουμε τις διαδικασίες σας και θα σχεδιάσουμε το ιδανικό AI pipeline για την εταιρεία σας.
                            </p>
                            <Link href="/estimate" className="inline-flex items-center gap-3 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-lg rounded-lg transition-all duration-300 shadow-lg">
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
