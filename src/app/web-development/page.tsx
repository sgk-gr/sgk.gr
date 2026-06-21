import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Code2, Layers, Smartphone, Globe, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Web development Ελλάδα | Custom web εφαρμογές | SGK Software",
    description: "Επαγγελματικό web development στην Ελλάδα. Custom web εφαρμογές, React/Next.js, Node.js, APIs. 18 χρόνια εμπειρία, 100+ projects. Ζητήστε προσφορά.",
    keywords: "web development ελλάδα, κατασκευή web εφαρμογών, react next.js ελλάδα, custom web development, software development αθήνα, web app development",
    alternates: {
        canonical: "https://sgk.gr/web-development",
    },
    openGraph: {
        title: "Web development Ελλάδα | SGK Software Development",
        description: "Custom web εφαρμογές με React/Next.js. 18 χρόνια εμπειρία, 100+ projects στην Ελλάδα.",
        url: "https://sgk.gr/web-development",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Web development Ελλάδα | SGK",
        description: "Custom web εφαρμογές, React/Next.js. 18 χρόνια εμπειρία.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Τι τεχνολογίες χρησιμοποιείτε για web development;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Χρησιμοποιούμε τις πιο σύγχρονες τεχνολογίες: React & Next.js για frontend, Node.js & Python για backend, PostgreSQL & MongoDB για databases, Docker & Kubernetes για deployment, AWS & Vercel για hosting. Επιλέγουμε το κατάλληλο tech stack για κάθε project."
            }
        },
        {
            "@type": "Question",
            "name": "Πόσο κοστίζει ένα custom web project;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Το κόστος εξαρτάται από την πολυπλοκότητα. Ένα βασικό εταιρικό website κοστίζει €1.000-€2.000. Μια custom web εφαρμογή (dashboard, platform, SaaS) κοστίζει €3.000-€20.000+. Enterprise λύσεις (telecom platforms, ERP systems) ξεκινούν από €15.000."
            }
        },
        {
            "@type": "Question",
            "name": "Πόσο χρόνο παίρνει η ανάπτυξη web εφαρμογής;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ένα εταιρικό website παραδίδεται σε 2-4 εβδομάδες. Μια custom web εφαρμογή χρειάζεται 4-12 εβδομάδες. Μεγάλα enterprise projects μπορεί να διαρκέσουν 3-6+ μήνες. Χρησιμοποιούμε agile methodology με τακτικά check-ins."
            }
        },
        {
            "@type": "Question",
            "name": "Κάνετε και mobile app development;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι! Αναπτύσσουμε cross-platform mobile apps με React Native που τρέχουν σε iOS και Android από μια κοινή codebase. Επίσης κατασκευάζουμε Progressive Web Apps (PWA) που προσφέρουν native-like εμπειρία στο browser."
            }
        },
        {
            "@type": "Question",
            "name": "Αναλαμβάνετε maintenance υπαρχόντων projects;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Φυσικά! Αναλαμβάνουμε maintenance, bugfixes, new features και performance optimization σε υπάρχοντα web projects, ανεξαρτήτως τεχνολογίας. Έχουμε πείρα σε legacy code migration και modernization."
            }
        }
    ]
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://sgk.gr" },
        { "@type": "ListItem", "position": 2, "name": "Web Development", "item": "https://sgk.gr/web-development" }
    ]
};

const stack = [
    { category: "Frontend", technologies: ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion"] },
    { category: "Backend", technologies: ["Node.js", "Python", "FastAPI", "Express", "GraphQL"] },
    { category: "Database", technologies: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Firebase"] },
    { category: "DevOps", technologies: ["Docker", "AWS", "Vercel", "Cloudflare", "GitHub Actions"] },
];

const services = [
    { icon: <Globe className="w-6 h-6" />, title: "Εταιρικά websites", desc: "Premium websites που αντιπροσωπεύουν σωστά την εταιρεία σας. SEO-ready, ultra-fast, mobile-first." },
    { icon: <Layers className="w-6 h-6" />, title: "Web εφαρμογές & platforms", desc: "Custom platforms, dashboards, SaaS εφαρμογές — από CRM μέχρι telecom management systems." },
    { icon: <Smartphone className="w-6 h-6" />, title: "Progressive web apps", desc: "Web εφαρμογές που λειτουργούν σαν native mobile apps — offline support, push notifications." },
    { icon: <Code2 className="w-6 h-6" />, title: "API development", desc: "RESTful & GraphQL APIs. Ενσωμάτωση με τρίτα συστήματα, ERP, payment gateways." },
    { icon: <Zap className="w-6 h-6" />, title: "Performance optimization", desc: "Speed audit και optimization για Core Web Vitals 95+. Laser-focused on LCP, CLS, FID." },
    { icon: <Shield className="w-6 h-6" />, title: "Security & compliance", desc: "GDPR compliance, penetration testing, SSL, security audits για enterprise web εφαρμογές." },
];

const portfolioItems = [
    { name: "KM-Fiber", desc: "Telecom infrastructure & workforce management platform", href: "/case-study/km-fiber" },
    { name: "REKRUA", desc: "AI-powered HR & candidate screening platform", href: "/case-study/rekrua" },
    { name: "Sigmalabs AI", desc: "Agentic AI for e-commerce operations", href: "/case-study/sigmalabs-ai" },
    { name: "SKINNERA", desc: "Business operations & loyalty platform", href: "/case-study/skinnera" },
];

export default function WebDevelopmentPage() {
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
                                <li className="text-black font-medium">Web development</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <p className="text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-4">
                                18 χρόνια εμπειρία • Αθήνα, Ελλάδα
                            </p>
                            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-black mb-6">
                                Web development<br />
                                <span className="font-normal text-[#3b5bdb]">στην Ελλάδα</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl font-light">
                                Αναπτύσσουμε <strong className="font-medium text-black">custom web εφαρμογές</strong>, platforms και eshop με τις πιο σύγχρονες τεχνολογίες. React, Next.js, Node.js — από εταιρικά websites μέχρι enterprise telecom platforms. 18 χρόνια εμπειρία, 100+ επιτυχημένα projects.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/estimate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium rounded-lg transition-all duration-300 text-lg shadow-sm">
                                    Δωρεάν εκτίμηση <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-300 text-lg shadow-sm">
                                    Δείτε το portfolio
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Services Grid */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Υπηρεσίες web development</h2>
                            <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto font-light">Πλήρες φάσμα υπηρεσιών web development για κάθε ανάγκη</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {services.map((s) => (
                                    <div key={s.title} className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm flex flex-col">
                                        <div className="w-10 h-10 text-[#3b5bdb] mb-6 flex items-center justify-center">{s.icon}</div>
                                        <h3 className="text-lg font-bold text-black mb-3">{s.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto bg-white border border-gray-250 p-8 md:p-12 rounded-xl shadow-sm">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-8">Γιατί να επιλέξετε την SGK για web development;</h2>
                            <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-black prose-headings:font-light prose-strong:text-black prose-strong:font-medium">
                                <p>
                                    Με <strong>18 χρόνια εμπειρία</strong> στο web development, η SGK Software Development έχει υλοποιήσει projects για Cosmote, Vodafone, startups και SMEs. Δεν αναπτύσσουμε απλώς "websites" — δημιουργούμε <strong>ψηφιακά προϊόντα</strong> που λύνουν πραγματικά business προβλήματα.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Σύγχρονο tech stack — καμία τεχνολογική οφειλή</h3>
                                <p>
                                    Χρησιμοποιούμε αποκλειστικά σύγχρονες τεχνολογίες: <strong>React & Next.js</strong> για ultra-fast frontends, <strong>Node.js & Python</strong> για scalable backends. Τα projects μας δεν "γηράσκουν" — χτίζονται με architecture που υποστηρίζει growth.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Performance που μετράται</h3>
                                <p>
                                    Κάθε web project παραδίδεται με <strong>Google Core Web Vitals 90+</strong>. Αυτό σημαίνει καλύτερο SEO ranking, χαμηλότερο bounce rate και καλύτερη εμπειρία χρήστη. Το performance δεν είναι afterthought — είναι πυλώνας της ανάπτυξής μας.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Enterprise experience</h3>
                                <p>
                                    Έχουμε αναπτύξει platforms για <strong>τηλεπικοινωνιακές υποδομές</strong> (fiber network management), <strong>AI-powered HR systems</strong> (REKRUA), <strong>εμπορικά AI systems</strong> (Sigmalabs) και <strong>loyalty platforms</strong> (SKINNERA). Γνωρίζουμε πώς να αντιμετωπίζουμε enterprise-level πολυπλοκότητα.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Tech stack</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Οι τεχνολογίες που χρησιμοποιούμε</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {stack.map((s) => (
                                    <div key={s.category} className="p-6 rounded-xl border border-gray-250 bg-white shadow-sm flex flex-col">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#3b5bdb] mb-4">{s.category}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {s.technologies.map((tech) => (
                                                <span key={tech} className="text-xs px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 font-medium">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Portfolio */}
                    <section className="container mx-auto px-6 py-20">
                        <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Portfolio web projects</h2>
                        <p className="text-gray-500 text-center mb-16 font-light">Μερικά από τα projects που έχουμε αναπτύξει</p>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {portfolioItems.map((item) => (
                                <Link key={item.name} href={item.href} className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                    <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-[#3b5bdb] transition-colors">{item.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                                    <span className="text-[#3b5bdb] text-sm font-semibold flex items-center gap-2">Δείτε το case study <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Συχνές ερωτήσεις — web development</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Ό,τι χρειάζεται να γνωρίζετε</p>
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
                        <h2 className="text-xl font-light text-gray-800 mb-8">Σχετικές υπηρεσίες</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/kataskevi-eshop" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Κατασκευή eshop →</h3>
                                <p className="text-xs text-gray-500">Ηλεκτρονικό εμπόριο</p>
                            </Link>
                            <Link href="/ai-agents" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">AI agents →</h3>
                                <p className="text-xs text-gray-500">AI αυτοματισμοί</p>
                            </Link>
                            <Link href="/kataskevi-istoselidon" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Κατασκευή ιστοσελίδων →</h3>
                                <p className="text-xs text-gray-500">Εταιρικά websites</p>
                            </Link>
                            <Link href="/kataskevi-eshop-woocommerce" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">WooCommerce →</h3>
                                <p className="text-xs text-gray-500">WordPress eshop</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6">
                        <div className="rounded-2xl bg-[#3b5bdb] p-12 md:p-20 text-center text-white shadow-lg">
                            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">Ξεκινήστε το project σας</h2>
                            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-light">
                                Περιγράψτε μας το project σας και σε 24 ώρες θα σας στείλουμε πλήρη τεχνική πρόταση και κόστος.
                            </p>
                            <Link href="/estimate" className="inline-flex items-center gap-3 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-lg rounded-lg transition-all duration-300 shadow-md">
                                Δωρεάν εκτίμηση <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
