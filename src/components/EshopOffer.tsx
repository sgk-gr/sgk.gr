"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import deskImage from "../assets/desk.png";
import mobImage from "../assets/mob.png";

const EshopOffer = () => {
    return (
        <section id="eshop-offer" className="py-16 sm:py-24 relative overflow-hidden bg-secondary/20">
            {/* Glow Effects */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-heading font-bold mb-6">
                            Προσφορά Περιορισμένου Χρόνου
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                            Eshop <span className="text-gradient">Νέας Γενιάς</span> <br />
                            από μόλις 1.999€
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                            Αποκτήστε ένα υπερσύγχρονο, ταχύτατο και πλήρως custom ηλεκτρονικό κατάστημα. Σχεδιασμένο να πουλάει από το πρώτο δευτερόλεπτο, με έμφαση στην εμπειρία του χρήστη.
                        </p>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-3">
                                <span className="text-base sm:text-lg font-medium text-foreground">Πληρωμή σε <span className="text-primary font-bold">2 δόσεις</span> για μεγαλύτερη ευελιξία</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-base sm:text-lg font-medium text-foreground">Mobile First / Fully Responsive Design</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-base sm:text-lg font-medium text-foreground">SEO Optimized & Hyper-Fast Loading</span>
                            </div>

                            {/* Google PageSpeed Scores */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 ml-1">
                                {[
                                    { label: "Απόδοση", score: 98, color: "#0cce6b" },
                                    { label: "Προσβασιμότητα", score: 93, color: "#0cce6b" },
                                    { label: "Βέλτιστες πρακτικές", score: 96, color: "#0cce6b" },
                                    { label: "SEO", score: 100, color: "#0cce6b" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-2">
                                        <div className="relative w-11 h-11">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
                                                <circle cx="18" cy="18" r="15.5" fill="none" stroke={item.color} strokeWidth="2.5" strokeDasharray={`${item.score * 0.975} 100`} strokeLinecap="round" />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color: item.color }}>{item.score}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <Link
                                href="/estimate"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:scale-105 transition-all glow-border"
                                aria-label="Ζητήστε Προσφορά για Eshop"
                            >
                                Θέλω προσφορά Eshop
                            </Link>
                            <Link
                                href="/eshop-demo"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 border border-border text-foreground font-heading font-semibold rounded-lg hover:bg-secondary transition-all"
                            >
                                Δείτε Demo από τα eshop
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Main Mockup (Desktop) - Stable E-commerce Interface */}
                        <div className="relative rounded-2xl border border-white/10 bg-card p-2 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <img
                                src="/desk.png"
                                alt="Modern E-commerce Interface"
                                className="w-full h-auto rounded-xl shadow-lg"
                                width="1200"
                                height="800"
                                loading="lazy"
                            />
                        </div>

                        {/* Secondary Mockup (Mobile) - Stable Mobile View */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -right-6 md:-right-12 w-32 md:w-48 rounded-[2rem] border-8 border-[#1a1a1a] bg-card shadow-2xl overflow-hidden"
                        >
                            <img
                                src="/mob.png"
                                alt="Mobile Shopping App"
                                className="w-full h-auto"
                                width="400"
                                height="600"
                                loading="lazy"
                            />
                        </motion.div>

                        {/* Background Decor */}
                        <div className="absolute -z-10 -top-10 -right-10 w-full h-full bg-primary/5 rounded-full blur-3xl" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default EshopOffer;
