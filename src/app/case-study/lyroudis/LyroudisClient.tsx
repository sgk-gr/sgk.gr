"use client";

import { motion } from "framer-motion";
import { 
    ArrowLeft, ExternalLink, ShieldCheck, FileText, Building2, 
    CheckCircle2, Zap, Scale, Lock, Globe, Server, UserCheck, Phone, Mail
} from "lucide-react";
import Link from "next/link";

const techStack = [
    "Next.js 15", "React", "TypeScript", "TailwindCSS", 
    "PDF Storage Engine", "ΓΕΜΗ Integration", "SSL Security", "Responsive UI"
];

const legalSpecs = [
    { label: "Εταιρική Επωνυμία", value: "LYROUDIS CONSULTING SERVICES ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε." },
    { label: "Επωνυμία (Λατινικά)", value: "LYROUDIS CONSULTING SERVICES SINGLE MEMBER P.C." },
    { label: "Διακριτικός Τίτλος", value: "LYROUDIS CONSULTING SERVICES" },
    { label: "Αριθμός Γ.Ε.ΜΗ.", value: "195135303000 (EUID: ELGEMI.195135303000)" },
    { label: "Αρμόδια Υπηρεσία ΓΕΜΗ", value: "ΕΠΑΓΓΕΛΜΑΤΙΚΟ ΕΠΙΜΕΛΗΤΗΡΙΟ ΑΘΗΝΑΣ" },
    { label: "ΑΦΜ / ΔΟΥ", value: "803351366 / ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ" },
    { label: "Νομική Μορφή", value: "Μονοπρόσωπη Ι.Κ.Ε. (Ενεργή από 16/07/2026 — Αορίστου Χρόνου)" },
    { label: "Διεύθυνση Έδρας", value: "Κυπρίων Αγωνιστών 68, Τ.Κ. 16451, Αργυρούπολη (Δήμος Ελληνικού - Αργυρούπολης)" },
    { label: "Εταιρικό Κεφάλαιο", value: "1.000,00 € (100% Κεφαλαιακές Εισφορές - 10 μερίδια των 100,00 €)" },
    { label: "Διαχειριστής & Μοναδικός Εταίρος", value: "Βασίλειος Λυρούδης του Χρήστου (100% - 10/10 Μερίδια)" },
    { label: "Κύρια Δραστηριότητα (ΚΑΔ 62202000)", value: "Υπηρεσίες Παροχής Συμβουλών για Θέματα Συστημάτων και Λογισμικού" },
    { label: "Δευτερεύουσα Δραστηριότητα (ΚΑΔ 62101107)", value: "Υπηρεσίες Σχεδιασμού, Υποστήριξης και Ολοκλήρωσης Συστημάτων Λογισμικού" },
];

const systemModules = [
    {
        icon: Scale,
        title: "Πλήρης Νομική Συμμόρφωση ΓΕΜΗ",
        description: "Σχεδιασμός βάσει του Άρθρου 47 §2 Ν. 4072/2012 (όπως εξειδικεύτηκε με την ΚΥΑ 46982/2025) & Ν. 4919/2022 για υποχρεωτική εταιρική δημοσιότητα ΙΚΕ στο διαδίκτυο.",
    },
    {
        icon: FileText,
        title: "Πλατφόρμα Ανάρτησης Ισολογισμών",
        description: "Ειδικός τομέας δημοσίευσης οικονομικών καταστάσεων, ισολογισμών και εταιρικών πράξεων σε υψηλής ανάλυσης αρχεία PDF.",
    },
    {
        icon: ShieldCheck,
        title: "Πιστοποιημένη Ασφάλεια & SSL",
        description: "Εγκατάσταση SSL 256-bit για προστασία δεδομένων, ασφαλή πλοήγηση και 100% αξιοπιστία απέναντι στις ελεγκτικές αρχές.",
    },
    {
        icon: Building2,
        title: "Εταιρική Παρουσίαση Συμβουλευτικών Υπηρεσιών",
        description: "Σύγχρονη παρουσίαση των εξειδικευμένων υπηρεσιών λογισμικού, σχεδιασμού συστημάτων και IT consulting της εταιρείας.",
    },
    {
        icon: Globe,
        title: "SEO & Άμεση Ευρετηρίαση Google",
        description: "Βέλτιστη δομή SEO ώστε η εταιρεία να εμφανίζεται άμεσα στις αναζητήσεις με βάση την επωνυμία, το ΑΦΜ και το ΓΕΜΗ της.",
    },
    {
        icon: Mail,
        title: "Εταιρικό Mail System & Επικοινωνία",
        description: "Διαμόρφωση εταιρικού email (info@lyroudis.gr) με προηγμένο spam filtering και άμεση φόρμα επικοινωνίας.",
    },
];

const results = [
    { icon: Scale, value: "100%", label: "ΓΕΜΗ Compliance" },
    { icon: Zap, value: "< 0.5s", label: "Χρόνος φόρτωσης" },
    { icon: ShieldCheck, value: "A+ SSL", label: "Δεδομένα & Ασφάλεια" },
    { icon: FileText, value: "Live", label: "Δημοσιότητα PDF" },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function LyroudisClient() {
    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Lyroudis Consulting Services Μονοπρόσωπη Ι.Κ.Ε. Case Study",
                        "description": "Κατασκευή εταιρικής ιστοσελίδας και ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ για τη Lyroudis Consulting Services ΙΚΕ.",
                        "author": {
                            "@type": "Organization",
                            "name": "SGK Software Development",
                            "url": "https://sgk.gr"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "SGK Software Development"
                        },
                        "mainEntityOfPage": "https://sgk.gr/case-study/lyroudis"
                    })
                }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Πίσω στο Portfolio
                    </Link>
                    <a
                        href="https://www.lyroudis.gr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                    >
                        Επίσκεψη Ιστοσελίδας
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
                            <Scale className="w-3.5 h-3.5" />
                            Νομική Δημοσιότητα Ι.Κ.Ε. & Corporate Website
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            lyroudis.gr
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-4">
                            «Πλήρης εταιρική διαφάνεια, δημοσιότητα Γ.Ε.ΜΗ. & ανάρτηση Ισολογισμών για την <span className="text-foreground font-medium">LYROUDIS CONSULTING SERVICES ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.</span>»
                        </p>
                        <p className="text-sm text-muted-foreground mb-8 text-white/90">
                            Σύμβουλοι Συστημάτων & Λογισμικού — Εταιρική Ιστοσελίδα & Πλατφόρμα Ισολογισμών
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["ΓΕΜΗ Compliance", "Ν. 4072/2012", "Ισολογισμοί PDF", "Next.js", "SSL Security"].map(
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
                                Πρόβλημα & Νομική Υποχρέωση
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Βάσει του <strong>Άρθρου 47 §2 του Ν. 4072/2012, όπως εξειδικεύτηκε με την ΚΥΑ 46982/2025</strong>, και του <strong>Ν. 4919/2022</strong>, κάθε Ιδιωτική Κεφαλαιουχική Εταιρεία (Ι.Κ.Ε.) υποχρεούται να διατηρεί εταιρική ιστοσελίδα εντός ενός (1) μηνός από τη σύστασή της, όπου δημοσιεύονται τα πλήρη στοιχεία Γ.Ε.ΜΗ., το εταιρικό κεφάλαιο, οι διαχειριστές και οι ετήσιοι Ισολογισμοί / Οικονομικές Καταστάσεις σε μορφή PDF. Η LYROUDIS CONSULTING SERVICES Μ.Ι.Κ.Ε. χρειαζόταν μια άμεση, καλαίσθητη και 100% νόμιμη λύση.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">
                                Η Λύση της SGK Digital
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Σχεδιάσαμε και αναπτύξαμε την επίσημη ιστοσελίδα <a href="https://www.lyroudis.gr/" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">www.lyroudis.gr</a>. Ενσωματώσαμε πλήρη πίνακα Εταιρικής Διαφάνειας & Στοιχείων ΓΕΜΗ, ειδικό τομέα ανάρτησης Ισολογισμών με υποστήριξη PDF λήψεων, εταιρικό mail system (`info@lyroudis.gr`) και πιστοποιητικό SSL για 100% ασφάλεια και ταχύτητα.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Legal Breakdown Card Table */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.div {...fadeUp} className="mb-10 text-center">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Νομική Δημοσιότητα Ι.Κ.Ε. (Άρθρο 47 §2 Ν. 4072/2012 - ΚΥΑ 46982/2025)
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                            Εταιρικά Στοιχεία & Γ.Ε.ΜΗ.
                        </h2>
                    </motion.div>

                    <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {legalSpecs.map((item, idx) => (
                                <div key={idx} className="p-4 rounded-lg bg-secondary/40 border border-border/50">
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                        {item.label}
                                    </span>
                                    <span className="font-medium text-foreground leading-snug">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Contact details bar */}
                        <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>Τηλέφωνο: <strong className="text-foreground">6973400545</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>Email: <a href="mailto:info@lyroudis.gr" className="text-primary underline">info@lyroudis.gr</a></span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 sm:py-20 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="mb-10">
                        <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                            Τεχνολογίες & Υποδομή
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
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
                            Βασικά Χαρακτηριστικά Έργου
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Πλήρης κάλυψη νομικών απαιτήσεων και εταιρικής προβολής.
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
                                <mod.icon className="w-8 h-8 text-primary mb-4" />
                                <h3 className="font-heading font-semibold mb-2 text-foreground">
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
                                <r.icon className="w-6 h-6 text-primary mx-auto mb-2" />
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
                            Χρειάζεστε Ιστοσελίδασ ΙΚΕ / ΓΕΜΗ;
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            Κατασκευή Εταιρικής Ιστοσελίδας ΙΚΕ & Ισολογισμών
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Αποκτήστε την επίσημη ιστοσελίδα της ΙΚΕ σας με πλήρη νομική συμμόρφωση ΓΕΜΗ (Άρθρο 47 §2 Ν. 4072/2012, ΚΥΑ 46982/2025) αυθημερόν.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://www.lyroudis.gr/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:scale-105 transition-all gap-2"
                            >
                                Επίσκεψη lyroudis.gr <ExternalLink className="w-4 h-4" />
                            </a>
                            <Link
                                href="/estimate"
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-border hover:bg-secondary text-foreground font-heading font-bold rounded-lg transition-all"
                            >
                                Ζητήστε Προσφορά για ΙΚΕ
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer spacer */}
            <div className="h-16 bg-background" />
        </div>
    );
}
