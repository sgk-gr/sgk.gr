import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star, Palette, Zap, Search, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Κατασκευή Ιστοσελίδων | Επαγγελματικές Ιστοσελίδες Ελλάδα | SGK",
    description: "Επαγγελματική κατασκευή ιστοσελίδων στην Ελλάδα. Custom design, SEO-optimized, mobile-first. Εταιρικά websites, landing pages, WordPress. Ζητήστε προσφορά.",
    keywords: "κατασκευή ιστοσελίδων, κατασκευή ιστοσελίδας ελλάδα, κατασκευή website, επαγγελματική ιστοσελίδα, εταιρικό website, wordpress κατασκευή",
    alternates: {
        canonical: "https://sgk.gr/kataskevi-istoselidon",
    },
    openGraph: {
        title: "Κατασκευή Ιστοσελίδων | SGK Software Development",
        description: "Επαγγελματική κατασκευή ιστοσελίδων. Custom design, SEO, mobile-first. 18 χρόνια εμπειρία.",
        url: "https://sgk.gr/kataskevi-istoselidon",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Κατασκευή Ιστοσελίδων | SGK",
        description: "Επαγγελματική κατασκευή ιστοσελίδων. Custom design, SEO, mobile-first.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Πόσο κοστίζει η κατασκευή ιστοσελίδας;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Η κατασκευή επαγγελματικής ιστοσελίδας ξεκινά από €500 για βασικά business websites (5 σελίδες). Ένα πλήρες εταιρικό website με custom design κοστίζει €1.200-€3.000. Landing pages για campaigns: €400-€1.000. Σε όλες τις περιπτώσεις το SEO setup περιλαμβάνεται."
            }
        },
        {
            "@type": "Question",
            "name": "WordPress ή custom κατασκευή ιστοσελίδας;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Το WordPress είναι ιδανικό αν θέλετε να διαχειρίζεστε εύκολα το περιεχόμενο μόνοι σας. Μια custom κατασκευή με Next.js/React είναι πιο γρήγορη (Core Web Vitals 95+) και ασφαλής. Για εταιρικά sites που δεν ενημερώνονται συχνά, η custom λύση κερδίζει. Για blogs και sites με πολύ content, το WordPress."
            }
        },
        {
            "@type": "Question",
            "name": "Περιλαμβάνεται hosting και domain;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Η κατασκευή ιστοσελίδας δεν περιλαμβάνει αυτόματα hosting και domain, αλλά μπορούμε να τα διαχειριστούμε εμείς για εσάς. Προτείνουμε Vercel ή Cloudflare Pages για στατικά sites (δωρεάν tier), ή managed WordPress hosting για WordPress sites (€5-20/μήνα)."
            }
        },
        {
            "@type": "Question",
            "name": "Πόσο χρόνο παίρνει η κατασκευή ιστοσελίδας;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ένα βασικό business website παραδίδεται σε 1-2 εβδομάδες. Ένα πλήρες εταιρικό website με custom design και πολλές σελίδες χρειάζεται 3-5 εβδομάδες. Landing pages μπορούν να παραδοθούν σε 3-5 ημέρες."
            }
        },
        {
            "@type": "Question",
            "name": "Προσφέρετε υπηρεσίες SEO;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Κάθε ιστοσελίδα που κατασκευάζουμε είναι on-page SEO optimized: proper heading structure, meta tags, schema markup, sitemap, canonical URLs, Core Web Vitals 95+. Για ongoing SEO (link building, content strategy) προσφέρουμε ξεχωριστά πακέτα SEO υπηρεσιών."
            }
        }
    ]
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://sgk.gr" },
        { "@type": "ListItem", "position": 2, "name": "Κατασκευή Ιστοσελίδων", "item": "https://sgk.gr/kataskevi-istoselidon" }
    ]
};

const websiteTypes = [
    { icon: <Star className="w-6 h-6" />, title: "Εταιρικά Websites", price: "από €1.200", features: ["Custom design", "5-15 σελίδες", "SEO setup", "Contact forms", "Google Analytics"] },
    { icon: <Zap className="w-6 h-6" />, title: "Landing Pages", price: "από €400", features: ["Conversion-focused", "A/B testing ready", "Fast loading", "Lead capture", "CTA optimization"] },
    { icon: <Search className="w-6 h-6" />, title: "WordPress Websites", price: "από €1.000", features: ["Custom theme", "Blog/CMS", "SEO plugins setup", "Easy management", "Plugin integrations"] },
    { icon: <Palette className="w-6 h-6" />, title: "Portfolio Websites", price: "από €600", features: ["Stunning gallery", "Project showcase", "Contact integration", "Mobile-first", "Social links"] },
];

export default function KataskevIstoselidonPage() {
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
                                <li className="text-foreground font-medium">Κατασκευή Ιστοσελίδων</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
                                Web Design & Development
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                                Κατασκευή<br />
                                <span className="text-gradient">Ιστοσελίδων</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                                Επαγγελματική <strong className="text-foreground">κατασκευή ιστοσελίδων</strong> που εντυπωσιάζουν, πείθουν και μετατρέπουν. Custom design, SEO-ready, mobile-first websites για κάθε ελληνική επιχείρηση. Χωρίς έτοιμα templates.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/estimate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:scale-105 transition-all text-lg">
                                    Δωρεάν Εκτίμηση <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/web-development" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 font-bold rounded-sm hover:border-white/50 transition-all text-lg">
                                    Web Development
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Website Types */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Τύποι Ιστοσελίδων</h2>
                            <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Κατασκευάζουμε κάθε είδος ιστοσελίδας με το ίδιο επίπεδο αριστείας</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {websiteTypes.map((type) => (
                                    <div key={type.title} className="p-6 rounded-2xl border border-white/10 bg-background flex flex-col">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">{type.icon}</div>
                                        <h3 className="text-lg font-bold mb-1">{type.title}</h3>
                                        <p className="text-primary font-bold mb-4">{type.price}</p>
                                        <ul className="space-y-2 flex-1">
                                            {type.features.map((f) => (
                                                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/estimate" className="mt-6 w-full text-center py-2.5 px-4 border border-white/20 hover:border-primary/40 font-medium text-sm rounded-sm transition-all">
                                            Ζητήστε Προσφορά
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">Τι Κάνει μια Ιστοσελίδα Επιτυχημένη;</h2>
                            <div className="prose prose-invert prose-lg max-w-none prose-p:text-muted-foreground prose-headings:text-white prose-strong:text-white">
                                <p>
                                    Στην SGK Software Development, πιστεύουμε ότι μια <strong>επαγγελματική ιστοσελίδα</strong> δεν είναι απλώς μια "online παρουσία" — είναι ο πιο σημαντικός πωλητής σας. Λειτουργεί 24/7, αντιπροσωπεύει την εταιρεία σας στους υποψήφιους πελάτες και μπορεί να μετατρέψει έναν άγνωστο επισκέπτη σε πελάτη.
                                </p>

                                <h3>Design που Εντυπωσιάζει</h3>
                                <p>
                                    Δεν χρησιμοποιούμε έτοιμα templates. Κάθε ιστοσελίδα σχεδιάζεται από μηδέν, με <strong>custom UI/UX design</strong> που αντικατοπτρίζει την ταυτότητα της επιχείρησής σας. Χρησιμοποιούμε σύγχρονες αρχές design: λευκό space, readable typography, strategic CTAs και visual hierarchy.
                                </p>

                                <h3>SEO από την Πρώτη Ημέρα</h3>
                                <p>
                                    Κάθε ιστοσελίδα που κατασκευάζουμε είναι <strong>πλήρως SEO optimized</strong>: σωστή H1/H2/H3 ιεραρχία, meta tags, schema markup (Organization, LocalBusiness, WebSite), XML sitemap, canonical URLs, και Core Web Vitals 95+. Η Google αγαπά τα sites μας.
                                </p>

                                <h3>Mobile-First Design</h3>
                                <p>
                                    Πάνω από το <strong>65% των επισκέψεων</strong> στα περισσότερα ελληνικά business websites γίνεται από κινητά. Σχεδιάζουμε πρώτα για mobile και μετά προσαρμόζουμε για desktop — ακριβώς το αντίθετο από τις παλιές methods.
                                </p>

                                <h3>Απίστευτη Ταχύτητα</h3>
                                <p>
                                    Η Google επιβραβεύει τα γρήγορα sites. Τα websites που κατασκευάζουμε επιτυγχάνουν <strong>95+ Google PageSpeed score</strong> με βελτιστοποιημένες εικόνες, lazy loading, και minimal JavaScript. Αποτέλεσμα: καλύτερο SEO και χαμηλότερο bounce rate.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features list */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Τι Περιλαμβάνεται σε Κάθε Ιστοσελίδα</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Custom design — χωρίς έτοιμα templates",
                                    "Mobile-first responsive layout",
                                    "Core Web Vitals 90+ score",
                                    "On-page SEO (meta tags, schema, sitemap)",
                                    "SSL certificate & HTTPS",
                                    "Google Analytics 4 setup",
                                    "Contact forms με email notifications",
                                    "Social media integration",
                                    "GDPR cookie consent",
                                    "Εκπαίδευση χρήσης",
                                    "1 μήνας δωρεάν support",
                                    "Παράδοση source code",
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 p-4 rounded-xl border border-white/5">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="container mx-auto px-6 py-20 max-w-4xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Συχνές Ερωτήσεις</h2>
                        <p className="text-muted-foreground text-center mb-16">Απαντάμε σε όλες τις ερωτήσεις σας για την κατασκευή ιστοσελίδας</p>
                        <div className="space-y-6">
                            {faqSchema.mainEntity.map((faq, idx) => (
                                <div key={idx} className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
                                    <h3 className="text-xl font-bold mb-4">{faq.name}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{faq.acceptedAnswer.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Internal Links */}
                    <section className="container mx-auto px-6 pb-16">
                        <h2 className="text-2xl font-bold mb-8">Σχετικές Υπηρεσίες</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/kataskevi-eshop" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Κατασκευή Eshop →</h3>
                                <p className="text-sm text-muted-foreground">Ηλεκτρονικό εμπόριο</p>
                            </Link>
                            <Link href="/web-development" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Web Development →</h3>
                                <p className="text-sm text-muted-foreground">Custom web εφαρμογές</p>
                            </Link>
                            <Link href="/ai-agents" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">AI Agents →</h3>
                                <p className="text-sm text-muted-foreground">AI αυτοματισμοί</p>
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
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ξεκινήστε την Ιστοσελίδα σας</h2>
                            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
                                Δωρεάν εκτίμηση σε 24 ώρες. Περιγράψτε μας τις ανάγκες σας και θα σας προτείνουμε την κατάλληλη λύση.
                            </p>
                            <Link href="/estimate" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-bold text-xl rounded-sm hover:scale-105 transition-all">
                                Ζητήστε Δωρεάν Εκτίμηση <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
