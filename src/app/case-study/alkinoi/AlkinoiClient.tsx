"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Calculator, ShieldCheck, Zap, Globe, BarChart3, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const techStack = [
    "Next.js", "React", "TypeScript", "Tailwind CSS", "Technical SEO", "SSL Security", "Responsive Design"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const deliverables = [
    {
        icon: Briefcase,
        title: "Σύγχρονη Εταιρική Παρουσίαση",
        description: "Σχεδιασμός κομψού και επαγγελματικού ψηφιακού περιβάλλοντος που αναδεικνύει το εύρος των συμβουλευτικών, φοροτεχνικών και λογιστικών υπηρεσιών της Alkinoi Consulting."
    },
    {
        icon: Calculator,
        title: "Οικονομοτεχνική & Φοροτεχνική Δομή",
        description: "Καθαρή κατηγοριοποίηση υπηρεσιών για επιχειρήσεις και ιδιώτες, επιτρέποντας στους επισκέπτες να εντοπίζουν άμεσα την κατάλληλη λύση για τις ανάγκες τους."
    },
    {
        icon: Globe,
        title: "Προηγμένο SEO & Βελτιστοποίηση Ταχύτητας",
        description: "Άριστη απόδοση Core Web Vitals, δομημένα δεδομένα Schema.org και στοχευμένη βελτιστοποίηση για τοπικές και εθνικές αναζητήσεις συμβούλων επιχειρήσεων."
    },
    {
        icon: ShieldCheck,
        title: "Εταιρική Διαφάνεια & Ασφάλεια",
        description: "Πλήρης συμμόρφωση με τους κανόνες εταιρικής δημοσιότητας, κρυπτογράφηση SSL 256-bit και responsive εμπειρία σε κάθε συσκευή (mobile, tablet, desktop)."
    }
];

export default function AlkinoiClient() {
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
                        Corporate & Consulting
                    </span>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="max-w-4xl">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Business Consulting & Financial Advisory
                        </p>
                        <h1 className="text-5xl md:text-6xl font-heading font-bold leading-[1.05] mb-6">
                            Alkinoi Consulting
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Σχεδιασμός και υλοποίηση σύγχρονης εταιρικής ιστοσελίδας για συμβούλους επιχειρήσεων, οικονομολόγους και φοροτεχνικούς, με έμφαση στην αξιοπιστία, την ταχύτητα και το στοχευμένο SEO.
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
                                Η Alkinoi Consulting χρειαζόταν μια δυναμική ψηφιακή παρουσία που να αποπνέει κύρος, διαφάνεια και σύγχρονη αισθητική. Ήταν απαραίτητο να παρουσιαστούν με σαφήνεια οι πολύπλευρες συμβουλευτικές και λογιστικές υπηρεσίες της, διατηρώντας κορυφαία ταχύτητα φόρτωσης και άψογη εμφάνιση σε κινητά.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Η Υλοποίηση από την SGK
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Τι Δημιουργήσαμε</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Αναπτύξαμε μια ταχύτατη εφαρμογή βασισμένη σε σύγχρονο Next.js framework και Tailwind CSS. Δημιουργήσαμε καθαρή αρχιτεκτονική πληροφόρησης, ενσωματώσαμε τεχνικό SEO για μέγιστη οργανική ορατότητα και διαμορφώσαμε άμεσες φόρμες επικοινωνίας για prospective πελάτες.
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
                            Βασικοί Πυλώνες
                        </p>
                        <h2 className="text-3xl font-heading font-bold">Τι Παραδόθηκε</h2>
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
                            Ισχυρή Εταιρική Ταυτότητα & Εμπιστοσύνη
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                                <p className="text-xs text-muted-foreground">Mobile Responsive</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">&lt; 0.6s</div>
                                <p className="text-xs text-muted-foreground">Ταχύτητα Φόρτωσης</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border col-span-2 md:col-span-1">
                                <div className="text-3xl font-bold text-primary mb-2">A+</div>
                                <p className="text-xs text-muted-foreground">SSL & Security Score</p>
                            </div>
                        </div>
                        <Link
                            href="/estimate"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Ξεκινήστε το δικό σας Project
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
