"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Smartphone, CreditCard, Bell, Navigation, Map, Users } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Flutter", "Firebase", "Realtime Database", "Stripe", "Push Notifications", "Android", "Google Maps API", "Live Tracking"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function LTGClient() {
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
                            Mobile App & Taxi Tours
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            Live Tour Guide (LTG)
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Mobile app για private taxi tours στην Αθήνα με <span className="text-foreground font-medium">real-time tracking</span> και αυτοματοποιημένη διαχείριση κρατήσεων.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Flutter", "Firebase", "Stripe", "Android", "Realtime DB", "Push Notifications"].map(
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
                                Η εταιρεία χρειαζόταν μια ολοκληρωμένη mobile εφαρμογή για να διαχειρίζεται private taxi tours στην Ελλάδα. Κύριες ανάγκες ήταν η παρακολούθηση της θέσης του οδηγού σε πραγματικό χρόνο (live tracking), η διασφάλιση εύκολων και ασφαλών πληρωμών για τους τουρίστες και ο συντονισμός των ραντεβού.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Λύση</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Φτιάξαμε μια native-feel mobile εφαρμογή με Flutter για Android. Χρησιμοποιήσαμε Firebase Realtime Database για το live tracking της διαδρομής, κάνοντας την εμπειρία του πελάτη πιο ασφαλή. Ενσωματώσαμε το Stripe για πληρωμές και σύστημα push notifications για άμεσες ενημερώσεις σχετικά με την άφιξη του οδηγού.
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
                            Αναβάθμιση Ταξιδιωτικής Εμπειρίας
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">45%</div>
                                <p className="text-sm text-muted-foreground">Αύξηση Completion Rate</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">30%</div>
                                <p className="text-sm text-muted-foreground">Περισσότερες Recurrent Κρατήσεις</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Το Live Tour Guide έδωσε στους πελάτες τη σιγουριά που χρειάζονταν, μειώνοντας τις αναμονές και βελτιώνοντας το συνολικό rating της υπηρεσίας.
                        </p>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
                        >
                            Θέλω μια εφαρμογή Flutter
                            <Sparkles className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
}
