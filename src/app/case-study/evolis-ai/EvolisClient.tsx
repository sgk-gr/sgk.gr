"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Bot, MessageSquare, Building2, Palmtree, Database, Layout } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Flutter Web", "Firebase Realtime Database", "NoSQL", "VPS Server", "AI Agents", "Customer Support Automation"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function EvolisClient() {
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
                    <motion.div {...fadeUp}>
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            AI / Tourism / Real Estate
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            EvolisAI
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Web app για δημιουργία <span className="text-foreground font-medium">AI agents</span> για customer support σε τουρισμό και real estate.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Flutter", "Firebase", "AI Agents", "Customer Support", "NoSQL", "VPS"].map(
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
                                Πολλές εταιρείες στον τομέα του τουρισμού και του real estate αντιμετώπιζαν το ίδιο πρόβλημα: την ανάγκη για 24/7 υποστήριξη πελατών χωρίς το τεράστιο κόστος πρόσληψης και εκπαίδευσης μεγάλων ομάδων support. Οι καθυστερημένες απαντήσεις οδηγούσαν σε απώλεια κρατήσεων και πωλήσεων.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Λύση</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Δημιουργήσαμε μια ισχυρή web πλατφόρμα με Flutter όπου κάθε επιχείρηση μπορεί να "εκπαιδεύει" και να αναπτύσσει τους δικούς της AI agents. Χρησιμοποιήσαμε Firebase Realtime Database (NoSQL) για ακαριαία απόκριση και VPS server για σταθερότητα, επιτρέποντας στους agents να διαχειρίζονται χιλιάδες ερωτήματα ταυτόχρονα.
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
                            24/7 Υποστήριξη χωρίς Διακοπές
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                                <p className="text-sm text-muted-foreground">Αδιάλειπτη Εξυπηρέτηση</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">Instant</div>
                                <p className="text-sm text-muted-foreground">Άμεσες Απαντήσεις</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Το EvolisAI επιτρέπει στις επιχειρήσεις να παρέχουν κορυφαία εξυπηρέτηση σε παγκόσμιο επίπεδο, ανεξάρτητα από τη ζώνη ώρας, αυξάνοντας την ικανοποίηση των πελατών.
                        </p>
                        <Link
                            href="/estimate"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
                        >
                            Θέλω AI agents για την επιχείρησή μου
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
}
