"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, ShoppingCart, Bell, Play, Database, Gift, ListChecks } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Flutter", "Firebase Realtime Database", "NoSQL", "Smart Notifications", "Video Player", "Data Aggregation"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function SuperAppClient() {
    return (
        <div className="min-h-screen bg-background text-foreground">
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
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Consumer Mobile App
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            Super App
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Mobile app με <span className="text-foreground font-medium">προσφορές Σούπερ Μάρκετ</span> από όλες τις μεγάλες αλυσίδες σε ένα μέρος.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Flutter", "Firebase", "Notifications", "Video Player", "NoSQL", "Real-time"].map(
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
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
                        <motion.div {...fadeUp}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Το Ζητούμενο
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Πρόβλημα</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Οι καταναλωτές χρειαζόταν πολύ χρόνο για να αναζητήσουν και να συγκρίνουν προσφορές από διαφορετικές αλυσίδες σούπερ μάρκετ, ξεφυλλίζοντας έντυπα φυλλάδια ή ψάχνοντας σε διαφορετικά sites. Υπήρχε ανάγκη για μια κεντρική, εύχρηστη εφαρμογή.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Λύση</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Φτιάξαμε μια mobile εφαρμογή με Flutter που συγκεντρώνει καθημερινά τις καλύτερες προσφορές από Μασούτη, Σκλαβενίτη, Χαλκιαδάκη και ΑΒ Βασιλόπουλο. Χρησιμοποιήσαμε Firebase Realtime Database για άμεσο συγχρονισμό, smart notifications για ειδοποίηση νέων προσφορών και ενσωματωμένο video player για την προβολή διαφημιστικών spots.
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
                            Χιλιάδες Ενεργοί Χρήστες
                        </h2>
                        <div className="flex justify-center gap-6 mb-10">
                            <div className="p-8 rounded-xl bg-card border border-border min-w-[200px] text-center">
                                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest">Downloads</p>
                            </div>
                            <div className="p-8 rounded-xl bg-card border border-border min-w-[200px] text-center">
                                <div className="text-4xl font-bold text-primary mb-2">Daily</div>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest">Active Users</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Η εφαρμογή έγινε απαραίτητο εργαλείο για τους καταναλωτές, βοηθώντας τους να εξοικονομούν χρήματα καθημερινά από τις αγορές τους.
                        </p>
                        <Link
                            href="/estimate"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
                        >
                            Θέλω μια τέτοια εφαρμογή
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
}
