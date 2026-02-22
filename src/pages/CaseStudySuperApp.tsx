import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, ShoppingCart, Bell, Play, Database, Smartphone, Zap, Gift, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

const techStack = [
    "Flutter", "Firebase Realtime Database", "NoSQL", "Smart Notifications", "Video Player", "Data Aggregation"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const CaseStudySuperApp = () => {
    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Super App Case Study | Προσφορές Σούπερ Μάρκετ Mobile App — SGK Digital</title>
                <meta name="description" content="Case study: Flutter mobile app που συγκεντρώνει προσφορές από Μασούτη, Σκλαβενίτη, Χαλκιαδάκη, ΑΒ Βασιλόπουλο. Smart notifications, Firebase real-time. 1000+ downloads." />
                <meta name="keywords" content="προσφορές σούπερ μάρκετ, εφαρμογή προσφορών, flutter app, mobile app ελλάδα, μασούτης, σκλαβενίτης, εκπτώσεις, consumer app, offer aggregator" />
                <link rel="canonical" href="https://sgk.gr/case-study/super-app" />
                <meta property="og:title" content="Super App — Προσφορές Σούπερ Μάρκετ | SGK Digital" />
                <meta property="og:description" content="Όλες οι προσφορές σούπερ μάρκετ σε μία εφαρμογή. Flutter, Firebase, smart notifications." />
                <meta property="og:url" content="https://sgk.gr/case-study/super-app" />
            </Helmet>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-6 h-16 flex items-center">
                    <Link
                        to="/#portfolio"
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
                                icon: ShoppingCart,
                                title: "Offer Aggregator",
                                desc: "Συγκέντρωση προσφορών από όλες τις μεγάλες αλυσίδες σούπερ μάρκετ σε μία λίστα.",
                            },
                            {
                                icon: Bell,
                                title: "Smart Notifications",
                                desc: "Προσωποποιημένες ειδοποιήσεις για νέες προσφορές που ενδιαφέρουν τον χρήστη.",
                            },
                            {
                                icon: Play,
                                title: "Video Player",
                                desc: "Ενσωματωμένη δυνατότητα προβολής video για παρουσίαση προϊόντων και προσφορών.",
                            },
                            {
                                icon: Database,
                                title: "Real-time Sync",
                                desc: "Άμεση ενημέρωση των τιμών και των διαθέσιμων προσφορών μέσω Firebase.",
                            },
                            {
                                icon: ListChecks,
                                title: "Category Filtering",
                                desc: "Εύκολη πλοήγηση ανά κατηγορία προϊόντος για γρήγορη εύρεση αυτού που ψάχνετε.",
                            },
                            {
                                icon: Gift,
                                title: "Exclusive Deals",
                                desc: "Ειδικές προσφορές που είναι διαθέσιμες μόνο μέσω της εφαρμογής.",
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
                                <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
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
                            <div className="p-8 rounded-xl bg-card border border-border min-w-[200px]">
                                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest">Downloads</p>
                            </div>
                            <div className="p-8 rounded-xl bg-card border border-border min-w-[200px]">
                                <div className="text-4xl font-bold text-primary mb-2">Daily</div>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest">Active Users</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Η εφαρμογή έγινε απαραίτητο εργαλείο για τους καταναλωτές, βοηθώντας τους να εξοικονομούν χρήματα καθημερινά από τις αγορές τους.
                        </p>
                        <Link
                            to="/#contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
                        >
                            Θέλω μια τέτοια εφαρμογή
                            <Sparkles className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
};

export default CaseStudySuperApp;
