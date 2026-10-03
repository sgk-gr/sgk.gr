"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Globe2, Languages, Scale, ShieldCheck, Zap, FileText } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Next.js", "React", "TypeScript", "Tailwind CSS", "ΓΕΜΗ Compliance Engine", "SSL Security", "Multi-language Ready"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const deliverables = [
    {
        icon: Scale,
        title: "Πλήρης Νομική Συμμόρφωση ΓΕΜΗ",
        description: "Υλοποίηση σύμφωνα με το Άρθρο 47 §2 Ν. 4072/2012 και Ν. 4919/2022 για υποχρεωτική ψηφιακή δημοσιότητα Ι.Κ.Ε., με ασφαλή ανάρτηση καταστατικών και εταιρικών στοιχείων."
    },
    {
        icon: Languages,
        title: "Παρουσίαση Υπηρεσιών Localization",
        description: "Ανάδειξη του ευρέος φάσματος μεταφραστικών υπηρεσιών, τεχνικής τοπικοποίησης λογισμικού, ορολογικής διαχείρισης και διερμηνείας για διεθνείς οργανισμούς."
    },
    {
        icon: Globe2,
        title: "Διεθνές & Minimal Design",
        description: "Σύγχρονος αισθητικός σχεδιασμός που ανταποκρίνεται στα πρότυπα πολυεθνικών εταιρειών που αναζητούν αξιόπιστους συνεργάτες localization στην Ελλάδα."
    },
    {
        icon: ShieldCheck,
        title: "Ασφάλεια SSL & GDPR",
        description: "Πλήρης προστασία ευαίσθητων εταιρικών αρχείων με κρυπτογράφηση SSL 256-bit και πιστοποιημένη συμμόρφωση με τον Ευρωπαϊκό Κανονισμό GDPR."
    }
];

export default function ThinkLocalizationClient() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Πίσω στο Portfolio
                    </Link>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Localization & ΓΕΜΗ ΙΚΕ
                    </span>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="max-w-4xl">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Translation & Localization Services
                        </p>
                        <h1 className="text-5xl md:text-6xl font-heading font-bold leading-[1.05] mb-6">
                            Think Localization IKE
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Ανάπτυξη επίσημης εταιρικής ιστοσελίδας και πλατφόρμας δημοσιότητας ΓΕΜΗ για εξειδικευμένο πάροχο μεταφραστικών υπηρεσιών και software localization.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((tag) => (
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

            {/* Problem & Solution */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
                        <motion.div {...fadeUp}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Η Ανάγκη
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Το Ζητούμενο</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Η Think Localization Ι.Κ.Ε. χρειαζόταν μια άρτια τεχνικά ιστοσελίδα που αφενός να καλύπτει τις αυστηρές προθεσμίες και προδιαγραφές του νόμου για εταιρική δημοσιότητα ΓΕΜΗ, και αφετέρου να προβάλλει με κύρος τις δυνατότητες της εταιρείας σε διεθνείς πελάτες.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Η Υλοποίηση
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Τι Δημιουργήσαμε</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Σχεδιάσαμε μια minimal, υψηλής αισθητικής πλατφόρμα με Next.js. Ενσωματώσαμε modular δομή για άμεση ανάρτηση οικονομικών καταστάσεων και εταιρικών πράξεων, βελτιστοποιώντας ταυτόχρονα το Core Web Vitals score για ταχύτατη παγκόσμια πρόσβαση.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Deliverables */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="mb-12 max-w-2xl">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Υπηρεσίες & Χαρακτηριστικά
                        </p>
                        <h2 className="text-3xl font-heading font-bold">Βασικές Ενότητες</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 gap-8 max-w-5xl">
                        {deliverables.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    {...fadeUp}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <motion.div {...fadeUp}>
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Αποτέλεσμα
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            100% Νομική Συμμόρφωση & Ταχύτητα
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                                <p className="text-xs text-muted-foreground">ΓΕΜΗ & GDPR Compliance</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">&lt; 0.5s</div>
                                <p className="text-xs text-muted-foreground">Χρόνος Απόκρισης</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border col-span-2 md:col-span-1">
                                <div className="text-3xl font-bold text-primary mb-2">A+</div>
                                <p className="text-xs text-muted-foreground">SSL Security</p>
                            </div>
                        </div>
                        <Link
                            href="/estimate"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Ενδιαφέρομαι για Ιστοσελίδα ΙΚΕ / ΓΕΜΗ
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
