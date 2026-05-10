"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Users, Bell, Smartphone, Award, FileText, Building2, Handshake, BellRing, DatabaseZap } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Flutter", "Firebase Realtime Database", "NoSQL", "Android App",
    "OneSignal", "Push Notifications", "Partner Management", "Rewards System",
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const SkinneraClient = () => {
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
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Business Services
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            Skinnera IKE
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Πλατφόρμα διαχείρισης συνεργατών με <span className="text-foreground font-medium">σύστημα επιβράβευσης</span>, real-time notifications και mobile app για tracking αιτήσεων ΕΣΠΑ/ΔΥΠΑ.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Flutter", "Firebase", "Realtime Database", "Android", "OneSignal", "Push Notifications", "ΕΣΠΑ", "ΔΥΠΑ"].map(
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
                            <h2 className="text-3xl font-heading font-bold mb-4 text-white">Πρόβλημα</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Η Skinnera IKE χρειαζόταν μια ολοκληρωμένη πλατφόρμα για να διαχειρίζεται τους πελάτες της και τους πελάτες συνεργατών της, με real-time ενημέρωση για την εξέλιξη αιτήσεων σε προγράμματα ΕΣΠΑ και ΔΥΠΑ.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4 text-white">Λύση</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Δημιουργήσαμε μια web app με Flutter και Firebase Realtime Database όπου η επιχείρηση μπορεί να καταχωρεί πελάτες της και πελάτες συνεργατών, να ενημερώνει κάθε πελάτη για την εξέλιξη της αίτησής του σε προγράμματα ΕΣΠΑ και ΔΥΠΑ. Επίσης αναπτύξαμε Android mobile app για τους πελάτες με OneSignal push notifications σε πραγματικό χρόνο.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="mb-10">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3 text-white">
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

            {/* Key Features */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="mb-14">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Λειτουργίες
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold">
                            Τι Περιλαμβάνει
                        </h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
                        {[
                            {
                                icon: Handshake,
                                title: "Διαχείριση Συνεργατών",
                                desc: "Καταχώρηση και παρακολούθηση συνεργατών με πλήρες ιστορικό πελατών τους.",
                            },
                            {
                                icon: Users,
                                title: "Διαχείριση Πελατών",
                                desc: "Κεντρική βάση πελατών εταιρείας και συνεργατών με status tracking αιτήσεων.",
                            },
                            {
                                icon: FileText,
                                title: "ΕΣΠΑ & ΔΥΠΑ Tracking",
                                desc: "Real-time ενημέρωση εξέλιξης αιτήσεων σε προγράμματα ΕΣΠΑ και ΔΥΠΑ.",
                            },
                            {
                                icon: BellRing,
                                title: "Push Notifications",
                                desc: "OneSignal integration για instant ειδοποιήσεις σε πραγματικό χρόνο στο Android app.",
                            },
                            {
                                icon: Award,
                                title: "Σύστημα Επιβράβευσης",
                                desc: "Rewards system για συνεργάτες που ενισχύει την αφοσίωση και την απόδοση.",
                            },
                            {
                                icon: Smartphone,
                                title: "Android Mobile App",
                                desc: "Native-like εφαρμογή με Flutter για πελάτες, με real-time status updates.",
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-7 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
                            >
                                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-heading font-semibold mb-2 text-white">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture Flow */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div {...fadeUp} className="mb-10 text-white">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Αρχιτεκτονική
                        </p>
                        <h2 className="text-3xl font-heading font-bold mb-4">Πώς Λειτουργεί</h2>
                    </motion.div>

                    <motion.div {...fadeUp} className="p-8 rounded-xl bg-card border border-border">
                        <div className="space-y-6">
                            {[
                                { icon: Building2, step: "1", title: "Εταιρεία", desc: "Καταχωρεί πελάτες και συνεργάτες στη web πλατφόρμα" },
                                { icon: Handshake, step: "2", title: "Συνεργάτης", desc: "Προσθέτει τους δικούς του πελάτες στο σύστημα" },
                                { icon: DatabaseZap, step: "3", title: "Firebase Realtime DB", desc: "Αποθηκεύει και συγχρονίζει δεδομένα σε πραγματικό χρόνο" },
                                { icon: FileText, step: "4", title: "Status Update", desc: "Η εταιρεία ενημερώνει την εξέλιξη αίτησης ΕΣΠΑ/ΔΥΠΑ" },
                                { icon: Bell, step: "5", title: "Push Notification", desc: "Ο πελάτης λαμβάνει instant ειδοποίηση στο Android app" },
                            ].map((item, i) => (
                                <div key={item.step} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="w-8 h-8 rounded-full bg-primary/15 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                                            {item.step}
                                        </span>
                                        {i < 4 && <div className="w-px h-6 bg-border mt-2" />}
                                    </div>
                                    <div className="pb-2 text-white">
                                        <div className="flex items-center gap-2 mb-1">
                                            <item.icon className="w-4 h-4 text-primary" />
                                            <h4 className="font-heading font-semibold text-sm">{item.title}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                            Ολοκληρωμένη διαχείριση συνεργατών
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Real-time ενημέρωση πελατών, αυτοματοποιημένες ειδοποιήσεις και σύστημα επιβράβευσης που ενισχύει την αφοσίωση.
                        </p>
                        <Link
                            href="/estimate"
                            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-heading font-bold rounded-sm hover:scale-105 transition-all outline-none"
                        >
                            Ζητήστε Προσφορά
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
};

export default SkinneraClient;
