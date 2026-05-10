"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, MapPin, Users, Wrench, Camera, Wifi, AlertTriangle, CheckCircle2, BarChart3, Clock, Shield, Zap, Eye } from "lucide-react";
import Link from "next/link";

const techStack = [
    "React", "Supabase", "PostgreSQL", "Google Maps API", "AI Vision",
    "Real-time Subscriptions", "Edge Functions", "Leaflet.js",
    "Resend API", "TailwindCSS", "TypeScript", "VPS Hosting",
];

const systemModules = [
    {
        icon: Users,
        title: "Διαχείριση Πελατών",
        description: "Καταχώρηση και διαχείριση πελατών Cosmote, Vodafone και λοιπών παρόχων με πλήρες ιστορικό συνδέσεων.",
    },
    {
        icon: Wrench,
        title: "Οργάνωση Συνεργείων",
        description: "Real-time ανάθεση εργασιών σε συνεργεία, live tracking θέσης και πρόοδος εργασιών ανά ομάδα.",
    },
    {
        icon: MapPin,
        title: "Live Χάρτης Συνδέσεων",
        description: "Google Maps integration με markers για κάθε σύνδεση, φίλτρα ανά περιοχή, status και πάροχο.",
    },
    {
        icon: AlertTriangle,
        title: "Σύστημα Βλαβών",
        description: "Real-time αναφορές βλαβών με push notifications, ανάθεση σε τεχνικούς και live status tracking.",
    },
    {
        icon: Camera,
        title: "AI Αυτοψίες",
        description: "Σύστημα φωτογραφικών αυτοψιών με AI αναγνώριση εικόνας για αυτόματη ταξινόμηση και επαλήθευση εργασιών.",
    },
    {
        icon: Wifi,
        title: "Κλείσιμο Συνδέσεων",
        description: "Live σύστημα κλεισίματος συνδέσεων οπτικών ινών με real-time ενημέρωση status και ειδοποιήσεις.",
    },
];

const results = [
    { icon: Clock, value: "80%", label: "Μείωση χρόνου καταχώρησης" },
    { icon: CheckCircle2, value: "Real-time", label: "Live δεδομένα συνεργείων" },
    { icon: Eye, value: "AI", label: "Αυτόματη αναγνώριση αυτοψιών" },
    { icon: Shield, value: "100%", label: "Ακρίβεια data" },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const KMFiberClient = () => {
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
                            KM-FIBER
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-4">
                            Ολοκληρωμένο σύστημα διαχείρισης <span className="text-foreground font-medium">οπτικών ινών</span> για συνεργάτη της Cosmote.
                            Καταχώρηση πελατών, οργάνωση συνεργείων, real-time βλάβες και AI αυτοψίες.
                        </p>
                        <p className="text-sm text-muted-foreground mb-8 text-white">
                            Telecom Operations Platform — Cosmote / Vodafone Partner
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Supabase", "PostgreSQL", "Google Maps API", "AI Vision", "Real-time"].map(
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
                                Η εταιρεία KM-FIBER, συνεργάτης της Cosmote στον τομέα οπτικών ινών, διαχειριζόταν
                                τους πελάτες, τα συνεργεία και τις βλάβες με χειροκίνητα εργαλεία (Excel, τηλέφωνα, χαρτιά).
                                Αυτό δημιουργούσε λάθη, καθυστερήσεις και αδυναμία real-time ελέγχου στο πεδίο.
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
                                Χτίσαμε μια ολοκληρωμένη web πλατφόρμα με React και Supabase που κεντρικοποιεί
                                τη διαχείριση πελατών, συνεργείων, βλαβών και αυτοψιών. Live χάρτης, AI αναγνώριση
                                φωτογραφιών, real-time notifications και σύστημα κλεισίματος συνδέσεων — όλα σε ένα dashboard.
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
                            Modules
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
                            Τα Modules του Συστήματος
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            6 βασικά modules που καλύπτουν κάθε πτυχή της λειτουργίας.
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

            {/* How It Works */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl">
                        <motion.div {...fadeUp}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Ροή Λειτουργίας
                            </p>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                                Πώς δουλεύει
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Από την καταχώρηση πελάτη μέχρι το κλείσιμο σύνδεσης — όλα online, σε πραγματικό χρόνο.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    { icon: Users, text: "Καταχώρηση νέου πελάτη Cosmote/Vodafone στο σύστημα" },
                                    { icon: MapPin, text: "Τοποθέτηση στον χάρτη με Google Maps — αυτόματη εύρεση διεύθυνσης" },
                                    { icon: Wrench, text: "Ανάθεση σε συνεργείο & live tracking πορείας εργασιών" },
                                    { icon: Camera, text: "Αυτοψία στο πεδίο — AI αναγνώριση φωτογραφιών" },
                                    { icon: CheckCircle2, text: "Κλείσιμο σύνδεσης & ενημέρωση σε real-time" },
                                ].map((item) => (
                                    <li key={item.text} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            {...fadeUp}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="p-6 rounded-xl bg-card border border-border"
                        >
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading mb-4">
                                Live Data Flow
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Νέα σύνδεση καταχωρείται στο σύστημα",
                                    "Ανάθεση σε συνεργείο → push notification στον τεχνικό",
                                    "Τεχνικός ανεβάζει φωτογραφίες αυτοψίας",
                                    "AI αναλύει τις εικόνες & επαληθεύει την εργασία",
                                    "Σύνδεση κλείνει → live ενημέρωση dashboard",
                                    "Αν υπάρξει βλάβη → άμεση ειδοποίηση & ανάθεση",
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-muted-foreground">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-16 sm:py-20 bg-secondary/30">
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
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <motion.div {...fadeUp}>
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Σας ενδιαφέρει;
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            Θέλετε κάτι παρόμοιο;
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Χτίζουμε custom πλατφόρμες διαχείρισης για κάθε κλάδο. Μιλήστε μας για τις ανάγκες σας.
                        </p>
                        <Link
                            href="/estimate"
                            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-heading font-bold rounded-sm hover:scale-105 transition-all"
                        >
                            Θέλω κάτι παρόμοιο
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer spacer */}
            <div className="h-16 bg-background" />
        </div>
    );
};

export default KMFiberClient;
