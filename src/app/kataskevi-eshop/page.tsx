import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle, ArrowRight, Star, Zap, ShoppingCart, TrendingUp, Headphones, Code2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Κατασκευή eshop | Επαγγελματικά ηλεκτρονικά καταστήματα | SGK",
    description: "Κατασκευή eshop από εξειδικευμένους developers. WooCommerce, custom React eshops με Core Web Vitals 95+. Γρήγορη παράδοση, SEO-ready, mobile-first. Ζητήστε προσφορά σήμερα.",
    keywords: "κατασκευή eshop, κατασκευή ηλεκτρονικού καταστήματος, eshop ελλάδα, woocommerce ελλάδα, custom eshop, κατασκευή online shop",
    alternates: {
        canonical: "https://sgk.gr/kataskevi-eshop",
    },
    openGraph: {
        title: "Κατασκευή eshop | SGK Software Development",
        description: "Επαγγελματική κατασκευή eshop με WooCommerce & custom React. Core Web Vitals 95+, mobile-first, SEO-ready.",
        url: "https://sgk.gr/kataskevi-eshop",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Κατασκευή eshop | SGK Software Development",
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
    { icon: <ShoppingCart className="w-6 h-6" />, title: "Mobile-first design", desc: "80% των αγορών γίνονται από κινητό — σχεδιάζουμε για αυτό" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "SEO optimized", desc: "Schema markup, sitemap, structured data σε κάθε σελίδα" },
    { icon: <Code2 className="w-6 h-6" />, title: "Custom integrations", desc: "ERP, CRM, courier, payment gateways όλα ενσωματωμένα" },
    { icon: <Star className="w-6 h-6" />, title: "Premium UX/UI", desc: "Διεθνούς επιπέδου design που αυξάνει το conversion rate" },
    { icon: <Headphones className="w-6 h-6" />, title: "24/7 support", desc: "Πάντα διαθέσιμοι για τεχνική υποστήριξη και ενημερώσεις" },
];

const packages = [
    {
        name: "Pay As You Grow",
        price: "250€ + 5%",
        subtitle: "Μηδενικό Ρίσκο — Πληρώνεις μόνο όταν πουλάς",
        features: [
            "250€ εφάπαξ (Server 1 έτος, Domain .gr 2 έτη, SSL)",
            "5% προμήθεια επί των πωλήσεων για 12 μήνες μόνο",
            "0€ προμήθεια αν δεν έχετε πωλήσεις (Zero Risk)",
            "100% δικό σας μετά τους 12 μήνες (χωρίς μηνιαία πάγια)",
            "Πρόωρη εξαγορά ανά πάσα στιγμή χωρίς καμία ρήτρα",
            "Core Web Vitals 95+ & Mobile-First σχεδίαση",
        ],
        cta: "Έναρξη Χωρίς Ρίσκο",
        href: "/pay-as-you-grow",
        highlight: true,
    },
    {
        name: "Custom WooCommerce",
        price: "από €2.300",
        subtitle: "Κλασικό Μοντέλο Ορόσημων (50% - 25% - 25%)",
        features: [
            "50% προκαταβολή, 25% στο Design, 25% στο Launch",
            "Μέχρι 2.000 προϊόντα & Custom UI/UX σχεδίαση",
            "Διασύνδεση με Ελληνικές Τράπεζες, Viva & Courier",
            "Πλήρες On-Page SEO & Schema Structured Data",
            "Εκπαίδευση διαχειριστή & 6 μήνες τεχνική υποστήριξη",
        ],
        cta: "Ζητήστε Προσφορά",
        href: "/estimate",
        highlight: false,
    },
    {
        name: "Headless Enterprise",
        price: "από €3.900",
        subtitle: "Custom Next.js Frontend + ERP Sync",
        features: [
            "Next.js React Frontend & Cloud Backend",
            "Ακαριαία ταχύτητα φόρτωσης (<0.5 δευτερόλεπτα)",
            "Αμφίδρομη διασύνδεση με ERP / CRM / Αποθήκη",
            "AI Agent προσωποποιημένων προτάσεων αγορών",
            "12 μήνες SLA Enterprise υποστήριξη 24/7",
        ],
        cta: "Enterprise Λύση",
        href: "/estimate",
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

            <div className="min-h-screen bg-white flex flex-col font-sans text-black">
                <Navbar />

                <main className="flex-grow pt-24 bg-[#f4f2ea] pb-24">
                    {/* Breadcrumbs */}
                    <div className="container mx-auto px-6 pt-4 pb-2">
                        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
                            <ol className="flex items-center gap-2">
                                <li><Link href="/" className="hover:text-black transition-colors">Αρχική</Link></li>
                                <li className="text-gray-400">/</li>
                                <li className="text-black font-medium">Κατασκευή eshop</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero Section */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <p className="text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-4">
                                eCommerce development
                            </p>
                            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-black mb-6">
                                Κατασκευή eshop<br />
                                <span className="font-normal text-[#3b5bdb]">που πουλάει</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl font-light">
                                Κατασκευάζουμε επαγγελματικά ηλεκτρονικά καταστήματα με <strong className="font-medium text-black">WooCommerce</strong> και <strong className="font-medium text-black">custom React</strong> τεχνολογία. Γρήγορα, SEO-optimized, mobile-first eshop που αυξάνουν τις πωλήσεις. 18 χρόνια εμπειρία, 50+ επιτυχημένα projects.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/estimate"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium rounded-lg transition-all duration-300 text-lg shadow-sm"
                                >
                                    Δωρεάν εκτίμηση <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/kataskevi-eshop-woocommerce"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-300 text-lg shadow-sm"
                                >
                                    WooCommerce eshop
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="border-y border-gray-250 py-12 bg-white/60">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { value: "50+", label: "Eshop παραδοθέντα" },
                                    { value: "95+", label: "Core Web Vitals score" },
                                    { value: "18", label: "Χρόνια εμπειρίας" },
                                    { value: "300%", label: "Μέση αύξηση πωλήσεων" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className="text-4xl font-bold text-[#3b5bdb] mb-2">{stat.value}</p>
                                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Main Content - SEO rich text */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto bg-white border border-gray-250 p-8 md:p-12 rounded-xl shadow-sm">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-8">Τι περιλαμβάνει η κατασκευή eshop από την SGK</h2>
                            <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-black prose-headings:font-light prose-strong:text-black prose-strong:font-medium">
                                <p>
                                    Η <strong>κατασκευή eshop</strong> είναι μια από τις πιο σημαντικές επενδύσεις για μια σύγχρονη επιχείρηση. Στην SGK Software Development, δεν φτιάχνουμε απλώς "ένα eshop" — δημιουργούμε ένα πλήρες ψηφιακό κανάλι πωλήσεων που λειτουργεί 24/7, προσελκύει οργανική κίνηση από τη Google και μετατρέπει τους επισκέπτες σε αγοραστές.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Γιατί η ταχύτητα είναι το νο.1 ζητούμενο στο eCommerce</h3>
                                <p>
                                    Έρευνες δείχνουν ότι κάθε δευτερόλεπτο καθυστέρησης μειώνει τις μετατροπές κατά 7%. Τα eshop που κατασκευάζουμε επιτυγχάνουν σκορ <strong>95+ στα Google Core Web Vitals</strong>, διασφαλίζοντας εξαιρετική εμπειρία χρήστη και υψηλότερες κατατάξεις στα αποτελέσματα αναζήτησης.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Mobile-first κατασκευή eshop</h3>
                                <p>
                                    Πάνω από το <strong>80% των online αγορών</strong> στην Ελλάδα γίνεται από κινητά τηλέφωνα. Κάθε eshop που κατασκευάζουμε σχεδιάζεται πρώτα για mobile και μετά προσαρμόζεται για desktop, διασφαλίζοντας άριστη εμπειρία σε κάθε συσκευή.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">SEO-ready από την πρώτη ημέρα</h3>
                                <p>
                                    Η <strong>κατασκευή eshop με SEO</strong> δεν είναι προαιρετική — είναι απαραίτητη. Κάθε eshop μας έρχεται με πλήρες SEO setup: structured data (Product, BreadcrumbList, Organization schema), XML sitemap, canonical tags, meta descriptions, OpenGraph tags για social sharing και optimized URLs.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Ολοκληρωμένες λύσεις πληρωμών για την ελληνική αγορά</h3>
                                <p>
                                    Ενσωματώνουμε τα κορυφαία payment gateways της ελληνικής αγοράς: <strong>Stripe, PayPal, Alpha Bank, Piraeus Bank, Eurobank</strong> και αντικαταβολή. Κάθε eshop είναι έτοιμο να δεχτεί πληρωμές από την πρώτη ημέρα λειτουργίας.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">ERP & CRM integrations</h3>
                                <p>
                                    Συνδέουμε το eshop σας με τα συστήματα που ήδη χρησιμοποιείτε: SoftOne, Entersoft, Epsilon Net, Atlantis ERP. Ο αυτόματος συγχρονισμός αποθεμάτων, τιμών και παραγγελιών εξοικονομεί ώρες εργασίας καθημερινά.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Eshop με AI δυνατότητες</h3>
                                <p>
                                    Προσθέτουμε <strong>AI-powered features</strong> που αυξάνουν τις πωλήσεις: προσωποποιημένες προτάσεις προϊόντων, intelligent search, automated email marketing και AI chatbot για εξυπηρέτηση πελατών 24/7.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Τι κάνει τα eshop μας να ξεχωρίζουν</h2>
                            <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto font-light">Κάθε eshop που κατασκευάζουμε συνδυάζει τεχνική αριστεία με εμπορική αποτελεσματικότητα</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {features.map((f) => (
                                    <div key={f.title} className="p-8 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm flex flex-col">
                                        <div className="w-10 h-10 flex items-center justify-center text-[#3b5bdb] mb-6">{f.icon}</div>
                                        <h3 className="text-lg font-bold text-black mb-3">{f.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing Packages */}
                    <section className="container mx-auto px-6 py-20">
                        <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Πακέτα κατασκευής eshop</h2>
                        <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto font-light">Επιλέξτε το πακέτο που ταιριάζει στις ανάγκες σας. Όλα τα πακέτα περιλαμβάνουν SEO setup και mobile optimization.</p>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {packages.map((pkg) => (
                                <div key={pkg.name} className={`p-8 rounded-xl border ${pkg.highlight ? 'border-[#3b5bdb] bg-[#3b5bdb] text-white shadow-lg shadow-blue-100' : 'border-gray-250 bg-white text-black shadow-sm'} flex flex-col`}>
                                    {pkg.highlight && <span className="text-[10px] font-bold uppercase tracking-wider text-white mb-2 self-start bg-blue-700 px-2 py-0.5 rounded-full">Δημοφιλέστερο (Pay As You Grow)</span>}
                                    <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
                                    {pkg.subtitle && <p className={`text-xs mb-3 ${pkg.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{pkg.subtitle}</p>}
                                    <p className={`text-3xl font-bold mb-8 ${pkg.highlight ? 'text-white' : 'text-[#3b5bdb]'}`}>{pkg.price}</p>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {pkg.features.map((f) => (
                                            <li key={f} className={`flex items-center gap-3 text-sm ${pkg.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                                                <CheckCircle className={`w-4 h-4 flex-shrink-0 ${pkg.highlight ? 'text-[#4ade80]' : 'text-[#3b5bdb]'}`} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={pkg.href || "/estimate"}
                                        className={`w-full text-center py-3 px-6 font-medium rounded-lg transition-all duration-300 text-sm ${pkg.highlight ? 'bg-[#4ade80] text-black hover:bg-[#22c55e] shadow-sm font-bold' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'}`}
                                    >
                                        {pkg.cta}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Συχνές ερωτήσεις για την κατασκευή eshop</h2>
                            <p className="text-gray-500 text-center mb-16 font-light">Ό,τι χρειάζεται να γνωρίζετε για το eshop σας</p>
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
                            <Link href="/kataskevi-eshop-woocommerce" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Κατασκευή eshop WooCommerce →</h3>
                                <p className="text-xs text-gray-500">Εξειδικευμένες λύσεις WooCommerce</p>
                            </Link>
                            <Link href="/web-development" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Web development →</h3>
                                <p className="text-xs text-gray-500">Custom web εφαρμογές & sites</p>
                            </Link>
                            <Link href="/ai-agents" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">AI agents →</h3>
                                <p className="text-xs text-gray-500">Αυτοματισμοί για το eshop σας</p>
                            </Link>
                            <Link href="/kataskevi-istoselidon" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Κατασκευή ιστοσελίδων →</h3>
                                <p className="text-xs text-gray-500">Επαγγελματικές ιστοσελίδες</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6 pt-8">
                        <div className="rounded-2xl bg-[#3b5bdb] p-12 md:p-20 text-center text-white shadow-lg">
                            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">Έτοιμοι να ξεκινήσετε το eshop σας;</h2>
                            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-light">
                                Πάρτε μια δωρεάν εκτίμηση για το eshop σας. Σε 24 ώρες σας στέλνουμε πλήρη πρόταση με τεχνικές λεπτομέρειες και κόστος.
                            </p>
                            <Link
                                href="/estimate"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-lg rounded-lg transition-all duration-300 shadow-md"
                            >
                                Ζητήστε δωρεάν εκτίμηση <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
