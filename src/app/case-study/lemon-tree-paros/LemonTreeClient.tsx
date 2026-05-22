"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Website", "Custom Booking System", "Property Management", "Responsive Design", "SEO Optimization"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function LemonTreeClient() {
    return (
        <div className="min-h-screen bg-background text-foreground">
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
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Booking System & Website
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            Lemon tree 1 Paros
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Κατασκευή ιστοσελίδας και custom booking system για συγκρότημα από <span className="text-foreground font-medium">3 Studios & 3 Apartments</span> στην Παροικιά της Πάρου.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <a 
                                href="https://lemontree1.gr/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                            >
                                Επίσκεψη στο site
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["Website", "Booking System", "Airbnb", "Paros", "Tourism", "Hospitality"].map(
                                (tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-full border border-border"
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
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
                        <motion.div {...fadeUp}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Το Ζητούμενο
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Ανάδειξη & Κρατήσεις</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Οι ιδιοκτήτες (Ανδρέας και Άννα) χρειάζονταν μια σύγχρονη ψηφιακή παρουσία που να αναδεικνύει την αυθεντική κυκλαδίτικη φιλοξενία που προσφέρουν εδώ και 10+ χρόνια.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Βασικός στόχος ήταν να υπάρχει μια εύχρηστη πλατφόρμα παρουσίασης των 6 καταλυμάτων (Studios Christina, Andreas, Anna και Apartments Lemon tree 1, 2, Family House) και ένα ενσωματωμένο σύστημα online κρατήσεων (booking engine).
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Ολοκληρωμένη Λύση</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Σχεδιάσαμε μια καλαίσθητη ιστοσελίδα με έμφαση στη φυσική ομορφιά της Πάρου και την ησυχία της τοποθεσίας (600μ. από τη θάλασσα).
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Το σύστημα κρατήσεων που αναπτύξαμε επιτρέπει στους επισκέπτες να βλέπουν πληροφορίες για κάθε κατάλυμα και να επικοινωνούν απευθείας για τη διαμονή τους, αυξάνοντας τις απευθείας (direct) κρατήσεις χωρίς προμήθειες σε τρίτους.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="mb-10">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Τεχνολογίες & Εργαλεία
                        </p>
                        <h2 className="text-3xl font-heading font-bold">Tech Stack</h2>
                    </motion.div>
                    <motion.div {...fadeUp} className="flex flex-wrap gap-3 max-w-4xl">
                        {techStack.map((tech, i) => (
                            <motion.span
                                key={tech}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.04 }}
                                className="px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-heading font-medium hover:border-primary/30 transition-colors"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Result */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <motion.div {...fadeUp}>
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Το Αποτέλεσμα
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            Αύξηση Απευθείας Κρατήσεων & Ενίσχυση Brand
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">6</div>
                                <p className="text-sm text-muted-foreground">Καταλύματα (Studios & Apartments)</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                                <p className="text-sm text-muted-foreground">Direct Bookings Support</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">SEO</div>
                                <p className="text-sm text-muted-foreground">Βελτιστοποίηση στην Πάρο</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Η Lemon tree 1 Paros πλέον διαθέτει ένα σύγχρονο ψηφιακό «σπίτι» που αντικατοπτρίζει την ποιότητα της φιλοξενίας της και βοηθά τους επισκέπτες να κλείσουν απευθείας.
                        </p>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
                        >
                            Θέλω ένα αντίστοιχο σύστημα
                            <Sparkles className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
}
