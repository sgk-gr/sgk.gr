import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle, ArrowRight, Globe, ShieldCheck, BarChart3, Plug } from "lucide-react";

export const metadata: Metadata = {
    title: "Κατασκευή eshop WooCommerce | WordPress eshop Ελλάδα | SGK",
    description: "Εξειδικευμένη κατασκευή eshop WooCommerce στην Ελλάδα. Custom themes, Greek payment gateways, ERP integrations, SEO. 18 χρόνια εμπειρία. Ζητήστε προσφορά.",
    keywords: "κατασκευή eshop woocommerce, woocommerce ελλάδα, wordpress eshop, κατασκευή woocommerce eshop, woocommerce κατασκευή",
    alternates: {
        canonical: "https://sgk.gr/kataskevi-eshop-woocommerce",
    },
    openGraph: {
        title: "Κατασκευή eshop WooCommerce | SGK Software Development",
        description: "Custom WooCommerce eshop ανάπτυξη στην Ελλάδα. Greek payment gateways, ERP integrations, SEO-optimized.",
        url: "https://sgk.gr/kataskevi-eshop-woocommerce",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Κατασκευή eshop WooCommerce | SGK",
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
    { icon: <Globe className="w-6 h-6" />, title: "Custom WordPress themes", desc: "Μοναδικό design χωρίς έτοιμα templates — κάθε pixel σχεδιασμένο για conversion" },
    { icon: <Plug className="w-6 h-6" />, title: "Greek payment gateways", desc: "Alpha Bank, Piraeus, Eurobank, Stripe — πλήρης κάλυψη ελληνικής αγοράς" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "ERP & myDATA integration", desc: "SoftOne, Epsilon Net, Atlantis — αυτόματος συγχρονισμός αποθεμάτων και τιμολογίων" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "SEO & performance", desc: "Yoast/RankMath setup, Core Web Vitals optimization, schema markup για προϊόντα" },
];

const comparisonData = [
    { feature: "Κόστος setup", woo: "€1.000-€3.500", custom: "€2.300+" },
    { feature: "Μηνιαίο κόστος", woo: "€0 (hosting μόνο)", custom: "€0 (hosting μόνο)" },
    { feature: "Ταχύτητα / απόδοση", woo: "★★★★☆", custom: "★★★★★ (Core Web Vitals 95+)" },
    { feature: "Ευελιξία / design", woo: "★★★★☆", custom: "★★★★★ (Απεριόριστες επιλογές)" },
    { feature: "Ελληνική αγορά", woo: "★★★★★", custom: "★★★★★" },
    { feature: "Scalability", woo: "★★★★☆", custom: "★★★★★" },
];

export default function WooCommercePage() {
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
                                <li><Link href="/kataskevi-eshop" className="hover:text-black transition-colors">Κατασκευή eshop</Link></li>
                                <li className="text-gray-400">/</li>
                                <li className="text-black font-medium">WooCommerce</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Hero */}
                    <section className="container mx-auto px-6 py-16 md:py-24">
                        <div className="max-w-4xl">
                            <p className="text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-4">
                                WooCommerce experts
                            </p>
                            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-black mb-6">
                                Κατασκευή eshop<br />
                                <span className="font-normal text-[#3b5bdb]">WooCommerce</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl font-light">
                                Εξειδικευμένη κατασκευή <strong className="font-medium text-black">WooCommerce eshop</strong> για την ελληνική αγορά. Custom themes, ελληνικά payment gateways, courier integrations, myDATA και ERP. Χωρίς μηνιαία subscription, ο κώδικας σας ανήκει.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/estimate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium rounded-lg transition-all duration-300 text-lg shadow-sm">
                                    Δωρεάν εκτίμηση <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/kataskevi-eshop" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-300 text-lg shadow-sm">
                                    Όλα τα πακέτα eshop
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* WooCommerce Features */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">WooCommerce για την ελληνική αγορά</h2>
                            <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto font-light">Χτίζουμε WooCommerce eshop ειδικά διαμορφωμένα για τις ανάγκες της ελληνικής αγοράς</p>
                            <div className="grid md:grid-cols-2 gap-8">
                                {wooFeatures.map((f) => (
                                    <div key={f.title} className="p-8 rounded-xl border border-gray-250 bg-white shadow-sm flex gap-6">
                                        <div className="w-12 h-12 text-[#3b5bdb] flex-shrink-0 flex items-center justify-center">{f.icon}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-black mb-3">{f.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="container mx-auto px-6 py-20">
                        <div className="max-w-4xl mx-auto bg-white border border-gray-250 p-8 md:p-12 rounded-xl shadow-sm">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-8">Γιατί το WooCommerce είναι η καλύτερη επιλογή για ελληνικές επιχειρήσεις</h2>
                            <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-black prose-headings:font-light prose-strong:text-black prose-strong:font-medium">
                                <p>
                                    Το <strong>WooCommerce</strong> είναι η κορυφαία πλατφόρμα eshop παγκοσμίως, με πάνω από 5 εκατομμύρια καταστήματα. Στην Ελλάδα ειδικά, είναι η ιδανική επιλογή λόγω της μεγάλης ευελιξίας που προσφέρει για τις τοπικές ανάγκες — από ελληνικά payment gateways μέχρι ενσωμάτωση με ΑΑΔΕ.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Headless React frontend — η τεχνολογία των κολοσσών</h3>
                                <p>
                                    Αντί να χρησιμοποιούμε έτοιμα, βαριά και αργά themes (όπως Flatsome, Avada, Astra) που επιλέγουν οι περισσότερες εταιρείες, εμείς πάμε την κατασκευή eshop στο επόμενο επίπεδο. <strong>Χτίζουμε το frontend του eshop σας αποκλειστικά με React</strong> (Headless architecture). Πρόκειται για την ίδια ακριβώς τεχνολογία αιχμής που χρησιμοποιούν παγκόσμιοι κολοσσοί όπως το <strong>Skroutz, το Airbnb και το Shopify</strong>. Το αποτέλεσμα; Ασύγκριτη ταχύτητα φόρτωσης (Core Web Vitals 95+), άμεση απόκριση στις ενέργειες του χρήστη (app-like feel), κορυφαίο SEO και μετατροπές που εκτοξεύονται.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">Ελληνικά payment gateways</h3>
                                <p>
                                    Ενσωματώνουμε όλα τα ελληνικά και διεθνή payment gateways:
                                </p>
                                <ul className="list-disc pl-6 space-y-1 my-4">
                                    <li><strong>Alpha Bank, Piraeus Bank, Eurobank, NBG</strong> — Πλήρης κάλυψη ελληνικών τραπεζών</li>
                                    <li><strong>Stripe & PayPal</strong> — Για διεθνείς πωλήσεις</li>
                                    <li><strong>Αντικαταβολή</strong> — Ακόμα η πιο δημοφιλής επιλογή στην ελληνική αγορά</li>
                                </ul>

                                <h3 className="text-2xl mt-8 mb-4">WooCommerce & Skroutz — πλήρης ενσωμάτωση</h3>
                                <p>
                                    Ενσωματώνουμε το eshop σας με το <strong>Skroutz</strong> για αυτόματο feed προϊόντων, Skroutz Smart Cart και διαχείριση παραγγελιών. Επίσης υποστηρίζουμε ενσωμάτωση με Google Shopping, Facebook Shops και Amazon Marketplace.
                                </p>

                                <h3 className="text-2xl mt-8 mb-4">WooCommerce & ERP integration</h3>
                                <p>
                                    Συνδέουμε το WooCommerce eshop σας με το ERP σύστημα που χρησιμοποιείτε: <strong>SoftOne, Epsilon Net, Entersoft, Atlantis ERP</strong>. Ο αυτόματος συγχρονισμός αποθεμάτων, τιμών, παραγγελιών και τιμολογίων εξοικονομεί ώρες εργασίας καθημερινά.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Comparison Table */}
                    <section className="bg-white/40 border-y border-gray-250 py-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">WooCommerce vs Headless React</h2>
                            <p className="text-gray-500 text-center mb-12 font-light">Σύγκριση κλασικού WooCommerce με Headless αρχιτεκτονική</p>
                            <div className="bg-white border border-gray-250 rounded-xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <th className="text-left py-4 px-6 text-gray-500 font-medium text-sm">Χαρακτηριστικό</th>
                                                <th className="text-center py-4 px-6 text-[#3b5bdb] font-bold text-sm">Κλασικό WooCommerce</th>
                                                <th className="text-center py-4 px-6 text-black font-bold text-sm">Headless React + Woo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonData.map((row, idx) => (
                                                <tr key={idx} className="border-b border-gray-150 hover:bg-gray-50/50">
                                                    <td className="py-4 px-6 text-gray-700 text-sm">{row.feature}</td>
                                                    <td className="py-4 px-6 text-center text-[#3b5bdb] font-medium text-sm">{row.woo}</td>
                                                    <td className="py-4 px-6 text-center text-gray-900 font-medium text-sm">{row.custom}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="container mx-auto px-6 py-20 max-w-4xl">
                        <h2 className="text-3xl md:text-4xl font-light text-black mb-4 text-center">Συχνές ερωτήσεις — WooCommerce</h2>
                        <p className="text-gray-500 text-center mb-16 font-light">Όλα όσα θέλετε να γνωρίζετε για τη κατασκευή WooCommerce eshop</p>
                        <div className="space-y-6">
                            {faqSchema.mainEntity.map((faq, idx) => (
                                <div key={idx} className="p-8 rounded-xl border border-gray-250 bg-white shadow-sm">
                                    <h3 className="text-lg font-bold text-black mb-4">{faq.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Internal Links */}
                    <section className="container mx-auto px-6 pb-16">
                        <h2 className="text-xl font-light text-gray-800 mb-8">Σχετικές σελίδες</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link href="/kataskevi-eshop" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Κατασκευή eshop →</h3>
                                <p className="text-xs text-gray-500">Όλα τα πακέτα eshop</p>
                            </Link>
                            <Link href="/web-development" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Web development →</h3>
                                <p className="text-xs text-gray-500">Custom React eshops & apps</p>
                            </Link>
                            <Link href="/blog/poso-kostizei-kataskevi-eshop-2025" className="p-6 rounded-xl border border-gray-250 bg-white hover:border-[#3b5bdb]/30 transition-all duration-300 shadow-sm group">
                                <h3 className="font-bold text-sm text-black mb-2 group-hover:text-[#3b5bdb] transition-colors">Κόστος κατασκευής eshop →</h3>
                                <p className="text-xs text-gray-500">Τιμές και πακέτα 2025</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6">
                        <div className="rounded-2xl bg-[#3b5bdb] p-12 md:p-20 text-center text-white shadow-lg">
                            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">Ξεκινήστε το WooCommerce eshop σας</h2>
                            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-light">
                                Δωρεάν εκτίμηση σε 24 ώρες. Αναλύουμε τις ανάγκες σας και σας προτείνουμε την ιδανική WooCommerce λύση.
                            </p>
                            <Link href="/estimate" className="inline-flex items-center gap-3 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-lg rounded-lg transition-all duration-300 shadow-md">
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
