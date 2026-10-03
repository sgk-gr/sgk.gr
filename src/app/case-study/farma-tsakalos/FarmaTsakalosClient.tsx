"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sprout, Truck, ShieldCheck, Sun, MapPin, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Next.js", "React", "TypeScript", "Tailwind CSS", "High-Resolution Media", "Local SEO", "SSL Security"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const deliverables = [
    {
        icon: Sprout,
        title: "Προβολή Αγροτικής Παραγωγής & Προϊόντων",
        description: "Αναλυτική παρουσίαση των καλλιεργειών υπαίθρου, νωπών λαχανικών και πεπονοειδών, τονίζοντας τις σύγχρονες μεθόδους καλλιέργειας και την εγγύηση φρεσκάδας."
    },
    {
        icon: Truck,
        title: "Χονδρικό Εμπόριο & Εφοδιαστική Αλυσίδα",
        description: "Στοχευμένη ενότητα για επαγγελματίες χονδρικής, αλυσίδες τροφίμων και λαχαναγορές με εύκολη δυνατότητα παραγγελίας και άμεση επικοινωνία."
    },
    {
        icon: Sun,
        title: "Αυθεντική Ταυτότητα & Branding Εύβοιας",
        description: "Οπτικός σχεδιασμός που εμπνέεται από τη γη της Εύβοιας (Τριάδα Ψαχνών), συνδυάζοντας την παράδοση με τη σύγχρονη αγροτική τεχνολογία."
    },
    {
        icon: Award,
        title: "Πρότυπα Ποιότητας & Ταχύτητα",
        description: "Βελτιστοποιημένη αρχιτεκτονική για άμεσο άνοιγμα σε κινητά, με πλούσιο φωτογραφικό υλικό από τις εγκαταστάσεις και τα χωράφια παραγωγής."
    }
];

export default function FarmaTsakalosClient() {
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
                        Αγροτική Μονάδα & B2B
                    </span>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="max-w-4xl">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Agriculture & Fresh Produce Wholesale
                        </p>
                        <h1 className="text-5xl md:text-6xl font-heading font-bold leading-[1.05] mb-6">
                            Φάρμα Ευβοίας Τσάκαλος
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Σχεδιασμός και υλοποίηση σύγχρονης ψηφιακής πλατφόρμας για πρότυπη αγροτική μονάδα καλλιέργειας και χονδρικής διάθεσης νωπών κηπευτικών στην Εύβοια.
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
                                Η Φάρμα Τσάκαλος αναζητούσε έναν σύγχρονο ψηφιακό τρόπο να αναδείξει την κλίμακα των καλλιεργειών της, την ποιότητα των κηπευτικών της και τη δυνατότητά της να εξυπηρετεί μεγάλες παραγγελίες χονδρικής σε όλη την Ελλάδα.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Η Λύση της SGK
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Τι Δημιουργήσαμε</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Κατασκευάσαμε μια φωτεινή, ταχύτατη ιστοσελίδα με έμφαση στα φρέσκα προϊόντα, την τοπική παραγωγή της Εύβοιας και τα ανταγωνιστικά πλεονεκτήματα της μονάδας, με απευθείας κουμπιά κλήσης και αποστολής παραγγελιών.
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
                            Αύξηση Αναγνωρισιμότητας & B2B Συνεργασιών
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                                <p className="text-xs text-muted-foreground">Mobile Responsive</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">&lt; 0.5s</div>
                                <p className="text-xs text-muted-foreground">Χρόνος Φόρτωσης</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border col-span-2 md:col-span-1">
                                <div className="text-3xl font-bold text-primary mb-2">B2B</div>
                                <p className="text-xs text-muted-foreground">Direct Lead Gen</p>
                            </div>
                        </div>
                        <Link
                            href="/estimate"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Σχεδιάστε τη δική σας Ιστοσελίδα
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
