import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Bot, Workflow, MessageSquare, BarChart2, Layers, Cpu } from "lucide-react";

export const metadata: Metadata = {
    title: "AI Agents για Επιχειρήσεις | Αυτοματισμοί & AI Ελλάδα | SGK",
    description: "Αναπτύξτε AI agents που αυτοματοποιούν διαδικασίες, εξυπηρετούν πελάτες 24/7 και αναλύουν δεδομένα. Εξειδικευμένη ανάπτυξη AI agents για ελληνικές επιχειρήσεις.",
    keywords: "ai agents ελλάδα, ai αυτοματισμοί, ai agent επιχειρήσεις, artificial intelligence ελλάδα, ai chatbot, agentic ai, ai automation greece",
    alternates: {
        canonical: "https://sgk.gr/ai-agents",
    },
    openGraph: {
        title: "AI Agents για Επιχειρήσεις | SGK Software Development",
        description: "Custom AI agents που αυτοματοποιούν διαδικασίες, εξυπηρετούν πελάτες 24/7 και αναλύουν δεδομένα.",
        url: "https://sgk.gr/ai-agents",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Agents για Επιχειρήσεις | SGK",
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
        icon: <MessageSquare className="w-8 h-8" />,
        title: "AI Customer Service Agent",
        desc: "Εξυπηρέτηση πελατών 24/7 στα ελληνικά. Απαντά σε ερωτήσεις, επεξεργάζεται παραγγελίες, κάνει escalation σε σοβαρά θέματα. Μειώνει το κόστος εξυπηρέτησης έως 70%.",
        industries: ["eCommerce", "Hotels", "Clinics", "Real Estate"],
    },
    {
        icon: <Workflow className="w-8 h-8" />,
        title: "AI Sales & Lead Agent",
        desc: "Qualify leads αυτόματα, κλείνει ραντεβού, στέλνει follow-up emails. Λειτουργεί σε email, WhatsApp, website chat. Αυξάνει το conversion rate έως 40%.",
        industries: ["B2B", "SaaS", "Finance", "Real Estate"],
    },
    {
        icon: <BarChart2 className="w-8 h-8" />,
        title: "AI Analytics & Reporting Agent",
        desc: "Αναλύει δεδομένα πωλήσεων, δημιουργεί reports, εντοπίζει trends και anomalies. Απαντά σε ερωτήσεις με φυσική γλώσσα: 'Ποιες είναι οι top πωλήσεις αυτό το μήνα;'",
        industries: ["Retail", "Finance", "Manufacturing", "Healthcare"],
    },
    {
        icon: <Layers className="w-8 h-8" />,
        title: "AI HR & Recruitment Agent",
        desc: "Κοσκινίζει βιογραφικά, κάνει pre-screening interviews, αξιολογεί υποψήφιους. Όπως στο project REKRUA που αναπτύξαμε — μειώνει τον χρόνο hiring κατά 60%.",
        industries: ["HR Tech", "Staffing", "Corporate", "Startups"],
    },
    {
        icon: <Bot className="w-8 h-8" />,
        title: "AI Operations Agent",
        desc: "Διαχειρίζεται αποθέματα, παρακολουθεί supply chain, δημιουργεί αυτόματα purchase orders. Ενσωματώνεται με ERP και warehouse management systems.",
        industries: ["Manufacturing", "Logistics", "Retail", "F&B"],
    },
    {
        icon: <Cpu className="w-8 h-8" />,
        title: "Custom AI Agent",
        desc: "Αν δεν βρίσκετε αυτό που χρειάζεστε στα παραπάνω, σχεδιάζουμε custom AI agent για τη μοναδική σας ανάγκη. Ιδανικό για specialized industries.",
        industries: ["Telecom", "Legal", "Education", "Government"],
    },
];

export default function AIAgentsPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                <main className="pt-28">
                    {/* Breadcrumbs */}
                    <div className="container mx-auto px-6 pt-4 pb-2">
                        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                            <ol className="flex items-center gap-2">
                                <li><Link href="/" className="hover:text-primary transition-colors">Αρχική</Link></li>
                                <li className="text-muted-foreground/40">/</li>
                                <li className="text-foreground font-medium">AI Agents</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
                                Agentic AI • Ελλάδα
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                                AI Agents για<br />
                                <span className="text-gradient">Επιχειρήσεις</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                                Αναπτύσσουμε <strong className="text-foreground">AI agents</strong> που αυτοματοποιούν διαδικασίες, εξυπηρετούν πελάτες 24/7 και αναλύουν δεδομένα. Όχι απλά chatbots — έξυπνοι πράκτορες που δρουν αυτόνομα και ενσωματώνονται με τα υπάρχοντα συστήματά σας.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/estimate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:scale-105 transition-all text-lg">
                                    Ζητήστε Demo <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/blog/ti-einai-ai-agents-epicheiriseis" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 font-bold rounded-sm hover:border-white/50 transition-all text-lg">
                                    Τι είναι τα AI Agents;
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="border-y border-white/5 py-12 bg-white/[0.02]">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { value: "70%", label: "Μείωση κόστους εξυπηρέτησης" },
                                    { value: "24/7", label: "Αδιάλειπτη λειτουργία" },
                                    { value: "40%", label: "Αύξηση conversion rate" },
                                    { value: "10+", label: "AI Projects παραδοθέντα" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">Τι είναι τα AI Agents και Γιατί η Επιχείρησή σας τα Χρειάζεται</h2>
                            <div className="prose prose-invert prose-lg max-w-none prose-p:text-muted-foreground prose-headings:text-white prose-strong:text-white">
                                <p>
                                    Τα <strong>AI agents</strong> είναι η επόμενη εξέλιξη μετά τα chatbots. Αντί να απλώς απαντούν σε ερωτήσεις, μπορούν να <strong>εκτελούν πολύπλοκες αλυσίδες ενεργειών</strong>: να ψάχνουν πληροφορίες, να καλούν APIs, να ενημερώνουν βάσεις δεδομένων, να στέλνουν emails — όλα αυτόνομα.
                                </p>

                                <h3>Πώς Λειτουργεί ένας AI Agent;</h3>
                                <p>
                                    Ένας AI agent λαμβάνει ένα <strong>goal</strong> (στόχο) και αποφασίζει μόνος του ποια βήματα χρειάζεται να κάνει για να τον επιτύχει. Χρησιμοποιεί "tools" (εργαλεία) που του δίνουμε εμείς: πρόσβαση σε database, δυνατότητα αποστολής email, κλήση APIs, ανάλυση αρχείων κ.α.
                                </p>

                                <h3>Real-World Παράδειγμα: SIGMALABS</h3>
                                <p>
                                    Για τον πελάτη μας <strong>Sigmalabs</strong>, αναπτύξαμε ένα AI agent που διαχειρίζεται ολόκληρο το eCommerce operation: παρακολουθεί παραγγελίες Skroutz, αναλύει πωλήσεις, εντοπίζει προβλήματα και απαντά σε ερωτήματα management με φυσική γλώσσα. Αποτέλεσμα: 15+ ώρες εξοικονόμηση εβδομαδιαίως.
                                </p>

                                <h3>Τεχνολογία που Χρησιμοποιούμε</h3>
                                <p>
                                    Εργαζόμαστε με τα καλύτερα AI μοντέλα: <strong>GPT-4o (OpenAI), Claude 3.5 Sonnet (Anthropic), Gemini Pro (Google)</strong>. Για orchestration χρησιμοποιούμε LangGraph και custom multi-agent frameworks. Κάθε λύση είναι GDPR-compliant με δυνατότητα on-premise deployment.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Use Cases AI Agents</h2>
                            <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Εφαρμογές AI agents σε πραγματικά business scenarios</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {useCases.map((uc) => (
                                    <div key={uc.title} className="p-8 rounded-2xl border border-white/10 bg-background hover:border-primary/30 transition-colors">
                                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">{uc.icon}</div>
                                        <h3 className="text-xl font-bold mb-3">{uc.title}</h3>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">{uc.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {uc.industries.map((ind) => (
                                                <span key={ind} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{ind}</span>
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
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Πακέτα AI Agent Development</h2>
                            <p className="text-muted-foreground text-center mb-16">Επιλέξτε το σωστό πακέτο για τις ανάγκες σας</p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { name: "Starter AI", price: "από €1.000", features: ["1 AI agent", "Βασικό chatbot", "Web integration", "3 μήνες support", "Email notifications"], highlight: false },
                                    { name: "Business AI", price: "από €2.500", features: ["Multi-step agent", "CRM/ERP integration", "Custom logic & tools", "Analytics dashboard", "6 μήνες support"], highlight: true },
                                    { name: "Enterprise AI", price: "από €8.000", features: ["Multi-agent system", "Πλήρης automation", "On-premise option", "Custom LLM fine-tuning", "12 μήνες support"], highlight: false },
                                ].map((pkg) => (
                                    <div key={pkg.name} className={`p-8 rounded-2xl border ${pkg.highlight ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/[0.03]'} flex flex-col`}>
                                        {pkg.highlight && <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Δημοφιλέστερο</span>}
                                        <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                        <p className="text-3xl font-bold text-primary mb-8">{pkg.price}</p>
                                        <ul className="space-y-3 mb-8 flex-1">
                                            {pkg.features.map((f) => (
                                                <li key={f} className="flex items-center gap-3 text-muted-foreground">
                                                    <Bot className="w-4 h-4 text-primary flex-shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/estimate" className={`w-full text-center py-3 px-6 font-bold rounded-sm transition-all ${pkg.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-white/20 hover:border-white/50'}`}>
                                            Ζητήστε Demo
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Συχνές Ερωτήσεις — AI Agents</h2>
                            <p className="text-muted-foreground text-center mb-16">Ό,τι θέλετε να ξέρετε για τους AI agents</p>
                            <div className="space-y-6">
                                {faqSchema.mainEntity.map((faq, idx) => (
                                    <div key={idx} className="p-8 rounded-2xl border border-white/10 bg-background">
                                        <h3 className="text-xl font-bold mb-4">{faq.name}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{faq.acceptedAnswer.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Internal Links */}
                    <section className="container mx-auto px-6 py-16">
                        <h2 className="text-2xl font-bold mb-8">Σχετικές Υπηρεσίες & Άρθρα</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link href="/web-development" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Web Development →</h3>
                                <p className="text-sm text-muted-foreground">Custom web εφαρμογές</p>
                            </Link>
                            <Link href="/blog/ti-einai-ai-agents-epicheiriseis" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Τι είναι τα AI Agents; →</h3>
                                <p className="text-sm text-muted-foreground">Εκπαιδευτικό άρθρο</p>
                            </Link>
                            <Link href="/kataskevi-eshop" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">AI για Eshop →</h3>
                                <p className="text-sm text-muted-foreground">AI agents στο eCommerce</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6 pb-24">
                        <div className="rounded-3xl bg-primary/5 border border-primary/20 p-12 md:p-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Έτοιμοι να Αυτοματοποιήσετε την Επιχείρησή σας;</h2>
                            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
                                Κλείστε μια δωρεάν συνάντηση 30 λεπτών. Θα αναλύσουμε τις διαδικασίες σας και θα σας δείξουμε ακριβώς πώς ένα AI agent μπορεί να βελτιώσει την απόδοση της επιχείρησής σας.
                            </p>
                            <Link href="/estimate" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-bold text-xl rounded-sm hover:scale-105 transition-all">
                                Ζητήστε Demo <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
