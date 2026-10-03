"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home, Building, Scale, ShieldCheck, KeyRound, MapPin, Eye } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Next.js", "React", "TypeScript", "Tailwind CSS", "Real Estate UI", "ΓΕΜΗ Integration", "SSL Security"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const deliverables = [
    {
        icon: Building,
        title: "Παρουσίαση Χαρτοφυλακίου Ακινήτων",
        description: "Σύγχρονη δομή προβολής για ανάπτυξη, κατασκευή, εκμίσθωση και διαχείριση επιλεγμένων οικιστικών και εμπορικών ακινήτων στην Αττική."
    },
    {
        icon: Scale,
        title: "Θεσμική Συμμόρφωση ΓΕΜΗ (Ν. 4072/2012)",
        description: "Πλήρης νομική κάλυψη για την υποχρεωτική εταιρική διαφάνεια της Μονοπρόσωπης Ι.Κ.Ε., με ανάρτηση εταιρικών πράξεων και στοιχείων διοίκησης."
    },
    {
        icon: Eye,
        title: "High-End Minimal Real Estate Design",
        description: "Κομψή αισθητική που ταιριάζει στον τομέα των premium επενδυτικών ακινήτων, με υψηλής ευκρίνειας φωτογραφική υποστήριξη και γρήγορο rendering."
    },
    {
        icon: ShieldCheck,
        title: "Ασφάλεια SSL & Cloud Υποδομή",
        description: "Αξιόπιστη φιλοξενία σε enterprise cloud υποδομή, με 99.9% uptime, προστασία DDoS και πιστοποιητικό SSL 256-bit."
    }
];

export default function AgiosStefanosClient() {
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
                        Real Estate & ΓΕΜΗ
                    </span>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="max-w-4xl">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Real Estate & Property Development
                        </p>
                        <h1 className="text-5xl md:text-6xl font-heading font-bold leading-[1.05] mb-6">
                            Agios Stefanos Properties IKE
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Σχεδιασμός και υλοποίηση επίσημης εταιρικής ιστοσελίδας διαφάνειας ΓΕΜΗ και ανάδειξης ακινήτων για επενδυτική εταιρεία ακίνητης περιουσίας στην Αθήνα.
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
                                Η Πρόκληση
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Το Ζητούμενο</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Η Agios Stefanos Properties Μονοπρόσωπη Ι.Κ.Ε. χρειαζόταν άμεση δημιουργία ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ εντός της νόμιμης προθεσμίας 30 ημερών, με ταυτόχρονη δημιουργία μιας premium εικόνας για τους επενδυτές και μισθωτές της.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Η Λύση της SGK
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Τι Δημιουργήσαμε</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Παραδώσαμε σε χρόνο ρεκόρ μια σύγχρονη ιστοσελίδα Next.js, ενσωματώνοντας όλα τα απαραίτητα στοιχεία νομικής διαφάνειας, βελτιστοποιημένα για τις ελεγκτικές αρχές, σε συνδυασμό με minimal responsive παρουσίαση των ακινήτων της εταιρείας.
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
                            Υλοποίηση
                        </p>
                        <h2 className="text-3xl font-heading font-bold">Βασικά Στοιχεία Έργου</h2>
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
                            Άμεση Παράδοση & Εταιρικό Κύρος
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                                <p className="text-xs text-muted-foreground">Χρόνος Παράδοσης</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                                <p className="text-xs text-muted-foreground">ΓΕΜΗ Compliance</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border col-span-2 md:col-span-1">
                                <div className="text-3xl font-bold text-primary mb-2">0€</div>
                                <p className="text-xs text-muted-foreground">Κίνδυνος Προστίμων</p>
                            </div>
                        </div>
                        <Link
                            href="/ike-offer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Δείτε το Πακέτο Ιστοσελίδας ΙΚΕ
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
