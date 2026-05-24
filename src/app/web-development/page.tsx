import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Code2, Layers, Smartphone, Globe, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Web Development Ελλάδα | Custom Web Εφαρμογές | SGK Software",
    description: "Επαγγελματικό web development στην Ελλάδα. Custom web εφαρμογές, React/Next.js, Node.js, APIs. 18 χρόνια εμπειρία, 100+ projects. Ζητήστε προσφορά.",
    keywords: "web development ελλάδα, κατασκευή web εφαρμογών, react next.js ελλάδα, custom web development, software development αθήνα, web app development",
    alternates: {
        canonical: "https://sgk.gr/web-development",
    },
    openGraph: {
        title: "Web Development Ελλάδα | SGK Software Development",
        description: "Custom web εφαρμογές με React/Next.js. 18 χρόνια εμπειρία, 100+ projects στην Ελλάδα.",
        url: "https://sgk.gr/web-development",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Web Development Ελλάδα | SGK",
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
    { icon: <Globe className="w-6 h-6" />, title: "Εταιρικά Websites", desc: "Premium websites που αντιπροσωπεύουν σωστά την εταιρεία σας. SEO-ready, ultra-fast, mobile-first." },
    { icon: <Layers className="w-6 h-6" />, title: "Web Εφαρμογές & Platforms", desc: "Custom platforms, dashboards, SaaS εφαρμογές — από CRM μέχρι telecom management systems." },
    { icon: <Smartphone className="w-6 h-6" />, title: "Progressive Web Apps", desc: "Web εφαρμογές που λειτουργούν σαν native mobile apps — offline support, push notifications." },
    { icon: <Code2 className="w-6 h-6" />, title: "API Development", desc: "RESTful & GraphQL APIs. Ενσωμάτωση με τρίτα συστήματα, ERP, payment gateways." },
    { icon: <Zap className="w-6 h-6" />, title: "Performance Optimization", desc: "Speed audit και optimization για Core Web Vitals 95+. Laser-focused on LCP, CLS, FID." },
    { icon: <Shield className="w-6 h-6" />, title: "Security & Compliance", desc: "GDPR compliance, penetration testing, SSL, security audits για enterprise web εφαρμογές." },
];

const portfolioItems = [
    { name: "KM-Fiber", desc: "Telecom Infrastructure & Workforce Management Platform", href: "/case-study/km-fiber" },
    { name: "REKRUA", desc: "AI-Powered HR & Candidate Screening Platform", href: "/case-study/rekrua" },
    { name: "Sigmalabs AI", desc: "Agentic AI for E-commerce Operations", href: "/case-study/sigmalabs-ai" },
    { name: "SKINNERA", desc: "Business Operations & Loyalty Platform", href: "/case-study/skinnera" },
];

export default function WebDevelopmentPage() {
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
                                <li className="text-foreground font-medium">Web Development</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <p className="text-primary font-heading text-xs tracking-[0.2em] uppercase mb-4">
                                18 Χρόνια Εμπειρία • Αθήνα, Ελλάδα
                            </p>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                                Web Development<br />
                                <span className="text-gradient">Ελλάδα</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                                Αναπτύσσουμε <strong className="text-foreground">custom web εφαρμογές</strong>, platforms και eshops με τις πιο σύγχρονες τεχνολογίες. React, Next.js, Node.js — από εταιρικά websites μέχρι enterprise telecom platforms. 18 χρόνια εμπειρία, 100+ επιτυχημένα projects.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/estimate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:scale-105 transition-all text-lg">
                                    Δωρεάν Εκτίμηση <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/#portfolio" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 font-bold rounded-sm hover:border-white/50 transition-all text-lg">
                                    Δείτε Portfolio
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Services Grid */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Web Development Υπηρεσίες</h2>
                            <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Πλήρης φάσμα υπηρεσιών web development για κάθε ανάγκη</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {services.map((s) => (
                                    <div key={s.title} className="p-8 rounded-2xl border border-white/10 bg-background hover:border-primary/30 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">{s.icon}</div>
                                        <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                                        <p className="text-muted-foreground">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">Γιατί να Επιλέξετε την SGK για Web Development;</h2>
                            <div className="prose prose-invert prose-lg max-w-none prose-p:text-muted-foreground prose-headings:text-white prose-strong:text-white">
                                <p>
                                    Με <strong>18 χρόνια εμπειρία</strong> στο web development, η SGK Software Development έχει υλοποιήσει projects για Cosmote, Vodafone, startups και SMEs. Δεν αναπτύσσουμε απλώς "websites" — δημιουργούμε <strong>ψηφιακά προϊόντα</strong> που λύνουν πραγματικά business προβλήματα.
                                </p>

                                <h3>Σύγχρονο Tech Stack — Καμία Τεχνολογική Οφειλή</h3>
                                <p>
                                    Χρησιμοποιούμε αποκλειστικά σύγχρονες τεχνολογίες: <strong>React & Next.js</strong> για ultra-fast frontends, <strong>Node.js & Python</strong> για scalable backends. Τα projects μας δεν "γηράσκουν" — χτίζονται με architecture που υποστηρίζει growth.
                                </p>

                                <h3>Performance που Μετράται</h3>
                                <p>
                                    Κάθε web project παραδίδεται με <strong>Google Core Web Vitals 90+</strong>. Αυτό σημαίνει καλύτερο SEO ranking, χαμηλότερο bounce rate και καλύτερη εμπειρία χρήστη. Το performance δεν είναι afterthought — είναι πυλώνας της ανάπτυξής μας.
                                </p>

                                <h3>Enterprise Experience</h3>
                                <p>
                                    Έχουμε αναπτύξει platforms για <strong>τηλεπικοινωνιακές υποδομές</strong> (fiber network management), <strong>AI-powered HR systems</strong> (REKRUA), <strong>εμπορικά AI systems</strong> (Sigmalabs) και <strong>loyalty platforms</strong> (SKINNERA). Ξέρουμε να αντιμετωπίζουμε enterprise-level πολυπλοκότητα.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Tech Stack</h2>
                            <p className="text-muted-foreground text-center mb-16">Οι τεχνολογίες που χρησιμοποιούμε</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {stack.map((s) => (
                                    <div key={s.category} className="p-6 rounded-2xl border border-white/10 bg-background">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{s.category}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {s.technologies.map((tech) => (
                                                <span key={tech} className="text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Portfolio */}
                    <section className="container mx-auto px-6 py-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Portfolio Web Projects</h2>
                        <p className="text-muted-foreground text-center mb-16">Μερικά από τα projects που έχουμε αναπτύξει</p>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {portfolioItems.map((item) => (
                                <Link key={item.name} href={item.href} className="p-8 rounded-2xl border border-white/10 hover:border-primary/30 transition-colors group">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-muted-foreground mb-4">{item.desc}</p>
                                    <span className="text-primary text-sm font-bold flex items-center gap-2">Δείτε Case Study <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Συχνές Ερωτήσεις — Web Development</h2>
                            <p className="text-muted-foreground text-center mb-16">Ό,τι χρειάζεστε να ξέρετε</p>
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
                        <h2 className="text-2xl font-bold mb-8">Σχετικές Υπηρεσίες</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/kataskevi-eshop" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Κατασκευή Eshop →</h3>
                                <p className="text-sm text-muted-foreground">Ηλεκτρονικό εμπόριο</p>
                            </Link>
                            <Link href="/ai-agents" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">AI Agents →</h3>
                                <p className="text-sm text-muted-foreground">AI αυτοματισμοί</p>
                            </Link>
                            <Link href="/kataskevi-istoselidon" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Κατασκευή Ιστοσελίδων →</h3>
                                <p className="text-sm text-muted-foreground">Εταιρικά websites</p>
                            </Link>
                            <Link href="/kataskevi-eshop-woocommerce" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">WooCommerce →</h3>
                                <p className="text-sm text-muted-foreground">WordPress eshop</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6 pb-24">
                        <div className="rounded-3xl bg-primary/5 border border-primary/20 p-12 md:p-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ξεκινήστε το Project σας</h2>
                            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
                                Περιγράψτε μας το project σας και σε 24 ώρες θα σας στείλουμε πλήρη τεχνική πρόταση και κόστος.
                            </p>
                            <Link href="/estimate" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-bold text-xl rounded-sm hover:scale-105 transition-all">
                                Δωρεάν Εκτίμηση <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
