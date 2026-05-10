import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle, ArrowRight, Globe, ShieldCheck, BarChart3, Plug } from "lucide-react";

export const metadata: Metadata = {
    title: "Κατασκευή Eshop WooCommerce | WordPress Eshop Ελλάδα | SGK",
    description: "Εξειδικευμένη κατασκευή eshop WooCommerce στην Ελλάδα. Custom themes, Greek payment gateways, ERP integrations, SEO. 18 χρόνια εμπειρία. Ζητήστε προσφορά.",
    keywords: "κατασκευή eshop woocommerce, woocommerce ελλάδα, wordpress eshop, κατασκευή woocommerce eshop, woocommerce κατασκευή",
    alternates: {
        canonical: "https://sgk.gr/kataskevi-eshop-woocommerce",
    },
    openGraph: {
        title: "Κατασκευή Eshop WooCommerce | SGK Software Development",
        description: "Custom WooCommerce eshop ανάπτυξη στην Ελλάδα. Greek payment gateways, ERP integrations, SEO-optimized.",
        url: "https://sgk.gr/kataskevi-eshop-woocommerce",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Κατασκευή Eshop WooCommerce | SGK",
        description: "Custom WooCommerce eshop ανάπτυξη. Greek payment gateways, ERP integrations.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Γιατί να επιλέξω WooCommerce για το eshop μου;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Το WooCommerce είναι η πιο δημοφιλής πλατφόρμα eshop παγκοσμίως (38% market share). Είναι open-source, εξαιρετικά ευέλικτο, και έχει μεγάλο οικοσύστημα plugins για την ελληνική αγορά (Stripe, τράπεζες, courier integrations, ΑΑΔΕ τιμολόγηση). Επιπλέον, δεν πληρώνετε μηνιαία subscription — ο κώδικας σας ανήκει."
            }
        },
        {
            "@type": "Question",
            "name": "Τι είναι τα Headless Eshops (React + WooCommerce) που κατασκευάζετε;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Κατασκευάζουμε Headless eshops νέας γενιάς. Αυτό σημαίνει ότι χρησιμοποιούμε το WooCommerce ως backend για τη διαχείριση (προϊόντα, παραγγελίες) και ένα custom React frontend για ασύγκριτη ταχύτητα, τέλειο SEO και premium εμπειρία χρήστη, χωρίς τους περιορισμούς των έτοιμων themes."
            }
        },
        {
            "@type": "Question",
            "name": "Μπορώ να μεταφέρω το υπάρχον eshop μου σε WooCommerce;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι! Αναλαμβάνουμε migration από Opencart, PrestaShop, Skroutz Easy ή οποιαδήποτε άλλη πλατφόρμα σε WooCommerce. Μεταφέρουμε προϊόντα, παραγγελίες, πελάτες και διατηρούμε το SEO ranking σας με 301 redirects."
            }
        },
        {
            "@type": "Question",
            "name": "Πόσο κοστίζει η κατασκευή WooCommerce eshop;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Η κατασκευή ενός σύγχρονου Headless WooCommerce eshop ξεκινά από €2.300. Ένα πλήρες σύστημα με custom design, payment gateways και ERP integration κοστίζει €3.500-€5.000+. Η απόδοση όμως θα υπερκαλύψει γρήγορα την αρχική επένδυση."
            }
        },
        {
            "@type": "Question",
            "name": "Υποστηρίζετε ελληνικά courier στο WooCommerce;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι! Ενσωματώνουμε όλους τους ελληνικούς courier: ACS, ELTA Courier, Speedex, Geniki Taxydromiki, DHL. Αυτόματη δημιουργία αποστολής, tracking number και ενημέρωση πελάτη."
            }
        },
        {
            "@type": "Question",
            "name": "Μπορείτε να ενσωματώσετε ΑΑΔΕ τιμολόγηση στο WooCommerce;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Φυσικά! Ενσωματώνουμε myDATA (ΑΑΔΕ) για αυτόματη έκδοση τιμολογίων και αποδείξεων απευθείας από το WooCommerce. Επίσης συνεργαζόμαστε με λογισμικά τιμολόγησης όπως SoftOne, Epsilon Net και Atlantis."
            }
        }
    ]
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://sgk.gr" },
        { "@type": "ListItem", "position": 2, "name": "Κατασκευή Eshop", "item": "https://sgk.gr/kataskevi-eshop" },
        { "@type": "ListItem", "position": 3, "name": "WooCommerce", "item": "https://sgk.gr/kataskevi-eshop-woocommerce" }
    ]
};

const wooFeatures = [
    { icon: <Globe className="w-6 h-6" />, title: "Custom WordPress Themes", desc: "Μοναδικό design χωρίς έτοιμα templates — κάθε pixel σχεδιασμένο για conversion" },
    { icon: <Plug className="w-6 h-6" />, title: "Greek Payment Gateways", desc: "Alpha Bank, Piraeus, Eurobank, Stripe — πλήρης κάλυψη ελληνικής αγοράς" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "ERP & myDATA Integration", desc: "SoftOne, Epsilon Net, Atlantis — αυτόματος συγχρονισμός αποθεμάτων και τιμολογίων" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "SEO & Performance", desc: "Yoast/RankMath setup, Core Web Vitals optimization, schema markup για προϊόντα" },
];

const comparisonData = [
    { feature: "Κόστος Setup", woo: "€1.000-€3.500", custom: "€2.300+" },
    { feature: "Μηνιαίο Κόστος", woo: "€0 (hosting μόνο)", custom: "€0 (hosting μόνο)" },
    { feature: "Ταχύτητα / Απόδοση", woo: "★★★★☆", custom: "★★★★★ (Core Web Vitals 95+)" },
    { feature: "Ευελιξία / Design", woo: "★★★★☆", custom: "★★★★★ (Απεριόριστες επιλογές)" },
    { feature: "Ελληνική Αγορά", woo: "★★★★★", custom: "★★★★★" },
    { feature: "Scalability", woo: "★★★★☆", custom: "★★★★★" },
];

export default function WooCommercePage() {
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
                                <li><Link href="/kataskevi-eshop" className="hover:text-primary transition-colors">Κατασκευή Eshop</Link></li>
                                <li className="text-muted-foreground/40">/</li>
                                <li className="text-foreground font-medium">WooCommerce</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
                                WooCommerce Experts
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                                Κατασκευή Eshop<br />
                                <span className="text-gradient">WooCommerce</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                                Εξειδικευμένη κατασκευή <strong className="text-foreground">WooCommerce eshop</strong> για την ελληνική αγορά. Custom themes, ελληνικά payment gateways, courier integrations, myDATA και ERP. Χωρίς μηνιαία subscription, ο κώδικας σας ανήκει.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/estimate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:scale-105 transition-all text-lg">
                                    Δωρεάν Εκτίμηση <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/kataskevi-eshop" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 font-bold rounded-sm hover:border-white/50 transition-all text-lg">
                                    Όλα τα Πακέτα Eshop
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* WooCommerce Features */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">WooCommerce για την Ελληνική Αγορά</h2>
                            <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Χτίζουμε WooCommerce eshops ειδικά διαμορφωμένα για τις ανάγκες της ελληνικής αγοράς</p>
                            <div className="grid md:grid-cols-2 gap-8">
                                {wooFeatures.map((f) => (
                                    <div key={f.title} className="p-8 rounded-2xl border border-white/10 bg-background flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{f.icon}</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                            <p className="text-muted-foreground">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">Γιατί το WooCommerce είναι η Καλύτερη Επιλογή για Ελληνικές Επιχειρήσεις</h2>
                            <div className="prose prose-invert prose-lg max-w-none prose-p:text-muted-foreground prose-headings:text-white prose-strong:text-white">
                                <p>
                                    Το <strong>WooCommerce</strong> είναι η κορυφαία πλατφόρμα eshop παγκοσμίως, με πάνω από 5 εκατομμύρια καταστήματα. Στην Ελλάδα ειδικά, είναι η ιδανική επιλογή λόγω της μεγάλης ευελιξίας που προσφέρει για τις τοπικές ανάγκες — από ελληνικά payment gateways μέχρι ενσωμάτωση με ΑΑΔΕ.
                                </p>

                                <h3>Headless React Frontend — Η Τεχνολογία των Κολοσσών</h3>
                                <p>
                                    Αντί να χρησιμοποιούμε έτοιμα, βαριά και αργά themes (όπως Flatsome, Avada, Astra) που επιλέγουν οι περισσότερες εταιρείες, εμείς πάμε την κατασκευή eshop στο επόμενο επίπεδο. <strong>Χτίζουμε το frontend του eshop σας αποκλειστικά με React</strong> (Headless architecture). Πρόκειται για την ίδια ακριβώς τεχνολογία αιχμής που χρησιμοποιούν παγκόσμιοι κολοσσοί όπως το <strong>Skroutz, το Airbnb και το Shopify</strong>. Το αποτέλεσμα; Ασύγκριτη ταχύτητα φόρτωσης (Core Web Vitals 95+), άμεση απόκριση στις ενέργειες του χρήστη (app-like feel), κορυφαίο SEO και μετατροπές που εκτοξεύονται.
                                </p>

                                <h3>Ελληνικά Payment Gateways</h3>
                                <p>
                                    Ενσωματώνουμε όλα τα ελληνικά και διεθνή payment gateways:
                                </p>
                                <ul>
                                    <li><strong>Alpha Bank, Piraeus Bank, Eurobank, NBG</strong> — Πλήρης κάλυψη ελληνικών τραπεζών</li>
                                    <li><strong>Stripe & PayPal</strong> — Για διεθνείς πωλήσεις</li>
                                    <li><strong>Αντικαταβολή</strong> — Ακόμα η πιο δημοφιλής επιλογή στην ελληνική αγορά</li>
                                </ul>

                                <h3>WooCommerce & Skroutz — Πλήρης Ενσωμάτωση</h3>
                                <p>
                                    Ενσωματώνουμε το eshop σας με το <strong>Skroutz</strong> για αυτόματο feed προϊόντων, Skroutz Smart Cart και διαχείριση παραγγελιών. Επίσης υποστηρίζουμε ενσωμάτωση με Google Shopping, Facebook Shops και Amazon Marketplace.
                                </p>

                                <h3>WooCommerce & ERP Integration</h3>
                                <p>
                                    Συνδέουμε το WooCommerce eshop σας με το ERP σύστημα που χρησιμοποιείτε: <strong>SoftOne, Epsilon Net, Entersoft, Atlantis ERP</strong>. Αυτόματος συγχρονισμός αποθεμάτων, τιμών, παραγγελιών και τιμολογίων — εξοικονομεί ώρες εργασίας καθημερινά.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Comparison Table */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">WooCommerce vs Headless React</h2>
                            <p className="text-muted-foreground text-center mb-12">Σύγκριση κλασικού WooCommerce με Headless αρχιτεκτονική</p>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-4 px-4 text-muted-foreground font-medium">Χαρακτηριστικό</th>
                                            <th className="text-center py-4 px-4 text-primary font-bold">Κλασικό WooCommerce</th>
                                            <th className="text-center py-4 px-4 text-foreground font-bold">Headless React + Woo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparisonData.map((row, idx) => (
                                            <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                                                <td className="py-4 px-4 text-muted-foreground">{row.feature}</td>
                                                <td className="py-4 px-4 text-center text-primary font-medium">{row.woo}</td>
                                                <td className="py-4 px-4 text-center text-muted-foreground font-medium">{row.custom}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="container mx-auto px-6 py-20 max-w-4xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Συχνές Ερωτήσεις — WooCommerce</h2>
                        <p className="text-muted-foreground text-center mb-16">Όλα όσα θέλετε να ξέρετε για τη κατασκευή WooCommerce eshop</p>
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
                        <h2 className="text-2xl font-bold mb-8">Σχετικές Σελίδες</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link href="/kataskevi-eshop" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Κατασκευή Eshop →</h3>
                                <p className="text-sm text-muted-foreground">Όλα τα πακέτα eshop</p>
                            </Link>
                            <Link href="/web-development" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Web Development →</h3>
                                <p className="text-sm text-muted-foreground">Custom React Eshops & Apps</p>
                            </Link>
                            <Link href="/blog/poso-kostizei-kataskevi-eshop-2025" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Κόστος Κατασκευής Eshop →</h3>
                                <p className="text-sm text-muted-foreground">Τιμές και πακέτα 2025</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6 pb-24">
                        <div className="rounded-3xl bg-primary/5 border border-primary/20 p-12 md:p-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ξεκινήστε το WooCommerce Eshop σας</h2>
                            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
                                Δωρεάν εκτίμηση σε 24 ώρες. Αναλύουμε τις ανάγκες σας και σας προτείνουμε την ιδανική WooCommerce λύση.
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
