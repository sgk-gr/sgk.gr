import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Bot, Workflow, MessageSquare, BarChart2, Layers, Cpu, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "AI agents για επιχειρήσεις | Αυτοματισμοί & AI Ελλάδα | SGK",
    description: "Αναπτύξτε AI agents που αυτοματοποιούν διαδικασίες, εξυπηρετούν πελάτες 24/7 και αναλύουν δεδομένα. Εξειδικευμένη ανάπτυξη AI agents για ελληνικές επιχειρήσεις.",
    keywords: "ai agents ελλάδα, ai αυτοματισμοί, ai agent επιχειρήσεις, artificial intelligence ελλάδα, ai chatbot, agentic ai, ai automation greece",
    alternates: {
        canonical: "https://sgk.gr/ai-agents",
    },
    openGraph: {
        title: "AI agents για επιχειρήσεις | SGK Software Development",
        description: "Custom AI agents που αυτοματοποιούν διαδικασίες, εξυπηρετούν πελάτες 24/7 και αναλύουν δεδομένα.",
        url: "https://sgk.gr/ai-agents",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI agents για επιχειρήσεις | SGK",
        description: "Custom AI agents για ελληνικές επιχειρήσεις. Αυτοματισμοί, chatbots, data analysis.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Τι είναι ένας AI Agent;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ένας AI Agent είναι ένα αυτόνομο λογισμικό που χρησιμοποιεί τεχνητή νοημοσύνη για να εκτελεί εργασίες, να παίρνει αποφάσεις και να αλληλεπιδρά με άλλα συστήματα χωρίς ανθρώπινη παρέμβαση. Διαφέρει από ένα απλό chatbot γιατί μπορεί να εκτελέσει πολύπλοκες ακολουθίες ενεργειών, να χρησιμοποιεί εξωτερικά APIs και να μαθαίνει από τα δεδομένα σας."
            }
        },
        {
            "@type": "Question",
            "name": "Σε ποιες περιπτώσεις μπορώ να χρησιμοποιήσω AI agents;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "AI agents εφαρμόζονται σε: εξυπηρέτηση πελατών 24/7, αυτόματη επεξεργασία παραγγελιών, ανάλυση δεδομένων και reporting, email marketing automation, lead qualification, HR screening, inventory management, και πολλά άλλα. Ουσιαστικά οποιαδήποτε επαναλαμβανόμενη εργασία μπορεί να αυτοματοποιηθεί."
            }
        },
        {
            "@type": "Question",
            "name": "Πόσο κοστίζει η ανάπτυξη AI agent;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Το κόστος ανάπτυξης AI agent εξαρτάται από την πολυπλοκότητα. Ένας απλός AI chatbot κοστίζει €500-€1.500. Ένας πλήρης AI agent με integrations και custom logic κοστίζει €2.000-€8.000. Enterprise λύσεις με πολλαπλά agents ξεκινούν από €10.000."
            }
        },
        {
            "@type": "Question",
            "name": "Με ποιες τεχνολογίες αναπτύσσετε AI agents;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Χρησιμοποιούμε GPT-4o, Claude Sonnet, Gemini Pro και open-source μοντέλα ανάλογα με τις ανάγκες. Για orchestration χρησιμοποιούμε LangGraph, LangChain και custom frameworks. Ενσωματώνουμε με οποιοδήποτε API, database ή business tool."
            }
        },
        {
            "@type": "Question",
            "name": "Είναι ασφαλής η χρήση AI στην επιχείρησή μου;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι, με την κατάλληλη αρχιτεκτονική. Τα δεδομένα σας παραμένουν ιδιωτικά — δεν χρησιμοποιούνται για training μοντέλων τρίτων. Σχεδιάζουμε με GDPR compliance και μπορούμε να αναπτύξουμε on-premise λύσεις που τρέχουν εξ ολοκλήρου στους δικούς σας servers."
            }
        }
    ]
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://sgk.gr" },
        { "@type": "ListItem", "position": 2, "name": "AI Agents", "item": "https://sgk.gr/ai-agents" }
    ]
};

const useCases = [
    {
        icon: <MessageSquare className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI customer service agent",
        desc: "Εξυπηρέτηση πελατών 24/7 στα ελληνικά. Απαντά σε ερωτήσεις, επεξεργάζεται παραγγελίες, κάνει escalation σε σοβαρά θέματα. Μειώνει το κόστος εξυπηρέτησης έως 70%.",
        industries: ["eCommerce", "Hotels", "Clinics", "Real Estate"],
    },
    {
        icon: <Workflow className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI sales & lead agent",
        desc: "Qualify leads αυτόματα, κλείνει ραντεβού, στέλνει follow-up emails. Λειτουργεί σε email, WhatsApp, website chat. Αυξάνει το conversion rate έως 40%.",
        industries: ["B2B", "SaaS", "Finance", "Real Estate"],
    },
    {
        icon: <BarChart2 className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI analytics & reporting agent",
        desc: "Αναλύει δεδομένα πωλήσεων, δημιουργεί reports, εντοπίζει trends και anomalies. Απαντά σε ερωτήσεις με φυσική γλώσσα: 'Ποιες είναι οι top πωλήσεις αυτό το μήνα;'",
        industries: ["Retail", "Finance", "Manufacturing", "Healthcare"],
    },
    {
        icon: <Layers className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI HR & recruitment agent",
        desc: "Κοσκινίζει βιογραφικά, κάνει pre-screening interviews, αξιολογεί υποψήφιους. Όπως στο project REKRUA που αναπτύξαμε — μειώνει τον χρόνο hiring κατά 60%.",
        industries: ["HR Tech", "Staffing", "Corporate", "Startups"],
    },
    {
        icon: <Bot className="w-8 h-8 text-[#3b5bdb]" />,
        title: "AI operations agent",
        desc: "Διαχειρίζεται αποθέματα, παρακολουθεί supply chain, δημιουργεί αυτόματα purchase orders. Ενσωματώνεται με ERP και warehouse management systems.",
        industries: ["Manufacturing", "Logistics", "Retail", "F&B"],
    },
    {
        icon: <Cpu className="w-8 h-8 text-[#3b5bdb]" />,
        title: "Custom AI agent",
        desc: "Αν δεν βρίσκετε αυτό που χρειάζεστε στα παραπάνω, σχεδιάζουμε custom AI agent για τη μοναδική σας ανάγκη. Ιδανικό για specialized industries.",
        industries: ["Telecom", "Legal", "Education", "Government"],
    },
];

export default function AIAgentsPage() {
    return (
        <>
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
                                <li className="text-black font-medium">AI agents</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <p className="text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-4">
                                Agentic AI • Ελλάδα
                            </p>
                            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-black mb-6">
                                AI agents για<br />
                                <span className="font-normal text-[#3b5bdb]">επιχειρήσεις</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl font-light">
                                Αναπτύσσουμε <strong className="font-medium text-black">AI agents</strong> που αυτοματοποιούν διαδικασίες, εξυπηρετούν πελάτες 24/7 και αναλύουν δεδομένα. Όχι απλά chatbots — έξυπνοι πράκτορες που δρουν αυτόνομα και ενσωματώνονται με τα υπάρχοντα συστήματά σας.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/estimate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium rounded-lg transition-all duration-300 text-lg shadow-sm">
                                    Ζητήστε demo <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/blog/ti-einai-ai-agents-epicheiriseis" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-300 text-lg shadow-sm">
                                    Τι είναι τα AI agents;
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="border-y border-gray-250 py-12 bg-white/60">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { value: "70%", label: "Μείωση κόστους εξυπηρέτησης" },
                                    { value: "24/7", label: "Αδιάλειπτη λειτουργία" },
                                    { value: "40%", label: "Αύξηση conversion rate" },
                                    { value: "10+", label: "AI projects παραδοθέντα" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className="text-4xl font-bold text-[#3b5bdb] mb-2">{stat.value}</p>
                                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto bg-white border border-gray-250 p-8 md:p-12 rounded-xl shadow-sm">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-8">Τι είναι τα AI agents και γιατί η επιχείρησή σας τα χρειάζεται</h2>
                            <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-black prose-headings:font-light prose-strong:text-black prose-strong:font-medium">
                                <p>
                                    Τα <strong>AI agents</strong> είναι η επόμενη εξέλιξη μετά τα chatbots. Αντί να απλώς απαντούν σε ερωτήσεις, μπορούν να <strong>εκτελούν πολύπλοκες αλυσίδες ενεργειών</strong>: να ψάχνουν πληροφορίες, να καλούν APIs, να ενημερώνουν βάσεις δεδομένων, να στέλνουν emails — όλα αυτόνομα.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Πώς λειτουργεί ένας AI agent;</h3>
                                <p>
                                    Ένας AI agent λαμβάνει ένα <strong>goal</strong> (στόχο) και αποφασίζει μόνος του ποια βήματα χρειάζεται να κάνει για να τον επιτύχει. Χρησιμοποιεί "tools" (εργαλεία) που του δίνουμε εμείς: πρόσβαση σε database, δυνατότητα αποστολής email, κλήση APIs, ανάλυση αρχείων κ.α.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Real-world παράδειγμα: SIGMALABS</h3>
                                <p>
                                    Για τον πελάτη μας <strong>Sigmalabs</strong>, αναπτύξαμε ένα AI agent που διαχειρίζεται ολόκληρο το eCommerce operation: παρακολουθεί παραγγελίες Skroutz, αναλύει πωλήσεις, εντοπίζει προβλήματα και απαντά σε ερωτήματα management με φυσική γλώσσα. Αποτέλεσμα: 15+ ώρες εξοικονόμηση εβδομαδιαίως.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Τεχνολογία που χρησιμοποιούμε</h3>
                                <p>
                                    Εργαζόμαστε με τα καλύτερα AI μοντέλα: <strong>GPT-4o (OpenAI), Claude 3.5 Sonnet (Anthropic), Gemini Pro (Google)</strong>. Για orchestration χρησιμοποιούμε LangGraph και custom multi-agent frameworks. Κάθε λύση είναι GDPR-compliant με δυνατότητα on-premise deployment.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Use cases AI agents</h2>
                            <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto font-light">Εφαρμογές AI agents σε πραγματικά business scenarios</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {useCases.map((uc) => (
                                    <div key={uc.title} className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm flex flex-col">
                                        <div className="w-12 h-12 mb-6 flex items-center justify-center">{uc.icon}</div>
                                        <h3 className="text-lg font-bold text-black mb-3">{uc.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{uc.desc}</p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {uc.industries.map((ind) => (
                                                <span key={ind} className="text-[10px] px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 font-medium">{ind}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Πακέτα AI agent development</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Επιλέξτε το σωστό πακέτο για τις ανάγκες σας</p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { name: "Starter AI", price: "από €1.000", features: ["1 AI agent", "Βασικό chatbot", "Web integration", "3 μήνες support", "Email notifications"], highlight: false },
                                    { name: "Business AI", price: "από €2.500", features: ["Multi-step agent", "CRM/ERP integration", "Custom logic & tools", "Analytics dashboard", "6 μήνες support"], highlight: true },
                                    { name: "Enterprise AI", price: "από €8.000", features: ["Multi-agent system", "Πλήρης automation", "On-premise option", "Custom LLM fine-tuning", "12 μήνες support"], highlight: false },
                                ].map((pkg) => (
                                    <div key={pkg.name} className={`p-8 rounded-xl border ${pkg.highlight ? 'border-[#3b5bdb] bg-[#3b5bdb] text-white shadow-lg shadow-blue-100' : 'border-gray-250 bg-white text-black shadow-sm'} flex flex-col`}>
                                        {pkg.highlight && <span className="text-[10px] font-bold uppercase tracking-wider text-white mb-2 self-start bg-blue-700 px-2 py-0.5 rounded-full">Δημοφιλέστερο</span>}
                                        <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                        <p className={`text-3xl font-bold mb-8 ${pkg.highlight ? 'text-white' : 'text-[#3b5bdb]'}`}>{pkg.price}</p>
                                        <ul className="space-y-3 mb-8 flex-1">
                                            {pkg.features.map((f) => (
                                                <li key={f} className={`flex items-center gap-3 text-sm ${pkg.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${pkg.highlight ? 'text-[#4ade80]' : 'text-[#3b5bdb]'}`} />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/estimate" className={`w-full text-center py-3 px-6 font-medium rounded-lg transition-all duration-300 text-sm ${pkg.highlight ? 'bg-[#4ade80] text-black hover:bg-[#22c55e] shadow-sm' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'}`}>
                                            Ζητήστε demo
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Συχνές ερωτήσεις — AI agents</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Ό,τι θέλετε να γνωρίζετε για τους AI agents</p>
                            <div className="space-y-6">
                                {faqSchema.mainEntity.map((faq, idx) => (
                                    <div key={idx} className="p-8 rounded-xl border border-gray-250 bg-white shadow-sm">
                                        <h3 className="text-lg font-bold text-black mb-4">{faq.name}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Internal Links */}
                    <section className="container mx-auto px-6 py-16">
                        <h2 className="text-xl font-light text-gray-800 mb-8">Σχετικές υπηρεσίες & άρθρα</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link href="/web-development" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Web development →</h3>
                                <p className="text-xs text-gray-500">Custom web εφαρμογές</p>
                            </Link>
                            <Link href="/blog/ti-einai-ai-agents-epicheiriseis" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Τι είναι τα AI agents; →</h3>
                                <p className="text-xs text-gray-500">Εκπαιδευτικό άρθρο</p>
                            </Link>
                            <Link href="/kataskevi-eshop" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">AI για eshop →</h3>
                                <p className="text-xs text-gray-500">AI agents στο eCommerce</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6">
                        <div className="rounded-2xl bg-[#3b5bdb] p-12 md:p-20 text-center text-white shadow-lg">
                            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">Έτοιμοι να αυτοματοποιήσετε την επιχείρησή σας;</h2>
                            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-light">
                                Κλείστε μια δωρεάν συνάντηση 30 λεπτών. Θα αναλύσουμε τις διαδικασίες σας και θα σας δείξουμε ακριβώς πώς ένα AI agent μπορεί να βελτιώσει την απόδοση της επιχείρησής σας.
                            </p>
                            <Link href="/estimate" className="inline-flex items-center gap-3 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-lg rounded-lg transition-all duration-300 shadow-md">
                                Ζητήστε demo <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
