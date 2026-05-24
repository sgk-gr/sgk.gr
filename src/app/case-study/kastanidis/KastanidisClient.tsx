"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Database, Layout, ShieldCheck, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";

const techStack = [
    "WordPress", "WooCommerce", "MySQL", "PHP", "TailwindCSS", "Custom Theme",
    "WP REST API", "Cloudflare CDN", "ERP Integration"
];

const systemModules = [
    {
        icon: Layout,
        title: "Custom WooCommerce Theme",
        description: "Σχεδιασμός και ανάπτυξη αποκλειστικού theme για μέγιστη ταχύτητα και καθαρότητα κώδικα, χωρίς περιττά plugins.",
    },
    {
        icon: Database,
        title: "ERP & Inventory Sync",
        description: "Διασύνδεση με το μηχανογραφικό σύστημα (ERP) της εταιρείας για αυτόματο συγχρονισμό αποθεμάτων και τιμών.",
    },
    {
        icon: ShoppingBag,
        title: "Premium Product Grid",
        description: "Σύγχρονη παρουσίαση προϊόντων με προηγμένα φίλτρα για πλακάκια, είδη υγιεινής, έπιπλα κουζίνας κ.α.",
    },
    {
        icon: ShieldCheck,
        title: "Ασφάλεια & Σταθερότητα",
        description: "Ενισχυμένη ασφάλεια σε επίπεδο server και Cloudflare CDN για προστασία των συναλλαγών και των δεδομένων.",
    },
];

const results = [
    { value: "40+", label: "Χρόνια Εμπιστοσύνης" },
    { value: "92%", label: "Mobile Optimization" },
    { value: "+35%", label: "Αύξηση Direct Orders" },
    { value: "10k+", label: "Ενεργά Προϊόντα" },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function KastanidisClient() {
    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/#portfolio"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Πίσω στο Portfolio
                    </Link>
                    <a
                        href="https://www.kastanidis.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                    >
                        Επίσκεψη στο site ↗
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="max-w-4xl">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            E-COMMERCE / WORDPRESS / WOOCOMMERCE
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            ΚΑΒΕ Α.Ε. Καστανίδης
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Σύγχρονο WooCommerce e-shop για την κορυφαία εταιρεία εμπορίας ειδών υγιεινής, πλακιδίων και θέρμανσης σε Καστοριά και Πτολεμαΐδα από το 1975.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["WordPress", "WooCommerce", "PHP", "MySQL", "TailwindCSS"].map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Brief / Details */}
            <section className="py-20 bg-secondary/10 border-t border-b border-border">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <motion.div {...fadeUp}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Το Ζητούμενο
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">
                                Πρόκληση
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Η ΚΑΒΕ Α.Ε. Καστανίδης χρειαζόταν μια σύγχρονη e-commerce πλατφόρμα που να μπορεί να διαχειριστεί μια τεράστια γκάμα προϊόντων (είδη υγιεινής, πλακάκια, έπιπλα κουζίνας, laminate, θέρμανση) με άμεση ταχύτητα φόρτωσης και απλότητα στη διαχείριση, αντικατοπτρίζοντας την αξιοπιστία 40+ χρόνων.
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
                                Αναπτύξαμε ένα καθαρό, custom WooCommerce e-shop, αποφεύγοντας βαριά έτοιμα themes. Δημιουργήσαμε ένα ταχύτατο περιβάλλον πλοήγησης με εξαιρετικό mobile UX, πλήρη οργάνωση των κατηγοριών και διασύνδεση με το ERP για real-time ενημέρωση τιμών και αποθεμάτων.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="mb-10 text-center">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Τεχνολογίες & Εργαλεία
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold">
                            Tech Stack
                        </h2>
                    </motion.div>
                    <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
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
            <section className="py-20 bg-secondary/20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
                            Βασικά Χαρακτηριστικά
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Τεχνολογική ανωτερότητα και έμφαση στην εμπειρία του χρήστη.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                        {systemModules.map((mod, i) => (
                            <motion.div
                                key={mod.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-7 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="font-heading font-semibold mb-2 text-white text-base">
                                        {mod.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {mod.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-20">
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

            {/* Detailed Contact Info */}
            <section id="contact-info" className="py-20 bg-secondary/20 border-t border-border">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-heading font-bold mb-4">ΚΑΒΕ Α.Ε. Καστανίδης</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                Ολοκληρωμένες λύσεις για πλακάκια, είδη υγιεινής, laminate και κουζίνες, με πάνω από 40 χρόνια εμπειρίας και άριστης ποιότητας εξυπηρέτησης.
                            </p>
                            <div className="space-y-3.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                    <span>40+ Χρόνια Εμπειρίας στην Αγορά</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                    <span>Μεγάλη Γκάμα Εισαγόμενων Οίκων</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                    <span>Άμεση & Φιλική Εξυπηρέτηση</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-center">
                            <h4 className="text-sm font-bold text-foreground">Θέλετε ένα ταχύτατο WooCommerce E-shop;</h4>
                            <p className="text-xs text-muted-foreground leading-normal">
                                Σχεδιάζουμε και αναπτύσσουμε custom, γρήγορες e-commerce πλατφόρμες με απόλυτη διασύνδεση ERP.
                            </p>
                            <Link
                                href="/estimate"
                                className="w-full inline-flex items-center justify-center py-3 bg-primary text-primary-foreground font-heading font-bold text-xs rounded-md hover:opacity-90 transition-opacity"
                            >
                                Ζητήστε Προσφορά
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
}
