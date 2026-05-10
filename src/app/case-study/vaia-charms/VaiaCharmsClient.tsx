"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Gem, Zap, Search, ShieldCheck, CheckCircle2, ShoppingBag, Truck, CreditCard } from "lucide-react";
import Link from "next/link";

const techStack = [
    "React", "WooCommerce", "Next.js", "TailwindCSS", "REST API",
    "Framer Motion", "TypeScript", "Vercel", "Stripe API"
];

const systemModules = [
    {
        icon: Gem,
        title: "Exclusive Design",
        description: "Premium, custom UI/UX σχεδιασμένο από το μηδέν για να αναδεικνύει την ποιότητα των κοσμημάτων και το brand identity.",
    },
    {
        icon: Zap,
        title: "Headless Architecture",
        description: "Διαχωρισμός frontend (React) από το backend (WooCommerce) για απίστευτες ταχύτητες φόρτωσης (Core Web Vitals 95+).",
    },
    {
        icon: Search,
        title: "Advanced Filtering",
        description: "Άμεσα φίλτρα προϊόντων χωρίς reload σελίδας, επιτρέποντας στους πελάτες να βρίσκουν ακριβώς το κόσμημα που ψάχνουν.",
    },
    {
        icon: CreditCard,
        title: "Ολοκληρωμένες Πληρωμές",
        description: "Ασφαλές checkout με υποστήριξη όλων των σύγχρονων μεθόδων πληρωμής για την ελληνική και διεθνή αγορά.",
    },
    {
        icon: ShieldCheck,
        title: "Security & Stability",
        description: "Ανώτερη ασφάλεια χάρη στη Headless προσέγγιση, καθώς το backend δεν είναι άμεσα προσβάσιμο από το public frontend.",
    },
    {
        icon: Truck,
        title: "Courier Integration",
        description: "Αυτόματη δημιουργία voucher και διαχείριση αποστολών απευθείας από το διαχειριστικό του WooCommerce.",
    },
];

const results = [
    { icon: Zap, value: "98/100", label: "Google PageSpeed" },
    { icon: CheckCircle2, value: "< 1s", label: "Χρόνος φόρτωσης" },
    { icon: ShoppingBag, value: "+45%", label: "Αύξηση Conversion" },
    { icon: Gem, value: "100%", label: "Custom Design" },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const VaiaCharmsClient = () => {
    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-6 h-16 flex items-center">
                    <Link
                        href="/#portfolio"
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
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-6">
                            <Sparkles className="w-3.5 h-3.5" />
                            Case Study
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            Vaia Charms
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-4">
                            «Η ζωή είναι πολύ μικρή για μέτρια κοσμήματα.»<br />
                            Κατασκευή <span className="text-foreground font-medium">Headless e-shop νέας γενιάς</span> με React και WooCommerce.
                        </p>
                        <p className="text-sm text-muted-foreground mb-8 text-white">
                            Exclusive Jewelry Boutique — E-Commerce
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
                                Το Vaia Charms, ως ένα exclusive brand κοσμημάτων, χρειαζόταν μια online παρουσία που να αποπνέει πολυτέλεια και ποιότητα. Τα κλασικά έτοιμα themes του WooCommerce ήταν πολύ αργά και περιόριζαν την ελευθερία στον σχεδιασμό, μειώνοντας την premium εμπειρία που έπρεπε να νιώθει ο πελάτης.
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
                                Προχωρήσαμε σε Headless αρχιτεκτονική. Κρατήσαμε το WooCommerce μόνο ως εργαλείο διαχείρισης (backend) και σχεδιάσαμε ένα ταχύτατο custom frontend με React (Next.js). Το αποτέλεσμα είναι ένα eshop που φορτώνει ακαριαία, προσφέροντας μια κομψή, app-like εμπειρία χρήστη που αυξάνει σημαντικά τις πωλήσεις.
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
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-6">
                            <Zap className="w-3.5 h-3.5" />
                            Features
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
                            Βασικά Χαρακτηριστικά
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Τεχνολογική ανωτερότητα και έμφαση στη λεπτομέρεια.
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
                                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <mod.icon className="w-5 h-5 text-primary" />
                                </div>
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
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <r.icon className="w-5 h-5 text-primary" />
                                </div>
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
                            Θέλετε ένα ταχύτατο Headless E-shop;
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Επενδύστε στην ποιότητα και δείτε τις πωλήσεις σας να εκτοξεύονται. Ζητήστε προσφορά σήμερα.
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
};

export default VaiaCharmsClient;
