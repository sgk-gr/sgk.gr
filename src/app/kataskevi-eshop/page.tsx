import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle, ArrowRight, Star, Zap, ShoppingCart, TrendingUp, Headphones, Code2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Κατασκευή Eshop | Επαγγελματικά Ηλεκτρονικά Καταστήματα | SGK",
    description: "Κατασκευή eshop από εξειδικευμένους developers. WooCommerce, custom React eshops με Core Web Vitals 95+. Γρήγορη παράδοση, SEO-ready, mobile-first. Ζητήστε προσφορά σήμερα.",
    keywords: "κατασκευή eshop, κατασκευή ηλεκτρονικού καταστήματος, eshop ελλάδα, woocommerce ελλάδα, custom eshop, κατασκευή online shop",
    alternates: {
        canonical: "https://sgk.gr/kataskevi-eshop",
    },
    openGraph: {
        title: "Κατασκευή Eshop | SGK Software Development",
        description: "Επαγγελματική κατασκευή eshop με WooCommerce & custom React. Core Web Vitals 95+, mobile-first, SEO-ready.",
        url: "https://sgk.gr/kataskevi-eshop",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Κατασκευή Eshop | SGK Software Development",
        description: "Επαγγελματική κατασκευή eshop με WooCommerce & custom React. Core Web Vitals 95+.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Πόσο κοστίζει η κατασκευή eshop;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Το κόστος κατασκευής eshop στην SGK ξεκινά από €2.300 για Headless React eshops με πλήρεις ενσωματώσεις και advanced features. Η τελική τιμή εξαρτάται από τον αριθμό προϊόντων, τις ενσωματώσεις (ERP, payment gateways) και τις custom λειτουργίες που χρειάζεστε."
            }
        },
        {
            "@type": "Question",
            "name": "Πόσο χρόνο χρειάζεται η κατασκευή eshop;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ένα βασικό WooCommerce eshop παραδίδεται σε 2-3 εβδομάδες. Για custom eshop με advanced features, ο χρόνος ανάπτυξης είναι 4-8 εβδομάδες. Σε κάθε περίπτωση, σας δίνουμε ακριβές timeline πριν ξεκινήσουμε."
            }
        },
        {
            "@type": "Question",
            "name": "Ποια πλατφόρμα eshop να επιλέξω;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Η επιλογή πλατφόρμας εξαρτάται από τις ανάγκες σας. Το WooCommerce είναι ιδανικό για ελληνικές επιχειρήσεις λόγω ευελιξίας, χαμηλού κόστους και ελέγχου. Για μεγάλα καταστήματα με custom ανάγκες και έμφαση στην ταχύτητα, μια Headless React λύση (με WooCommerce backend) είναι η βέλτιστη επιλογή."
            }
        },
        {
            "@type": "Question",
            "name": "Περιλαμβάνεται SEO στην κατασκευή eshop;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι! Κάθε eshop που κατασκευάζουμε είναι πλήρως SEO-optimized: structured data, sitemap, canonical URLs, schema markup, Core Web Vitals 95+. Προσφέρουμε επίσης ongoing SEO υπηρεσίες για μεγαλύτερη ορατότητα στη Google."
            }
        },
        {
            "@type": "Question",
            "name": "Ποια payment gateways υποστηρίζετε;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Υποστηρίζουμε όλα τα κύρια payment gateways: Stripe, PayPal, Alpha Bank, Piraeus Bank, Eurobank, National Bank of Greece. Ενσωματώνουμε και αντικαταβολή (COD) για την ελληνική αγορά."
            }
        },
        {
            "@type": "Question",
            "name": "Τι γίνεται μετά την παράδοση του eshop;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Προσφέρουμε πλήρη εκπαίδευση χρήσης, τεχνική υποστήριξη και maintenance πακέτα. Μπορείτε να διαχειριστείτε μόνοι σας τα προϊόντα και τις παραγγελίες, ενώ εμείς αναλαμβάνουμε τις τεχνικές ενημερώσεις."
            }
        }
    ]
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://sgk.gr" },
        { "@type": "ListItem", "position": 2, "name": "Κατασκευή Eshop", "item": "https://sgk.gr/kataskevi-eshop" }
    ]
};

const features = [
    { icon: <Zap className="w-6 h-6" />, title: "Core Web Vitals 95+", desc: "Ταχύτητα που επιβραβεύει η Google και αγαπούν οι χρήστες" },
    { icon: <ShoppingCart className="w-6 h-6" />, title: "Mobile-First Design", desc: "80% των αγορών γίνονται από κινητό — σχεδιάζουμε για αυτό" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "SEO Optimized", desc: "Schema markup, sitemap, structured data σε κάθε σελίδα" },
    { icon: <Code2 className="w-6 h-6" />, title: "Custom Integrations", desc: "ERP, CRM, courier, payment gateways όλα ενσωματωμένα" },
    { icon: <Star className="w-6 h-6" />, title: "Premium UX/UI", desc: "Διεθνούς επιπέδου design που αυξάνει το conversion rate" },
    { icon: <Headphones className="w-6 h-6" />, title: "24/7 Support", desc: "Πάντα διαθέσιμοι για τεχνική υποστήριξη και ενημερώσεις" },
];

const packages = [
    {
        name: "Starter Eshop",
        price: "από €2.300",
        features: ["Μέχρι 1.000 προϊόντα", "Headless React + Woo", "Responsive design", "Βασικό SEO", "Payment gateways", "3 μήνες support"],
        cta: "Ξεκινήστε",
        highlight: false,
    },
    {
        name: "Pro Eshop",
        price: "από €3.500",
        features: ["Απεριόριστα προϊόντα", "Headless React + Woo", "Advanced SEO", "Όλα τα payment gateways", "ERP integration", "6 μήνες support"],
        cta: "Η Καλύτερη Επιλογή",
        highlight: true,
    },
    {
        name: "Custom Eshop",
        price: "από €4.000",
        features: ["Custom React frontend", "Headless architecture", "Core Web Vitals 98+", "AI recommendations", "Full ERP/CRM sync", "12 μήνες support"],
        cta: "Κορυφαία Λύση",
        highlight: false,
    },
];

export default function KataskevEshopPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                <main className="pt-28">
                    {/* Breadcrumbs */}
                    <div className="container mx-auto px-6 pt-4 pb-2">
                        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                            <ol className="flex items-center gap-2">
                                <li><Link href="/" className="hover:text-primary transition-colors">Αρχική</Link></li>
                                <li className="text-muted-foreground/40">/</li>
                                <li className="text-foreground font-medium">Κατασκευή Eshop</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero Section */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
                                eCommerce Development
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                                Κατασκευή Eshop<br />
                                <span className="text-gradient">που Πουλάει</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                                Κατασκευάζουμε επαγγελματικά ηλεκτρονικά καταστήματα με <strong className="text-foreground">WooCommerce</strong> και <strong className="text-foreground">custom React</strong> τεχνολογία. Γρήγορα, SEO-optimized, mobile-first eshops που αυξάνουν τις πωλήσεις. 18 χρόνια εμπειρία, 50+ επιτυχημένα projects.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/estimate"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:scale-105 transition-all text-lg"
                                >
                                    Δωρεάν Εκτίμηση <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/kataskevi-eshop-woocommerce"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-foreground font-bold rounded-sm hover:border-white/50 transition-all text-lg"
                                >
                                    WooCommerce Eshop
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="border-y border-white/5 py-12 bg-white/[0.02]">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { value: "50+", label: "Eshops παραδοθέντα" },
                                    { value: "95+", label: "Core Web Vitals Score" },
                                    { value: "18", label: "Χρόνια Εμπειρίας" },
                                    { value: "300%", label: "Μέση αύξηση πωλήσεων" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Main Content - SEO rich text */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">Τι Περιλαμβάνει η Κατασκευή Eshop από την SGK</h2>
                            <div className="prose prose-invert prose-lg max-w-none prose-p:text-muted-foreground prose-headings:text-white prose-strong:text-white">
                                <p>
                                    Η <strong>κατασκευή eshop</strong> είναι μια από τις πιο σημαντικές επενδύσεις για μια σύγχρονη επιχείρηση. Στην SGK Software Development, δεν φτιάχνουμε απλώς "ένα eshop" — δημιουργούμε ένα πλήρες ψηφιακό κανάλι πωλήσεων που λειτουργεί 24/7, προσελκύει οργανική κίνηση από τη Google και μετατρέπει τους επισκέπτες σε αγοραστές.
                                </p>

                                <h3>Γιατί η Ταχύτητα είναι το Νο.1 Ζητούμενο στο eCommerce</h3>
                                <p>
                                    Έρευνες δείχνουν ότι κάθε δευτερόλεπτο καθυστέρησης μειώνει τις μετατροπές κατά 7%. Τα eshops που κατασκευάζουμε επιτυγχάνουν σκορ <strong>95+ στα Google Core Web Vitals</strong>, διασφαλίζοντας εξαιρετική εμπειρία χρήστη και υψηλότερες κατατάξεις στα αποτελέσματα αναζήτησης.
                                </p>

                                <h3>Mobile-First Κατασκευή Eshop</h3>
                                <p>
                                    Πάνω από το <strong>80% των online αγορών</strong> στην Ελλάδα γίνεται από κινητά τηλέφωνα. Κάθε eshop που κατασκευάζουμε σχεδιάζεται πρώτα για mobile και μετά προσαρμόζεται για desktop, διασφαλίζοντας άριστη εμπειρία σε κάθε συσκευή.
                                </p>

                                <h3>SEO-Ready από την Πρώτη Ημέρα</h3>
                                <p>
                                    Η <strong>κατασκευή eshop με SEO</strong> δεν είναι προαιρετική — είναι απαραίτητη. Κάθε eshop μας έρχεται με πλήρες SEO setup: structured data (Product, BreadcrumbList, Organization schema), XML sitemap, canonical tags, meta descriptions, OpenGraph tags για social sharing και optimized URLs.
                                </p>

                                <h3>Ολοκληρωμένες Λύσεις Πληρωμών για την Ελληνική Αγορά</h3>
                                <p>
                                    Ενσωματώνουμε τα κορυφαία payment gateways της ελληνικής αγοράς: <strong>Stripe, PayPal, Alpha Bank, Piraeus Bank, Eurobank</strong> και αντικαταβολή. Κάθε eshop είναι έτοιμο να δεχτεί πληρωμές από την πρώτη ημέρα λειτουργίας.
                                </p>

                                <h3>ERP & CRM Integrations</h3>
                                <p>
                                    Συνδέουμε το eshop σας με τα συστήματα που ήδη χρησιμοποιείτε: SoftOne, Entersoft, Epsilon Net, Atlantis ERP. Αυτόματη συγχρονισμός αποθεμάτων, τιμών και παραγγελιών εξοικονομεί ώρες εργασίας καθημερινά.
                                </p>

                                <h3>Eshop με AI Δυνατότητες</h3>
                                <p>
                                    Προσθέτουμε <strong>AI-powered features</strong> που αυξάνουν τις πωλήσεις: προσωποποιημένες προτάσεις προϊόντων, intelligent search, automated email marketing και AI chatbot για εξυπηρέτηση πελατών 24/7.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Τι Κάνει τα Eshops μας Ξεχωριστά</h2>
                            <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Κάθε eshop που κατασκευάζουμε συνδυάζει τεχνική αριστεία με εμπορική αποτελεσματικότητα</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {features.map((f) => (
                                    <div key={f.title} className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-primary/30 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">{f.icon}</div>
                                        <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                        <p className="text-muted-foreground">{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing Packages */}
                    <section className="container mx-auto px-6 py-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Πακέτα Κατασκευής Eshop</h2>
                        <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Επιλέξτε το πακέτο που ταιριάζει στις ανάγκες σας. Όλα τα πακέτα περιλαμβάνουν SEO setup και mobile optimization.</p>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {packages.map((pkg) => (
                                <div key={pkg.name} className={`p-8 rounded-2xl border ${pkg.highlight ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/[0.03]'} flex flex-col`}>
                                    {pkg.highlight && <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Δημοφιλέστερο</span>}
                                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                    <p className="text-3xl font-bold text-primary mb-8">{pkg.price}</p>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {pkg.features.map((f) => (
                                            <li key={f} className="flex items-center gap-3 text-muted-foreground">
                                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/estimate"
                                        className={`w-full text-center py-3 px-6 font-bold rounded-sm transition-all ${pkg.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-white/20 hover:border-white/50'}`}
                                    >
                                        {pkg.cta}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="bg-white/[0.02] border-y border-white/5 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Συχνές Ερωτήσεις για την Κατασκευή Eshop</h2>
                            <p className="text-muted-foreground text-center mb-16">Οτιδήποτε θέλετε να ξέρετε για το eshop σας</p>
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
                            <Link href="/kataskevi-eshop-woocommerce" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Κατασκευή Eshop WooCommerce →</h3>
                                <p className="text-sm text-muted-foreground">Εξειδικευμένες λύσεις WooCommerce</p>
                            </Link>
                            <Link href="/web-development" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Web Development →</h3>
                                <p className="text-sm text-muted-foreground">Custom web εφαρμογές & sites</p>
                            </Link>
                            <Link href="/ai-agents" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">AI Agents →</h3>
                                <p className="text-sm text-muted-foreground">Αυτοματισμοί για το eshop σας</p>
                            </Link>
                            <Link href="/kataskevi-istoselidon" className="p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group">
                                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Κατασκευή Ιστοσελίδων →</h3>
                                <p className="text-sm text-muted-foreground">Επαγγελματικές ιστοσελίδες</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6 pb-24">
                        <div className="rounded-3xl bg-primary/5 border border-primary/20 p-12 md:p-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Έτοιμοι να Ξεκινήσετε το Eshop σας;</h2>
                            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
                                Πάρτε μια δωρεάν εκτίμηση για το eshop σας. Σε 24 ώρες σας στέλνουμε πλήρη πρόταση με τεχνικές λεπτομέρειες και κόστος.
                            </p>
                            <Link
                                href="/estimate"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-bold text-xl rounded-sm hover:scale-105 transition-all"
                            >
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
