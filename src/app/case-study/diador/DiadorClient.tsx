"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Shirt, Printer, Zap, Search, ShieldCheck, CheckCircle2, ShoppingBag, Truck, CreditCard } from "lucide-react";
import Link from "next/link";

const techStack = [
    "React", "WooCommerce", "Next.js", "TailwindCSS", "REST API",
    "Framer Motion", "TypeScript", "Vercel", "Stripe API", "GraphQL"
];

const systemModules = [
    {
        icon: Shirt,
        title: "Workwear Customization",
        description: "Premium UI/UX σχεδιασμένο για να αναδεικνύει την εταιρική ταυτότητα μέσω ρούχων εργασίας, στολών και ειδικής ένδυσης.",
    },
    {
        icon: Printer,
        title: "Promotional Printing Engine",
        description: "Διασύνδεση με custom παραμετροποιητή για επιλογή μεθόδων εκτύπωσης (κέντημα, μεταξοτυπία, ψηφιακή εκτύπωση) απευθείας στο eshop.",
    },
    {
        icon: Zap,
        title: "Headless Architecture",
        description: "Διαχωρισμός frontend (React) από το backend (WooCommerce) για απίστευτες ταχύτητες φόρτωσης (Core Web Vitals 95+).",
    },
    {
        icon: Search,
        title: "Advanced B2B Filtering",
        description: "Άμεση εύρεση και φιλτράρισμα ανά κατηγορία επαγγέλματος, μέγεθος, χρώμα και υλικό χωρίς reload σελίδας.",
    },
    {
        icon: CreditCard,
        title: "B2B & B2C Billing",
        description: "Ασφαλές checkout με αυτόματο υπολογισμό τιμολογίου, B2B εκπτώσεων βάσει ποσότητας και υποστήριξη όλων των σύγχρονων πληρωμών.",
    },
    {
        icon: Truck,
        title: "Courier & Logistics Integration",
        description: "Αυτόματη δημιουργία voucher και υποστήριξη ογκωδών/πολλαπλών αποστολών απευθείας από το διαχειριστικό του WooCommerce.",
    },
];

const results = [
    { icon: Zap, value: "99/100", label: "Google PageSpeed" },
    { icon: CheckCircle2, value: "< 0.8s", label: "Χρόνος φόρτωσης" },
    { icon: ShoppingBag, value: "+52%", label: "Αύξηση Conversion" },
    { icon: Shirt, value: "100%", label: "Custom B2B Catalog" },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function DiadorClient() {
    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-6 h-16 flex items-center">
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Πίσω στο Portfolio
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="max-w-4xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            diador.eu
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-4">
                            «Premium επαγγελματική ένδυση και διαφήμιση με κορυφαία ταχύτητα.»<br />
                            Κατασκευή <span className="text-foreground font-medium">Headless e-shop νέας γενιάς</span> με React και WooCommerce.
                        </p>
                        <p className="text-sm text-muted-foreground mb-8 text-white">
                            Work Clothes & Advertising Solutions — E-Commerce
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["React Frontend", "WooCommerce", "Headless E-commerce"].map(
                                (tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                                    >
                                        {tag}
                                    </span>
                                )
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Problem & Solution */}
            <section className="py-16 sm:py-20 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
                        <motion.div {...fadeUp}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Το Ζητούμενο
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">
                                Πρόβλημα
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Το Diador.eu, ως ηγετική εταιρεία σε ρούχα εργασίας και διαφημιστικά προϊόντα, χρειαζόταν μια σύγχρονη B2B/B2C πλατφόρμα. Τα κλασικά e-shop δυσκολεύονταν να διαχειριστούν τις πολλαπλές παραμετροποιήσεις (λογότυπα, κεντήματα, μεγέθη, χρώματα) και τις κλιμακωτές τιμές χονδρικής, ενώ εμφάνιζαν μεγάλες καθυστερήσεις στη φόρτωση χιλιάδων κωδικών.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">
                                Λύση
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Εφαρμόσαμε Headless αρχιτεκτονική συνδέοντας custom React frontend με WooCommerce API. Αναπτύξαμε έναν έξυπνο B2B παραμετροποιητή για άμεσο υπολογισμό κόστους εκτύπωσης/κεντήματος και κλιμακωτών εκπτώσεων. Το eshop πλέον φορτώνει σε λιγότερο από 0.8 δευτερόλεπτα, διευκολύνοντας τις εταιρικές παραγγελίες μεγάλου όγκου.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="mb-10">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Τεχνολογίες & Εργαλεία
                        </p>
                        <h2 className="text-3xl font-heading font-bold">
                            Tech Stack
                        </h2>
                    </motion.div>
                    <motion.div {...fadeUp} className="flex flex-wrap gap-3 max-w-4xl">
                        {techStack.map((tech, i) => (
                            <motion.span
                                key={tech}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.03 }}
                                className="px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-heading font-medium hover:border-primary/30 transition-colors"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* System Modules */}
            <section className="py-16 sm:py-20 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
                            Βασικά Χαρακτηριστικά
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Τεχνολογική ανωτερότητα και B2B αυτοματοποίηση.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {systemModules.map((mod, i) => (
                            <motion.div
                                key={mod.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-7 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500 group"
                            >

                                <h3 className="font-heading font-semibold mb-2 text-white">
                                    {mod.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {mod.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div {...fadeUp} className="text-center mb-12">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Αποτελέσματα
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                            Μετρήσιμα Αποτελέσματα
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {results.map((r, i) => (
                            <motion.div
                                key={r.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-6 rounded-xl bg-card border border-border text-center hover:border-primary/30 transition-colors"
                            >

                                <p className="text-2xl sm:text-3xl font-heading font-bold text-[#00D16B] mb-1">{r.value}</p>
                                <p className="text-xs text-muted-foreground">{r.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-20 bg-secondary/30">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <motion.div {...fadeUp}>
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Σας ενδιαφέρει;
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            Θέλετε ένα B2B Headless E-shop;
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Βελτιστοποιήστε τη χονδρική σας πώληση και προσφέρετε ασύγκριτη ταχύτητα στους εταιρικούς σας πελάτες.
                        </p>
                        <Link
                            href="/estimate"
                            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-heading font-bold rounded-sm hover:scale-105 transition-all"
                        >
                            Ζητήστε Προσφορά
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer spacer */}
            <div className="h-16 bg-background" />
        </div>
    );
}
