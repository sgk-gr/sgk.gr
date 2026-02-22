import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Car, MessageSquare, CreditCard, Server, Shield, TrendingUp, PhoneOff, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

const techStack = [
    "React", "PostgreSQL", "VPS Server", "Stripe", "SSL", "AI Agent", "Custom Logo Design", "SEO Optimization"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const CaseStudyYolo8 = () => {
    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>yolo8 Case Study | Car Rental Booking System & AI Support — SGK Digital</title>
                <meta name="description" content="Case study: Smart booking system με AI customer support για ενοικιάσεις αυτοκινήτων. React, Stripe πληρωμές, AI agent 24/7, PostgreSQL, VPS." />
                <meta name="keywords" content="car rental booking system, σύστημα κρατήσεων, ενοικίαση αυτοκινήτων, ai customer support, booking platform, stripe, react, online κρατήσεις" />
                <link rel="canonical" href="https://sgk.gr/case-study/yolo8" />
                <meta property="og:title" content="yolo8 — Car Rental & AI Support | SGK Digital" />
                <meta property="og:description" content="Booking system με AI support, Stripe πληρωμές και real-time διαθεσιμότητα στόλου." />
                <meta property="og:url" content="https://sgk.gr/case-study/yolo8" />
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
                            Car Rental & AI Support
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            yolo8
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Smart booking system με <span className="text-foreground font-medium">AI customer support</span> για ενοικιάσεις αυτοκινήτων. Κρατήσεις, πληρωμές και υποστήριξη σε ένα σύστημα.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["React", "AI Agent", "Booking System", "Stripe", "PostgreSQL", "VPS", "SEO", "SSL"].map(
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
                                Η εταιρεία χρειαζόταν ένα ολοκληρωμένο σύστημα online κρατήσεων με real-time διαθεσιμότητα στόλου, ασφαλείς πληρωμές και 24/7 υποστήριξη πελατών. Οι τηλεφωνικές κλήσεις για απλές ερωτήσεις κατανάλωναν πολύ χρόνο από το προσωπικό.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Λύση</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Φτιάξαμε custom logo, React web app με smart booking system, PostgreSQL database σε VPS server για απίστευτες ταχύτητες και SEO, SSL για ασφαλείς Stripe πληρωμές και AI agent που απαντάει σε ερωτήσεις πελατών 24/7.
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
                                icon: Car,
                                title: "Fleet Management",
                                desc: "Real-time παρακολούθηση διαθεσιμότητας αυτοκινήτων και αυτόματη ενημέρωση ημερολογίου.",
                            },
                            {
                                icon: Cpu,
                                title: "AI Support Agent",
                                desc: "Έξυπνος βοηθός που απαντά άμεσα σε ερωτήσεις για τιμές, όρους και διαθεσιμότητα.",
                            },
                            {
                                icon: CreditCard,
                                title: "Stripe Integration",
                                desc: "Ασφαλείς πληρωμές και προκαταβολές με όλα τα πρωτόκολλα ασφαλείας.",
                            },
                            {
                                icon: Server,
                                title: "High Performance VPS",
                                desc: "Φιλοξενία σε γρήγορους servers για μηδενικό loading time και καλύτερο SEO.",
                            },
                            {
                                icon: Shield,
                                title: "SSL & Security",
                                desc: "Κρυπτογραφημένη σύνδεση για την προστασία των προσωπικών δεδομένων των πελατών.",
                            },
                            {
                                icon: MessageSquare,
                                title: "Multi-channel AI",
                                desc: "Δυνατότητα επέκτασης του AI agent σε WhatsApp και Messenger για ενοποιημένη υποστήριξη.",
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
                            Ψηφιακός Μετασχηματισμός & Αυλάρωση
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">-70%</div>
                                <p className="text-sm text-muted-foreground">Τηλεφωνικές Κλήσεις</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">3x</div>
                                <p className="text-sm text-muted-foreground">Online Κρατήσεις</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                                <p className="text-sm text-muted-foreground">Support</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Η yolo8 πλέον λειτουργεί στον "αυτόματο", με το AI να αναλαμβάνει την υποστήριξη και το σύστημα να κλείνει κρατήσεις ακόμα και όταν η επιχείρηση είναι κλειστή.
                        </p>
                        <Link
                            to="/#contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
                        >
                            Θέλω κάτι παρόμοιο
                            <Sparkles className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
};

export default CaseStudyYolo8;
