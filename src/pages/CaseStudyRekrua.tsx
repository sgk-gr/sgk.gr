import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Users, Brain, Database, Mail, Timer, CheckCircle, Zap, Layout, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const techStack = [
    "React", "Supabase", "PostgreSQL", "Edge Functions", "GPT-5.2 Mini", "Netlify", "Vercel", "AI Screening"
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const CaseStudyRekrua = () => {
    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Rekrua Case Study | AI HR Platform & Candidate Screening — SGK Digital</title>
                <meta name="description" content="Case study: AI HR πλατφόρμα με candidate rating, intelligent screening, auto follow-ups. React, Supabase, GPT-5.2 Mini. -60% χρόνος screening, 2x faster time-to-hire." />
                <meta name="keywords" content="ai hr platform, candidate screening, recruitment automation, hiring system, ai προσλήψεις, hr dashboard, ai recruiting, αξιολόγηση υποψηφίων" />
                <link rel="canonical" href="https://sgk.gr/case-study/rekrua" />
                <meta property="og:title" content="Rekrua — AI HR Platform | SGK Digital" />
                <meta property="og:description" content="AI HR πλατφόρμα με intelligent screening και candidate rating. -60% χρόνος screening." />
                <meta property="og:url" content="https://sgk.gr/case-study/rekrua" />
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
                            AI HR Platform
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
                            Rekrua
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            AI HR πλατφόρμα με <span className="text-foreground font-medium">candidate rating system</span> για έξυπνο hiring και αυτοματοποιημένο screening.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Supabase", "AI", "GPT-5.2 Mini", "PostgreSQL", "Edge Functions", "Netlify", "Vercel"].map(
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
                                Οι ομάδες HR έχαναν αμέτρητες ώρες σε χειροκίνητο screening εκατοντάδων βιογραφικών και σε επαναλαμβανόμενα email follow-ups με υποψηφίους. Αυτή η καθυστέρηση οδηγούσε συχνά στην απώλεια κορυφαίων ταλέντων από τον ανταγωνισμό.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                                Τι Υλοποιήσαμε
                            </p>
                            <h2 className="text-3xl font-heading font-bold mb-4">Λύση</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Φτιάξαμε μια AI HR πλατφόρμα με candidate rating system, React frontend, Supabase backend με PostgreSQL, Edge Functions και GPT-5.2 Mini για intelligent screening. Το σύστημα αξιολογεί αυτόματα τους υποψηφίους και προτείνει τους καλύτερους βάσει των αναγκών της θέσης.
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
                                icon: Brain,
                                title: "Intelligent Screening",
                                desc: "Αυτόματη αξιολόγηση βιογραφικών με GPT-5.2 Mini για ταχύτατο φιλτράρισμα.",
                            },
                            {
                                icon: Users,
                                title: "Candidate Rating System",
                                desc: "Σύστημα βαθμολόγησης υποψηφίων βάσει δεξιοτήτων και εμπειρίας.",
                            },
                            {
                                icon: Database,
                                title: "Supabase Backend",
                                desc: "Real-time βάση δεδομένων και authentication για ασφαλή διαχείριση δεδομένων.",
                            },
                            {
                                icon: Zap,
                                title: "Edge Functions",
                                desc: "Serverless λογική για ταχύτατη επεξεργασία δεδομένων και AI calls.",
                            },
                            {
                                icon: Mail,
                                title: "Auto Follow-ups",
                                desc: "Αυτοματοποιημένα emails ενημέρωσης υποψηφίων σε κάθε στάδιο της διαδικασίας.",
                            },
                            {
                                icon: Layout,
                                title: "HR Dashboard",
                                desc: "Εύχρηστο περιβάλλον διαχείρισης για την παρακολούθηση ολόκληρου του hiring pipeline.",
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
                            Ταχύτερο & Εξυπνότερο Hiring
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">-60%</div>
                                <p className="text-sm text-muted-foreground">Χρόνος Screening</p>
                            </div>
                            <div className="p-6 rounded-xl bg-card border border-border">
                                <div className="text-3xl font-bold text-primary mb-2">2x</div>
                                <p className="text-sm text-muted-foreground">Faster Time-to-Hire</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Η Rekrua μεταμόρφωσε τη διαδικασία προσλήψεων, επιτρέποντας στους recruiters να επικεντρωθούν μόνο στους πιο κατάλληλους υποψηφίους.
                        </p>
                        <Link
                            to="/#contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
                        >
                            Θέλω AI λύση για την επιχείρησή μου
                            <Sparkles className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
};

export default CaseStudyRekrua;
