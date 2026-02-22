import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, MapPin, Smartphone, CreditCard, Bell, Navigation, Clock, ShieldCheck, Map, Users } from "lucide-react";
import { Link } from "react-router-dom";

const techStack = [
    "Flutter", "Firebase", "Realtime Database", "Stripe", "Push Notifications", "Android", "Google Maps API", "Live Tracking"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const CaseStudyLTG = () => {
    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Live Tour Guide Case Study | Taxi Tours Mobile App — SGK Digital</title>
                <meta name="description" content="Case study: Flutter mobile app για private taxi tours στην Αθήνα. Real-time tracking, Stripe πληρωμές, push notifications, Firebase. +45% completion rate." />
                <meta name="keywords" content="taxi tour app, flutter mobile app, live tracking, σύστημα κρατήσεων, private tours, booking app, firebase, stripe, android app, tour guide app" />
                <link rel="canonical" href="https://sgk.gr/case-study/live-tour-guide" />
                <meta property="og:title" content="Live Tour Guide — Taxi Tours App | SGK Digital" />
                <meta property="og:description" content="Flutter app για private taxi tours με live tracking, Stripe πληρωμές και push notifications." />
                <meta property="og:url" content="https://sgk.gr/case-study/live-tour-guide" />
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
                                icon: Navigation,
                                title: "Real-time Tracking",
                                desc: "Ζωντανή παρακολούθηση της θέσης του οδηγού και της διαδρομής του tour πάνω στο χάρτη.",
                            },
                            {
                                icon: Smartphone,
                                title: "Flutter Mobile App",
                                desc: "Native εμπειρία χρήσης σε Android με υψηλή απόδοση και ομαλά animations.",
                            },
                            {
                                icon: CreditCard,
                                title: "Secure Payments",
                                desc: "Πλήρης ενσωμάτωση Stripe για ασφαλείς συναλλαγές και διαχείριση προκαταβολών.",
                            },
                            {
                                icon: Bell,
                                title: "Push Notifications",
                                desc: "Άμεσες ειδοποιήσεις για την εξέλιξη της κράτησης και την άφιξη του οχήματος.",
                            },
                            {
                                icon: Map,
                                title: "Interactive Itineraries",
                                desc: "Δυναμική παρουσίαση των σημείων ενδιαφέροντος και της διαδρομής κάθε tour.",
                            },
                            {
                                icon: Users,
                                title: "Driver Dashboard",
                                desc: "Ειδικό περιβάλλον για τους οδηγούς για τη διαχείριση των καθημερινών τους tours.",
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
                            to="/#contact"
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
};

export default CaseStudyLTG;
