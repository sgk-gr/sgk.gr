"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
    Home, ArrowRight, Phone, Mail, 
    Globe, Bot, FileText, Sparkles, AlertCircle 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
    const popularServices = [
        {
            title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ",
            badge: "80€ Τελική με ΦΠΑ",
            badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            desc: "Πλήρης νομική συμμόρφωση ΓΕΜΗ (Ν.4072/2012) σε 24 ώρες με .gr domain & hosting 1 έτους.",
            href: "/kataskevi-istoselidas-ike",
            icon: Globe,
        },
        {
            title: "Κατασκευή Ιστοσελίδων & E-Shop",
            badge: "Next.js & WordPress",
            badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            desc: "Custom web development, mobile-first design, κορυφαίο SEO και σκορ PageSpeed 95+.",
            href: "/kataskevi-istoselidon",
            icon: Sparkles,
        },
        {
            title: "Αυτόνομοι AI Agents & Voice AI",
            badge: "24/7 Τηλεφωνία & ERP",
            badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            desc: "Ψηφιακοί υπάλληλοι εξυπηρέτησης, Voice AI 24/7 και διασύνδεση με SoftOne / Entersoft.",
            href: "/ai-agents",
            icon: Bot,
        },
        {
            title: "Τεχνολογικό Blog & Οδηγοί",
            badge: "Άρθρα & Case Studies",
            badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            desc: "Αναλυτικοί οδηγοί για νομοθεσία ΓΕΜΗ, τεχνητή νοημοσύνη και βέλτιστες πρακτικές web.",
            href: "/blog",
            icon: FileText,
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
            <Navbar />
            <main className="flex-1 pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-5xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest mb-4">
                            <AlertCircle size={14} />
                            <span>Σφάλμα 404 • Η Σελίδα Μετακινήθηκε</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-4">
                            Δεν βρέθηκε η σελίδα που αναζητάτε
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Η διεύθυνση URL που πληκτρολογήσατε ή επιλέξατε από τα αποτελέσματα αναζήτησης πιθανόν έχει μεταφερθεί, αναβαθμιστεί ή αντικατασταθεί από μια νεότερη έκδοση.
                        </p>
                    </motion.div>

                    {/* Quick navigation cards */}
                    <div className="mb-12">
                        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-center mb-6">
                            Μήπως αναζητούσατε κάποια από τις κύριες υπηρεσίες μας;
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {popularServices.map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <motion.div
                                        key={service.href}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={service.href}
                                            className="group block p-6 rounded-xl bg-card/60 hover:bg-card border border-white/10 hover:border-primary/50 transition-all duration-300 relative overflow-hidden h-full shadow-lg hover:shadow-primary/5"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Icon size={20} />
                                                </div>
                                                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${service.badgeColor}`}>
                                                    {service.badge}
                                                </span>
                                            </div>
                                            <h2 className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1.5 mb-2">
                                                {service.title}
                                                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                            </h2>
                                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                                {service.desc}
                                            </p>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact & Fallback Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 via-card to-purple-950/40 border border-white/10 text-center"
                    >
                        <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-2">
                            Χρειάζεστε άμεση καθοδήγηση ή εξειδικευμένη προσφορά;
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
                            Η ομάδα της SGK Digital είναι στη διάθεσή σας καθημερινά για να απαντήσει σε οποιαδήποτε ερώτηση σχετικά με το project σας.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded-lg hover:brightness-110 transition-all shadow-md shadow-primary/20"
                            >
                                <Home size={16} />
                                Αρχική Σελίδα
                            </Link>
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-heading font-semibold text-sm rounded-lg hover:bg-white/10 transition-all"
                            >
                                <Sparkles size={16} />
                                Όλες οι Υπηρεσίες
                            </Link>
                            <a
                                href="tel:2111140013"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-heading font-semibold text-sm rounded-lg hover:bg-emerald-500/20 transition-all"
                            >
                                <Phone size={16} />
                                211 114 0013
                            </a>
                            <a
                                href="mailto:info@sgk.gr"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-muted-foreground hover:text-white font-heading font-semibold text-sm rounded-lg hover:bg-white/10 transition-all"
                            >
                                <Mail size={16} />
                                info@sgk.gr
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
