"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Zap, Search, MapPin, Server, BarChart3, Rocket } from "lucide-react";
import Link from "next/link";

const techStack = [
    "React", "Tailwind CSS", "VPS Server", "SEO Optimization", "Google Business Profile", "Lead Generation"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function EnergyClient() {
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
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Energy Solutions & SEO
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            Glavinas Energy Solutions
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Γρήγορο landing page με <span className="text-foreground font-medium">SEO optimization</span> και Google Business για κορυφαία κατάταξη στις αναζητήσεις.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["React", "SEO", "Google Business", "VPS", "Tailwind CSS", "Lead Gen"].map(
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
                                Η εταιρεία δεν είχε online παρουσία και ήταν αδύνατο να βρεθεί από νέους πελάτες στις Google αναζητήσεις για ενεργειακές λύσεις. Αυτό είχε ως αποτέλεσμα να χάνονται σημαντικές ευκαιρίες πώλησης από τον ανταγωνισμό.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Λύση</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Φτιάξαμε ένα γρήγορο landing page με React και Tailwind CSS, SEO optimization, Google Business setup, και VPS server για απίστευτες ταχύτητες. Η στρατηγική μας επικεντρώθηκε στην τοπική αναζήτηση (Local SEO).
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
                            Κυριαρχία στις Αναζητήσεις
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">Top 5</div>
                                <p className="text-sm text-muted-foreground">Στο Google για target keywords</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">40+</div>
                                <p className="text-sm text-muted-foreground">Μηνιαία Leads</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Η Glavinas Energy Solutions πλέον πρωταγωνιστεί στην αγορά της, με σταθερή ροή νέων ενδιαφερόμενων πελατών κάθε μήνα.
                        </p>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
                        >
                            Θέλω να ανέβω στη Google
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
}
